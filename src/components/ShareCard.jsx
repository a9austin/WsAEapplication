import { forwardRef } from 'react';
import { ARCHETYPES } from '../utils/archetypes';

const ShareCard = forwardRef(function ShareCard({ archetype, choice }, ref) {
  const archetypeData = ARCHETYPES[choice];

  return (
    <div
      ref={ref}
      className="w-[1200px] h-[630px] bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 p-16 flex flex-col"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        {/* Workstream Logo */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-500 rounded-xl flex items-center justify-center">
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
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white">Workstream</span>
            <span className="text-sm text-indigo-300">QSR Sales Challenge</span>
          </div>
        </div>

        {/* Badge */}
        <div className="bg-green-500/20 border border-green-500/30 rounded-full px-6 py-2">
          <span className="text-green-400 font-semibold">COMPLETED</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <p className="text-indigo-300 text-xl mb-4 uppercase tracking-wide">
          I completed The QSR Sales Challenge
        </p>

        {/* Archetype icon */}
        <div className="text-8xl mb-6">{archetypeData?.icon || '🏆'}</div>

        {/* Archetype name */}
        <h1 className="text-5xl font-bold text-white mb-4">{archetype}</h1>

        {/* Description */}
        <p className="text-2xl text-indigo-200 max-w-2xl">
          {archetypeData?.description || 'A unique sales approach'}
        </p>
      </div>

      {/* Footer CTA */}
      <div className="flex items-center justify-between pt-8 border-t border-white/10">
        <p className="text-xl text-slate-400">
          Think you have what it takes?
        </p>
        <div className="bg-indigo-600 px-8 py-3 rounded-xl">
          <span className="text-white font-semibold text-lg">Take the Challenge</span>
        </div>
      </div>
    </div>
  );
});

export default ShareCard;
