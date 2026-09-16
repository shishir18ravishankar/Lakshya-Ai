import { describe, expect, it } from 'vitest';
import { calculateFinancialStructure } from './financeEngine';

describe('calculateFinancialStructure', () => {
  it('rejects zero, negative, non-finite, and non-numeric input', () => {
    expect(calculateFinancialStructure({ mode: 'start', marginCapital: 0 }).calculationStatus).toBe('invalid_input');
    expect(calculateFinancialStructure({ mode: 'start', marginCapital: -1 }).calculationStatus).toBe('invalid_input');
    expect(calculateFinancialStructure({ mode: 'start', marginCapital: Number.NaN }).calculationStatus).toBe('invalid_input');
    expect(calculateFinancialStructure({ mode: 'start', marginCapital: Number.POSITIVE_INFINITY }).calculationStatus).toBe('invalid_input');
    expect(calculateFinancialStructure({ mode: 'start', marginCapital: '100000' as unknown as number }).calculationStatus).toBe('invalid_input');
  });

  it('derives micro finance project cost and capped loan at the lower boundary', () => {
    const result = calculateFinancialStructure({ mode: 'start', marginCapital: 10000 });

    expect(result.projectCost).toBe(100000);
    expect(result.maxLoanAmount).toBe(90000);
    expect(result.actualLoanAmount).toBe(90000);
    expect(result.scheme?.id).toBe('microFinance');
    expect(result.numberOfInstallments).toBe(11);
  });

  it('routes exactly ₹1,40,000 project cost to micro finance and applies the cap', () => {
    const result = calculateFinancialStructure({ mode: 'start', marginCapital: 14000 });

    expect(result.projectCost).toBe(140000);
    expect(result.scheme?.id).toBe('microFinance');
    expect(result.actualLoanAmount).toBe(125000);
  });

  it('routes the next project cost to term loan and uses its cap', () => {
    const result = calculateFinancialStructure({ mode: 'start', marginCapital: 14001 });

    expect(result.projectCost).toBe(140010);
    expect(result.scheme?.id).toBe('termLoan');
    expect(result.actualLoanAmount).toBe(126009);
    expect(result.numberOfInstallments).toBe(26);
  });

  it('routes exactly ₹50,00,000 to term loan and rejects higher projects', () => {
    const boundary = calculateFinancialStructure({ mode: 'start', marginCapital: 500000 });
    const outside = calculateFinancialStructure({ mode: 'start', marginCapital: 500001 });

    expect(boundary.projectCost).toBe(5000000);
    expect(boundary.scheme?.id).toBe('termLoan');
    expect(outside.projectCost).toBe(5000010);
    expect(outside.scheme).toBeNull();
    expect(outside.schemeStatus).toBe('not eligible under this scheme');
    expect(outside.totalRepayment).toBeNull();
  });

  it('calculates quarterly moratorium capitalization and repayment totals', () => {
    const result = calculateFinancialStructure({ mode: 'start', marginCapital: 10000 });
    const quarterlyRate = 0.065 / 4;
    const moratoriumInterest = 90000 * quarterlyRate;
    const capitalizedPrincipal = 90000 + moratoriumInterest;
    const growth = Math.pow(1 + quarterlyRate, 11);
    const installment = capitalizedPrincipal * quarterlyRate * growth / (growth - 1);

    expect(result.quarterlyInterestRate).toBeCloseTo(quarterlyRate, 12);
    expect(result.moratoriumInterest).toBeCloseTo(moratoriumInterest, 2);
    expect(result.capitalizedPrincipal).toBeCloseTo(capitalizedPrincipal, 2);
    expect(result.quarterlyInstallment).toBeCloseTo(installment, 2);
    expect(result.totalRepayment).toBeCloseTo(installment * 11, 2);
    expect(result.totalInterest).toBeCloseTo(installment * 11 - 90000, 2);
  });

  it('keeps Start and Scale financial calculations identical for the same margin capital', () => {
    const start = calculateFinancialStructure({ mode: 'start', marginCapital: 10000 });
    const scale = calculateFinancialStructure({ mode: 'scale', marginCapital: 10000 });

    expect(start.mode).toBe('start');
    expect(scale.mode).toBe('scale');
    expect({ ...start, mode: undefined }).toEqual({ ...scale, mode: undefined });
  });
});