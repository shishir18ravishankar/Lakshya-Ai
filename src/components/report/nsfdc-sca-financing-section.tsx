"use client";

import React from "react";
import { FinancialsData } from "@/types/verdict";
import { DataBadge } from "@/components/ui/data-badge";
import { formatINR } from "@/lib/utils";
import { Landmark, AlertCircle, GitBranch } from "lucide-react";

interface NsfdcScaFinancingSectionProps {
  financial?: FinancialsData | null;
}

export function NsfdcScaFinancingSection({ financial }: NsfdcScaFinancingSectionProps) {
  // Graceful fallback if financial data is missing or empty
  if (
    !financial ||
    (financial.projectCost === undefined &&
      financial.totalProjectCost === undefined &&
      financial.maximumLoanAmount === undefined &&
      financial.ownContribution === undefined)
  ) {
    return (
      <section aria-labelledby="nsfdc-sca-financing-heading" className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Section 8A
                </span>
                <span className="text-slate-300">•</span>
                <h2 id="nsfdc-sca-financing-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-blue-700" />
                  <span>NSFDC / SCA Financing Structure</span>
                </h2>
              </div>
            </div>
            <DataBadge type="verified" size="sm" showTooltip />
          </div>

          <div className="p-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center space-y-2">
            <AlertCircle className="h-5 w-5 text-slate-400 mx-auto" />
            <p className="text-sm font-medium text-slate-700">
              Financing structure unavailable.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Institutional financing parameters have not been populated for this proposal.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Reuse existing financial values from backend response without duplicating calculation formulas
  const marginAmount = financial.ownContribution ?? financial.ownEquity;
  const scaAmount = financial.maximumLoanAmount ?? financial.fundingRequirement ?? financial.termLoan;
  const totalCost = financial.projectCost ?? financial.totalProjectCost;

  return (
    <section aria-labelledby="nsfdc-sca-financing-heading" className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Section 8A
              </span>
              <span className="text-slate-300">•</span>
              <h2 id="nsfdc-sca-financing-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Landmark className="h-4 w-4 text-blue-700" />
                <span>NSFDC / SCA Financing Structure</span>
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              10% beneficiary margin with the corresponding 90% SCA financing structure, subject to eligibility, applicable scheme limits and sanction.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DataBadge type="verified" size="sm" showTooltip />
          </div>
        </div>

        {/* Main Visual: Horizontal Financing Structure */}
        <div className="rounded-xl border-2 border-blue-200/80 bg-slate-50/60 p-5 sm:p-6 space-y-5">
          {/* Responsive Cards: Side-by-side on desktop, stacked on mobile */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Card 1: 10% Beneficiary Margin */}
            <div className="flex-1 rounded-xl border border-emerald-200 bg-white p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  10% Margin
                </span>
                <span className="text-[11px] font-semibold text-slate-500">Own Contribution</span>
              </div>
              <span className="text-xs font-semibold text-slate-600 block">
                Beneficiary Margin
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {marginAmount !== undefined ? formatINR(marginAmount) : "—"}
              </div>
              <div className="text-[11px] text-emerald-800 font-medium pt-0.5">
                10% Beneficiary Margin (Promoter Equity)
              </div>
            </div>

            {/* Operator: Plus */}
            <div className="flex items-center justify-center shrink-0">
              <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-black text-blue-800 text-lg shadow-2xs">
                +
              </div>
            </div>

            {/* Card 2: 90% Indicative SCA Financing */}
            <div className="flex-1 rounded-xl border border-blue-200 bg-white p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  90% Financing
                </span>
                <span className="text-[11px] font-semibold text-slate-500">SCA Financing</span>
              </div>
              <span className="text-xs font-semibold text-slate-600 block">
                Indicative SCA Financing
              </span>
              <div className="text-2xl sm:text-3xl font-black text-blue-700">
                {scaAmount !== undefined ? formatINR(scaAmount) : "—"}
              </div>
              <div className="text-[11px] text-blue-800 font-medium pt-0.5">
                90% Indicative SCA Financing Channel
              </div>
            </div>

            {/* Operator: Equals / Result */}
            <div className="flex items-center justify-center shrink-0">
              <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-black text-slate-700 text-lg shadow-2xs">
                =
              </div>
            </div>

            {/* Card 3: 100% Total Project Cost */}
            <div className="flex-1 rounded-xl border-2 border-slate-300 bg-white p-5 shadow-2xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  100% Total
                </span>
                <span className="text-[11px] font-semibold text-slate-500">Gross Outlay</span>
              </div>
              <span className="text-xs font-semibold text-slate-600 block">
                Total Project Cost
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {totalCost !== undefined ? formatINR(totalCost) : "—"}
              </div>
              <div className="text-[11px] text-slate-600 font-medium pt-0.5">
                100% Total Project Cost
              </div>
            </div>
          </div>

          {/* Equation Bar */}
          <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-center flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs">
            <span className="text-emerald-700 font-bold">
              {marginAmount !== undefined ? formatINR(marginAmount) : "—"}
            </span>
            <span className="text-slate-500 font-normal">(10% Beneficiary Margin)</span>
            <span className="text-slate-400 font-bold">+</span>
            <span className="text-blue-700 font-bold">
              {scaAmount !== undefined ? formatINR(scaAmount) : "—"}
            </span>
            <span className="text-slate-500 font-normal">(90% Indicative SCA Financing)</span>
            <span className="text-slate-400 font-bold">=</span>
            <span className="text-slate-900 font-bold">
              {totalCost !== undefined ? formatINR(totalCost) : "—"}
            </span>
            <span className="text-slate-500 font-normal">(100% Project Cost)</span>
          </div>
        </div>

        {/* Process Flow: How the financing structure works */}
        <div className="space-y-3 pt-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5 text-blue-700" />
            <span>How the financing structure works</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Step 1 */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="h-5 w-5 rounded-full bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center">
                  1
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-400">Margin</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 leading-snug">
                Beneficiary contributes 10% margin
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="h-5 w-5 rounded-full bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-400">Evaluation</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 leading-snug">
                Business proposal and eligibility are evaluated
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="h-5 w-5 rounded-full bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center">
                  3
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-400">Routing</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 leading-snug">
                Application is routed through the applicable SCA / nodal channel
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="h-5 w-5 rounded-full bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center">
                  4
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-400">Structuring</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 leading-snug">
                Eligible financing is structured up to the applicable limit
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="h-5 w-5 rounded-full bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center">
                  5
                </span>
                <span className="text-[10px] font-bold uppercase text-slate-400">Sanction</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 leading-snug">
                Final sanction and disbursement are subject to approval
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 italic pt-1">
            Illustrative financing structure. Final financing, sanction and disbursement are subject to beneficiary eligibility, applicable scheme limits and approval by the relevant authority.
          </p>
        </div>

        {/* Small Eligibility / Approval Note */}
        <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed font-medium">
            <strong>Sanction & Eligibility Disclaimer:</strong> Final sanction depends on eligibility, applicable scheme limits, documentation and approval through the relevant financing channel.
          </p>
        </div>
      </div>
    </section>
  );
}
