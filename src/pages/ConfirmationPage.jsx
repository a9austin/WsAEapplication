import { useLocation, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import ShareCard from '../components/ShareCard';
import { ARCHETYPES } from '../utils/archetypes';

export default function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const shareCardRef = useRef(null);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const { archetype, archetypeDescription, choice, error } = location.state || {};

  // Redirect if accessed directly without state
  useEffect(() => {
    if (!archetype) {
      navigate('/');
    }
  }, [archetype, navigate]);

  if (!archetype) return null;

  const archetypeData = ARCHETYPES[choice];

  // Generate and download share card
  const handleDownloadCard = async () => {
    if (!shareCardRef.current) return;

    setIsGeneratingCard(true);
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });

      const link = document.createElement('a');
      link.download = `qsr-sales-challenge-${archetype.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error generating card:', err);
    } finally {
      setIsGeneratingCard(false);
    }
  };

  // Copy challenge link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // Share on LinkedIn
  const handleLinkedInShare = () => {
    const text = encodeURIComponent(
      "Just completed The QSR Sales Challenge! They're hiring scrappy AEs - are you up for it?"
    );
    const url = encodeURIComponent(window.location.origin);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
      '_blank',
      'width=600,height=400'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Challenge Complete!
          </h1>
          <p className="text-blue-200 text-lg">
            Thanks for completing The QSR Sales Challenge!
            <br />
            We'll review your submission and be in touch soon.
          </p>
        </div>

        {/* Error message if save failed */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-8 text-center">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Archetype reveal card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          <div className={`bg-gradient-to-r ${archetypeData?.color || 'from-blue-500 to-purple-500'} p-6`}>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wide mb-2">
              Your Sales Style
            </p>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{archetypeData?.icon || '🏆'}</span>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">{archetype}</h2>
                <p className="text-white/80">{archetypeDescription}</p>
              </div>
            </div>
          </div>

          {/* Archetype description */}
          <div className="p-6">
            <div className={`${archetypeData?.bgColor || 'bg-blue-50'} rounded-xl p-4`}>
              <p className={`${archetypeData?.textColor || 'text-blue-700'} text-center`}>
                {getArchetypeInsight(choice)}
              </p>
            </div>
          </div>
        </div>

        {/* Share section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4 text-center">Share Your Results</h3>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* LinkedIn Share */}
            <button
              onClick={handleLinkedInShare}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0077B5] hover:bg-[#006097] text-white font-medium rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              Share on LinkedIn
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all"
            >
              {linkCopied ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>

            {/* Download Card */}
            <button
              onClick={handleDownloadCard}
              disabled={isGeneratingCard}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all disabled:opacity-50"
            >
              {isGeneratingCard ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Card
                </>
              )}
            </button>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-blue-300 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Hidden share card for rendering */}
      <div className="fixed -left-[9999px] -top-[9999px]">
        <ShareCard ref={shareCardRef} archetype={archetype} choice={choice} />
      </div>
    </div>
  );
}

// Helper function for archetype insights
function getArchetypeInsight(choice) {
  const insights = {
    A: "Closers understand that sometimes you need to be flexible to win the deal. You're results-oriented and willing to do what it takes to get to 'yes'.",
    B: "Relationship Builders know that objections often mask deeper concerns. By asking the right questions, you uncover what really matters to the prospect.",
    C: "Patient Strategists play the long game. You provide value without being pushy, trusting that good things come to those who nurture relationships.",
    D: "Creative Escalators think outside the box. When you hit a wall, you find new angles and resources to move the deal forward.",
    E: "Qualifiers protect their most valuable resource: time. You recognize that not every deal is worth chasing, and focus on prospects who value what you offer.",
  };
  return insights[choice] || "You have a unique approach to sales that sets you apart.";
}
