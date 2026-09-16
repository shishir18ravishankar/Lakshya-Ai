import React from "react";
import { 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  TrendingUp, 
  Wallet, 
  Award, 
  ShieldCheck,
  Building2
} from "lucide-react";
import { VerdictBadge } from "@/components/ui/verdict-badge";
import { DataBadge } from "@/components/ui/data-badge";
import { Badge } from "@/components/ui/badge";

export function VerdictPreviewCard() {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Sample / Preview Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 border-t border-x border-slate-300 rounded-t-xl text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-600" />
          <span className="font-mono font-bold tracking-wider text-slate-800 uppercase text-[11px]">
            SAMPLE / ILLUSTRATIVE PREVIEW
          </span>
          <span className="text-slate-500 hidden sm:inline">• Illustrative decision document</span>
        </div>
        <Badge variant="tech" className="text-[10px] font-semibold bg-white text-blue-800 border-blue-200">
          Standard Report Output
        </Badge>
      </div>

      {/* Main Single Verdict Container (Advisory Report Paper Style) */}
      <div className="rounded-b-xl border border-slate-300 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header with Enterprise Name & Location */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-700" />
              <span className="text-xs font-mono font-semibold text-slate-500">DOSSIER #LAK-2026-0842</span>
              <DataBadge type="user" size="sm" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Solar Agri-Cold Storage & Processing Unit
            </h3>
            <p className="text-xs text-slate-600">
              Taluka: Magadi • District: Ramanagara, Karnataka • Total CapEx: ₹8,50,000
            </p>
          </div>

          {/* Big Proceed Verdict */}
          <div className="sm:text-right shrink-0">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Advisory Recommendation
            </span>
            <VerdictBadge verdict="proceed" size="lg" />
          </div>
        </div>

        {/* Clear Direction Statement */}
        <div className="p-4 sm:p-5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3.5">
          <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-bold text-emerald-900">
              One clear direction: Your business shows promising local demand with a manageable funding requirement.
            </h4>
            <p className="text-xs text-emerald-800/90 leading-relaxed font-normal">
              Based on local horticultural output and a cold storage capacity deficit in Magadi taluka, the proposed unit has a high probability of sustained profitability and qualifies for a 35% capital subsidy under KVIC PMEGP Rural guidelines.
            </p>
          </div>
        </div>

        {/* 4 Feasibility Pillars Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold">
                <TrendingUp className="h-3.5 w-3.5 text-blue-700" />
                Local Demand
              </span>
              <DataBadge type="verified" size="sm" />
            </div>
            <p className="text-lg font-bold text-slate-900">88% <span className="text-xs text-emerald-700 font-semibold">High Match</span></p>
            <p className="text-[11px] text-slate-600 leading-snug">62 local farmer producers within 8km currently lack cold storage facilities.</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold">
                <Wallet className="h-3.5 w-3.5 text-emerald-700" />
                Capital Recovery
              </span>
              <DataBadge type="ai" size="sm" />
            </div>
            <p className="text-lg font-bold text-slate-900">5.4 Mos <span className="text-xs text-blue-700 font-semibold">Break-even</span></p>
            <p className="text-[11px] text-slate-600 leading-snug">Projected monthly operating surplus of ₹42,000 after quarterly repayment service.</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold">
                <Award className="h-3.5 w-3.5 text-amber-700" />
                Scheme Subsidy
              </span>
              <DataBadge type="verified" size="sm" />
            </div>
            <p className="text-lg font-bold text-slate-900">PMEGP <span className="text-xs text-emerald-700 font-semibold">35% Grant</span></p>
            <p className="text-[11px] text-slate-600 leading-snug">Up to ₹2,97,500 non-repayable capital subsidy via KVIC / DIC nodal agency.</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-700" />
                Risk Factor
              </span>
              <DataBadge type="ai" size="sm" />
            </div>
            <p className="text-lg font-bold text-slate-900">Low <span className="text-xs text-slate-600 font-semibold">Power Risk</span></p>
            <p className="text-[11px] text-slate-600 leading-snug">Grid interruptions mitigated by recommended 5kW solar hybrid backup.</p>
          </div>
        </div>

        {/* Advisory Next Steps Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 border-t border-slate-100">
          <span className="flex items-center gap-1.5 font-medium">
            <FileText className="h-4 w-4 text-slate-400" />
            Complete Detailed Project Report (DPR) formatted for local lead bank branch submission.
          </span>
          <span className="text-blue-700 font-semibold text-[11px] flex items-center gap-1">
            Lakshya Financial Structuring Model <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
