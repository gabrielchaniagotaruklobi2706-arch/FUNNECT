import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Sparkles, X } from 'lucide-react';

interface GuideStep {
  stepNumber: number;
  title: string;
  instruction: string;
  targetComponentType: string;
  parts: string[];
}

interface GuideMeOverlayProps {
  steps: GuideStep[];
  currentStepIndex: number;
  onNextStep: () => void;
  onPrevStep: () => void;
  onClose: () => void;
  onAutoPlaceStep?: () => void;
}

export const GuideMeOverlay: React.FC<GuideMeOverlayProps> = ({
  steps,
  currentStepIndex,
  onNextStep,
  onPrevStep,
  onClose,
  onAutoPlaceStep
}) => {
  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex] || steps[0];
  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="bg-white/95 backdrop-blur-md border border-blue-200 rounded-3xl shadow-xl p-4 sm:p-5 max-w-xl w-full mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center">
            {currentStep.stepNumber}
          </span>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">
              Guide Me · Step {currentStep.stepNumber} of {steps.length}
            </div>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
              {currentStep.title}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Instruction */}
      <p className="text-xs text-slate-600 leading-relaxed mb-3">
        {currentStep.instruction}
      </p>

      {/* Parts Needed Chips */}
      <div className="flex items-center gap-1.5 flex-wrap mb-4">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase">Parts Needed:</span>
        {currentStep.parts.map((p, idx) => (
          <span
            key={idx}
            className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold"
          >
            {p}
          </span>
        ))}
      </div>

      {/* Step Navigation Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          onClick={onPrevStep}
          disabled={currentStepIndex === 0}
          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none font-bold text-xs text-slate-600 flex items-center gap-1 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <div className="text-[11px] font-mono text-slate-400">
          {progressPercent}% Complete
        </div>

        {currentStepIndex < steps.length - 1 ? (
          <button
            onClick={onNextStep}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-xs flex items-center gap-1 transition-all"
          >
            <span>Next Step</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs flex items-center gap-1 transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Finish Guide</span>
          </button>
        )}
      </div>
    </div>
  );
};
