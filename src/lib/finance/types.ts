export type RepaymentFrequency = 'quarterly';
export type SchemeId = 'microFinance' | 'termLoan';
export type BusinessMode = 'start' | 'scale';

export interface FinanceInput {
  mode: BusinessMode;
  marginCapital: number;
}

export interface FinanceSchemeConfig {
  id: SchemeId;
  name: string;
  minimumProjectCost: number;
  maximumProjectCost: number;
  fundingPercentage: number;
  beneficiaryContributionPercentage: number;
  maximumLoan: number;
  annualInterestRate: number;
  tenureYears: number;
  moratoriumMonths: number;
  repaymentFrequency: RepaymentFrequency;
  source: string;
  eligibilityNotes: string;
}

export interface FinancialResult {
  mode: BusinessMode;
  marginCapital: number | null;
  projectCost: number | null;
  maxLoanAmount: number | null;
  actualLoanAmount: number | null;
  scheme: FinanceSchemeConfig | null;
  schemeStatus: 'eligible' | 'not eligible under this scheme' | 'invalid margin capital';
  interestRate: number | null;
  tenureYears: number | null;
  moratoriumMonths: number | null;
  repaymentFrequency: RepaymentFrequency | null;
  quarterlyInterestRate: number | null;
  moratoriumInterest: number | null;
  capitalizedPrincipal: number | null;
  quarterlyInstallment: number | null;
  numberOfInstallments: number | null;
  remainingRepaymentQuarters: number | null;
  totalInterest: number | null;
  totalRepayment: number | null;
  assumptions: string[];
  calculationStatus: 'valid' | 'invalid_input' | 'outside_scheme';
}