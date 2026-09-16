import React from 'react';
import { 
  Building2, 
  Layers, 
  PieChart, 
  Calculator,
  Settings,
  TrendingUp
} from 'lucide-react';

interface SidebarProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentStep, onSelectStep }) => {
  return (
    <aside className="sidebar" id="app-sidebar">
      <div>
        <div className="nav-section-title">Calculator Steps</div>
        <nav className="nav-list">
          <a 
            href="#step1" 
            className={`nav-item ${currentStep === 1 ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onSelectStep(1); }}
            id="sidebar-nav-step1"
          >
            <Building2 size={18} />
            <span>1. Basic Info & Capital</span>
          </a>
          <a 
            href="#step2" 
            className={`nav-item ${currentStep === 2 ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onSelectStep(2); }}
            id="sidebar-nav-step2"
          >
            <Layers size={18} />
            <span>2. Operational Expenses</span>
            {currentStep < 2 && <span className="nav-item-badge">Next</span>}
          </a>
          <a 
            href="#step3" 
            className={`nav-item ${currentStep === 3 ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onSelectStep(3); }}
            id="sidebar-nav-step3"
          >
            <PieChart size={18} />
            <span>3. Funding & Summary</span>
            {currentStep < 3 && <span className="nav-item-badge">Next</span>}
          </a>
          <a 
            href="#step4" 
            className={`nav-item ${currentStep === 4 ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onSelectStep(4); }}
            id="sidebar-nav-step4"
          >
            <Calculator size={18} />
            <span>4. Finance Calculator</span>
            {currentStep < 4 && <span className="nav-item-badge">Next</span>}
          </a>
          <a 
            href="#step5" 
            className={`nav-item ${currentStep === 5 ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onSelectStep(5); }}
            id="sidebar-nav-step5"
          >
            <TrendingUp size={18} />
            <span>5. Profitability & Break-Even</span>
            {currentStep < 5 && <span className="nav-item-badge">Next</span>}
          </a>
        </nav>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div className="nav-section-title">System</div>
        <nav className="nav-list">
          <a href="#settings" className="nav-item">
            <Settings size={18} />
            <span>Configuration</span>
          </a>
        </nav>
      </div>
    </aside>
  );
};
