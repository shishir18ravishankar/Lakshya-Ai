import React from "react";
import { RepaymentScheduleData } from "@/types/verdict";
import { DataBadge } from "@/components/ui/data-badge";
import { formatINR } from "@/lib/utils";
import { Calendar, ShieldCheck, AlertCircle } from "lucide-react";

interface RepaymentScheduleSectionProps {
  schedule?: RepaymentScheduleData | null;
}

export function RepaymentScheduleSection({ schedule }: RepaymentScheduleSectionProps) {
  if (!schedule || (!schedule.quarterlyInstallment && !schedule.installments?.length && !schedule.loanAmount)) {
    return (
      <section aria-labelledby="repayment-schedule-heading" className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Section 9
                </span>
                <span className="text-slate-300">•</span>
                <h2 id="repayment-schedule-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-700" />
                  <span>Repayment Schedule</span>
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
              Institutional amortization schedules are structured upon preliminary bank sanction.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const installments = schedule.installments || [];
  const rate = schedule.annualInterestRatePct;
  const tenureQuarters = schedule.tenureQuarters || (schedule.tenureMonths ? Math.round(schedule.tenureMonths / 3) : undefined);
  const moratoriumQuarters = schedule.moratoriumQuarters || (schedule.moratoriumMonths ? Math.round(schedule.moratoriumMonths / 3) : undefined);

  return (
    <section aria-labelledby="repayment-schedule-heading" className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Section 9
              </span>
              <span className="text-slate-300">•</span>
              <h2 id="repayment-schedule-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-700" />
                <span>Repayment Schedule</span>
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Institutional amortization schedule structured on a quarterly debt servicing cycle.
            </p>
          </div>
          <DataBadge type="ai" size="sm" showTooltip />
        </div>

        {/* 4 Core Debt Servicing Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Quarterly Repayment */}
          <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-200 space-y-1">
            <span className="text-[11px] font-semibold text-blue-900 uppercase tracking-wider block">
              Quarterly Repayment
            </span>
            <span className="text-2xl font-black text-blue-800 block">
              {schedule.quarterlyInstallment !== undefined ? formatINR(schedule.quarterlyInstallment) : "—"}
            </span>
            <span className="text-[10px] text-blue-700 font-medium block">
              Payable every 3 months
            </span>
          </div>

          {/* Interest Rate & Tenure */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Rate & Duration
            </span>
            <span className="text-xl font-extrabold text-slate-900 block">
              {rate !== undefined ? `${rate}% p.a.` : "Indicative Rate"}
              {tenureQuarters ? ` • ${tenureQuarters} Qtrs` : ""}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {schedule.tenureMonths ? `${schedule.tenureMonths} Months (${schedule.tenureMonths / 12} Yrs)` : "Institutional term"}
            </span>
          </div>

          {/* Moratorium Grace */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Moratorium Grace
            </span>
            <span className="text-xl font-extrabold text-emerald-700 block">
              {moratoriumQuarters ? `${moratoriumQuarters} Quarters` : schedule.moratoriumMonths ? `${schedule.moratoriumMonths} Months` : "Standard"}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Principal repayment grace period
            </span>
          </div>

          {/* Total Interest Outlay */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Interest Payable
            </span>
            <span className="text-xl font-extrabold text-slate-900 block">
              {schedule.totalInterest !== undefined ? formatINR(schedule.totalInterest) : "—"}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {schedule.totalRepayment !== undefined ? `Total Repayment: ${formatINR(schedule.totalRepayment)}` : "Servicing outlay"}
            </span>
          </div>
        </div>

        {/* Detailed Amortization Table */}
        {installments.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Quarterly Repayment Breakdown
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Quarterly Cycle (Q1 – Q{installments.length})
              </span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-2xs">
              <table className="w-full text-xs text-left min-w-[550px]">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-3.5 py-2.5">Inst. #</th>
                    <th className="px-3.5 py-2.5">Due Period</th>
                    <th className="px-3.5 py-2.5 text-right">Principal</th>
                    <th className="px-3.5 py-2.5 text-right">Interest</th>
                    <th className="px-3.5 py-2.5 text-right">Total Installment</th>
                    <th className="px-3.5 py-2.5 text-right">Outstanding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {installments.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="px-3.5 py-2.5 font-bold text-slate-900">
                        #{item.installmentNumber}
                      </td>
                      <td className="px-3.5 py-2.5 font-medium text-slate-700">
                        {item.duePeriod}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-medium text-slate-900">
                        {formatINR(item.principal)}
                      </td>
                      <td className="px-3.5 py-2.5 text-right text-slate-600">
                        {formatINR(item.interest)}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-bold text-blue-700">
                        {formatINR(item.totalInstallment)}
                      </td>
                      <td className="px-3.5 py-2.5 text-right font-mono text-slate-700">
                        {formatINR(item.outstandingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Amortization Safety / Explanation Note */}
        {schedule.explanation && (
          <div className="p-4 rounded-lg bg-emerald-50/40 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
            <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Debt Servicing Framework:</strong> {schedule.explanation}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
