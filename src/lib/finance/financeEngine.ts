import { FINANCE_SCHEMES } from './schemeConfig';
import { FinanceInput, FinanceSchemeConfig, FinancialResult } from './types';

const PAYMENTS_PER_YEAR = 4;
const BENEFICIARY_CONTRIBUTION_RATE = 0.1;
const FINANCING_RATE = 0.9;
const MORATORIUM_ASSUMPTION = 'Moratorium interest is calculated as simple quarterly interest on the original principal and capitalized before repayment.';

const roundCurrency = (value: number): number => Math.round(value * 100) / 100;

const emptyResult = (
  mode: FinanceInput['mode'],
  marginCapital: number | null,
  status: FinancialResult['schemeStatus'],
  calculationStatus: FinancialResult['calculationStatus']
): FinancialResult => ({
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
  calculationStatus
});

const selectScheme = (projectCost: number): FinanceSchemeConfig | null => {
  if (projectCost <= FINANCE_SCHEMES[0].maximumProjectCost) return FINANCE_SCHEMES[0];
  if (projectCost <= FINANCE_SCHEMES[1].maximumProjectCost) return FINANCE_SCHEMES[1];
  return null;
};

export const calculateFinancialStructure = ({ mode, marginCapital }: FinanceInput): FinancialResult => {
  if (typeof marginCapital !== 'number' || !Number.isFinite(marginCapital) || marginCapital <= 0) {
    return emptyResult(
      mode,
      typeof marginCapital === 'number' && Number.isFinite(marginCapital) ? marginCapital : null,
      'invalid margin capital',
      'invalid_input'
    );
  }

  const projectCost = marginCapital / BENEFICIARY_CONTRIBUTION_RATE;
  const maxLoanAmount = projectCost * FINANCING_RATE;
  const scheme = selectScheme(projectCost);

  if (!scheme) {
    return {
      ...emptyResult(mode, marginCapital, 'not eligible under this scheme', 'outside_scheme'),
      projectCost: roundCurrency(projectCost),
      maxLoanAmount: roundCurrency(maxLoanAmount)
    };
  }

  const actualLoanAmount = Math.min(maxLoanAmount, scheme.maximumLoan);
  const quarterlyInterestRate = scheme.annualInterestRate / PAYMENTS_PER_YEAR / 100;
  const moratoriumQuarters = scheme.moratoriumMonths / 3;
  const numberOfInstallments = scheme.tenureYears * PAYMENTS_PER_YEAR - moratoriumQuarters;
  const moratoriumInterest = actualLoanAmount * quarterlyInterestRate * moratoriumQuarters;
  const capitalizedPrincipal = actualLoanAmount + moratoriumInterest;
  const growthFactor = Math.pow(1 + quarterlyInterestRate, numberOfInstallments);
  const quarterlyInstallment = capitalizedPrincipal > 0
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
    schemeStatus: 'eligible',
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
    calculationStatus: 'valid'
  };
};