import { useState } from 'react';
import { SCENARIO_OPTIONS, getArchetypeByChoice } from '../utils/archetypes';

export default function ScenarioQuestion({ onComplete }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!selectedOption) return;

    setIsSubmitting(true);
    const archetype = getArchetypeByChoice(selectedOption);

    // Small delay for UX
    setTimeout(() => {
      onComplete({
        choice: selectedOption,
        archetype: archetype.name,
        archetypeDescription: archetype.description,
      });
    }, 500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Scenario Setup */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-8 border border-amber-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">The Scenario</h3>
            <p className="text-slate-600 leading-relaxed">
              You've been working a deal with a <span className="font-semibold">10-location franchisee</span>. After 3 weeks of conversations, they say:
            </p>
            <blockquote className="mt-3 pl-4 border-l-4 border-amber-300 italic text-slate-700">
              "I like what you're selling, but your competitor is 30% cheaper. I need to think about it."
            </blockquote>
          </div>
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
        What do you do next?
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {SCENARIO_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
              ${selectedOption === option.value
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }
            `}
          >
            <input
              type="radio"
              name="scenario"
              value={option.value}
              checked={selectedOption === option.value}
              onChange={() => setSelectedOption(option.value)}
              className="mt-1 w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="font-semibold text-slate-500 mr-2">{option.value})</span>
              <span className={`${selectedOption === option.value ? 'text-blue-900' : 'text-slate-700'}`}>
                {option.text}
              </span>
            </div>
          </label>
        ))}
      </div>

      {/* Submit button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!selectedOption || isSubmitting}
          className={`
            flex items-center justify-center gap-2 px-8 py-3 font-semibold rounded-xl transition-all
            ${selectedOption && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-100'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Submit Answer
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
