import React, { useMemo } from 'react';
import { 
  PieChart, 
  Landmark, 
  Building, 
  Rocket, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowLeft, 
  Printer, 
  RotateCcw 
} from 'lucide-react';
import { Step1FormData, Step2FormData, Step3FundingSummary } from '../../types/calculator';
import { formatINR, parseINRAmount } from '../../utils/formatters';
import { calculateFinancialStructure, MICRO_FINANCE_SCHEME } from '../../lib/finance';

interface Step3SummaryProps {
  step1Data: Step1FormData | null;
  step2Data: Step2FormData | null;
  onBack: () => void;
  onContinue: () => void;
  onRestart: () => void;
}

export const Step3Summary: React.FC<Step3SummaryProps> = ({
  step1Data,
  step2Data,
  onBack,
  onContinue,
  onRestart
}) => {
  // Deterministic Client-Side Funding & Feasibility Calculations derived directly from step1Data & step2Data
  const summary = useMemo<Step3FundingSummary>(() => {
    const ownCap = step1Data?.ownCapital ? parseINRAmount(step1Data.ownCapital) : 0;
    const targetInv = step1Data ? calculateFinancialStructure({ mode: step1Data.mode, marginCapital: parseINRAmount(step1Data.ownCapital) }).projectCost || 0 : 0;

    const totalReq = targetInv;
    const gap = Math.max(0, totalReq - ownCap);

    const equityRatio = totalReq > 0 ? Math.min(100, Math.round((ownCap / totalReq) * 1000) / 10) : 0;
    const gapRatio = totalReq > 0 ? Math.max(0, Math.round((gap / totalReq) * 1000) / 10) : 0;

    let feasibilityStatus: Step3FundingSummary['feasibilityStatus'] = 'healthy';
    let feasibilityLabel = 'Healthy Self-Funding Ratio';

    if (equityRatio < 15) {
      feasibilityStatus = 'high_dependency';
      feasibilityLabel = 'High External Funding Dependency';
    } else if (equityRatio < 30) {
      feasibilityStatus = 'moderate';
      feasibilityLabel = 'Moderate Equity Coverage';
    }

    return {
      totalInvestmentRequired: totalReq,
      ownCapital: ownCap,
      fundingGap: gap,
      equityRatio,
      gapRatio,
      feasibilityStatus,
      feasibilityLabel
    };
  }, [step1Data, step2Data]);

  const financeResult = useMemo(() => calculateFinancialStructure({
    mode: step1Data?.mode || 'start',
    marginCapital: step1Data ? parseINRAmount(step1Data.ownCapital) : 0
  }), [step1Data]);
  const requiredOwnContribution = Math.max(0, (financeResult.projectCost || 0) - (financeResult.actualLoanAmount || 0));
  const additionalOwnContribution = Math.max(0, requiredOwnContribution - summary.ownCapital);
  const schemeStatus = financeResult.calculationStatus === 'outside_scheme'
    ? 'not_eligible'
    : additionalOwnContribution > 0
      ? 'additional_contribution_required'
      : 'eligible';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="calculator-form-container" id="step3-summary-container">
      {/* Section 1: Funding Breakdown Summary */}
      <div className="form-section">
        <div className="form-section-header">
          <div className="form-section-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <PieChart size={22} />
          </div>
          <div>
            <h3 className="form-section-title">1. Funding Breakdown Summary</h3>
            <p className="form-section-desc">Deterministic comparison of required capital, own equity, and funding gap.</p>
          </div>
        </div>

        <div className="grid-cards mb-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {/* Total Required */}
          <div className="card" style={{ padding: '20px' }}>
            <span className="summary-label">Total Investment Required</span>
            <div className="summary-value grand-total" style={{ fontSize: '1.5rem', marginTop: '6px' }}>
              {formatINR(summary.totalInvestmentRequired) || '₹ 0'}
            </div>
            <span className="card-desc" style={{ fontSize: '0.775rem', marginTop: '4px' }}>
              Base Capital Requirement
            </span>
          </div>

          {/* Own Capital */}
          <div className="card" style={{ padding: '20px', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
            <span className="summary-label">Available Own Capital (Equity)</span>
            <div className="summary-value" style={{ fontSize: '1.5rem', color: 'var(--accent-emerald)', marginTop: '6px' }}>
              {formatINR(summary.ownCapital) || '₹ 0'}
            </div>
            <span className="card-desc" style={{ fontSize: '0.775rem', marginTop: '4px' }}>
              {summary.equityRatio}% Self-Funded Share
            </span>
          </div>

          {/* Funding Gap */}
          <div className="card" style={{ padding: '20px', borderColor: summary.fundingGap > 0 ? 'rgba(6, 182, 212, 0.3)' : 'var(--border-color)' }}>
            <span className="summary-label">External Funding Gap</span>
            <div className="summary-value" style={{ fontSize: '1.5rem', color: 'var(--accent-cyan)', marginTop: '6px' }}>
              {formatINR(summary.fundingGap) || '₹ 0'}
            </div>
            <span className="card-desc" style={{ fontSize: '0.775rem', marginTop: '4px' }}>
              {summary.gapRatio}% Remaining Gap
            </span>
          </div>
        </div>

        {/* Visual Capital Ratio Bar */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
            <span>
              <strong>Own Capital (Equity):</strong> {summary.equityRatio}% ({formatINR(summary.ownCapital) || '₹ 0'})
            </span>
            <span>
              <strong>Funding Gap:</strong> {summary.gapRatio}% ({formatINR(summary.fundingGap) || '₹ 0'})
            </span>
          </div>
          <div style={{ height: '14px', borderRadius: '9999px', background: 'rgba(6, 182, 212, 0.2)', overflow: 'hidden', display: 'flex' }}>
            <div 
              style={{ 
                width: `${summary.equityRatio}%`, 
                background: 'var(--gradient-emerald)', 
                transition: 'var(--transition)' 
              }} 
            />
            <div 
              style={{ 
                width: `${summary.gapRatio}%`, 
                background: 'rgba(6, 182, 212, 0.5)', 
                transition: 'var(--transition)' 
              }} 
            />
          </div>
        </div>
      </div>

      <div className="form-section" id="micro-finance-scheme-section">
        <div className="form-section-header">
          <div className="form-section-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
            <Landmark size={22} />
          </div>
          <div>
            <h3 className="form-section-title">Micro Finance Scheme</h3>
            <p className="form-section-desc">Scheme data from {MICRO_FINANCE_SCHEME.source}. Project-cost condition only; other beneficiary criteria are not assessed.</p>
          </div>
        </div>

        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          <SchemeCard label="Project Cost Limit" value={formatINR(MICRO_FINANCE_SCHEME.maximumProjectCost)} detail="Scheme data" />
          <SchemeCard label="Beneficiary Contribution" value={`${MICRO_FINANCE_SCHEME.beneficiaryContributionPercentage}%`} detail="Scheme data" />
          <SchemeCard label="Maximum Funding" value={formatINR(MICRO_FINANCE_SCHEME.maximumLoan)} detail="Scheme data" />
          <SchemeCard label="Funding" value={`Up to ${MICRO_FINANCE_SCHEME.fundingPercentage}%`} detail="Scheme data" />
          <SchemeCard label="Interest Rate" value={`${MICRO_FINANCE_SCHEME.annualInterestRate}% p.a.`} detail="Scheme data" />
          <SchemeCard label="Repayment" value={`${MICRO_FINANCE_SCHEME.tenureYears} years`} detail="Scheme data" />
          <SchemeCard label="Moratorium" value={`${MICRO_FINANCE_SCHEME.moratoriumMonths} months`} detail="Scheme data" />
        </div>

        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginTop: '20px' }}>
          <SchemeCard label="Scheme Funding" value={formatINR(financeResult.actualLoanAmount || 0) || '₹ 0'} detail="Computed" accent="var(--accent-cyan)" />
          <SchemeCard label="Required Own Contribution" value={formatINR(requiredOwnContribution) || '₹ 0'} detail="Computed from project cost and funding cap" accent="var(--accent-emerald)" />
          <SchemeCard label="Available Own Capital" value={formatINR(summary.ownCapital) || '₹ 0'} detail="User input" />
        </div>

        <div
          className="alert"
          style={{
            marginTop: '20px',
            background: schemeStatus === 'eligible' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            borderColor: schemeStatus === 'eligible' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
            color: '#fff'
          }}
        >
          {schemeStatus === 'eligible' ? <CheckCircle2 size={22} color="var(--accent-emerald)" /> : <AlertTriangle size={22} color="var(--accent-amber)" />}
          <div>
            <strong>
              {schemeStatus === 'eligible' && 'Eligible based on project-cost condition'}
              {schemeStatus === 'not_eligible' && 'Not eligible - project cost exceeds scheme limit'}
              {schemeStatus === 'additional_contribution_required' && 'Eligible by project cost, but additional beneficiary contribution is required'}
            </strong>
            {schemeStatus === 'additional_contribution_required' && (
              <p style={{ fontSize: '0.875rem', marginTop: '4px', color: 'var(--text-secondary)' }}>
                Additional own contribution required: {formatINR(additionalOwnContribution)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Funding Sources UI Framework (Category UI Structure Only) */}
      <div className="form-section">
        <div className="form-section-header">
          <div className="form-section-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)' }}>
            <Landmark size={22} />
          </div>
          <div>
            <h3 className="form-section-title">2. Potential Funding Source Categories</h3>
            <p className="form-section-desc">Framework categories for financing your remaining funding gap.</p>
          </div>
        </div>

        <div className="grid-cards">
          {/* Category 1: Government Funding */}
          <div className="card" id="funding-category-gov">
            <div className="card-icon" style={{ color: 'var(--accent-emerald)' }}>
              <Landmark size={22} />
            </div>
            <h4 className="card-title">Government Funding</h4>
            <p className="card-desc">
              Public sector development schemes, subsidy frameworks, and credit guarantee coverage options.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
              <span className="badge-outline">Grant Schemes</span>
              <span className="badge-outline">Subsidies</span>
              <span className="badge-outline">Credit Guarantees</span>
            </div>
          </div>

          {/* Category 2: Bank / Private Financing */}
          <div className="card" id="funding-category-bank">
            <div className="card-icon" style={{ color: 'var(--accent-cyan)' }}>
              <Building size={22} />
            </div>
            <h4 className="card-title">Bank & Private Financing</h4>
            <p className="card-desc">
              Commercial bank loans, working capital lines, equipment financing, and financial institution credit.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
              <span className="badge-outline">Term Loans</span>
              <span className="badge-outline">Working Capital Credit</span>
              <span className="badge-outline">Asset Finance</span>
            </div>
          </div>

          {/* Category 3: Startup & Alternative Funding */}
          <div className="card" id="funding-category-alt">
            <div className="card-icon" style={{ color: 'var(--accent-amber)' }}>
              <Rocket size={22} />
            </div>
            <h4 className="card-title">Startup & Alternative Funding</h4>
            <p className="card-desc">
              Angel networks, seed capital, incubator grants, micro-finance institutions, and peer funding.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
              <span className="badge-outline">Angel Networks</span>
              <span className="badge-outline">Incubators</span>
              <span className="badge-outline">Micro-Loans</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Feasibility Summary */}
      <div className="form-section">
        <div className="form-section-header">
          <div className="form-section-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <h3 className="form-section-title">3. Feasibility Summary & Capital Ratio Assessment</h3>
            <p className="form-section-desc">Client-side deterministic analysis of self-funding capacity.</p>
          </div>
        </div>

        <div 
          className="alert" 
          style={{ 
            background: summary.feasibilityStatus === 'healthy' 
              ? 'rgba(16, 185, 129, 0.1)' 
              : summary.feasibilityStatus === 'moderate' 
              ? 'rgba(245, 158, 11, 0.1)' 
              : 'rgba(239, 68, 68, 0.1)',
            borderColor: summary.feasibilityStatus === 'healthy' 
              ? 'rgba(16, 185, 129, 0.3)' 
              : summary.feasibilityStatus === 'moderate' 
              ? 'rgba(245, 158, 11, 0.3)' 
              : 'rgba(239, 68, 68, 0.3)',
            color: '#fff',
            marginBottom: '20px'
          }}
        >
          {summary.feasibilityStatus === 'healthy' && <CheckCircle2 size={24} color="var(--accent-emerald)" />}
          {summary.feasibilityStatus === 'moderate' && <AlertTriangle size={24} color="var(--accent-amber)" />}
          {summary.feasibilityStatus === 'high_dependency' && <AlertTriangle size={24} color="var(--accent-rose)" />}
          
          <div>
            <strong style={{ fontSize: '1rem' }}>{summary.feasibilityLabel} ({summary.equityRatio}% Own Equity)</strong>
            <p style={{ fontSize: '0.875rem', marginTop: '4px', color: 'var(--text-secondary)' }}>
              {summary.feasibilityStatus === 'healthy' && 
                'Your business has a strong self-funded equity base (>= 30%). This provides a healthy foundation for securing debt financing or grants.'}
              {summary.feasibilityStatus === 'moderate' && 
                'Your business has a moderate self-funding base (15% - 29%). Financial institutions may evaluate working capital management closely.'}
              {summary.feasibilityStatus === 'high_dependency' && 
                'High dependency on external financing (< 15% equity). Consider raising additional initial equity or planning a phased rollout.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Equity Contribution</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px' }}>
              {formatINR(summary.ownCapital) || '₹ 0'} ({summary.equityRatio}%)
            </div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Required External Gap</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '4px', color: 'var(--accent-cyan)' }}>
              {formatINR(summary.fundingGap) || '₹ 0'} ({summary.gapRatio}%)
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Action Buttons */}
      <div className="form-actions-between">
        <button 
          type="button" 
          className="btn btn-secondary btn-large" 
          onClick={onBack}
          id="btn-step3-back"
        >
          <ArrowLeft size={20} />
          <span>Back to Step 2</span>
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-large" 
            onClick={handlePrint}
            id="btn-step3-print"
          >
            <Printer size={18} />
            <span>Print / Export</span>
          </button>

          <button 
            type="button" 
            className="btn btn-secondary btn-large" 
            onClick={onRestart}
            id="btn-step3-restart"
          >
            <RotateCcw size={18} />
            <span>Restart</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary btn-large" 
            onClick={onContinue}
            id="btn-step3-continue"
          >
            <span>Finance Calculator →</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface SchemeCardProps {
  label: string;
  value: string;
  detail: string;
  accent?: string;
}

const SchemeCard: React.FC<SchemeCardProps> = ({ label, value, detail, accent }) => (
  <div className="card" style={{ padding: '16px' }}>
    <span className="summary-label">{label}</span>
    <div className="summary-value" style={{ fontSize: '1.15rem', marginTop: '6px', color: accent || 'var(--text-primary)' }}>{value}</div>
    <span className="card-desc" style={{ fontSize: '0.75rem', marginTop: '4px' }}>{detail}</span>
  </div>
);
