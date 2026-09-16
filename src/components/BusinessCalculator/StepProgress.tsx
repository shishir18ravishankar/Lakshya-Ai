import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface StepProgressProps {
  currentStep: number;
}

export const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Business & Investment', subtitle: 'Basic Details & Capital' },
    { number: 2, title: 'Operational Setup', subtitle: 'Equipment & Expenses' },
    { number: 3, title: 'Funding & Summary', subtitle: 'Feasibility Assessment' },
    { number: 4, title: 'Finance Calculation', subtitle: 'Loan EMI & Repayment' },
    { number: 5, title: 'Profitability', subtitle: 'Profit & Break-Even' }
  ];

  return (
    <div className="step-progress-bar" id="step-progress-bar">
      {steps.map((step) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;

        return (
          <div
            key={step.number}
            className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
          >
            <div className="step-number-badge">
              {isCompleted ? <CheckCircle2 size={18} /> : step.number}
            </div>
            <div className="step-info">
              <span className="step-title">{step.title}</span>
              <span className="step-subtitle">{step.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
