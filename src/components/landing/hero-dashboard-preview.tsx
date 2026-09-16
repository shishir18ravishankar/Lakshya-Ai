import React from "react";
import { 
  MapPin, 
  TrendingUp, 
  Coins, 
  Landmark, 
  ShieldCheck, 
  ArrowUpRight 
} from "lucide-react";
import { DataBadge } from "@/components/ui/data-badge";
import { VerdictBadge } from "@/components/ui/verdict-badge";

export function HeroDashboardPreview() {
  return (
    <div className="w-full max-w-lg mx-auto lg:max-w-none">
      {/* Clean White Advisory Card */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-card overflow-hidden">
        {/* Card Header: Official Location Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900">Channapatna Block</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 font-medium">Ramanagara Dist.</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Agro-Processing & Jaggery Cluster</p>
            </div>
          </div>

          <div className="flex items-center">
            <VerdictBadge verdict="proceed" size="sm" />
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="p-5 space-y-4">
          {/* Metrics Row: Demand Indicator + Monthly Profit */}
          <div className="grid grid-cols-2 gap-3">
            {/* Metric 1: Local Demand Indicator */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
                  Local Demand
                </span>
                <DataBadge type="verified" size="sm" />
              </div>
              <div className="flex items-baseline gap-1.5 pt-0.5">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">86<span className="text-xs text-slate-500 font-normal">/100</span></span>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center">
                  <ArrowUpRight className="h-3 w-3" /> High
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">12km radius has unmet supply gap</p>
            </div>

            {/* Metric 2: Potential Monthly Profit */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-600 font-medium flex items-center gap-1">
                  <Coins className="h-3.5 w-3.5 text-emerald-600" />
                  Monthly Profit
                </span>
                <DataBadge type="ai" size="sm" />
              </div>
              <div className="flex items-baseline gap-1.5 pt-0.5">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">₹32,500</span>
                <span className="text-[11px] text-slate-500 font-normal">/ mo</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">Net surplus after debt service & power</p>
            </div>
          </div>

          {/* Capital Structuring & Investment Requirement */}
          <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Coins className="h-3.5 w-3.5 text-slate-600" />
                <span>Financial Structuring (CapEx & Working Capital)</span>
              </div>
              <span className="text-xs font-semibold text-slate-900">Total: ₹4,20,000</span>
            </div>

            {/* Restrained Stack Bar */}
            <div className="space-y-2">
              <div className="h-2.5 w-full rounded-md overflow-hidden flex bg-slate-100 border border-slate-200">
                <div className="h-full bg-emerald-600" style={{ width: "35%" }} title="PMEGP Subsidy: 35%" />
                <div className="h-full bg-blue-600" style={{ width: "55%" }} title="Bank Term Loan: 55%" />
                <div className="h-full bg-slate-400" style={{ width: "10%" }} title="Own Contribution: 10%" />
              </div>

              {/* Stack Legend */}
              <div className="grid grid-cols-3 gap-1 pt-1 text-[11px]">
                <div className="space-y-0.5">
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <span className="h-2 w-2 rounded-sm bg-emerald-600 shrink-0" />
                    Subsidy (35%)
                  </span>
                  <span className="font-semibold text-slate-900 block text-xs">₹1,47,000</span>
                </div>

                <div className="space-y-0.5">
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <span className="h-2 w-2 rounded-sm bg-blue-600 shrink-0" />
                    Bank Loan (55%)
                  </span>
                  <span className="font-semibold text-slate-900 block text-xs">₹2,31,000</span>
                </div>

                <div className="space-y-0.5">
                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                    <span className="h-2 w-2 rounded-sm bg-slate-400 shrink-0" />
                    Own Margin (10%)
                  </span>
                  <span className="font-semibold text-slate-900 block text-xs">₹42,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scheme Eligibility Box */}
          <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200/80 flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Landmark className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-900">Government Scheme Eligibility Match</p>
                <p className="text-[11px] text-slate-600 leading-snug">
                  PMEGP Rural General: 25% | Special Category (Women/SC/ST/OBC): <strong>35% Subsidy</strong>
                </p>
                <p className="text-[10px] text-blue-700 font-medium mt-0.5">
                  ✓ Eligible for CGTMSE collateral-free bank guarantee
                </p>
              </div>
            </div>
            <DataBadge type="verified" size="sm" />
          </div>
        </div>

        {/* Card Footer: Practical Institutional Verification */}
        <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Verified Against District MSME Handbook
          </span>
          <span className="text-slate-700 font-semibold text-[11px]">Break-even: Month 4.5</span>
        </div>
      </div>
    </div>
  );
}
