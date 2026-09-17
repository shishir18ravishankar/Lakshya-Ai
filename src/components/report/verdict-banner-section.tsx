import React from "react";
import { VerdictStatus } from "@/types/verdict";
import { DataBadge } from "@/components/ui/data-badge";
import { CheckCircle2, AlertTriangle, AlertOctagon, Info } from "lucide-react";

interface VerdictBannerSectionProps {
  verdict: VerdictStatus | string;
  reason?: string;
  caveat?: string;
}

export function VerdictBannerSection({ verdict, reason, caveat }: VerdictBannerSectionProps) {
  // Normalize verdict string
  const vNorm = typeof verdict === "string" ? verdict.toLowerCase().trim() : "proceed";
  const isProceed = vNorm.includes("proceed");
  const isReview = vNorm.includes("review");

  const getTheme = () => {
    if (isProceed) {
      return {
        label: "PROCEED",
        statusText: "Viable Opportunity",
        dotColor: "bg-emerald-600",
        containerStyles: "border-emerald-300 bg-gradient-to-r from-emerald-50/70 via-white to-slate-50",
        pillStyles: "bg-emerald-600 text-white border-emerald-700 shadow-sm",
        textColor: "text-emerald-950",
        icon: CheckCircle2,
      };
    }
    if (isReview) {
      return {
        label: "REVIEW",
        statusText: "Conditional Viability",
        dotColor: "bg-amber-600",
        containerStyles: "border-amber-300 bg-gradient-to-r from-amber-50/70 via-white to-slate-50",
        pillStyles: "bg-amber-500 text-white border-amber-600 shadow-sm",
        textColor: "text-amber-950",
        icon: AlertTriangle,
      };
    }
    return {
      label: "HIGH RISK",
      statusText: "Elevated Risk Profile",
      dotColor: "bg-rose-600",
      containerStyles: "border-rose-300 bg-gradient-to-r from-rose-50/70 via-white to-slate-50",
      pillStyles: "bg-rose-600 text-white border-rose-700 shadow-sm",
      textColor: "text-rose-950",
      icon: AlertOctagon,
    };
  };

  const theme = getTheme();
  const Icon = theme.icon;

  return (
    <section aria-labelledby="verdict-heading" className="space-y-3">
      <div className={`rounded-xl border p-6 sm:p-8 shadow-sm transition-all ${theme.containerStyles}`}>
        <div className="space-y-5 max-w-4xl">
          {/* Header strip */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs">
                Section 1 • Strategic Feasibility Determination
              </span>
              <span className="text-xs text-slate-500">• {theme.statusText}</span>
            </div>
            <DataBadge type="ai" size="sm" showTooltip />
          </div>

          {/* Prominent Verdict Visual Treatment */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 pt-1">
            <div
              className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-lg border font-black text-sm sm:text-base tracking-wider select-none shrink-0 ${theme.pillStyles}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{theme.label}</span>
            </div>

            <h1
              id="verdict-heading"
              className={`text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight ${theme.textColor}`}
            >
              {isProceed
                ? "Viable for Rural Enterprise Setup & Financing"
                : isReview
                ? "Proceed with Caution — Operational Adjustments Required"
                : "High Cluster Saturation or Structural Margin Pressures"}
            </h1>
          </div>

          {/* Concise Reason */}
          {reason && (
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Executive Determination:
              </span>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal">
                {reason}
              </p>
            </div>
          )}

          {/* Important Caveat Callout if Provided */}
          {caveat && (
            <div className="p-3.5 rounded-lg bg-white/90 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5 shadow-2xs">
              <Info className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900">Key Operational Caveat:</span>
                <p className="leading-relaxed text-slate-600">{caveat}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
