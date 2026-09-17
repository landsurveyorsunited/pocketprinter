import React from 'react';
import { UploadCloud, CheckSquare, Layers, Palette, Eye, Printer, Check } from 'lucide-react';
import { ActiveStep } from '../types';

interface StepBarProps {
  activeStep: ActiveStep;
  setActiveStep: (step: ActiveStep) => void;
  contactCount: number;
  selectedCount: number;
  seniorMode: boolean;
}

interface StepItem {
  id: ActiveStep;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  num: number;
}

const STEPS: StepItem[] = [
  { id: 'import', label: 'Import', icon: UploadCloud, num: 1 },
  { id: 'select', label: 'Select', icon: CheckSquare, num: 2 },
  { id: 'organize', label: 'Organize', icon: Layers, num: 3 },
  { id: 'design', label: 'Design', icon: Palette, num: 4 },
  { id: 'preview', label: 'Preview', icon: Eye, num: 5 },
  { id: 'print', label: 'Print', icon: Printer, num: 6 },
];

export const StepBar: React.FC<StepBarProps> = ({
  activeStep,
  setActiveStep,
  contactCount,
  selectedCount,
  seniorMode,
}) => {
  const activeIndex = STEPS.findIndex(s => s.id === activeStep);

  return (
    <div className="w-full bg-[#EEF2F6] py-3 px-3 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-6 gap-1.5 sm:gap-3 p-1.5 rounded-2xl neu-inset">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = step.id === activeStep;
            const isCompleted = idx < activeIndex;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                id={`step-nav-${step.id}`}
                className={`relative flex flex-col items-center justify-center py-2 sm:py-2.5 px-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'neu-raised text-[#087F8C] font-semibold border border-white/80 shadow-[0_4px_10px_rgba(8,127,140,0.15)]'
                    : isCompleted
                    ? 'text-[#243B53] hover:text-[#087F8C]'
                    : 'text-[#8292A2] hover:text-[#55697D]'
                }`}
              >
                {/* Step indicator circle / icon */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-1 text-xs transition-transform ${
                    isActive
                      ? 'bg-gradient-to-br from-[#087F8C] to-[#06616B] text-white shadow-md scale-105'
                      : isCompleted
                      ? 'bg-[#267A4A] text-white'
                      : 'neu-inset text-[#6D8092]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </div>

                {/* Label */}
                <span className={`text-[11px] sm:text-xs truncate max-w-full ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {step.label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute -bottom-1 w-2 h-0.5 rounded-full bg-[#087F8C]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Status mini bar */}
        <div className="flex items-center justify-between text-xs text-[#55697D] mt-2 px-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#17212B]">
              Step {activeIndex + 1} of 6:
            </span>
            <span>
              {activeStep === 'import' && 'Import your contact files or phone contacts'}
              {activeStep === 'select' && `${selectedCount} of ${contactCount} contacts selected for print`}
              {activeStep === 'organize' && 'Group by last name, household, or business category'}
              {activeStep === 'design' && 'Choose template, font style, and fields'}
              {activeStep === 'preview' && 'Inspect paginated sheets and layout'}
              {activeStep === 'print' && 'Generate PDF or send to your printer'}
            </span>
          </div>
          <span className="hidden sm:inline-block font-mono text-[11px] bg-white/70 px-2 py-0.5 rounded-md border border-[#D8E1E8]">
            {selectedCount} Ready
          </span>
        </div>
      </div>
    </div>
  );
};
