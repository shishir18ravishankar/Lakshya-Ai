import type { FeasibilityResponse } from "../../lib/ai/types";
import type { FinancialResult } from "../../lib/finance/calculator";
import type { VerdictStatus } from "@/types/verdict";

const VERDICT_LABEL: Record<string, VerdictStatus> = {
  proceed: "Proceed",
  review: "Review",
  high_risk: "High Risk",
};

// Merges the AI feasibility pipeline's output with the deterministic
// finance engine's output into the shape the report page/components
// expect. Extracted out of route.ts because Next.js's App Router only
// allows HTTP-method exports from a route file.
export function buildVerdictResponse(feasibilityJson: FeasibilityResponse, financial: FinancialResult) {
  const priceMins = feasibilityJson.suggested_pricing.items.map((item) => item.value.price_min_inr);
  const priceMaxes = feasibilityJson.suggested_pricing.items.map((item) => item.value.price_max_inr);

  return {
    verdict: VERDICT_LABEL[feasibilityJson.verdict_input.recommendation.value] ?? "Review",
    reason: feasibilityJson.verdict_input.rationale.value,

    recap: {
      location: feasibilityJson.meta.location,
      marginCapital: financial.marginCapital ?? undefined,
      businessCategory: feasibilityJson.meta.business_category,
      generatedDate: feasibilityJson.meta.generated_at,
    },

    marketReach: {
      demandSummary: feasibilityJson.local_demand.summary,
      localDrivers: feasibilityJson.local_demand.indicators,
      customerSegments: feasibilityJson.customer_segments,
    },

    // strengths/weaknesses come tagged from the AI pipeline's swot section.
    // threats are derived from risks (each risk.value.risk is a threat
    // statement) rather than asking the model to produce the same concern
    // twice — see the earlier swot/risks redundancy decision. opportunities
    // still aren't produced by the pipeline.
    swot: {
      strengths: feasibilityJson.swot.strengths,
      weaknesses: feasibilityJson.swot.weaknesses,
      threats: feasibilityJson.risks.map((risk) => risk.value.risk),
    },

    competitorMapping: feasibilityJson.competitors,

    suggestedPricing: {
      recommendedPriceRange:
        priceMins.length > 0 ? { min: Math.min(...priceMins), max: Math.max(...priceMaxes) } : undefined,
      rationale: feasibilityJson.suggested_pricing.summary.value,
      pricingFactors: feasibilityJson.suggested_pricing.items.map(
        (item) =>
          `${item.value.product}: ₹${item.value.price_min_inr}–₹${item.value.price_max_inr} (${item.value.basis})`
      ),
    },

    financials: {
      projectCost: financial.projectCost ?? undefined,
      maximumLoanAmount: financial.actualLoanAmount ?? undefined,
      ownContribution: financial.marginCapital ?? undefined,
      interestRate: financial.interestRate ?? undefined,
      tenureMonths: financial.tenureYears ? financial.tenureYears * 12 : undefined,
      moratoriumMonths: financial.moratoriumMonths ?? undefined,
    },

    schemeMatch:
      financial.calculationStatus === "valid" && financial.scheme
        ? {
            scheme: financial.scheme.name,
            tier: financial.scheme.name,
            applicableAmount: financial.actualLoanAmount ?? undefined,
            interest: financial.interestRate ?? undefined,
            tenure: `${financial.tenureYears} Years`,
            moratorium: `${financial.moratoriumMonths} Months`,
            explanation: financial.scheme.eligibilityNotes,
          }
        : {
            tier: "Outside Scheme / Flagged",
            explanation: "Project cost falls outside both configured financing schemes.",
          },

    // The finance engine produces aggregate quarterly-installment/interest
    // totals, not a full per-installment amortization table, so
    // installments stays unset here — the section renders the aggregate
    // summary without a row-by-row breakdown.
    repaymentSchedule: {
      loanAmount: financial.actualLoanAmount ?? undefined,
      annualInterestRatePct: financial.interestRate ?? undefined,
      tenureMonths: financial.tenureYears ? financial.tenureYears * 12 : undefined,
      moratoriumMonths: financial.moratoriumMonths ?? undefined,
      quarterlyInstallment: financial.quarterlyInstallment ?? undefined,
      totalInterest: financial.totalInterest ?? undefined,
      totalRepayment: financial.totalRepayment ?? undefined,
      explanation: financial.assumptions[0],
    },

    sources: feasibilityJson.sources,
  };
}
