/**
 * Deterministic financial structuring engine, ported from the
 * finance-calculator branch's src/lib/finance/{financeEngine,schemeConfig,types}.ts
 * (consolidated into one file, per spec). Verified against the corrected
 * scheme spec before use — see lib/finance/_verify-calculator.ts for the
 * test-case check.
 */

export type RepaymentFrequency = "quarterly";
export type SchemeId = "microFinance" | "termLoan";
export type BusinessMode = "start" | "scale";

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
  schemeStatus: "eligible" | "not eligible under this scheme" | "invalid margin capital";
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
  calculationStatus: "valid" | "invalid_input" | "outside_scheme";
}

export const MICRO_FINANCE_SCHEME: FinanceSchemeConfig = {
  id: "microFinance",
  name: "Micro Finance Scheme",
  minimumProjectCost: 0,
  maximumProjectCost: 140000,
  fundingPercentage: 90,
  beneficiaryContributionPercentage: 10,
  maximumLoan: 125000,
  annualInterestRate: 6.5,
  tenureYears: 3,
  moratoriumMonths: 3,
  repaymentFrequency: "quarterly",
  source: "SIH Problem Statement 26091",
  eligibilityNotes: "Project-cost condition only; other beneficiary criteria are not provided.",
};

export const TERM_LOAN_SCHEME: FinanceSchemeConfig = {
  id: "termLoan",
  name: "Term Loan Scheme",
  minimumProjectCost: 140000,
  maximumProjectCost: 5000000,
  fundingPercentage: 90,
  beneficiaryContributionPercentage: 10,
  maximumLoan: 4500000,
  annualInterestRate: 8,
  tenureYears: 7,
  moratoriumMonths: 6,
  repaymentFrequency: "quarterly",
  source: "SIH Problem Statement 26091",
  eligibilityNotes: "Project-cost condition only; other beneficiary criteria are not provided.",
};

export const FINANCE_SCHEMES = [MICRO_FINANCE_SCHEME, TERM_LOAN_SCHEME] as const;

const PAYMENTS_PER_YEAR = 4;
const BENEFICIARY_CONTRIBUTION_RATE = 0.1;
const FINANCING_RATE = 0.9;
const MORATORIUM_ASSUMPTION =
  "Moratorium interest is calculated as simple quarterly interest on the original principal and capitalized before repayment.";

const roundCurrency = (value: number): number => Math.round(value * 100) / 100;

function emptyResult(
  mode: BusinessMode,
  marginCapital: number | null,
  status: FinancialResult["schemeStatus"],
  calculationStatus: FinancialResult["calculationStatus"]
): FinancialResult {
  return {
    mode,
    marginCapital,
    projectCost: null,
    maxLoanAmount: null,
    actualLoanAmount: null,
    scheme: null,
    schemeStatus: status,
    interestRate: null,
    tenureYears: null,
    moratoriumMonths: null,
    repaymentFrequency: null,
    quarterlyInterestRate: null,
    moratoriumInterest: null,
    capitalizedPrincipal: null,
    quarterlyInstallment: null,
    numberOfInstallments: null,
    remainingRepaymentQuarters: null,
    totalInterest: null,
    totalRepayment: null,
    assumptions: [],
    calculationStatus,
  };
}

function selectScheme(projectCost: number): FinanceSchemeConfig | null {
  if (projectCost <= FINANCE_SCHEMES[0].maximumProjectCost) return FINANCE_SCHEMES[0];
  if (projectCost <= FINANCE_SCHEMES[1].maximumProjectCost) return FINANCE_SCHEMES[1];
  return null;
}

