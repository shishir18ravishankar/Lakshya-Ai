import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wrench, 
  Receipt, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  PieChart,
  ShieldAlert
} from 'lucide-react';
import { Step1FormData, Step2FormData, Step2FormErrors } from '../../types/calculator';
import { calculateMonthlyOperatingExpenses, formatINR, sanitizeMonetaryInput, parseINRAmount } from '../../utils/formatters';
import { calculateFinancialStructure } from '../../lib/finance';

interface Step2ExpensesProps {
  step1Data: Step1FormData | null;
  onBack: () => void;
  onComplete: (data: Step2FormData) => void;
  onChange?: (data: Step2FormData) => void;
  initialValues?: Partial<Step2FormData>;
}

export const Step2Expenses: React.FC<Step2ExpensesProps> = ({ 
  step1Data, 
  onBack, 
  onComplete, 
  onChange,
  initialValues 
}) => {
  const [formData, setFormData] = useState<Step2FormData>({
    equipmentCost: initialValues?.equipmentCost || '',
    renovationCost: initialValues?.renovationCost || '',
    licenseCost: initialValues?.licenseCost || '',
    monthlySalaries: initialValues?.monthlySalaries || '',
    monthlyRent: initialValues?.monthlyRent || '',
    monthlyMarketing: initialValues?.monthlyMarketing || '',
    runwayMonths: initialValues?.runwayMonths || 6,
    totalMonthlyOpEx: initialValues?.totalMonthlyOpEx ?? calculateMonthlyOperatingExpenses(initialValues as Step2FormData)
  });

  const [errors, setErrors] = useState<Step2FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Keep state synced if initialValues change externally
  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({
        ...prev,
        ...initialValues
      }));
    }
  }, [initialValues]);

  const updateFormData = (updated: Step2FormData) => {
    const persistedData = {
      ...updated,
      totalMonthlyOpEx: calculateMonthlyOperatingExpenses(updated)
    };
    setFormData(persistedData);
    if (onChange) {
      onChange(persistedData);
    }
  };

  // Monetary Input Sanitization
  const handleMonetaryChange = (field: keyof Omit<Step2FormData, 'runwayMonths' | 'totalMonthlyOpEx'>, rawValue: string) => {
    const clean = sanitizeMonetaryInput(rawValue);
    const updated = { ...formData, [field]: clean };
    updateFormData(updated);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Runway Month Selection
  const handleRunwayChange = (months: number) => {
    const updated = { ...formData, runwayMonths: months };
    updateFormData(updated);
  };

  // Live Calculation Breakdown
  const calculations = useMemo(() => {
    const equipment = parseINRAmount(formData.equipmentCost);
    const renovation = parseINRAmount(formData.renovationCost);
    const license = parseINRAmount(formData.licenseCost);

    const totalCapEx = equipment + renovation + license;
    const totalMonthlyOpEx = calculateMonthlyOperatingExpenses(formData);
    const workingCapitalReserve = totalMonthlyOpEx * formData.runwayMonths;
    const totalCalculatedNeed = totalCapEx + workingCapitalReserve;

    const expectedInvestment = step1Data ? calculateFinancialStructure({ mode: step1Data.mode, marginCapital: parseINRAmount(step1Data.ownCapital) }).projectCost || 0 : 0;
    const variance = expectedInvestment - totalCalculatedNeed;

    return {
      totalCapEx,
      totalMonthlyOpEx,
      workingCapitalReserve,
      totalCalculatedNeed,
      expectedInvestment,
      variance
    };
  }, [formData, step1Data]);

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: Step2FormErrors = {};

    if (!formData.equipmentCost || parseINRAmount(formData.equipmentCost) < 0) {
      newErrors.equipmentCost = 'Equipment cost must be ₹ 0 or greater.';
    }

    if (!formData.renovationCost || parseINRAmount(formData.renovationCost) < 0) {
      newErrors.renovationCost = 'Premises setup cost must be ₹ 0 or greater.';
    }

    if (!formData.licenseCost || parseINRAmount(formData.licenseCost) < 0) {
      newErrors.licenseCost = 'License/legal cost must be ₹ 0 or greater.';
    }

    if (!formData.monthlySalaries || parseINRAmount(formData.monthlySalaries) < 0) {
      newErrors.monthlySalaries = 'Monthly salaries must be ₹ 0 or greater.';
    }

    if (!formData.monthlyRent || parseINRAmount(formData.monthlyRent) < 0) {
      newErrors.monthlyRent = 'Monthly rent must be ₹ 0 or greater.';
    }

    if (!formData.monthlyMarketing || parseINRAmount(formData.monthlyMarketing) < 0) {
      newErrors.monthlyMarketing = 'Monthly marketing must be ₹ 0 or greater.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      onComplete(formData);
    }
  };

  return (
    <div className="calculator-form-container" id="step2-form-container">
      {isSubmitted && (
        <div className="alert alert-success mb-6">
          <CheckCircle2 size={20} />
          <div>
            <strong>Step 2 Saved Successfully!</strong>
            <p>Operational Expenses and Setup Costs recorded. Ready for Step 3.</p>
          </div>
        </div>
      )}

      {/* Target Investment Context Banner */}
      {step1Data && (
        <div className="alert alert-info mb-6" style={{ background: 'rgba(6, 182, 212, 0.08)', borderColor: 'rgba(6, 182, 212, 0.3)', color: '#93c5fd' }}>
          <PieChart size={20} color="var(--accent-cyan)" />
          <div>
            <strong>Step 1 Target: {step1Data.businessName} ({step1Data.businessType})</strong>
              <p style={{ fontSize: '0.85rem', marginTop: '2px' }}>
              Margin Capital: <strong>{formatINR(step1Data.ownCapital)}</strong> &bull; Derived Project Cost: <strong>{formatINR(calculateFinancialStructure({ mode: step1Data.mode, marginCapital: parseINRAmount(step1Data.ownCapital) }).projectCost || 0)}</strong> &bull; Mode: <strong>{step1Data.mode === 'start' ? 'Start' : 'Scale'}</strong>
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Section 1: One-Time Capital Expenditure (CapEx) */}
        <div className="form-section">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', borderColor: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-indigo)' }}>
              <Wrench size={20} />
            </div>
            <div>
              <h3 className="form-section-title">1. One-Time Setup Costs (CapEx)</h3>
              <p className="form-section-desc">Fixed assets, machinery, renovation, and license setup.</p>
            </div>
          </div>

          <div className="form-grid">
            {/* Equipment Cost */}
            <div className="form-group">
              <label htmlFor="equipmentCost" className="form-label">
                Equipment, Machinery & Hardware <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  type="text"
                  id="equipmentCost"
                  className={`form-input currency-input ${errors.equipmentCost ? 'input-error' : ''}`}
                  placeholder="e.g. 4,00,000"
                  value={formData.equipmentCost}
                  onChange={(e) => handleMonetaryChange('equipmentCost', e.target.value)}
                />
              </div>
              {formData.equipmentCost && !errors.equipmentCost && (
                <div className="formatted-hint">Formatted: <strong>{formatINR(formData.equipmentCost)}</strong></div>
              )}
              {errors.equipmentCost && (
                <div className="error-message"><AlertCircle size={14} /> {errors.equipmentCost}</div>
              )}
            </div>

            {/* Premises Setup & Renovation */}
            <div className="form-group">
              <label htmlFor="renovationCost" className="form-label">
                Premises Setup, Interiors & Deposit <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  type="text"
                  id="renovationCost"
                  className={`form-input currency-input ${errors.renovationCost ? 'input-error' : ''}`}
                  placeholder="e.g. 2,00,000"
                  value={formData.renovationCost}
                  onChange={(e) => handleMonetaryChange('renovationCost', e.target.value)}
                />
              </div>
              {formData.renovationCost && !errors.renovationCost && (
                <div className="formatted-hint">Formatted: <strong>{formatINR(formData.renovationCost)}</strong></div>
              )}
              {errors.renovationCost && (
                <div className="error-message"><AlertCircle size={14} /> {errors.renovationCost}</div>
              )}
            </div>

            {/* Licenses, Legal & Branding */}
            <div className="form-group full-width">
              <label htmlFor="licenseCost" className="form-label">
                Licenses, Legal Registration & Branding <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  type="text"
                  id="licenseCost"
                  className={`form-input currency-input ${errors.licenseCost ? 'input-error' : ''}`}
                  placeholder="e.g. 50,000"
                  value={formData.licenseCost}
                  onChange={(e) => handleMonetaryChange('licenseCost', e.target.value)}
                />
              </div>
              {formData.licenseCost && !errors.licenseCost && (
                <div className="formatted-hint">Formatted: <strong>{formatINR(formData.licenseCost)}</strong></div>
              )}
              {errors.licenseCost && (
                <div className="error-message"><AlertCircle size={14} /> {errors.licenseCost}</div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Monthly Operational Expenses (OpEx) & Runway */}
        <div className="form-section">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)' }}>
              <Receipt size={20} />
            </div>
            <div>
              <h3 className="form-section-title">2. Monthly Recurring Expenses (OpEx)</h3>
              <p className="form-section-desc">Estimate monthly running costs and working capital reserve buffer.</p>
            </div>
          </div>

          <div className="form-grid mb-6">
            {/* Monthly Salaries */}
            <div className="form-group">
              <label htmlFor="monthlySalaries" className="form-label">
                Staff Salaries & Wages / Month <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  type="text"
                  id="monthlySalaries"
                  className={`form-input currency-input ${errors.monthlySalaries ? 'input-error' : ''}`}
                  placeholder="e.g. 80,000"
                  value={formData.monthlySalaries}
                  onChange={(e) => handleMonetaryChange('monthlySalaries', e.target.value)}
                />
              </div>
              {formData.monthlySalaries && !errors.monthlySalaries && (
                <div className="formatted-hint">Formatted: <strong>{formatINR(formData.monthlySalaries)} / mo</strong></div>
              )}
              {errors.monthlySalaries && (
                <div className="error-message"><AlertCircle size={14} /> {errors.monthlySalaries}</div>
              )}
            </div>

            {/* Monthly Rent */}
            <div className="form-group">
              <label htmlFor="monthlyRent" className="form-label">
                Rent, Electricity & Utilities / Month <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  type="text"
                  id="monthlyRent"
                  className={`form-input currency-input ${errors.monthlyRent ? 'input-error' : ''}`}
                  placeholder="e.g. 30,000"
                  value={formData.monthlyRent}
                  onChange={(e) => handleMonetaryChange('monthlyRent', e.target.value)}
                />
              </div>
              {formData.monthlyRent && !errors.monthlyRent && (
                <div className="formatted-hint">Formatted: <strong>{formatINR(formData.monthlyRent)} / mo</strong></div>
              )}
              {errors.monthlyRent && (
                <div className="error-message"><AlertCircle size={14} /> {errors.monthlyRent}</div>
              )}
            </div>

            {/* Monthly Marketing & Admin */}
            <div className="form-group full-width">
              <label htmlFor="monthlyMarketing" className="form-label">
                Marketing, Sales & Admin Expenses / Month <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  type="text"
                  id="monthlyMarketing"
                  className={`form-input currency-input ${errors.monthlyMarketing ? 'input-error' : ''}`}
                  placeholder="e.g. 20,000"
                  value={formData.monthlyMarketing}
                  onChange={(e) => handleMonetaryChange('monthlyMarketing', e.target.value)}
                />
              </div>
              {formData.monthlyMarketing && !errors.monthlyMarketing && (
                <div className="formatted-hint">Formatted: <strong>{formatINR(formData.monthlyMarketing)} / mo</strong></div>
              )}
              {errors.monthlyMarketing && (
                <div className="error-message"><AlertCircle size={14} /> {errors.monthlyMarketing}</div>
              )}
            </div>
          </div>

          {/* Working Capital Runway Duration */}
          <div className="form-group">
            <label className="form-label">
              Working Capital Reserve Duration (Runway Months) <span className="required">*</span>
            </label>
            <div className="runway-grid">
              {[3, 6, 9, 12].map((months) => (
                <div
                  key={months}
                  className={`runway-card ${formData.runwayMonths === months ? 'active' : ''}`}
                  onClick={() => handleRunwayChange(months)}
                  id={`runway-${months}-card`}
                >
                  <Clock size={18} />
                  <div>
                    <div className="runway-title">{months} Months</div>
                    <div className="runway-subtitle">Reserve Buffer</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Allocation Summary Card */}
        <div className="form-section summary-card" id="allocation-summary-card">
          <div className="form-section-header">
            <div className="form-section-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
              <PieChart size={20} />
            </div>
            <div>
              <h3 className="form-section-title">Live Capital Allocation Breakdown</h3>
              <p className="form-section-desc">Real-time total of setup costs and working capital reserve buffer.</p>
            </div>
          </div>

          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Total Setup Costs (CapEx)</span>
              <span className="summary-value">{formatINR(calculations.totalCapEx) || '₹ 0'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Monthly OpEx</span>
              <span className="summary-value">{formatINR(calculations.totalMonthlyOpEx) || '₹ 0'} / mo</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">{formData.runwayMonths}-Month Working Capital Reserve</span>
              <span className="summary-value" style={{ color: 'var(--accent-cyan)' }}>
                {formatINR(calculations.workingCapitalReserve) || '₹ 0'}
              </span>
            </div>
            <div className="summary-item highlight">
              <span className="summary-label">Total Operational Budget Needed</span>
              <span className="summary-value grand-total">
                {formatINR(calculations.totalCalculatedNeed) || '₹ 0'}
              </span>
            </div>
          </div>

          {step1Data && calculations.expectedInvestment > 0 && (
            <div className="variance-row" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Step 1 Expected Investment Target: <strong>{formatINR(calculations.expectedInvestment)}</strong>
              </span>
              <span style={{ 
                fontSize: '0.9rem', 
                fontWeight: 700, 
                color: calculations.variance >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {calculations.variance >= 0 ? (
                  <>
                    <CheckCircle2 size={16} /> Budget Within Target (+{formatINR(calculations.variance)})
                  </>
                ) : (
                  <>
                    <ShieldAlert size={16} /> Over Target Budget ({formatINR(Math.abs(calculations.variance))})
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="form-actions-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
          <button 
            type="button" 
            className="btn btn-secondary btn-large" 
            onClick={onBack}
            id="btn-step2-back"
          >
            <ArrowLeft size={20} />
            <span>Back to Step 1</span>
          </button>

          <button 
            type="submit" 
            className="btn btn-primary btn-large"
            id="btn-step2-continue"
          >
            <span>Continue to Step 3</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};
