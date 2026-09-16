import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  IndianRupee,
  RotateCcw,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Step1FormData, Step2FormData, Step4FormData, Step5FormData } from '../../types/calculator';
import { formatINR, parseINRAmount, sanitizeMonetaryInput } from '../../utils/formatters';
import { calculateFinancialStructure } from '../../lib/finance';

interface Step5ProfitabilityProps {
  step1Data: Step1FormData | null;
  step2Data: Step2FormData | null;
  step4Data: Step4FormData | null;
  initialValues?: Partial<Step5FormData>;
  onChange: (data: Step5FormData) => void;
  onBack: () => void;
  onRestart: () => void;
}

const displayValue = (value: number | null): string => value === null ? 'Not available' : formatINR(value);

export const Step5Profitability: React.FC<Step5ProfitabilityProps> = ({
  step1Data,
  step2Data,
  step4Data,
  initialValues,
  onChange,
  onBack,
  onRestart
}) => {
  const [monthlyRevenue, setMonthlyRevenue] = useState(initialValues?.monthlyRevenue || '');

  useEffect(() => {
    if (initialValues?.monthlyRevenue !== undefined) {
      setMonthlyRevenue(initialValues.monthlyRevenue);
    }
  }, [initialValues?.monthlyRevenue]);

  const monthlyOperatingExpenses = step2Data?.totalMonthlyOpEx ?? null;

  const monthlyLoanEMI = step4Data?.repaymentFrequency === 'quarterly'
    ? (step4Data.repaymentInstallment ?? 0) / 3
    : step4Data?.monthlyEMI ?? 0;
  const totalInvestmentRequired = step1Data
    ? calculateFinancialStructure({ mode: step1Data.mode, marginCapital: parseINRAmount(step1Data.ownCapital) }).projectCost
    : null;
  const revenue = monthlyRevenue.trim() ? parseINRAmount(monthlyRevenue) : null;
  const monthlyNetProfit = revenue === null || monthlyOperatingExpenses === null
    ? null
    : revenue - monthlyOperatingExpenses - monthlyLoanEMI;
  const profitMargin = monthlyNetProfit !== null && revenue !== null && revenue > 0
    ? (monthlyNetProfit / revenue) * 100
    : null;
  const breakEvenPeriod = monthlyNetProfit !== null && monthlyNetProfit > 0 && totalInvestmentRequired !== null
    ? totalInvestmentRequired / monthlyNetProfit
    : null;
  const canReachBreakEven = monthlyNetProfit !== null && monthlyNetProfit > 0 && totalInvestmentRequired !== null;

  const handleRevenueChange = (value: string) => {
    const clean = sanitizeMonetaryInput(value);
    setMonthlyRevenue(clean);
    onChange({ monthlyRevenue: clean });
  };

  return (
    <div className="calculator-form-container" id="step5-profitability-container">
      <div className="form-section">
        <div className="form-section-header">
          <div className="form-section-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <h3 className="form-section-title">Profitability & Break-Even</h3>
            <p className="form-section-desc">Enter expected revenue to calculate monthly profitability from your saved planning data.</p>
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: '420px' }}>
          <label htmlFor="input-monthly-revenue" className="form-label">
            Expected Monthly Revenue (₹) <span className="required">User input</span>
          </label>
          <div className="input-wrapper">
            <span className="currency-symbol"><IndianRupee size={16} /></span>
            <input
              id="input-monthly-revenue"
              type="text"
              inputMode="decimal"
              className="form-input currency-input"
              placeholder="e.g. 3,00,000"
              value={monthlyRevenue}
              onChange={(e) => handleRevenueChange(e.target.value)}
              autoComplete="off"
            />
          </div>
          {monthlyRevenue && <div className="formatted-hint">Formatted: <strong>{formatINR(monthlyRevenue)}</strong></div>}
        </div>
      </div>

      <div className="form-section" id="profitability-results-section">
        <div className="form-section-header">
          <div className="form-section-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <h3 className="form-section-title">Computed Results</h3>
            <p className="form-section-desc">Values below are calculated deterministically from your inputs and saved Steps 1, 2, and 4 data.</p>
          </div>
        </div>

        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <ResultCard label="Monthly Revenue" value={displayValue(revenue)} detail="User input" />
          <ResultCard label="Monthly Operating Expenses" value={displayValue(monthlyOperatingExpenses)} detail="Computed from Step 2" />
          <ResultCard label="Monthly Loan Cost" value={formatINR(monthlyLoanEMI)} detail={step4Data?.repaymentFrequency === 'quarterly' ? 'Quarterly installment divided across 3 months for monthly profitability' : 'Computed from Step 4; ₹ 0 if no loan'} />
          <ResultCard label="Monthly Net Profit" value={displayValue(monthlyNetProfit)} detail="Revenue - expenses - EMI" accent={monthlyNetProfit !== null && monthlyNetProfit > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'} />
          <ResultCard label="Profit Margin" value={profitMargin === null ? 'Not available' : `${profitMargin.toFixed(2)}%`} detail="Computed from revenue and net profit" />
          <ResultCard label="Break-Even Period" value={breakEvenPeriod === null ? 'Not currently reachable' : `${breakEvenPeriod.toFixed(2)} months`} detail={canReachBreakEven ? `Based on ${formatINR(totalInvestmentRequired || 0)} investment` : 'Requires positive monthly net profit'} accent={canReachBreakEven ? 'var(--accent-cyan)' : 'var(--accent-amber)'} />
        </div>

        {revenue === null && <div className="alert alert-info" style={{ marginTop: '20px' }}><AlertCircle size={20} /><div>Enter a valid monthly revenue to compute profitability. Missing upstream data is shown as unavailable.</div></div>}
        {revenue !== null && monthlyNetProfit !== null && monthlyNetProfit <= 0 && <div className="alert" style={{ marginTop: '20px', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.35)', color: '#fca5a5' }}><AlertCircle size={20} /><div>Break-even cannot currently be reached because monthly net profit is not positive.</div></div>}
      </div>

      <div className="form-actions-between">
        <button type="button" className="btn btn-secondary btn-large" onClick={onBack} id="btn-step5-back">
          <ArrowLeft size={20} /><span>Back to Step 4</span>
        </button>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" className="btn btn-secondary btn-large" onClick={() => handleRevenueChange('')} id="btn-step5-reset">
            <RotateCcw size={18} /><span>Reset Revenue</span>
          </button>
          <button type="button" className="btn btn-primary btn-large" onClick={onRestart} id="btn-step5-restart">
            <RotateCcw size={18} /><span>Restart Planning</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface ResultCardProps {
  label: string;
  value: string;
  detail: string;
  accent?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ label, value, detail, accent }) => (
  <div className="card" style={{ padding: '18px' }}>
    <span className="summary-label">{label}</span>
    <div className="summary-value" style={{ fontSize: '1.25rem', marginTop: '6px', color: accent || 'var(--text-primary)' }}>{value}</div>
    <span className="card-desc" style={{ fontSize: '0.77rem', marginTop: '4px' }}>{detail}</span>
  </div>
);