"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { BusinessIntakePayload } from "@/types";
import { formatINR } from "@/lib/utils";

export interface AnalysisProgressProps {
  payload: BusinessIntakePayload;
  onComplete: () => void;
}

const ASSESSMENT_STEPS = [
  { id: "nlp", label: "Understanding your business concept" },
  { id: "demand", label: "Checking local demand in taluka cluster" },
  { id: "competition", label: "Assessing competition & market saturation" },
  { id: "customers", label: "Reviewing local customer opportunities" },
  { id: "pricing", label: "Estimating benchmark pricing & unit economics" },
  { id: "risks", label: "Identifying localized operating risks" },
  { id: "financials", label: "Preparing financial structuring & subsidy match" },
];

export function AnalysisProgress({ payload, onComplete }: AnalysisProgressProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < ASSESSMENT_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          // Wait a short moment on the last step before completing
          setTimeout(onComplete, 800);
          return prev;
        }
      });
    }, 550);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center pb-4 border-b border-slate-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4 text-blue-700" />
            <span>Feasibility Engine Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Assessing your business idea
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Synthesizing rural cluster demand, MSME handbook benchmarks, and government scheme parameters for{" "}
            <span className="font-semibold text-slate-800">
              {payload.location.village}, {payload.location.taluk}
            </span>
            .
          </p>
        </div>

        {/* Target Profile Summary Strip */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Proposed Venture:</span>
            <span className="font-bold text-slate-800 truncate block">
              {payload.businessIdea || "Enterprise"}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Own Capital:</span>
            <span className="font-bold text-slate-800">
              {formatINR(payload.availableCapital)}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-500 block text-[11px]">Expected Outlay:</span>
            <span className="font-bold text-blue-700">
              {formatINR(payload.expectedInvestment)}
            </span>
          </div>
        </div>

        {/* Sequential Step Progress List */}
        <div className="space-y-3 py-2">
          {ASSESSMENT_STEPS.map((step, index) => {
            const isFinished = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-2.5 rounded-lg text-sm transition-all duration-300 ${
                  isCurrent
                    ? "bg-blue-50 border border-blue-200 text-blue-900 font-semibold"
                    : isFinished
                    ? "text-slate-800 font-medium"
                    : "text-slate-400 opacity-60"
                }`}
              >
                <div className="shrink-0">
                  {isFinished ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                      {index + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1 flex items-center justify-between">
                  <span>{step.label}</span>
                  {isFinished && (
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold uppercase">
                      ✓ Done
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[11px] font-mono text-blue-700 font-semibold uppercase animate-pulse">
                      Analyzing...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Skip / Direct proceed link */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500">
          <span>Running rule-based & cluster verification</span>
          <button
            type="button"
            onClick={onComplete}
            className="text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1 transition-colors"
          >
            <span>Proceed to Report</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
