/**
 * Utility functions for currency formatting in INR (Indian Rupee) format.
 */

export const formatINR = (val: number | string): string => {
  if (val === '' || val === null || val === undefined) return '';
  const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
  if (isNaN(num)) return '';
  if (num < 0) return '₹ 0';

  // Indian numbering format (e.g. 10,00,000)
  return '₹ ' + num.toLocaleString('en-IN');
};

export const sanitizeMonetaryInput = (val: string): string => {
  // Remove currency symbols, commas, and non-numeric characters (except decimal point)
  let clean = val.replace(/[^0-9.]/g, '');
  
  // Prevent multiple decimals
  const parts = clean.split('.');
  if (parts.length > 2) {
    clean = parts[0] + '.' + parts.slice(1).join('');
  }

  return clean;
};

export const parseINRAmount = (val: string): number => {
  const clean = sanitizeMonetaryInput(val);
  const num = parseFloat(clean);
  return isNaN(num) || num < 0 ? 0 : num;
};

export const calculateMonthlyOperatingExpenses = (data: Pick<
  import('../types/calculator').Step2FormData,
  'monthlySalaries' | 'monthlyRent' | 'monthlyMarketing'
> | Partial<Pick<
  import('../types/calculator').Step2FormData,
  'monthlySalaries' | 'monthlyRent' | 'monthlyMarketing'
>> | null | undefined): number => (
  parseINRAmount(data?.monthlySalaries || '') +
  parseINRAmount(data?.monthlyRent || '') +
  parseINRAmount(data?.monthlyMarketing || '')
);
