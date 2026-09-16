import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calculator,
  IndianRupee,
  Percent,
  CalendarDays,
  TrendingUp,
  ArrowLeft,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { Step1FormData, Step4FormData } from '../../types/calculator';
import { formatINR, sanitizeMonetaryInput, parseINRAmount } from '../../utils/formatters';
import { calculateFinancialStructure, MICRO_FINANCE_SCHEME } from '../../lib/finance';

interface Step4LoanEMIProps {
  step1Data: Step1FormData | null;
  onBack: () => void;
  onContinue: () => void;
  onRestart: () => void;
  onChange?: (data: Step4FormData) => void;
  initialValues?: Partial<Step4FormData>;
}

type LoanFormData = Omit<Step4FormData, 'monthlyEMI'>;

interface LoanFormErrors {
  loanAmount?: string;
  annualInterestRate?: string;
  tenureYears?: string;
}

interface EMIResult {
  emi: number;
  totalInterest: number;
  totalRepayment: number;
  monthlyRate: number;
  totalMonths: number;
}

interface AmortizationRow {
  month: number;
  openingBalance: number;
  emi: number;
  principal: number;
  interest: number;
  closingBalance: number;
}

/**
 * Standard reducing-balance EMI formula:
 * EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)
 *
 * Where:
 *   P = Principal (Loan Amount)
 *   r = Monthly interest rate = Annual Rate / 12 / 100
 *   n = Total months = Tenure in years × 12
 */
const calculateEMI = (
  principal: number,
  annualRatePercent: number,
  tenureYears: number
): EMIResult | null => {
  if (principal <= 0 || annualRatePercent <= 0 || tenureYears <= 0) return null;

  const r = annualRatePercent / 12 / 100;
  const n = tenureYears * 12;

  const onePlusRPowN = Math.pow(1 + r, n);
  const emi = (principal * r * onePlusRPowN) / (onePlusRPowN - 1);

  const totalRepayment = emi * n;
  const totalInterest = totalRepayment - principal;

  return {
    emi: Math.round(emi * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    monthlyRate: r,
    totalMonths: n
  };
};

const buildAmortizationTable = (
  principal: number,
  monthlyRate: number,
  totalMonths: number,
  emi: number
): AmortizationRow[] => {
  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= totalMonths; month++) {
    const openingBalance = balance;
    const interest = Math.round(balance * monthlyRate * 100) / 100;
    const principalPaid = Math.round((emi - interest) * 100) / 100;
    const closingBalance = Math.max(0, Math.round((balance - principalPaid) * 100) / 100);

    rows.push({
      month,
      openingBalance,
      emi,
      principal: principalPaid,
      interest,
      closingBalance
    });

    balance = closingBalance;
    if (balance <= 0) break;
  }

  return rows;
};

const DEFAULT_LOAN: LoanFormData = {
  loanAmount: '',
  annualInterestRate: '',
  tenureYears: '',
  loanMode: 'custom',
  moratoriumMonths: 0
};

