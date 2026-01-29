import { useState, useEffect } from 'react';
import {
  getAllCandidates,
  exportToCSV,
  initMockData,
} from '../utils/db';
import { ARCHETYPES } from '../utils/archetypes';

const ADMIN_PASSWORD = 'qsrhire2024';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [filterArchetype, setFilterArchetype] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  // Load candidates on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadCandidates();
    }
  }, [isAuthenticated]);

  // Filter candidates when archetype filter changes
  useEffect(() => {
    if (filterArchetype === 'all') {
      setFilteredCandidates(candidates);
    } else {
      setFilteredCandidates(
        candidates.filter((c) => c.archetype === filterArchetype)
      );
    }
  }, [filterArchetype, candidates]);

  const loadCandidates = async () => {
    setIsLoading(true);
    try {
      // Initialize mock data if needed
      await initMockData();
      const data = await getAllCandidates();
      setCandidates(data);
      setFilteredCandidates(data);
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Export to CSV
  const handleExport = () => {
    const csv = exportToCSV(filteredCandidates);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `qsr-challenge-candidates-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Check if a candidate has a playable video (blob or URL)
  const hasVideo = (candidate) => {
    return !!(candidate.videoBlob || candidate.videoUrl);
  };

  // Download video
  const handleDownloadVideo = (candidate) => {
    if (candidate.videoBlob) {
      const url = URL.createObjectURL(candidate.videoBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = candidate.videoFileName;
      link.click();
      URL.revokeObjectURL(url);
    } else if (candidate.videoUrl) {
      window.open(candidate.videoUrl, '_blank');
    } else {
      alert('No video available for this candidate.');
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
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
            <h1 className="text-2xl font-bold text-slate-800">Workstream Admin</h1>
            <p className="text-slate-500 mt-1">QSR Sales Challenge</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-0 transition-colors ${
                  passwordError
                    ? 'border-red-300 bg-red-50 focus:border-red-500'
                    : 'border-slate-200 focus:border-indigo-500'
                }`}
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">Incorrect password</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Workstream Admin
                </h1>
                <p className="text-sm text-slate-500">
                  QSR Sales Challenge Submissions
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-slate-600">
                Filter by archetype:
              </label>
              <select
                value={filterArchetype}
                onChange={(e) => setFilterArchetype(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Archetypes</option>
                {Object.entries(ARCHETYPES).map(([key, { name }]) => (
                  <option key={key} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">
                {filteredCandidates.length} candidate
                {filteredCandidates.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Candidates table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500">Loading candidates...</p>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="p-12 text-center">
              <svg
                className="w-12 h-12 text-slate-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-slate-500">No candidates found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Archetype
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCandidates.map((candidate) => {
                    const archetypeKey = Object.keys(ARCHETYPES).find(
                      (k) => ARCHETYPES[k].name === candidate.archetype
                    );
                    const archetypeData = archetypeKey
                      ? ARCHETYPES[archetypeKey]
                      : null;

                    return (
                      <tr key={candidate.candidateId} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-800">
                              {candidate.name || 'Unknown'}
                            </span>
                            <code className="text-xs text-slate-400 mt-0.5">
                              {candidate.candidateId}
                            </code>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 text-sm">
                            <a
                              href={`mailto:${candidate.email}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {candidate.email || '-'}
                            </a>
                            {candidate.linkedin && (
                              <a
                                href={candidate.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                              >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                </svg>
                                LinkedIn
                              </a>
                            )}
                            {candidate.phone && (
                              <a
                                href={`tel:${candidate.phone}`}
                                className="text-slate-600 hover:text-slate-800"
                              >
                                {candidate.phone}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(candidate.timestamp)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                                archetypeData?.bgColor || 'bg-slate-100'
                              } ${archetypeData?.textColor || 'text-slate-700'}`}
                            >
                              <span>{archetypeData?.icon || '🏆'}</span>
                              {candidate.archetype}
                            </span>
                            <span className="text-xs text-slate-400 ml-1">
                              Choice: {candidate.scenarioChoice}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setActiveVideo(
                                  activeVideo === candidate.candidateId
                                    ? null
                                    : candidate.candidateId
                                )
                              }
                              disabled={!hasVideo(candidate)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                hasVideo(candidate)
                                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {activeVideo === candidate.candidateId
                                ? 'Hide'
                                : 'Watch'}
                            </button>
                            <button
                              onClick={() => handleDownloadVideo(candidate)}
                              disabled={!hasVideo(candidate)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                hasVideo(candidate)
                                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                              Download
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Inline video player */}
              {activeVideo && (
                <div className="border-t border-slate-200 p-6 bg-slate-50">
                  <VideoPlayer
                    candidate={filteredCandidates.find(
                      (c) => c.candidateId === activeVideo
                    )}
                    onClose={() => setActiveVideo(null)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Video player component — supports both blob and URL sources
function VideoPlayer({ candidate, onClose }) {
  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    if (candidate?.videoBlob) {
      const url = URL.createObjectURL(candidate.videoBlob);
      setVideoSrc(url);
      return () => URL.revokeObjectURL(url);
    } else if (candidate?.videoUrl) {
      setVideoSrc(candidate.videoUrl);
    }
  }, [candidate]);

  if (!candidate?.videoBlob && !candidate?.videoUrl) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">No video available for this candidate.</p>
        <p className="text-sm text-slate-400 mt-1">
          (Mock candidates don't have video recordings)
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">
          Video: {candidate.name || candidate.candidateId}
        </h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="bg-black rounded-xl overflow-hidden">
        <video
          src={videoSrc}
          controls
          autoPlay
          className="w-full aspect-video"
        />
      </div>
    </div>
  );
}
