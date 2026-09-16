import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentStep: number;
}

export const Header: React.FC<HeaderProps> = ({ currentStep }) => {
  return (
    <header className="header" id="app-header">
      <div className="header-brand">
        <div className="header-logo-icon">
          <Building2 size={22} />
        </div>
        <span className="header-title">Business Finance Suite</span>
        <span className="header-tag">Step {currentStep} of 5</span>
      </div>

      <div className="header-actions">
        <div className="status-badge" id="system-status">
          <span className="status-dot"></span>
          <ShieldCheck size={16} />
          <span>Form Engine Ready</span>
        </div>
      </div>
    </header>
  );
};
