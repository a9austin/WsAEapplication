import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStartChallenge = () => {
    navigate('/challenge');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Workstream Logo */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg
                className="w-7 h-7 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white">Workstream</span>
          </div>
        </div>

        {/* Hiring banner */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-sm text-indigo-100 font-medium">
            We're hiring Account Executives & SDRs
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
          The QSR Sales Challenge
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-indigo-200 mb-4 leading-relaxed">
          Record your pitch. Make your move.
          <br />
          <span className="text-white font-semibold">Show us what you've got.</span>
        </p>

        {/* Role description */}
        <p className="text-base text-indigo-300 mb-12 max-w-lg mx-auto">
          Workstream is looking for scrappy, hungry salespeople to join our team.
          Complete this challenge to apply for an AE or SDR role.
        </p>

        {/* Start Button */}
        <button
          onClick={handleStartChallenge}
          className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 active:scale-100"
        >
          <span>Start Challenge</span>
          <svg
            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        {/* Time indicator */}
        <p className="mt-8 text-slate-400 flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Takes 5 minutes
        </p>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">30-Second Pitch</h3>
            <p className="text-slate-400 text-sm">
              Record a quick video pitch to a QSR general manager
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Sales Scenario</h3>
            <p className="text-slate-400 text-sm">
              Make a key decision in a real-world sales situation
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Get Your Style</h3>
            <p className="text-slate-400 text-sm">
              Discover your sales archetype and share your results
            </p>
          </div>
        </div>

        {/* Footer tagline */}
        <p className="mt-16 text-sm text-indigo-300/60">
          Powered by Workstream - HR, Payroll & Hiring for Hourly Teams
        </p>
      </div>
    </div>
  );
}
