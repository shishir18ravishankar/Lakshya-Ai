import { FinanceSchemeConfig } from './types';

export const MICRO_FINANCE_SCHEME: FinanceSchemeConfig = {
  id: 'microFinance',
  name: 'Micro Finance Scheme',
  minimumProjectCost: 0,
  maximumProjectCost: 140000,
  fundingPercentage: 90,
  beneficiaryContributionPercentage: 10,
  maximumLoan: 125000,
  annualInterestRate: 6.5,
  tenureYears: 3,
  moratoriumMonths: 3,
  repaymentFrequency: 'quarterly',
  source: 'SIH Problem Statement 26091',
  eligibilityNotes: 'Project-cost condition only; other beneficiary criteria are not provided.'
};

export const TERM_LOAN_SCHEME: FinanceSchemeConfig = {
  id: 'termLoan',
  name: 'Term Loan Scheme',
  minimumProjectCost: 140000,
  maximumProjectCost: 5000000,
  fundingPercentage: 90,
  beneficiaryContributionPercentage: 10,
  maximumLoan: 4500000,
  annualInterestRate: 8,
  tenureYears: 7,
  moratoriumMonths: 6,
  repaymentFrequency: 'quarterly',
  source: 'SIH Problem Statement 26091',
  eligibilityNotes: 'Project-cost condition only; other beneficiary criteria are not provided.'
};

export const FINANCE_SCHEMES = [MICRO_FINANCE_SCHEME, TERM_LOAN_SCHEME] as const;