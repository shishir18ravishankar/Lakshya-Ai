import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes safely with clsx.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number into Indian Rupee string (e.g. 200000 -> "₹2,00,000")
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Human-readable Indian currency denomination (e.g. 200000 -> "2 Lakhs")
 */
export function formatINRWords(amount: number): string {
  if (!amount || isNaN(amount) || amount <= 0) return "";
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2).replace(/\.00$/, "");
    return `${cr} Crore${Number(cr) > 1 ? "s" : ""}`;
  }
  if (amount >= 100000) {
    const lk = (amount / 100000).toFixed(2).replace(/\.00$/, "");
    return `${lk} Lakh${Number(lk) > 1 ? "s" : ""}`;
  }
  if (amount >= 1000) {
    const th = (amount / 1000).toFixed(1).replace(/\.0$/, "");
    return `${th} Thousand`;
  }
  return `${amount}`;
}