export const Step4LoanEMI: React.FC<Step4LoanEMIProps> = ({
  step1Data,
  onBack,
  onContinue,
  onRestart,
  onChange,
  initialValues
}) => {
  const [form, setForm] = useState<LoanFormData>({
    loanAmount: initialValues?.loanAmount || '',
    annualInterestRate: initialValues?.annualInterestRate || '',
    tenureYears: initialValues?.tenureYears || '',
    loanMode: initialValues?.loanMode || 'custom',
    moratoriumMonths: initialValues?.moratoriumMonths || 0
  });
  const [errors, setErrors] = useState<LoanFormErrors>({});
  const [showAmortization, setShowAmortization] = useState(false);
  const [amortizationPage, setAmortizationPage] = useState(0);
  const ROWS_PER_PAGE = 12;

  const handleLoanAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = sanitizeMonetaryInput(e.target.value);
    setForm(prev => ({ ...prev, loanAmount: clean }));
    if (errors.loanAmount) setErrors(prev => ({ ...prev, loanAmount: undefined }));
  }, [errors.loanAmount]);

  const handleRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setForm(prev => ({ ...prev, annualInterestRate: val }));
    if (errors.annualInterestRate) setErrors(prev => ({ ...prev, annualInterestRate: undefined }));
  }, [errors.annualInterestRate]);

  const handleTenureChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setForm(prev => ({ ...prev, tenureYears: val }));
    if (errors.tenureYears) setErrors(prev => ({ ...prev, tenureYears: undefined }));
  }, [errors.tenureYears]);

  const principal = useMemo(() => parseINRAmount(form.loanAmount), [form.loanAmount]);
  const annualRate = useMemo(() => {
    const v = parseFloat(form.annualInterestRate);
    return isNaN(v) ? 0 : v;
  }, [form.annualInterestRate]);
  const tenureYears = useMemo(() => {
    const v = parseInt(form.tenureYears, 10);
    return isNaN(v) ? 0 : v;
  }, [form.tenureYears]);

  const schemeCalculation = useMemo(() => calculateFinancialStructure({
    mode: step1Data?.mode || 'start',
    marginCapital: step1Data ? parseINRAmount(step1Data.ownCapital) : 0
  }), [step1Data]);

  const isSchemeMode = form.loanMode === 'microFinance';
  const effectivePrincipal = isSchemeMode ? schemeCalculation.actualLoanAmount || 0 : principal;
  const effectiveAnnualRate = isSchemeMode ? schemeCalculation.interestRate || 0 : annualRate;
  const effectiveTenureYears = isSchemeMode ? schemeCalculation.tenureYears || 0 : tenureYears;

  const emiResult = useMemo<EMIResult | null>(
    () => calculateEMI(effectivePrincipal, effectiveAnnualRate, effectiveTenureYears),
    [effectivePrincipal, effectiveAnnualRate, effectiveTenureYears]
  );

  useEffect(() => {
    onChange?.({
      ...form,
      monthlyEMI: isSchemeMode ? 0 : emiResult?.emi || 0,
      repaymentInstallment: isSchemeMode ? schemeCalculation.quarterlyInstallment || 0 : emiResult?.emi || 0,
      repaymentFrequency: isSchemeMode ? 'quarterly' : 'monthly',
      totalInterest: isSchemeMode ? schemeCalculation.totalInterest || 0 : emiResult?.totalInterest || 0,
      totalRepayment: isSchemeMode ? schemeCalculation.totalRepayment || 0 : emiResult?.totalRepayment || 0
    });
  }, [emiResult, form, isSchemeMode, onChange, schemeCalculation]);

  const amortizationTable = useMemo<AmortizationRow[]>(() => {
    if (!emiResult) return [];
    return buildAmortizationTable(
      effectivePrincipal,
      emiResult.monthlyRate,
      emiResult.totalMonths,
      emiResult.emi
    );
  }, [emiResult, effectivePrincipal]);

  const paginatedRows = useMemo(() => {
    const start = amortizationPage * ROWS_PER_PAGE;
    return amortizationTable.slice(start, start + ROWS_PER_PAGE);
  }, [amortizationTable, amortizationPage]);

  const totalPages = Math.ceil(amortizationTable.length / ROWS_PER_PAGE);

  // Funding gap from Step 1 as a suggested loan amount
  const suggestedLoan = useMemo(() => {
    if (!step1Data) return null;
    const own = parseINRAmount(step1Data.ownCapital);
    const total = calculateFinancialStructure({ mode: step1Data.mode, marginCapital: parseINRAmount(step1Data.ownCapital) }).projectCost || 0;
    const gap = Math.max(0, total - own);
    return gap > 0 ? gap : null;
  }, [step1Data]);

  const applySuggestedLoan = () => {
    if (suggestedLoan !== null) {
      setForm(prev => ({ ...prev, loanAmount: String(suggestedLoan) }));
      setErrors(prev => ({ ...prev, loanAmount: undefined }));
    }
  };

  const selectLoanMode = (loanMode: LoanFormData['loanMode']) => {
    if (loanMode === 'microFinance') {
      setForm({
        loanMode,
        loanAmount: schemeCalculation.actualLoanAmount ? String(schemeCalculation.actualLoanAmount) : '',
        annualInterestRate: String(MICRO_FINANCE_SCHEME.annualInterestRate),
        tenureYears: String(MICRO_FINANCE_SCHEME.tenureYears),
        moratoriumMonths: MICRO_FINANCE_SCHEME.moratoriumMonths
      });
    } else {
      setForm(prev => ({ ...prev, loanMode, moratoriumMonths: 0 }));
    }
    setErrors({});
  };

  const handleReset = () => {
    setForm(DEFAULT_LOAN);
    setErrors({});
    setShowAmortization(false);
    setAmortizationPage(0);
  };

  // Interest-to-principal ratio for visual bar
  const interestRatio = emiResult
    ? Math.round((emiResult.totalInterest / emiResult.totalRepayment) * 1000) / 10
    : 0;
  const principalRatio = emiResult ? Math.round((100 - interestRatio) * 10) / 10 : 0;

  const hasResult = isSchemeMode
    ? schemeCalculation.calculationStatus === 'valid'
    : emiResult !== null;

  const displayedInstallment = isSchemeMode
    ? schemeCalculation.quarterlyInstallment
    : emiResult?.emi;
  const displayedTotalInterest = isSchemeMode
    ? schemeCalculation.totalInterest
    : emiResult?.totalInterest;
  const displayedTotalRepayment = isSchemeMode
    ? schemeCalculation.totalRepayment
    : emiResult?.totalRepayment;

  return (
    <div className="calculator-form-container" id="step4-loan-emi-container">
      {/* ── Section Header ── */}
      <div className="form-section">
        <div className="form-section-header">
          <div
            className="form-section-icon"
            style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)' }}
          >
            <Calculator size={22} />
          </div>
          <div>
            <h3 className="form-section-title">Loan Finance Calculator</h3>
            <p className="form-section-desc">
              Calculate EMI, total interest, and total repayment using the standard reducing-balance formula. All calculations are deterministic and client-side.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <span className="form-label">Financing Mode</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              className={`btn ${!isSchemeMode ? 'btn-primary' : 'btn-secondary'} btn-large`}
              onClick={() => selectLoanMode('custom')}
              id="loan-mode-custom"
            >
              Custom Loan
            </button>
            <button
              type="button"
              className={`btn ${isSchemeMode ? 'btn-primary' : 'btn-secondary'} btn-large`}
              onClick={() => selectLoanMode('microFinance')}
              id="loan-mode-micro-finance"
            >
              Micro Finance Scheme
            </button>
          </div>
        </div>

        {isSchemeMode && (
          <div className="alert alert-info" style={{ marginBottom: '24px' }}>
            <Info size={20} color="var(--accent-cyan)" />
            <div>
              <strong>{MICRO_FINANCE_SCHEME.name} values applied</strong>
              <p style={{ fontSize: '0.82rem', marginTop: '3px' }}>
                Scheme funding, {MICRO_FINANCE_SCHEME.annualInterestRate}% p.a., {MICRO_FINANCE_SCHEME.tenureYears} years, and {MICRO_FINANCE_SCHEME.moratoriumMonths}-month moratorium are scheme data. Quarterly repayment is computed by the finance engine; moratorium interest treatment follows its documented assumption.
              </p>
            </div>
          </div>
        )}

        {/* Suggested loan hint from Step 1 */}
        {!isSchemeMode && suggestedLoan !== null && (
          <div
            className="alert"
            style={{
              background: 'rgba(99, 102, 241, 0.08)',
              borderColor: 'rgba(99, 102, 241, 0.3)',
              color: '#fff',
              marginBottom: '24px',
              cursor: 'pointer',
              userSelect: 'none'
            }}
            onClick={applySuggestedLoan}
            id="suggested-loan-hint"
          >
            <Info size={20} color="var(--accent-indigo)" />
            <div>
              <strong>Funding Gap from Step 1:</strong>{' '}
              {formatINR(suggestedLoan)}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                Click to use this as your loan amount.
              </p>
            </div>
          </div>
        )}

        {/* ── Inputs ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}
        >
          {/* Loan Amount */}
          <div className="form-field">
            <label className="form-label" htmlFor="input-loan-amount">
              Loan / Scheme Funding <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{isSchemeMode ? 'Scheme data' : 'User input'}</span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix">
                <IndianRupee size={16} />
              </span>
              <input
                id="input-loan-amount"
                type="text"
                inputMode="decimal"
                className={`form-input ${errors.loanAmount ? 'input-error' : ''}`}
                placeholder="e.g. 5000000"
                value={form.loanAmount}
                onChange={handleLoanAmountChange}
                readOnly={isSchemeMode}
                autoComplete="off"
              />
            </div>
            {form.loanAmount && (
                <span className="input-hint">{formatINR(effectivePrincipal) || '₹ 0'}</span>
            )}
            {errors.loanAmount && (
              <span className="field-error">{errors.loanAmount}</span>
            )}
          </div>

          {/* Annual Interest Rate */}
          <div className="form-field">
            <label className="form-label" htmlFor="input-interest-rate">
              Annual Interest Rate (%) <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{isSchemeMode ? 'Scheme data' : 'User input'}</span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix">
                <Percent size={16} />
              </span>
              <input
                id="input-interest-rate"
                type="text"
                inputMode="decimal"
                className={`form-input ${errors.annualInterestRate ? 'input-error' : ''}`}
                placeholder="e.g. 10.5"
                value={form.annualInterestRate}
                onChange={handleRateChange}
                readOnly={isSchemeMode}
                autoComplete="off"
              />
            </div>
            {form.annualInterestRate && annualRate > 0 && (
              <span className="input-hint">Monthly rate: {(annualRate / 12).toFixed(4)}%</span>
            )}
            {errors.annualInterestRate && (
              <span className="field-error">{errors.annualInterestRate}</span>
            )}
          </div>

          {/* Loan Tenure */}
          <div className="form-field">
            <label className="form-label" htmlFor="input-tenure-years">
              Loan Tenure (Years) <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{isSchemeMode ? 'Scheme data' : 'User input'}</span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix">
                <CalendarDays size={16} />
              </span>
              <input
                id="input-tenure-years"
                type="text"
                inputMode="numeric"
                className={`form-input ${errors.tenureYears ? 'input-error' : ''}`}
                placeholder="e.g. 5"
                value={form.tenureYears}
                onChange={handleTenureChange}
                readOnly={isSchemeMode}
                autoComplete="off"
              />
            </div>
            {form.tenureYears && tenureYears > 0 && (
              <span className="input-hint">{tenureYears * 12} monthly instalments</span>
            )}
            {errors.tenureYears && (
              <span className="field-error">{errors.tenureYears}</span>
            )}
          </div>
        </div>

        {/* Quick tenure selector */}
        {!isSchemeMode && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
            Quick tenure:
          </span>
          {[1, 2, 3, 5, 7, 10, 15, 20].map(yr => (
            <button
              key={yr}
              type="button"
              className={`btn btn-secondary ${tenureYears === yr ? 'active' : ''}`}
              style={{ padding: '4px 12px', fontSize: '0.8rem', minWidth: 'unset' }}
              onClick={() => setForm(prev => ({ ...prev, tenureYears: String(yr) }))}
              id={`quick-tenure-${yr}yr`}
            >
              {yr}Y
            </button>
          ))}
        </div>}

        {isSchemeMode && (
          <div className="input-hint" style={{ marginBottom: '8px' }}>
            Moratorium: {form.moratoriumMonths} months, included in the stated {effectiveTenureYears}-year repayment period (scheme data).
          </div>
        )}
      </div>

      {/* ── Results Panel (visible when inputs are valid) ── */}
      {hasResult && (emiResult || isSchemeMode) && (
        <>
          {/* EMI Result Cards */}
          <div className="form-section" id="emi-results-section">
            <div className="form-section-header">
              <div
                className="form-section-icon"
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}
              >
                <TrendingUp size={22} />
              </div>
              <div>
                <h3 className="form-section-title">EMI Calculation Results</h3>
                <p className="form-section-desc">
                  Reducing-balance method · {effectiveTenureYears} year{effectiveTenureYears > 1 ? 's' : ''} ·{' '}
                  {effectiveAnnualRate}% p.a. {isSchemeMode ? '· Scheme-defined' : '· User input'}
                </p>
              </div>
            </div>

            {/* Primary EMI card */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.08) 100%)',
                border: '1px solid rgba(16,185,129,0.35)',
                borderRadius: 'var(--radius-lg)',
                padding: '28px 32px',
                textAlign: 'center',
                marginBottom: '20px'
              }}
              id="emi-primary-card"
            >
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                {isSchemeMode ? 'Quarterly Installment' : 'Monthly EMI (Equated Monthly Instalment)'}
              </p>
              <div
                style={{
                  fontSize: '2.6rem',
                  fontWeight: 800,
                  color: 'var(--accent-emerald)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1
                }}
                id="emi-value-display"
              >
                {formatINR(displayedInstallment || 0)}
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                {isSchemeMode
                  ? `payable every quarter for ${schemeCalculation.numberOfInstallments} installments`
                  : `payable every month for ${emiResult?.totalMonths || 0} months`}
              </p>
            </div>

            {/* Summary cards */}
            <div
              className="grid-cards mb-6"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
            >
              <div className="card" style={{ padding: '18px' }}>
                <span className="summary-label">Loan Principal</span>
                <div
                  className="summary-value"
                  style={{ fontSize: '1.35rem', marginTop: '6px' }}
                  id="result-principal"
                >
                  {formatINR(effectivePrincipal)}
                </div>
                <span className="card-desc" style={{ fontSize: '0.77rem', marginTop: '4px' }}>
                  Amount borrowed
                </span>
              </div>

              <div
                className="card"
                style={{ padding: '18px', borderColor: 'rgba(245, 158, 11, 0.3)' }}
              >
                <span className="summary-label">Total Interest Payable</span>
                <div
                  className="summary-value"
                  style={{ fontSize: '1.35rem', color: 'var(--accent-amber)', marginTop: '6px' }}
                  id="result-total-interest"
                >
                  {formatINR(displayedTotalInterest || 0)}
                </div>
                <span className="card-desc" style={{ fontSize: '0.77rem', marginTop: '4px' }}>
                  Interest cost over {effectiveTenureYears}Y
                </span>
              </div>

              <div
                className="card"
                style={{ padding: '18px', borderColor: 'rgba(6, 182, 212, 0.3)' }}
              >
                <span className="summary-label">Total Repayment Amount</span>
                <div
                  className="summary-value"
                  style={{ fontSize: '1.35rem', color: 'var(--accent-cyan)', marginTop: '6px' }}
                  id="result-total-repayment"
                >
                  {formatINR(displayedTotalRepayment || 0)}
                </div>
                <span className="card-desc" style={{ fontSize: '0.77rem', marginTop: '4px' }}>
                  Principal + Interest
                </span>
              </div>
            </div>

            {/* Principal vs Interest visual bar */}
            {!isSchemeMode && <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                  marginBottom: '10px',
                  flexWrap: 'wrap',
                  gap: '6px'
                }}
              >
                <span>
                  <strong>Principal:</strong> {principalRatio}% ({formatINR(effectivePrincipal)})
                </span>
                <span>
                  <strong>Total Interest:</strong> {interestRatio}% ({formatINR(displayedTotalInterest || 0)})
                </span>
              </div>
              <div
                style={{
                  height: '14px',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                  display: 'flex'
                }}
              >
                <div
                  style={{
                    width: `${principalRatio}%`,
                    background: 'var(--gradient-emerald)',
                    transition: 'width 0.5s ease'
                  }}
                />
                <div
                  style={{
                    width: `${interestRatio}%`,
                    background: 'rgba(245, 158, 11, 0.6)',
                    transition: 'width 0.5s ease'
                  }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginTop: '10px',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '2px',
                      background: 'var(--accent-emerald)'
                    }}
                  />
                  Principal
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      borderRadius: '2px',
                      background: 'var(--accent-amber)'
                    }}
                  />
                  Interest
                </span>
              </div>
            </div>}
          </div>

          {/* ── Amortization Schedule (collapsible) ── */}
          {!isSchemeMode && <div className="form-section" id="amortization-section">
            <button
              type="button"
              className="btn btn-secondary btn-large"
              style={{ width: '100%', justifyContent: 'space-between' }}
              onClick={() => {
                setShowAmortization(v => !v);
                setAmortizationPage(0);
              }}
              id="btn-toggle-amortization"
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarDays size={18} />
                {showAmortization ? 'Hide' : 'Show'} Amortization Schedule
              </span>
              {showAmortization ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {showAmortization && (
              <div style={{ marginTop: '16px', overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '0.82rem',
                    color: 'var(--text-primary)'
                  }}
                  id="amortization-table"
                >
                  <thead>
                    <tr
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        borderBottom: '1px solid var(--border-color)'
                      }}
                    >
                      {['Month', 'Opening Balance', 'EMI', 'Principal', 'Interest', 'Closing Balance'].map(
                        h => (
                          <th
                            key={h}
                            style={{
                              padding: '10px 12px',
                              textAlign: 'right',
                              fontWeight: 600,
                              color: 'var(--text-muted)',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.map(row => (
                      <tr
                        key={row.month}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          transition: 'background 0.15s'
                        }}
                        onMouseEnter={e =>
                          ((e.currentTarget as HTMLTableRowElement).style.background =
                            'rgba(255,255,255,0.03)')
                        }
                        onMouseLeave={e =>
                          ((e.currentTarget as HTMLTableRowElement).style.background = 'transparent')
                        }
                      >
                        <td
                          style={{
                            padding: '9px 12px',
                            textAlign: 'right',
                            color: 'var(--text-muted)'
                          }}
                        >
                          {amortizationPage * ROWS_PER_PAGE + row.month - (paginatedRows[0]?.month - 1)}
                        </td>
                        <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                          {formatINR(Math.round(row.openingBalance))}
                        </td>
                        <td
                          style={{
                            padding: '9px 12px',
                            textAlign: 'right',
                            color: 'var(--accent-emerald)',
                            fontWeight: 600
                          }}
                        >
                          {formatINR(Math.round(row.emi))}
                        </td>
                        <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                          {formatINR(Math.round(row.principal))}
                        </td>
                        <td
                          style={{
                            padding: '9px 12px',
                            textAlign: 'right',
                            color: 'var(--accent-amber)'
                          }}
                        >
                          {formatINR(Math.round(row.interest))}
                        </td>
                        <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                          {formatINR(Math.round(row.closingBalance))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '16px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '6px 14px' }}
                      disabled={amortizationPage === 0}
                      onClick={() => setAmortizationPage(p => p - 1)}
                      id="btn-amort-prev"
                    >
                      ← Prev
                    </button>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Page {amortizationPage + 1} of {totalPages}
                    </span>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '6px 14px' }}
                      disabled={amortizationPage >= totalPages - 1}
                      onClick={() => setAmortizationPage(p => p + 1)}
                      id="btn-amort-next"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>}
        </>
      )}

      {/* ── Empty state ── */}
      {!hasResult && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 24px',
            color: 'var(--text-muted)',
            fontSize: '0.9rem'
          }}
          id="emi-empty-state"
        >
          <Calculator size={40} style={{ opacity: 0.25, marginBottom: '12px' }} />
          <p>Enter loan amount, interest rate, and tenure above to calculate EMI instantly.</p>
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="form-actions-between">
        <button
          type="button"
          className="btn btn-secondary btn-large"
          onClick={onBack}
          id="btn-step4-back"
        >
          <ArrowLeft size={20} />
          <span>Back to Step 3</span>
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          {hasResult && (
            <button
              type="button"
              className="btn btn-secondary btn-large"
              onClick={handleReset}
              id="btn-step4-reset"
            >
              <RotateCcw size={18} />
              <span>Reset Calculator</span>
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary btn-large"
            onClick={onContinue}
            id="btn-step4-continue"
          >
            <span>Continue to Step 5</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-large"
            onClick={onRestart}
            id="btn-step4-restart"
          >
            <RotateCcw size={18} />
            <span>Restart Planning</span>
          </button>
        </div>
      </div>
    </div>
  );
};
