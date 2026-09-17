import React from "react";
import { DataBadge } from "@/components/ui/data-badge";
import { tagToBadgeType } from "@/lib/utils";
import { CheckSquare, Clock, UserCheck, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tagged } from "../../../lib/ai/types";
import type { ActionPlanStepContent } from "../../../lib/action-plan";

interface ActionPlanSectionProps {
  actionPlan?: Tagged<ActionPlanStepContent>[] | null;
}

export function ActionPlanSection({ actionPlan }: ActionPlanSectionProps) {
  const steps = actionPlan || [];

  return (
    <section aria-labelledby="action-plan-heading" className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Section 11
              </span>
              <span className="text-slate-300">•</span>
              <h2 id="action-plan-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-blue-700" />
                <span>Action Plan</span>
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Standard NSFDC application sequence to convert this advisory into an operating enterprise.
            </p>
          </div>
        </div>

        {steps.length === 0 ? (
          <div className="p-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center space-y-2">
            <AlertCircle className="h-5 w-5 text-slate-400 mx-auto" />
            <p className="text-sm font-medium text-slate-700">
              Information unavailable for this section.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Execution milestones have not been sequenced for this plan.
            </p>
          </div>
        ) : (
          <div className="space-y-3 relative">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors"
              >
                {/* Step Number Circle */}
                <div className="h-8 w-8 rounded-full bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>

                {/* Step Info */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">
                      {step.value.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                        <Clock className="h-3 w-3" />
                        {step.value.duration}
                      </span>
                      <DataBadge type={tagToBadgeType(step.tag)} size="sm" showTooltip />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.value.description}
                  </p>

                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                    <span>Lead Entity:</span>
                    <span className="font-semibold text-slate-700">{step.value.responsibleEntity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Milestone Completion Note */}
        <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-blue-700 shrink-0" />
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-blue-950">
                Institutional DPR & Ground Verification
              </h4>
              <p className="text-[11px] text-blue-800">
                Submit this feasibility analysis report to the Gram Panchayat or Lead District Bank for DPR appraisal.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Button href="/input" variant="primary" size="sm" className="text-xs">
              <span>Start Another Analysis</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
