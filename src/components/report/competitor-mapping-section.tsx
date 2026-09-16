import React from "react";
import { CompetitorMappingData, CompetitorItem } from "@/types/verdict";
import { DataBadge } from "@/components/ui/data-badge";
import { Store, Navigation, AlertCircle } from "lucide-react";

interface CompetitorMappingSectionProps {
  competitors?: CompetitorMappingData | CompetitorItem[] | null;
}

export function CompetitorMappingSection({ competitors }: CompetitorMappingSectionProps) {
  // Normalize items array
  let items: CompetitorItem[] = [];
  let saturationLevel: string | undefined;
  let saturationSummary: string | undefined;
  let nearbyCount: number | undefined;

  if (Array.isArray(competitors)) {
    items = competitors;
  } else if (competitors && typeof competitors === "object") {
    items = competitors.items || competitors.competitors || [];
    saturationLevel = competitors.saturationLevel;
    saturationSummary = competitors.saturationSummary || competitors.summary;
    nearbyCount = competitors.nearbyCompetitorCount ?? items.length;
  }

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

        {/* Saturation summary bar if available */}
        {(saturationLevel || saturationSummary || nearbyCount !== undefined) && (
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-800">
                  Nearby Units Identified:
                </span>
                <span className="text-sm font-extrabold text-blue-700">
                  {nearbyCount ?? items.length} Units
                </span>
                {saturationLevel && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getSaturationBadge(saturationLevel)}`}>
                      {saturationLevel} Saturation
                    </span>
                  </>
                )}
              </div>
              {saturationSummary && (
                <p className="text-xs text-slate-600 leading-snug">
                  {saturationSummary}
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
        {items.length === 0 ? (
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
            {items.map((comp, idx) => {
              const compName = comp.competitor || comp.name || `Competitor #${idx + 1}`;
              const pricing = comp.pricing || comp.pricingTier;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {compName}
                      </h3>
                      {pricing && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 bg-blue-50 text-blue-800 border-blue-200">
                          {pricing}
                        </span>
                      )}
                    </div>

                    {comp.type && (
                      <p className="text-xs text-slate-500 font-medium">
                        {comp.type}
                      </p>
                    )}

                    {comp.positioning && (
                      <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="font-semibold text-slate-600 block text-[11px] mb-0.5">Positioning:</span>
                        {comp.positioning}
                      </div>
                    )}

                    {comp.differentiation && (
                      <div className="text-xs text-emerald-900 bg-emerald-50/50 p-2 rounded border border-emerald-100">
                        <span className="font-semibold text-emerald-800 block text-[11px] mb-0.5">Differentiator:</span>
                        {comp.differentiation}
                      </div>
                    )}
                  </div>

                  {(comp.distanceKm !== undefined || comp.marketShareEstimate) && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
                      {comp.distanceKm !== undefined ? (
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <Navigation className="h-3 w-3 text-blue-600" />
                          {comp.distanceKm} km away
                        </span>
                      ) : <span />}
                      {comp.marketShareEstimate && (
                        <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {comp.marketShareEstimate} share
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
