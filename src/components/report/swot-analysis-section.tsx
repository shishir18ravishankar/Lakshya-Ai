import React from "react";
import { SwotData } from "@/types/verdict";
import { DataBadge } from "@/components/ui/data-badge";
import { Shield, AlertTriangle, Sparkles, AlertOctagon, CheckCircle2, AlertCircle } from "lucide-react";

interface SwotAnalysisSectionProps {
  swot?: SwotData | null;
}

export function SwotAnalysisSection({ swot }: SwotAnalysisSectionProps) {
  const strengths = swot?.strengths || [];
  const weaknesses = swot?.weaknesses || [];
  const opportunities = swot?.opportunities || [];
  const threats = swot?.threats || [];

  const isEmpty = strengths.length === 0 && weaknesses.length === 0 && opportunities.length === 0 && threats.length === 0;

  return (
    <section aria-labelledby="swot-analysis-heading" className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Section 4
              </span>
              <span className="text-slate-300">•</span>
              <h2 id="swot-analysis-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-700" />
                <span>SWOT Analysis</span>
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Evaluates internal enterprise strengths against village cluster constraints, market potential, and localized threats.
            </p>
          </div>
          <DataBadge type="ai" size="sm" showTooltip />
        </div>

        {isEmpty ? (
          <div className="p-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center space-y-2">
            <AlertCircle className="h-5 w-5 text-slate-400 mx-auto" />
            <p className="text-sm font-medium text-slate-700">
              Information unavailable for this section.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              SWOT evaluation matrix has not yet been populated for this specific location.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. STRENGTHS */}
            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    Strengths
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                  Internal Advantages
                </span>
              </div>

              <ul className="space-y-2 pt-1">
                {strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. WEAKNESSES */}
            <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    W
                  </div>
                  <h3 className="text-sm font-bold text-amber-950">
                    Weaknesses
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                  Internal Bottlenecks
                </span>
              </div>

              <ul className="space-y-2 pt-1">
                {weaknesses.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. OPPORTUNITIES */}
            <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    O
                  </div>
                  <h3 className="text-sm font-bold text-blue-950">
                    Opportunities
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                  External Upside
                </span>
              </div>

              <ul className="space-y-2 pt-1">
                {opportunities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. THREATS */}
            <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs">
                    T
                  </div>
                  <h3 className="text-sm font-bold text-rose-950">
                    Threats
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded">
                  Risk Factors
                </span>
              </div>

              <ul className="space-y-2 pt-1">
                {threats.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                    <AlertOctagon className="h-3.5 w-3.5 text-rose-600 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
