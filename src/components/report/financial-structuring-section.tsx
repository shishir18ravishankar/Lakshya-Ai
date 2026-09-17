import React from "react";
import { FinancialsData } from "@/types/verdict";
import { DataBadge } from "@/components/ui/data-badge";
import { formatINR } from "@/lib/utils";
import { Coins, AlertCircle } from "lucide-react";

interface FinancialStructuringSectionProps {
  financial?: FinancialsData | null;
}

export function FinancialStructuringSection({ financial }: FinancialStructuringSectionProps) {
  if (!financial || (!financial.projectCost && !financial.totalProjectCost && !financial.maximumLoanAmount && !financial.termLoan)) {
    return (
      <section aria-labelledby="financial-structuring-heading" className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Section 7
                </span>
                <span className="text-slate-300">•</span>
                <h2 id="financial-structuring-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Coins className="h-4 w-4 text-emerald-700" />
                  <span>Financial Structuring</span>
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
              Financial structuring parameters have not yet been generated for this intake.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const projectCost = financial.projectCost ?? financial.totalProjectCost;
  const maxLoan = financial.maximumLoanAmount ?? financial.termLoan;
  const ownContribution = financial.ownContribution ?? financial.ownEquity;
  const fundingReq = financial.fundingRequirement;
  const interestRate = financial.interestRate;
  const tenure = financial.tenure ?? (financial.tenureMonths ? `${financial.tenureMonths} Months` : undefined);
  const moratorium = financial.moratorium ?? (financial.moratoriumMonths ? `${financial.moratoriumMonths} Months` : undefined);
  const estimatedProfit = financial.estimatedProfit ?? financial.estimatedMonthlyProfit;
  const breakEven = financial.breakEven ?? (financial.breakevenMonths ? `${financial.breakevenMonths} Months` : undefined);

  return (
    <section aria-labelledby="financial-structuring-heading" className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Section 7
              </span>
              <span className="text-slate-300">•</span>
              <h2 id="financial-structuring-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Coins className="h-4 w-4 text-emerald-700" />
                <span>Financial Structuring</span>
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Institutional capital outlay and financing structure derived by backend financial models.
            </p>
          </div>
          <DataBadge type="ai" size="sm" showTooltip />
        </div>

        {/* Primary Outlay Banner */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Project Cost
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {projectCost !== undefined ? formatINR(projectCost) : "—"}
            </span>
            <span className="text-xs text-slate-500 block">
              Estimated complete capital outlay required
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0">
            <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-0.5">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Max Loan Amount</span>
              <span className="text-base font-extrabold text-blue-700">
                {maxLoan !== undefined ? formatINR(maxLoan) : "—"}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-0.5">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Own Contribution</span>
              <span className="text-base font-extrabold text-slate-900">
                {ownContribution !== undefined ? formatINR(ownContribution) : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Capital Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
          {fundingReq !== undefined && (
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Funding Requirement
              </span>
              <span className="text-base sm:text-lg font-black text-slate-900">
                {formatINR(fundingReq)}
              </span>
              <span className="text-[10px] text-slate-500 block">Net bank capital</span>
            </div>
          )}

          {interestRate !== undefined && (
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Interest Rate
              </span>
              <span className="text-base sm:text-lg font-black text-blue-700">
                {interestRate}% p.a.
              </span>
              <span className="text-[10px] text-slate-500 block">Indicative lending rate</span>
            </div>
          )}

          {tenure !== undefined && (
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Loan Tenure
              </span>
              <span className="text-base sm:text-lg font-black text-slate-900">
                {typeof tenure === "number" ? `${tenure} Months` : tenure}
              </span>
              <span className="text-[10px] text-slate-500 block">Repayment duration</span>
            </div>
          )}

          {moratorium !== undefined && (
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Moratorium Period
              </span>
              <span className="text-base sm:text-lg font-black text-amber-700">
                {typeof moratorium === "number" ? `${moratorium} Months` : moratorium}
              </span>
              <span className="text-[10px] text-slate-500 block">Principal grace period</span>
            </div>
          )}

          {estimatedProfit !== undefined && (
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Estimated Profit
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-700">
                {formatINR(estimatedProfit)}
              </span>
              <span className="text-[10px] text-slate-500 block">Monthly operating surplus</span>
            </div>
          )}

          {breakEven !== undefined && (
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Break-Even
              </span>
              <span className="text-base sm:text-lg font-black text-blue-700">
                {typeof breakEven === "number" ? `${breakEven} Months` : breakEven}
              </span>
              <span className="text-[10px] text-slate-500 block">From commercial launch</span>
            </div>
          )}

          {financial.workingCapital !== undefined && (
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Working Capital
              </span>
              <span className="text-base sm:text-lg font-black text-slate-900">
                {formatINR(financial.workingCapital)}
              </span>
              <span className="text-[10px] text-slate-500 block">Operating liquidity</span>
            </div>
          )}

          {financial.subsidyAmount !== undefined && (
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Eligible Subsidy
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-700">
                {formatINR(financial.subsidyAmount)}
              </span>
              <span className="text-[10px] text-slate-500 block">Applicable grant money</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
