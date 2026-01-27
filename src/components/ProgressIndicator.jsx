export default function ProgressIndicator({ currentStep, totalSteps = 2 }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={stepNum} className="flex items-center">
            <div
              className={`
                flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all
                ${isCompleted ? 'bg-green-500 text-white' : ''}
                ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-600/30' : ''}
                ${!isActive && !isCompleted ? 'bg-slate-200 text-slate-500' : ''}
              `}
            >
              {isCompleted ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                stepNum
              )}
            </div>
            {stepNum < totalSteps && (
              <div
                className={`w-12 h-0.5 mx-2 transition-colors ${
                  isCompleted ? 'bg-green-500' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        );
      })}
      <span className="ml-4 text-sm text-slate-500">
        Step {currentStep} of {totalSteps}
      </span>
    </div>
  );
}
