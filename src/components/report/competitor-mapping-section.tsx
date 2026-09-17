import React from "react";
import { DataBadge } from "@/components/ui/data-badge";
import { tagToBadgeType } from "@/lib/utils";
import { Store, AlertCircle } from "lucide-react";
import type { Tagged } from "../../../lib/ai/types";

// My CompetitorsSchema is flat (summary/intensity/players, all Tagged<T>) —
// none of CompetitorItem's rich per-competitor fields (type, positioning,
// pricing, differentiation, distanceKm, marketShareEstimate) are produced.
// Adapting the component to this shape rather than changing the schema.
interface CompetitorMappingSectionProps {
  competitors?: {
    summary: Tagged<string>;
    intensity: Tagged<"low" | "medium" | "high">;
    players: Tagged<string>[];
  } | null;
}

// The frontend's saturation-color lookup expects "Low"/"Moderate"/"High" —
// note "medium" -> "Moderate" is a real word change, not just casing.
const INTENSITY_LABEL: Record<"low" | "medium" | "high", string> = {
  low: "Low",
  medium: "Moderate",
  high: "High",
};

export function CompetitorMappingSection({ competitors }: CompetitorMappingSectionProps) {
  const players = competitors?.players ?? [];
  const summary = competitors?.summary;
  const intensity = competitors?.intensity;
  const saturationLevel = intensity ? INTENSITY_LABEL[intensity.value] : undefined;
  const nearbyCount = players.length;

  const getSaturationBadge = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "low":
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      case "moderate":
        return "bg-amber-50 text-amber-800 border-amber-300";
      case "high":
        return "bg-rose-50 text-rose-800 border-rose-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <section aria-labelledby="competitor-mapping-heading" className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Section 5
              </span>
              <span className="text-slate-300">•</span>
              <h2 id="competitor-mapping-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Store className="h-4 w-4 text-blue-700" />
                <span>Competitor Mapping</span>
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Analysis of registered and informal operating units within the target commercial radius.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DataBadge type="verified" size="sm" showTooltip />
            <DataBadge type="ai" size="sm" showTooltip />
          </div>
        </div>

        {/* Saturation summary bar */}
        {(saturationLevel || summary) && (
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-800">
                  Nearby Units Identified:
                </span>
                <span className="text-sm font-extrabold text-blue-700">
                  {nearbyCount} Units
                </span>
                {saturationLevel && intensity && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getSaturationBadge(saturationLevel)}`}>
                      {saturationLevel} Saturation
                    </span>
                    <DataBadge type={tagToBadgeType(intensity.tag)} size="sm" showTooltip />
                  </>
                )}
              </div>
              {summary && (
                <p className="text-xs text-slate-600 leading-snug flex items-start gap-1.5 flex-wrap">
                  <span>{summary.value}</span>
                  <DataBadge type={tagToBadgeType(summary.tag)} size="sm" showTooltip />
                </p>
              )}
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <span className="text-[10px] font-mono text-slate-500 block">
                Cluster Range: &lt; 10 km
              </span>
            </div>
          </div>
        )}

        {/* Competitor Items Grid or Empty State */}
        {players.length === 0 ? (
          <div className="p-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center space-y-2">
            <AlertCircle className="h-5 w-5 text-slate-400 mx-auto" />
            <p className="text-sm font-medium text-slate-700">
              Information unavailable for this section.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No direct commercial competitor units were identified within the localized radius, or survey data is currently pending field verification.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors space-y-2"
              >
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight flex-1 min-w-0">
                    {player.value}
                  </h3>
                  <DataBadge type={tagToBadgeType(player.tag)} size="sm" showTooltip />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
