import React from 'react';
import { AppStep } from '../types';

interface StepIndicatorProps {
  currentStep: AppStep;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: AppStep.SELECT_TEMPLATE, label: 'Style' },
    { id: AppStep.UPLOAD_PHOTO, label: 'Upload' },
    { id: AppStep.PAYMENT, label: 'Payment' },
    { id: AppStep.RESULT, label: 'Result' },
  ];

  const getStepStatus = (stepId: AppStep, stepIndex: number) => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    
    if (currentStep === AppStep.PROCESSING) {
        if (stepId === AppStep.RESULT) return 'pending';
        return 'completed';
    }
    
    if (currentStep === AppStep.ERROR && stepIndex < 2) return 'completed';
    
    if (stepId === currentStep) return 'active';
    if (currentIndex > stepIndex) return 'completed';
    
    return 'inactive';
  };

  return (
    <div className="flex items-center justify-center mb-10">
      <div className="bg-white/60 backdrop-blur-md rounded-full border border-white/80 p-1.5 flex items-center shadow-sm ring-1 ring-slate-100">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id, index);
          
          let pillClass = "text-slate-400 hover:text-slate-600 font-medium";
          
          if (status === 'active') {
            // Active: Black background, Yellow text
            pillClass = "bg-slate-900 text-yellow-400 shadow-lg shadow-slate-900/20 font-bold ring-2 ring-yellow-400/50";
          }
          if (status === 'completed') {
            // Completed: Yellow background, Black text
            pillClass = "bg-yellow-400 text-slate-900 font-bold shadow-sm";
          }
          if (status === 'pending') {
            pillClass = "text-yellow-600 animate-pulse font-bold";
          }

          return (
            <div key={step.id} className="flex items-center">
              <div 
                className={`
                  px-3 sm:px-6 py-2 rounded-full text-xs sm:text-sm transition-all duration-300 whitespace-nowrap
                  ${pillClass}
                `}
              >
                <div className="flex items-center space-x-2">
                    {status === 'completed' && (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    <span>{step.label}</span>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`w-3 sm:w-6 h-[2px] mx-1 ${status === 'completed' ? 'bg-yellow-400' : 'bg-slate-200'}`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};