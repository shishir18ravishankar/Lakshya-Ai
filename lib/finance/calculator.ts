/**
 * NSFDC Financial Calculator — PS26091 (Ministry of Social Justice & Empowerment)
 *
 * Pure deterministic function. No AI involvement.
 * Scheme tiers match NSFDC's real published terms exactly.
 */

export interface FinancialInput {
  marginCapital: number;
}

export interface FinancialOutput {
  marginCapital: number;
  projectCost: number;
  maxLoanAmount: number;
  scheme: string;
  interestRate: number;
  tenureYears: number;
  moratoriumMonths: number;
  repaymentFrequency: 'quarterly';
  quarterlyInstallment: number;
  numberOfInstallments: number;
  totalInterest: number;
  totalRepayment: number;
}

/**
 * Calculates NSFDC-compliant financials from margin capital alone.
 *
 * Derivation:
 *   projectCost      = marginCapital / 0.10   (margin is 10% of project cost)
 *   maxLoanAmount    = projectCost * 0.90      (90% financing)
 *
 * Tier 1 — Micro Finance Scheme
 *   Applies when:  projectCost <= ₹1,40,000
 *   Max loan:      90% of project cost, capped at ₹1,25,000
 *   Interest rate:  6.5% p.a.
 *   Tenure:         3 years
 *   Moratorium:     3 months
 *   Repayment:      quarterly
 *
 * Tier 2 — Term Loan Scheme
 *   Applies when:  ₹1,40,000 < projectCost <= ₹50,00,000
 *   Max loan:      90% of project cost, capped at ₹45,00,000
 *   Interest rate:  8% p.a.
 *   Tenure:         7 years
 *   Moratorium:     6 months
 *   Repayment:      quarterly
 *
 * If projectCost > ₹50,00,000: outside scheme eligibility.
 *
 * Repayment schedule:
 *   - Interest accrues during moratorium and is capitalized (simple interest
 *     added to principal at end of moratorium).
 *   - After moratorium, equal quarterly installments amortize the capitalized
 *     principal over the remaining quarters.
 */
export function calculateFinancials(input: FinancialInput): FinancialOutput {
  const marginCapital = Number(input.marginCapital);
  if (isNaN(marginCapital) || marginCapital <= 0) {
    throw new Error('marginCapital must be a positive number');
  }

  const projectCost = round2(marginCapital / 0.10);

  // Outside eligibility
  if (projectCost > 5_000_000) {
    return {
      marginCapital,
      projectCost,
      maxLoanAmount: 0,
      scheme: 'outside scheme eligibility',
      interestRate: 0,
      tenureYears: 0,
      moratoriumMonths: 0,
      repaymentFrequency: 'quarterly',
      quarterlyInstallment: 0,
      numberOfInstallments: 0,
      totalInterest: 0,
      totalRepayment: 0,
    };
  }

  let scheme: string;
  let maxLoanAmount: number;
  let interestRate: number;
  let tenureYears: number;
  let moratoriumMonths: number;

  if (projectCost <= 140_000) {
    // Tier 1 — Micro Finance Scheme
    scheme = 'Micro Finance Scheme';
    maxLoanAmount = Math.min(round2(projectCost * 0.90), 125_000);
    interestRate = 6.5;
    tenureYears = 3;
    moratoriumMonths = 3;
  } else {
    // Tier 2 — Term Loan Scheme
    scheme = 'Term Loan Scheme';
    maxLoanAmount = Math.min(round2(projectCost * 0.90), 4_500_000);
    interestRate = 8;
    tenureYears = 7;
    moratoriumMonths = 6;
  }

  // Quarterly rate
  const r = (interestRate / 100) / 4;

  // Total quarters and repayment quarters
  const totalQuarters = tenureYears * 4;
  const moratoriumQuarters = moratoriumMonths / 3;
  const numberOfInstallments = totalQuarters - moratoriumQuarters;

  // Interest accrues during moratorium (simple interest), capitalized at end
  const moratoriumInterest = maxLoanAmount * (interestRate / 100) * (moratoriumMonths / 12);
  const capitalizedPrincipal = maxLoanAmount + moratoriumInterest;

  // Equal quarterly installments (standard amortization formula)
  // PMT = P * r * (1+r)^n / ((1+r)^n - 1)
  const factor = Math.pow(1 + r, numberOfInstallments);
  const quarterlyInstallment = round2(
    (capitalizedPrincipal * r * factor) / (factor - 1)
  );

  const totalRepayment = round2(quarterlyInstallment * numberOfInstallments);
  const totalInterest = round2(totalRepayment - maxLoanAmount);

  return {
    marginCapital,
    projectCost,
    maxLoanAmount,
    scheme,
    interestRate,
    tenureYears,
    moratoriumMonths,
    repaymentFrequency: 'quarterly',
    quarterlyInstallment,
    numberOfInstallments,
    totalInterest,
    totalRepayment,
  };
}

/** Round to 2 decimal places */
function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
