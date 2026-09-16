export type { BusinessMode } from '../lib/finance';
import type { BusinessMode } from '../lib/finance';
export type LoanMode = 'custom' | 'microFinance';

export interface Step1FormData {
  businessName: string;
  businessType: string;
  location: string;
  mode: BusinessMode;
  ownCapital: string; // Stored as string for input handling, converted to number for validation
}

export interface Step1FormErrors {
  businessName?: string;
  businessType?: string;
  location?: string;
  ownCapital?: string;
  totalInvestment?: string;
}

export interface Step2FormData {
  // Capital Expenditure (One-Time Setup Costs)
  equipmentCost: string;
  renovationCost: string;
  licenseCost: string;
  
  // Operational Expenditure (Monthly Recurring Costs)
  monthlySalaries: string;
  monthlyRent: string;
  monthlyMarketing: string;
  runwayMonths: number; // 3, 6, 9, 12 months
  totalMonthlyOpEx?: number;
}

export interface Step2FormErrors {
  equipmentCost?: string;
  renovationCost?: string;
  licenseCost?: string;
  monthlySalaries?: string;
  monthlyRent?: string;
  monthlyMarketing?: string;
}

export interface Step4FormData {
  loanAmount: string;
  annualInterestRate: string;
  tenureYears: string;
  monthlyEMI: number;
  loanMode: LoanMode;
  moratoriumMonths: number;
  repaymentInstallment?: number;
  repaymentFrequency?: 'monthly' | 'quarterly';
  totalInterest?: number;
  totalRepayment?: number;
}

export interface Step5FormData {
  monthlyRevenue: string;
}

export interface Step3FundingSummary {
  totalInvestmentRequired: number;
  ownCapital: number;
  fundingGap: number;
  equityRatio: number; // Percentage (e.g. 33.3)
  gapRatio: number; // Percentage (e.g. 66.7)
  feasibilityStatus: 'healthy' | 'moderate' | 'high_dependency';
  feasibilityLabel: string;
}

export const BUSINESS_TYPES = [
  'Manufacturing',
  'Retail & E-commerce',
  'Services & Consulting',
  'IT & Technology Solutions',
  'Agriculture & Food Processing',
  'Healthcare & Wellness',
  'Food & Beverage / Restaurant',
  'Logistics & Transportation',
  'Textiles & Apparel',
  'Education & Training',
  'Other'
] as const;