export function calculateFinancialStructure({ mode, marginCapital }: FinanceInput): FinancialResult {
  if (typeof marginCapital !== "number" || !Number.isFinite(marginCapital) || marginCapital <= 0) {
    return emptyResult(
      mode,
      typeof marginCapital === "number" && Number.isFinite(marginCapital) ? marginCapital : null,
      "invalid margin capital",
      "invalid_input"
    );
  }

  const projectCost = marginCapital / BENEFICIARY_CONTRIBUTION_RATE;
  const maxLoanAmount = projectCost * FINANCING_RATE;
  const scheme = selectScheme(projectCost);

  if (!scheme) {
    return {
      ...emptyResult(mode, marginCapital, "not eligible under this scheme", "outside_scheme"),
      projectCost: roundCurrency(projectCost),
      maxLoanAmount: roundCurrency(maxLoanAmount),
    };
  }

  const actualLoanAmount = Math.min(maxLoanAmount, scheme.maximumLoan);
  const quarterlyInterestRate = scheme.annualInterestRate / PAYMENTS_PER_YEAR / 100;
  const moratoriumQuarters = scheme.moratoriumMonths / 3;
  const numberOfInstallments = scheme.tenureYears * PAYMENTS_PER_YEAR - moratoriumQuarters;
  const moratoriumInterest = actualLoanAmount * quarterlyInterestRate * moratoriumQuarters;
  const capitalizedPrincipal = actualLoanAmount + moratoriumInterest;
  const growthFactor = Math.pow(1 + quarterlyInterestRate, numberOfInstallments);
  const quarterlyInstallment =
    capitalizedPrincipal > 0
      ? (capitalizedPrincipal * quarterlyInterestRate * growthFactor) / (growthFactor - 1)
      : 0;
  const amortizationRepayment = quarterlyInstallment * numberOfInstallments;
  const amortizationInterest = amortizationRepayment - capitalizedPrincipal;

  return {
    mode,
    marginCapital: roundCurrency(marginCapital),
    projectCost: roundCurrency(projectCost),
    maxLoanAmount: roundCurrency(maxLoanAmount),
    actualLoanAmount: roundCurrency(actualLoanAmount),
    scheme,
    schemeStatus: "eligible",
    interestRate: scheme.annualInterestRate,
    tenureYears: scheme.tenureYears,
    moratoriumMonths: scheme.moratoriumMonths,
    repaymentFrequency: scheme.repaymentFrequency,
    quarterlyInterestRate,
    moratoriumInterest: roundCurrency(moratoriumInterest),
    capitalizedPrincipal: roundCurrency(capitalizedPrincipal),
    quarterlyInstallment: roundCurrency(quarterlyInstallment),
    numberOfInstallments,
    remainingRepaymentQuarters: numberOfInstallments,
    totalInterest: roundCurrency(moratoriumInterest + amortizationInterest),
    totalRepayment: roundCurrency(amortizationRepayment),
    assumptions: [MORATORIUM_ASSUMPTION],
    calculationStatus: "valid",
  };
}

export interface AmortizationInstallment {
  installmentNumber: number;
  duePeriod: string;
  principal: number;
  interest: number;
  totalInstallment: number;
  outstandingBalance: number;
}

// Deterministic per-quarter breakdown, derived from the same numbers
// calculateFinancialStructure already computed (capitalizedPrincipal,
// quarterlyInterestRate, numberOfInstallments, quarterlyInstallment) via
// standard declining-balance amortization — not separately estimated data.
// Quarter numbering accounts for the moratorium: repayment starts after
// moratoriumMonths/3 quarters have already elapsed.
export function generateAmortizationSchedule(result: FinancialResult): AmortizationInstallment[] {
  if (
    result.calculationStatus !== "valid" ||
    result.capitalizedPrincipal === null ||
    result.quarterlyInterestRate === null ||
    result.numberOfInstallments === null ||
    result.quarterlyInstallment === null ||
    result.moratoriumMonths === null
  ) {
    return [];
  }

  const moratoriumQuarters = result.moratoriumMonths / 3;
  let balance = result.capitalizedPrincipal;
  const installments: AmortizationInstallment[] = [];

  for (let i = 1; i <= result.numberOfInstallments; i++) {
    const interest = roundCurrency(balance * result.quarterlyInterestRate);
    const principal = roundCurrency(result.quarterlyInstallment - interest);
    balance = roundCurrency(Math.max(balance - principal, 0));

    const quarterNumber = moratoriumQuarters + i;
    const startMonth = (quarterNumber - 1) * 3 + 1;
    const endMonth = quarterNumber * 3;

    installments.push({
      installmentNumber: i,
      duePeriod: `Q${quarterNumber} (Months ${startMonth}-${endMonth})`,
      principal,
      interest,
      totalInstallment: result.quarterlyInstallment,
      outstandingBalance: balance,
    });
  }

  return installments;
}
