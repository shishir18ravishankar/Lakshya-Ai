import React from "react";
import { SuggestedPricingData } from "@/types/verdict";
import { DataBadge } from "@/components/ui/data-badge";
import { formatINR } from "@/lib/utils";
import { Tag, TrendingUp, CheckCircle2, AlertCircle, FileText } from "lucide-react";

interface PricingRecommendationSectionProps {
  pricing?: SuggestedPricingData | null;
}

export function PricingRecommendationSection({ pricing }: PricingRecommendationSectionProps) {
  if (!pricing || (!pricing.averageCostPerUnit && !pricing.recommendedPriceRange && !pricing.rationale)) {
    return (
      <section aria-labelledby="pricing-recommendation-heading" className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Section 6
                </span>
                <span className="text-slate-300">•</span>
                <h2 id="pricing-recommendation-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-blue-700" />
                  <span>Suggested Pricing</span>
                </h2>
              </div>
            </div>
            <DataBadge type="ai" size="sm" showTooltip />
          </div>

          <div className="p-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center space-y-2">
            <AlertCircle className="h-5 w-5 text-slate-400 mx-auto" />
            <p className="text-sm font-medium text-slate-700">
              Information unavailable for this section.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Pricing benchmarks are being compiled based on local mandi and cluster sales records.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const minPrice = pricing.recommendedPriceRange?.min;
  const maxPrice = pricing.recommendedPriceRange?.max;

  return (
    <section aria-labelledby="pricing-recommendation-heading" className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Section 6
              </span>
              <span className="text-slate-300">•</span>
              <h2 id="pricing-recommendation-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Tag className="h-4 w-4 text-blue-700" />
                <span>Suggested Pricing</span>
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Suggested price corridors and unit economics to safeguard micro-enterprise margin viability.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DataBadge type="ai" size="sm" showTooltip />
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Average Cost per unit */}
          {pricing.averageCostPerUnit !== undefined && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Estimated Unit Cost
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900">
                  {formatINR(pricing.averageCostPerUnit)}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ unit</span>
              </div>
              <span className="inline-block text-[10px] text-slate-500 font-mono">
                Input material + overheads
              </span>
            </div>
          )}

          {/* Recommended Price Corridor */}
          {(minPrice !== undefined || maxPrice !== undefined) && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Suggested Selling Price
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-blue-700">
                  {minPrice !== undefined && maxPrice !== undefined
                    ? `${formatINR(minPrice)} – ${formatINR(maxPrice)}`
                    : formatINR(minPrice ?? maxPrice ?? 0)}
                </span>
              </div>
              <span className="inline-block text-[10px] text-slate-500 font-mono">
                Wholesale floor to retail corridor
              </span>
            </div>
          )}

          {/* Suggested Gross Margin */}
          {pricing.suggestedMarginPct !== undefined && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Suggested Margin
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-emerald-700">
                  {pricing.suggestedMarginPct}%
                </span>
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-0.5">
                  <TrendingUp className="h-3 w-3" />
                  Target
                </span>
              </div>
              <span className="inline-block text-[10px] text-slate-500 font-mono">
                Net return after cost recovery
              </span>
            </div>
          )}
        </div>

        {/* Costing Rationale & Pricing Factors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1">
          {/* Detailed Narrative */}
          {pricing.rationale && (
            <div className={`${pricing.pricingFactors?.length ? "lg:col-span-7" : "lg:col-span-12"} p-4 rounded-lg bg-slate-50/70 border border-slate-200/80 space-y-2`}>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                Pricing Reasoning & Context
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {pricing.rationale}
              </p>
            </div>
          )}

          {/* Key Cost Drivers */}
          {pricing.pricingFactors && pricing.pricingFactors.length > 0 && (
            <div className="lg:col-span-5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                Key Pricing Considerations
              </span>
              <ul className="space-y-2">
                {pricing.pricingFactors.map((factor, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-slate-700 p-2 rounded-md bg-white border border-slate-200 shadow-2xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span className="leading-tight">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Source citation if available */}
        {pricing.source && (
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            <span>
              Source: <strong className="text-slate-700 font-semibold">{pricing.source}</strong>
              {pricing.year ? ` • Year: ${pricing.year}` : ""}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
