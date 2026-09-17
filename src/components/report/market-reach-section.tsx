import React from "react";
import { MarketReachData } from "@/types/verdict";
import { DataBadge } from "@/components/ui/data-badge";
import { tagToBadgeType } from "@/lib/utils";
import { Users, TrendingUp, Compass, CheckCircle2, Sparkles, BookOpen } from "lucide-react";
import type { Tagged } from "../../../lib/ai/types";

type CustomerSegment = Tagged<{
  name: string;
  description: string;
  priority: "primary" | "secondary";
}>;

// demandSummary, localDrivers, and customerSegments come tagged from the AI
// pipeline (local_demand and customer_segments respectively); every other
// field here (primaryCluster, catchmentRadiusKm, demandStatus, etc.) is not
// produced by the pipeline at all yet, so those stay exactly as
// MarketReachData already declared them.
interface MarketReachSectionProps {
  marketReach?: (Omit<MarketReachData, "demandSummary" | "localDrivers" | "customerSegments" | "targetSegments"> & {
    demandSummary?: Tagged<string>;
    localDrivers?: Tagged<string>[];
    customerSegments?: CustomerSegment[];
  }) | null;
}

export function MarketReachSection({ marketReach }: MarketReachSectionProps) {
  if (!marketReach) {
    return (
      <section aria-labelledby="market-reach-heading" className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-center text-xs text-slate-500">
          Information unavailable for this section.
        </div>
      </section>
    );
  }

  const segments = marketReach.customerSegments || [];
  const drivers = marketReach.localDrivers || [];

  const getDemandStatusBadge = () => {
    const status = (marketReach.demandStatus || "High").toLowerCase();
    if (status.includes("high")) {
      return "bg-emerald-50 text-emerald-800 border-emerald-300";
    }
    if (status.includes("mod")) {
      return "bg-amber-50 text-amber-800 border-amber-300";
    }
    return "bg-rose-50 text-rose-800 border-rose-300";
  };

  return (
    <section aria-labelledby="market-reach-heading" className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Section 3 • Product Headline
              </span>
              <span className="text-slate-300">•</span>
              <h2 id="market-reach-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Compass className="h-4 w-4 text-blue-700" />
                <span>Hyper-Local Market Reach & Customer Base</span>
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Evaluates geographic catchment, footfall velocity, and customer demand before seeking capital.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DataBadge type="verified" size="sm" showTooltip />
            <DataBadge type="ai" size="sm" showTooltip />
          </div>
        </div>

        {/* 3 Core Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Tile 1: Primary Cluster */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Designated Cluster
            </span>
            <p className="text-sm font-bold text-slate-900 leading-tight">
              {marketReach.primaryCluster || "Local Micro-Industrial Cluster"}
            </p>
            <span className="inline-block text-[10px] text-slate-500 font-mono">
              DIC / MSME Registry
            </span>
          </div>

          {/* Tile 2: Effective Radius & Target Households */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Catchment Radius & Base
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-blue-700">
                {marketReach.catchmentRadiusKm ? `${marketReach.catchmentRadiusKm} km` : "15 km"}
              </span>
              {marketReach.estimatedTargetHouseholds && (
                <span className="text-xs text-slate-600 font-medium">
                  (≈ {marketReach.estimatedTargetHouseholds.toLocaleString("en-IN")} Households)
                </span>
              )}
            </div>
            <span className="inline-block text-[10px] text-slate-500 font-mono">
              Census & Panchayat Demographics
            </span>
          </div>

          {/* Tile 3: Local Demand Assessment */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Demand Momentum
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${getDemandStatusBadge()}`}>
                {marketReach.demandStatus || "High"} Demand
              </span>
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-0.5">
                <TrendingUp className="h-3.5 w-3.5" />
                Active Uptrend
              </span>
            </div>
            {marketReach.demandSummary && (
              <p className="text-[11px] text-slate-600 pt-0.5 leading-snug flex items-start gap-1.5 flex-wrap">
                <span>{marketReach.demandSummary.value}</span>
                <DataBadge type={tagToBadgeType(marketReach.demandSummary.tag)} size="sm" showTooltip />
              </p>
            )}
          </div>
        </div>

        {/* Local Opportunity Highlight if provided */}
        {marketReach.localOpportunity && (
          <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-blue-950">Local Market Opportunity:</span>
              <p className="leading-relaxed text-blue-800">{marketReach.localOpportunity}</p>
            </div>
          </div>
        )}

        {/* Local Drivers & Target Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-1">
          {/* Local Market Demand Drivers */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
                <span>Local Demand Drivers</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-medium">Field Observations</span>
            </div>

            {drivers.length > 0 ? (
              <ul className="space-y-2.5">
                {drivers.map((driver, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-slate-700 p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/70 flex-wrap"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span className="leading-relaxed flex-1 min-w-0">{driver.value}</span>
                    <DataBadge type={tagToBadgeType(driver.tag)} size="sm" showTooltip />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                No specific local drivers supplied.
              </p>
            )}
          </div>

          {/* Target Customer Segments */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-emerald-600" />
                <span>Target Customer Segments</span>
              </h3>
            </div>

            {segments.length > 0 ? (
              <div className="space-y-3">
                {segments.map((seg, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="text-slate-400 font-mono text-[11px]">{idx + 1}.</span>
                        {seg.value.name}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            seg.value.priority === "primary"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {seg.value.priority === "primary" ? "Primary" : "Secondary"}
                        </span>
                        <DataBadge type={tagToBadgeType(seg.tag)} size="sm" showTooltip />
                      </div>
                    </div>

                    {seg.value.description && (
                      <p className="text-[11px] text-slate-600 leading-snug">
                        {seg.value.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                Information unavailable for this section.
              </p>
            )}
          </div>
        </div>

        {/* Source and Year Provenance Tag */}
        {(marketReach.source || marketReach.year) && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-slate-400" />
              <span>Source: <strong className="text-slate-700">{marketReach.source || "Government Census / DIC"}</strong></span>
            </span>
            {marketReach.year && <span>Year: <strong className="text-slate-700">{marketReach.year}</strong></span>}
          </div>
        )}
      </div>
    </section>
  );
}
