import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Rocket, 
  TrendingUp, 
  IndianRupee, 
  MapPin, 
  Tag, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { Step1FormData, Step1FormErrors, BUSINESS_TYPES } from '../../types/calculator';
import { formatINR, sanitizeMonetaryInput, parseINRAmount } from '../../utils/formatters';

interface Step1BasicInfoProps {
  onComplete?: (data: Step1FormData) => void;
  onChange?: (data: Step1FormData) => void;
  initialValues?: Partial<Step1FormData>;
}

export const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({ 
  onComplete, 
  onChange,
  initialValues 
}) => {
  const [formData, setFormData] = useState<Step1FormData>({
    businessName: initialValues?.businessName || '',
    businessType: initialValues?.businessType || '',
    location: initialValues?.location || '',
    mode: initialValues?.mode || 'start',
    ownCapital: initialValues?.ownCapital || '',
  });

  const [errors, setErrors] = useState<Step1FormErrors>({});
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

  // Update parent state whenever local form data changes
  const updateFormData = (updated: Step1FormData) => {
    setFormData(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Step1FormErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name or idea is required.';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Please select a business type.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location / City is required.';
    }

    const ownCapNum = parseINRAmount(formData.ownCapital);
    if (!formData.ownCapital || ownCapNum <= 0) {
      newErrors.ownCapital = 'Available own capital must be greater than ₹ 0.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Input Changes
  const handleInputChange = (field: keyof Step1FormData, value: string) => {
    const updated = { ...formData, [field]: value };
    updateFormData(updated);

    if (field !== 'mode' && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle Monetary Input Sanitization & Live Formatted Display
  const handleMonetaryChange = (field: 'ownCapital', rawValue: string) => {
    const clean = sanitizeMonetaryInput(rawValue);
    const updated = { ...formData, [field]: clean };
    updateFormData(updated);

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitted(true);
      if (onComplete) {
        onComplete(formData);
      }
    }
  };

  return (
    <div className="calculator-form-container" id="step1-form-container">
      {isSubmitted && (
        <div className="alert alert-success mb-6">
          <CheckCircle2 size={20} />
          <div>
            <strong>Step 1 Saved Successfully!</strong>
            <p>Business Information and Investment Overview saved. Ready for Step 2.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Section 1: Business Information */}
        <div className="form-section">
          <div className="form-section-header">
            <div className="form-section-icon">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="form-section-title">1. Business Information</h3>
              <p className="form-section-desc">Specify your business details and planning mode.</p>
            </div>
          </div>

          {/* Mode Selector Cards */}
          <div className="form-group mb-6">
            <label className="form-label">Select Business Stage <span className="required">*</span></label>
            <div className="input-hint" style={{ marginBottom: '10px' }}>
              Selected mode: <strong>{formData.mode === 'start' ? 'Start' : 'Scale'}</strong>. Financial rules are currently identical for both modes.
            </div>
            <div className="mode-selector-grid">
              <div 
                className={`mode-card ${formData.mode === 'start' ? 'active' : ''}`}
                onClick={() => handleInputChange('mode', 'start')}
                id="mode-start-card"
              >
                <div className="mode-card-icon">
                  <Rocket size={24} />
                </div>
                <div>
                  <div className="mode-card-title">Start My Business</div>
                  <div className="mode-card-desc">New venture setup, initial capital & launch planning</div>
                </div>
              </div>

              <div 
                className={`mode-card ${formData.mode === 'scale' ? 'active' : ''}`}
                onClick={() => handleInputChange('mode', 'scale')}
                id="mode-scale-card"
              >
                <div className="mode-card-icon">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <div className="mode-card-title">Scale My Business</div>
                  <div className="mode-card-desc">Existing business expansion, working capital & growth</div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-grid">
            {/* Business Name */}
            <div className="form-group">
              <label htmlFor="businessName" className="form-label">
                Business Name / Idea <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Building2 className="input-icon" size={18} />
                <input
                  type="text"
                  id="businessName"
                  className={`form-input ${errors.businessName ? 'input-error' : ''}`}
                  placeholder="e.g. Apex Tech Solutions"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                />
              </div>
              {errors.businessName && (
                <div className="error-message">
                  <AlertCircle size={14} /> {errors.businessName}
                </div>
              )}
            </div>

            {/* Business Type */}
            <div className="form-group">
              <label htmlFor="businessType" className="form-label">
                Business Type / Sector <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <Tag className="input-icon" size={18} />
                <select
                  id="businessType"
                  className={`form-input form-select ${errors.businessType ? 'input-error' : ''}`}
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                >
                  <option value="">Select Business Sector...</option>
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              {errors.businessType && (
                <div className="error-message">
                  <AlertCircle size={14} /> {errors.businessType}
                </div>
              )}
            </div>

            {/* Location */}
            <div className="form-group full-width">
              <label htmlFor="location" className="form-label">
                Location (City / State) <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <MapPin className="input-icon" size={18} />
                <input
                  type="text"
                  id="location"
                  className={`form-input ${errors.location ? 'input-error' : ''}`}
                  placeholder="e.g. Bengaluru, Karnataka"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
              {errors.location && (
                <div className="error-message">
                  <AlertCircle size={14} /> {errors.location}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Investment Overview */}
        <div className="form-section">
          <div className="form-section-header">
            <div className="form-section-icon">
              <IndianRupee size={20} />
            </div>
            <div>
              <h3 className="form-section-title">2. Investment Overview</h3>
              <p className="form-section-desc">Define your self-funded equity and total required investment.</p>
            </div>
          </div>

          <div className="form-grid">
            {/* Own Capital */}
            <div className="form-group">
              <label htmlFor="ownCapital" className="form-label">
                Beneficiary / Own Contribution <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <span className="currency-symbol">₹</span>
                <input
                  type="text"
                  id="ownCapital"
                  className={`form-input currency-input ${errors.ownCapital ? 'input-error' : ''}`}
                  placeholder="e.g. 5,00,000"
                  value={formData.ownCapital}
                  onChange={(e) => handleMonetaryChange('ownCapital', e.target.value)}
                />
              </div>
              {formData.ownCapital && !errors.ownCapital && (
                <div className="formatted-hint" id="hint-ownCapital-react">
                  Formatted: <strong>{formatINR(formData.ownCapital)}</strong>
                </div>
              )}
              {errors.ownCapital && (
                <div className="error-message">
                  <AlertCircle size={14} /> {errors.ownCapital}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-large" id="btn-step1-continue">
            <span>Continue to Next Step</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};
