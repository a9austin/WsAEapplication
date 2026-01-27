import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressIndicator from '../components/ProgressIndicator';
import VideoRecorder from '../components/VideoRecorder';
import CandidateInfoForm from '../components/CandidateInfoForm';
import ScenarioQuestion from '../components/ScenarioQuestion';
import { saveCandidate, generateCandidateId } from '../utils/db';

export default function ChallengePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [videoBlob, setVideoBlob] = useState(null);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVideoComplete = (blob) => {
    setVideoBlob(blob);
    setCurrentStep(2);
  };

  const handleCandidateInfoComplete = (info) => {
    setCandidateInfo(info);
    setCurrentStep(3);
  };

  const handleScenarioComplete = async ({ choice, archetype, archetypeDescription }) => {
    setIsProcessing(true);

    try {
      const candidateId = generateCandidateId();
      const timestamp = new Date().toISOString();

      const candidateData = {
        candidateId,
        videoBlob,
        name: candidateInfo.name,
        email: candidateInfo.email,
        linkedin: candidateInfo.linkedin,
        phone: candidateInfo.phone,
        scenarioChoice: choice,
        archetype,
        timestamp,
        videoFileName: `candidate-${candidateId}.webm`,
      };

      await saveCandidate(candidateData);

      // Navigate to confirmation with archetype info
      navigate('/complete', {
        state: {
          archetype,
          archetypeDescription,
          choice,
          candidateId,
          candidateName: candidateInfo.name,
        },
      });
    } catch (error) {
      console.error('Error saving candidate data:', error);
      // Still navigate but show error state
      navigate('/complete', {
        state: {
          archetype,
          archetypeDescription,
          choice,
          error: 'Failed to save your submission. Please try again.',
        },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            The QSR Sales Challenge
          </h1>
          <ProgressIndicator currentStep={currentStep} totalSteps={3} />
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          {currentStep === 1 && (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
                Part 1: Your 30-Second Pitch
              </h2>
              <VideoRecorder onComplete={handleVideoComplete} />
            </>
          )}

          {currentStep === 2 && (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
                Part 2: Your Info
              </h2>
              <CandidateInfoForm onComplete={handleCandidateInfoComplete} />
            </>
          )}

          {currentStep === 3 && (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
                Part 3: The Sales Scenario
              </h2>
              <ScenarioQuestion onComplete={handleScenarioComplete} />
            </>
          )}
        </div>

        {/* Processing overlay */}
        {isProcessing && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Processing your submission...
              </h3>
              <p className="text-slate-500 text-sm">
                This will only take a moment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
