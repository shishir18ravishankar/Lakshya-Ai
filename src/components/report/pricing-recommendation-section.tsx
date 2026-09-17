import React from "react";
import { DataBadge } from "@/components/ui/data-badge";
import { tagToBadgeType, formatINR } from "@/lib/utils";
import { Tag, AlertCircle } from "lucide-react";
import type { Tagged } from "../../../lib/ai/types";

// My SuggestedPricingSchema is {summary, items[]} — no averageCostPerUnit or
// suggestedMarginPct anywhere in the pipeline, so those metric cards (and
// the source/year footer, which duplicates the dedicated Sources section)
// are dropped rather than filled with invented numbers.
interface PricingRecommendationSectionProps {
  pricing?: {
    summary: Tagged<string>;
    items: Tagged<{
      product: string;
      price_min_inr: number;
      price_max_inr: number;
      basis: string;
    }>[];
  } | null;
}

export function PricingRecommendationSection({ pricing }: PricingRecommendationSectionProps) {
  const items = pricing?.items ?? [];

  if (!pricing || items.length === 0) {
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

  const minPrice = Math.min(...items.map((item) => item.value.price_min_inr));
  const maxPrice = Math.max(...items.map((item) => item.value.price_max_inr));

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

        {/* Recommended Price Corridor */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1 max-w-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Suggested Selling Price
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-blue-700">
              {minPrice === maxPrice ? formatINR(minPrice) : `${formatINR(minPrice)} – ${formatINR(maxPrice)}`}
            </span>
          </div>
          <span className="inline-block text-[10px] text-slate-500 font-mono">
            Range across all suggested products
          </span>
        </div>

        {/* Costing Rationale */}
        <div className="p-4 rounded-lg bg-slate-50/70 border border-slate-200/80 space-y-2 flex items-start gap-2 flex-wrap">
          <div className="flex-1 min-w-0 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
              Pricing Reasoning & Context
            </span>
            <p className="text-xs text-slate-700 leading-relaxed">
              {pricing.summary.value}
            </p>
          </div>
          <DataBadge type={tagToBadgeType(pricing.summary.tag)} size="sm" showTooltip />
        </div>

        {/* Per-product pricing */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
            Suggested Product Pricing
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900 flex-1 min-w-0">{item.value.product}</span>
                  <DataBadge type={tagToBadgeType(item.tag)} size="sm" showTooltip />
                </div>
                <div className="text-sm font-extrabold text-blue-700">
                  {formatINR(item.value.price_min_inr)} – {formatINR(item.value.price_max_inr)}
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{item.value.basis}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
