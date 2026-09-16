import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StepProgress } from './components/BusinessCalculator/StepProgress';
import { Step1BasicInfo } from './components/BusinessCalculator/Step1BasicInfo';
import { Step2Expenses } from './components/BusinessCalculator/Step2Expenses';
import { Step3Summary } from './components/BusinessCalculator/Step3Summary';
import { Step4LoanEMI } from './components/BusinessCalculator/Step4LoanEMI';
import { Step5Profitability } from './components/BusinessCalculator/Step5Profitability';
import { Step1FormData, Step2FormData, Step4FormData, Step5FormData } from './types/calculator';
import { calculateMonthlyOperatingExpenses } from './utils/formatters';

const STORAGE_KEY_STEP1 = 'fincalc_step1_data';
const STORAGE_KEY_STEP2 = 'fincalc_step2_data';
const STORAGE_KEY_STEP4 = 'fincalc_step4_data';
const STORAGE_KEY_STEP5 = 'fincalc_step5_data';

const getStepFromHash = (): number => {
  const hash = window.location.hash;
  if (hash === '#step4') return 4;
  if (hash === '#step5') return 5;
  if (hash === '#step3') return 3;
  if (hash === '#step2') return 2;
  return 1;
};

const loadSavedStep4 = (): Step4FormData | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_STEP4);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Failed to load saved Step 4 data from localStorage', e);
    return null;
  }
};

const loadSavedStep5 = (): Step5FormData | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_STEP5);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    console.error('Failed to load saved Step 5 data from localStorage', e);
    return null;
  }
};

const loadSavedStep1 = (): Step1FormData | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_STEP1);
    if (!saved) return null;
    const data = JSON.parse(saved) as Step1FormData;
    return { ...data, mode: data.mode || 'start' };
  } catch (e) {
    console.error('Failed to load saved Step 1 data from localStorage', e);
    return null;
  }
};

const loadSavedStep2 = (): Step2FormData | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_STEP2);
    if (!saved) return null;
    const data = JSON.parse(saved) as Step2FormData;
    return {
      ...data,
      totalMonthlyOpEx: data.totalMonthlyOpEx ?? calculateMonthlyOperatingExpenses(data)
    };
  } catch (e) {
    console.error('Failed to load saved Step 2 data from localStorage', e);
    return null;
  }
};

export const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(getStepFromHash);
  const [step1Data, setStep1Data] = useState<Step1FormData | null>(loadSavedStep1);
  const [step2Data, setStep2Data] = useState<Step2FormData | null>(loadSavedStep2);
  const [step4Data, setStep4Data] = useState<Step4FormData | null>(loadSavedStep4);
  const [step5Data, setStep5Data] = useState<Step5FormData | null>(loadSavedStep5);

  // Synchronize state with browser URL hash & back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const step = getStepFromHash();
      setCurrentStep(step);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save Step 1 data to localStorage whenever it changes
  useEffect(() => {
    if (step1Data) {
      try {
        localStorage.setItem(STORAGE_KEY_STEP1, JSON.stringify(step1Data));
      } catch (e) {
        console.error('Failed to save Step 1 data to localStorage', e);
      }
    }
  }, [step1Data]);

  // Save Step 2 data to localStorage whenever it changes
  useEffect(() => {
    if (step2Data) {
      try {
        localStorage.setItem(STORAGE_KEY_STEP2, JSON.stringify(step2Data));
      } catch (e) {
        console.error('Failed to save Step 2 data to localStorage', e);
      }
    }
  }, [step2Data]);

  useEffect(() => {
    if (step4Data) localStorage.setItem(STORAGE_KEY_STEP4, JSON.stringify(step4Data));
  }, [step4Data]);

  useEffect(() => {
    if (step5Data) localStorage.setItem(STORAGE_KEY_STEP5, JSON.stringify(step5Data));
  }, [step5Data]);

  const changeStep = (step: number) => {
    setCurrentStep(step);
    window.location.hash = `#step${step}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep1Change = (data: Step1FormData) => {
    setStep1Data(data);
  };

  const handleStep2Change = (data: Step2FormData) => {
    setStep2Data(data);
  };

  const handleStep4Change = useCallback((data: Step4FormData) => {
    setStep4Data(data);
  }, []);

  const handleStep5Change = (data: Step5FormData) => {
    setStep5Data(data);
  };

  const handleStep1Complete = (data: Step1FormData) => {
    setStep1Data(data);
    changeStep(2);
  };

  const handleStep2Complete = (data: Step2FormData) => {
    setStep2Data(data);
    changeStep(3);
  };

  const handleStepSelect = (step: number) => {
    if (step >= 1 && step <= 5) {
      changeStep(step);
    }
  };

  const handleRestart = () => {
    try {
      localStorage.removeItem(STORAGE_KEY_STEP1);
      localStorage.removeItem(STORAGE_KEY_STEP2);
      localStorage.removeItem(STORAGE_KEY_STEP4);
      localStorage.removeItem(STORAGE_KEY_STEP5);
    } catch (e) {
      console.error('Failed to clear localStorage on restart', e);
    }
    setStep1Data(null);
    setStep2Data(null);
    setStep4Data(null);
    setStep5Data(null);
    changeStep(1);
  };

  return (
    <div className="app-container">
      <Header currentStep={currentStep} />
      <div className="app-body">
        <Sidebar currentStep={currentStep} onSelectStep={handleStepSelect} />
        <main className="main-content" id="main-content">
          <StepProgress currentStep={currentStep} />

          {currentStep === 1 && (
            <Step1BasicInfo 
              onComplete={handleStep1Complete} 
              onChange={handleStep1Change}
              initialValues={step1Data || undefined} 
            />
          )}

          {currentStep === 2 && (
            <Step2Expenses 
              step1Data={step1Data}
              onBack={() => handleStepSelect(1)}
              onComplete={handleStep2Complete}
              onChange={handleStep2Change}
              initialValues={step2Data || undefined}
            />
          )}

          {currentStep === 3 && (
            <Step3Summary 
              step1Data={step1Data}
              step2Data={step2Data}
              onBack={() => handleStepSelect(2)}
              onContinue={() => handleStepSelect(4)}
              onRestart={handleRestart}
            />
          )}

          {currentStep === 4 && (
            <Step4LoanEMI
              step1Data={step1Data}
              onBack={() => handleStepSelect(3)}
              onContinue={() => handleStepSelect(5)}
              onRestart={handleRestart}
              onChange={handleStep4Change}
              initialValues={step4Data || undefined}
            />
          )}

          {currentStep === 5 && (
            <Step5Profitability
              step1Data={step1Data}
              step2Data={step2Data}
              step4Data={step4Data}
              initialValues={step5Data || undefined}
              onChange={handleStep5Change}
              onBack={() => handleStepSelect(4)}
              onRestart={handleRestart}
            />
          )}
        </main>
      </div>
      <footer className="footer">
        Business Finance Suite &copy; {new Date().getFullYear()} &bull; Modular Business Financial Planning Platform
      </footer>
    </div>
  );
};

export default App;
