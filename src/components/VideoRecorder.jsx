import { useEffect } from 'react';
import useVideoRecorder from '../hooks/useVideoRecorder';

export default function VideoRecorder({ onComplete }) {
  const {
    videoRef,
    status,
    countdown,
    retakesRemaining,
    error,
    videoBlob,
    videoUrl,
    initCamera,
    startRecording,
    stopRecording,
    retake,
    maxRetakes,
    recordingDuration,
  } = useVideoRecorder();

  useEffect(() => {
    initCamera();
  }, [initCamera]);

  const handleSubmit = () => {
    if (videoBlob) {
      onComplete(videoBlob);
    }
  };

  // Calculate progress percentage for the countdown ring
  const progress = (countdown / recordingDuration) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Prompt */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">Your Pitch Scenario</h3>
            <p className="text-slate-600 leading-relaxed">
              "You walk into a busy QSR during lunch rush. You have <span className="font-semibold text-blue-600">30 seconds</span> to pitch the GM on why they should stay open an extra hour during their slowest time. Go."
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={initCamera}
            className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Video container */}
      <div className="relative bg-slate-900 rounded-2xl overflow-hidden aspect-video shadow-xl">
        {/* Live preview or playback */}
        {status === 'reviewing' && videoUrl ? (
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
            controls
            autoPlay
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
        )}

        {/* Recording indicator */}
        {status === 'recording' && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">Recording</span>
          </div>
        )}

        {/* Countdown timer during recording */}
        {status === 'recording' && (
          <div className="absolute top-4 right-4">
            <div className="relative w-16 h-16">
              {/* Background circle */}
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="white"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                  className="transition-all duration-1000 linear"
                />
              </svg>
              {/* Countdown number */}
              <span className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
                {countdown}
              </span>
            </div>
          </div>
        )}

        {/* Idle state overlay */}
        {status === 'idle' && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/90">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-white">Initializing camera...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
        {status === 'previewing' && (
          <button
            onClick={startRecording}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 active:scale-100"
          >
            <span className="w-3 h-3 bg-white rounded-full" />
            Start Recording
          </button>
        )}

        {status === 'recording' && (
          <button
            onClick={stopRecording}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
          >
            <span className="w-3 h-3 bg-white rounded-sm" />
            Stop Early
          </button>
        )}

        {status === 'reviewing' && (
          <>
            <button
              onClick={retake}
              disabled={retakesRemaining <= 0}
              className={`flex items-center justify-center gap-2 px-6 py-3 border-2 font-semibold rounded-xl transition-all ${
                retakesRemaining > 0
                  ? 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                  : 'border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Re-record ({retakesRemaining} left)
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 active:scale-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Submit Video
            </button>
          </>
        )}
      </div>

      {/* Info text */}
      {status === 'previewing' && (
        <p className="mt-4 text-center text-sm text-slate-500">
          Recording will automatically stop after {recordingDuration} seconds.
          You have {retakesRemaining} retake{retakesRemaining !== 1 ? 's' : ''} available.
        </p>
      )}
    </div>
  );
}
