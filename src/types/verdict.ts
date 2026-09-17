/**
 * Unified Verdict Response Schema for Lakshya AI
 * Source of Truth: SIH 2026 Problem Statement 26091
 * "AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant for Rural Micro-Entrepreneurs"
 */

export interface VerdictInputPayload {
  location: string;
  marginCapital: number;
  businessCategory: string;
}

export type VerdictStatus = "Proceed" | "Review" | "High Risk";

export interface BusinessRecapData {
  location: string;
  marginCapital: number;
  availableCapital?: number;
  businessCategory: string;
  dossierId?: string;
  generatedDate?: string;
  taluk?: string;
  district?: string;
  state?: string;
}

export interface MarketReachData {
  primaryCluster?: string;
  catchmentRadiusKm?: number;
  estimatedTargetHouseholds?: number;
  demandStatus?: "High" | "Moderate" | "Low" | string;
  demandSummary?: string;
  localOpportunity?: string;
  localDrivers?: string[];
  customerSegments?: {
    segment: string;
    sharePct: number;
    description?: string;
  }[];
  targetSegments?: {
    segment: string;
    sharePct: number;
    description: string;
  }[];
  source?: string;
  year?: number;
}

export interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface CompetitorItem {
  competitor?: string;
  name?: string;
  type?: string;
  positioning?: string;
  pricing?: string;
  pricingTier?: "Budget" | "Mid-Range" | "Premium" | string;
  differentiation?: string;
  distanceKm?: number;
  marketShareEstimate?: string;
}

export interface CompetitorMappingData {
  saturationLevel?: "Low" | "Moderate" | "High" | string;
  summary?: string;
  saturationSummary?: string;
  nearbyCompetitorCount?: number;
  items?: CompetitorItem[];
  competitors?: CompetitorItem[];
}

export interface SuggestedPricingData {
  averageCostPerUnit?: number;
  recommendedPriceRange?: {
    min: number;
    max: number;
  };
  suggestedMarginPct?: number;
  rationale?: string;
  pricingFactors?: string[];
  source?: string;
  year?: number;
}

export interface FinancialsData {
  projectCost?: number;
  totalProjectCost?: number;
  maximumLoanAmount?: number;
  termLoan?: number;
  ownContribution?: number;
  ownEquity?: number;
  fundingRequirement?: number;
  equityPct?: number;
  loanPct?: number;
  subsidyAmount?: number;
  subsidyPct?: number;
  interestRate?: number;
  tenure?: string | number;
  tenureMonths?: number;
  moratorium?: string | number;
  moratoriumMonths?: number;
  estimatedProfit?: number;
  estimatedMonthlyProfit?: number;
  estimatedMonthlyRevenue?: number;
  breakEven?: string | number;
  breakevenMonths?: number;
  workingCapital?: number;
  capexMachinery?: number;
  dscr?: number;
}

export interface SchemeMatchData {
  scheme?: string;
  tier?: "Micro Finance Scheme" | "Term Loan Scheme" | "Outside Scheme / Flagged" | string;
  applicableAmount?: number;
  interest?: string | number;
  tenure?: string | number;
  moratorium?: string | number;
  explanation?: string;
  nodalAgency?: string;
  subsidyPct?: number;
  maxSubsidyAmount?: number;
  description?: string;
  eligibilityCriteria?: string[];
  documentationRequired?: string[];
  primaryScheme?: {
    name: string;
    nodalAgency: string;
    subsidyPct: number;
    maxSubsidyAmount: number;
    description: string;
    eligibilityCriteria: string[];
    documentationRequired: string[];
  };
  secondarySchemes?: {
    name: string;
    agency?: string;
    benefit: string;
  }[];
}

export interface RepaymentInstallment {
  installmentNumber: number;
  duePeriod: string; // e.g. "Q1 (Months 1-3)"
  principal: number;
  interest: number;
  totalInstallment: number;
  outstandingBalance: number;
}

export interface RepaymentScheduleData {
  frequency?: "Quarterly Repayment" | string;
  loanAmount?: number;
  annualInterestRatePct?: number;
  tenureQuarters?: number;
  tenureMonths?: number;
  moratoriumQuarters?: number;
  moratoriumMonths?: number;
  quarterlyInstallment?: number;
  totalRepayment?: number;
  totalInterest?: number;
  installments?: RepaymentInstallment[];
  explanation?: string;
}

export interface SourceCitation {
  source?: string;
  title?: string;
  publisher?: string;
  year?: number;
  context?: string;
  type?: "registry" | "census" | "guideline" | "market_benchmark" | string;
}

export interface ActionPlanStep {
  stepNumber?: number;
  step?: number;
  title: string;
  description: string;
  duration?: string;
  durationWeeks?: string;
  responsibleEntity?: string;
}

export interface UnifiedVerdictResponse {
  verdict: VerdictStatus | string;
  reason?: string;
  caveat?: string;
  recap?: BusinessRecapData;
  marketReach?: MarketReachData;
  swot?: SwotData;
  competitorMapping?: CompetitorMappingData | CompetitorItem[];
  suggestedPricing?: SuggestedPricingData;
  financials?: FinancialsData;
  schemeMatch?: SchemeMatchData;
  repaymentSchedule?: RepaymentScheduleData;
  sources?: SourceCitation[];
  actionPlan?: ActionPlanStep[];
}
