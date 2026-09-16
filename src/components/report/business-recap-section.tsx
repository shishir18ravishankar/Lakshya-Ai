import React from "react";
import { BusinessRecapData } from "@/types/verdict";
import { DataBadge } from "@/components/ui/data-badge";
import { formatINR, formatINRWords } from "@/lib/utils";
import { MapPin, Coins, Layers, Calendar, Hash } from "lucide-react";

interface BusinessRecapSectionProps {
  recap?: BusinessRecapData | null;
}

export function BusinessRecapSection({ recap }: BusinessRecapSectionProps) {
  const safeRecap: Partial<BusinessRecapData> = recap || {};
  const capital = safeRecap.marginCapital !== undefined ? safeRecap.marginCapital : (safeRecap.availableCapital || 100000);
  const capitalWords = formatINRWords(capital);

  return (
    <section aria-labelledby="business-recap-heading" className="space-y-3">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Section 2
            </span>
            <span className="text-slate-300">•</span>
            <h2 id="business-recap-heading" className="text-base font-bold text-slate-900">
              Business Recap
            </h2>
          </div>
          <DataBadge type="user" size="sm" showTooltip />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Location Catchment */}
          <div className="p-4 rounded-lg bg-slate-50/80 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-blue-600" />
              Location
            </span>
            <p className="text-base font-bold text-slate-900">
              {safeRecap.location || "Channapatna"}
            </p>
            <p className="text-[11px] text-slate-600">
              {safeRecap.taluk ? `${safeRecap.taluk} Taluk` : "Rural Block Boundary"} {safeRecap.district ? `• ${safeRecap.district}` : ""}
            </p>
          </div>

          {/* Available Margin Capital */}
          <div className="p-4 rounded-lg bg-slate-50/80 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-emerald-600" />
              Available Margin Capital
            </span>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-bold text-emerald-800">
                {formatINR(capital)}
              </p>
              {capitalWords && (
                <span className="text-xs font-semibold text-slate-600">
                  (₹{capitalWords})
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Promoter margin capital
            </p>
          </div>

          {/* Business Category */}
          <div className="p-4 rounded-lg bg-slate-50/80 border border-slate-200/80 space-y-1 sm:col-span-2 lg:col-span-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-blue-600" />
              Business Category
            </span>
            <p className="text-base font-bold text-slate-900">
              {safeRecap.businessCategory || "Dairy"}
            </p>
            <span className="inline-block text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-medium border border-blue-100">
              Rural Micro-Enterprise
            </span>
          </div>
        </div>

        {/* Dossier Metadata Strip */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-xs text-slate-500 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5 text-slate-400" />
            <span>Dossier Reference:</span>
            <span className="font-mono font-semibold text-slate-800">{safeRecap.dossierId || "LAK-2026-CHN-1001"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Assessment Date:</span>
            <span className="font-medium text-slate-700">{safeRecap.generatedDate || new Date().toLocaleDateString("en-IN")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-mono">
              SIH 2026 • PS 26091
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
