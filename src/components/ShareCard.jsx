import { forwardRef } from 'react';
import { ARCHETYPES } from '../utils/archetypes';

const ShareCard = forwardRef(function ShareCard({ archetype, choice }, ref) {
  const archetypeData = ARCHETYPES[choice];

  return (
    <div
      ref={ref}
      className="w-[1200px] h-[630px] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-16 flex flex-col"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        {/* Logo placeholder */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold text-white">QSR Sales Challenge</span>
        </div>

        {/* Badge */}
        <div className="bg-green-500/20 border border-green-500/30 rounded-full px-6 py-2">
          <span className="text-green-400 font-semibold">COMPLETED</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <p className="text-blue-300 text-xl mb-4 uppercase tracking-wide">
          I completed The QSR Sales Challenge
        </p>

        {/* Archetype icon */}
        <div className="text-8xl mb-6">{archetypeData?.icon || '🏆'}</div>

        {/* Archetype name */}
        <h1 className="text-5xl font-bold text-white mb-4">{archetype}</h1>

        {/* Description */}
        <p className="text-2xl text-blue-200 max-w-2xl">
          {archetypeData?.description || 'A unique sales approach'}
        </p>
      </div>

      {/* Footer CTA */}
      <div className="flex items-center justify-between pt-8 border-t border-white/10">
        <p className="text-xl text-slate-400">
          Think you have what it takes?
        </p>
        <div className="bg-blue-600 px-8 py-3 rounded-xl">
          <span className="text-white font-semibold text-lg">Take the Challenge</span>
        </div>
      </div>
    </div>
  );
});

export default ShareCard;
