import React from 'react';
import { TrendingUp, Building2, Landmark, PiggyBank, Sparkles, CheckCircle2 } from 'lucide-react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <main className="main-content" id="main-dashboard">
      <div className="hero-banner">
        <div className="hero-content">
          <h2>Financial Calculator Suite</h2>
          <p>
            Project foundation configured with Vite, React 18, TypeScript, and modern design tokens.
            Ready for modular calculator development.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="var(--accent-emerald)" />
          Planned Modules Overview
        </h3>
      </div>

      <div className="grid-cards">
        <div className="card" id="card-investment">
          <div className="card-icon">
            <TrendingUp size={22} />
          </div>
          <h4 className="card-title">Investment Calculator</h4>
          <p className="card-desc">
            Compound interest, SIP projections, CAGR, and future wealth growth engine.
          </p>
          <div className="card-footer">
            <span className="badge-outline">Status: Standby</span>
            <CheckCircle2 size={16} color="var(--accent-emerald)" />
          </div>
        </div>

        <div className="card" id="card-loans">
          <div className="card-icon">
            <Building2 size={22} />
          </div>
          <h4 className="card-title">Loan & EMI Suite</h4>
          <p className="card-desc">
            Home loan, personal loan, amortization schedule & interest comparison.
          </p>
          <div className="card-footer">
            <span className="badge-outline">Status: Standby</span>
            <CheckCircle2 size={16} color="var(--accent-emerald)" />
          </div>
        </div>

        <div className="card" id="card-tax">
          <div className="card-icon">
            <Landmark size={22} />
          </div>
          <h4 className="card-title">Tax Estimator</h4>
          <p className="card-desc">
            Income tax slab evaluation and regime comparison engine.
          </p>
          <div className="card-footer">
            <span className="badge-outline">Status: Standby</span>
            <CheckCircle2 size={16} color="var(--accent-emerald)" />
          </div>
        </div>

        <div className="card" id="card-savings">
          <div className="card-icon">
            <PiggyBank size={22} />
          </div>
          <h4 className="card-title">Retirement & Savings</h4>
          <p className="card-desc">
            Goal-based savings planner, corpus targets & inflation adjustment.
          </p>
          <div className="card-footer">
            <span className="badge-outline">Status: Standby</span>
            <CheckCircle2 size={16} color="var(--accent-emerald)" />
          </div>
        </div>
      </div>
    </main>
  );
};
