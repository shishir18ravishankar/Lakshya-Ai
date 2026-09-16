"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Printer, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportHeaderNavProps {
  dossierId: string;
  generatedDate: string;
  location?: string;
  businessCategory?: string;
}

export function ReportHeaderNav({ dossierId, generatedDate, location, businessCategory }: ReportHeaderNavProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-4 pb-4 border-b border-slate-200 print:hidden">
      {/* Top utility row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/input"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-md px-3 py-1.5 transition-colors shadow-2xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Input</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span className="font-semibold text-slate-700">Dossier:</span>
            <span>{dossierId}</span>
            <span>•</span>
            <span>{generatedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>SIH PS 26091 Advisory</span>
          </div>

          <Button
            type="button"
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
          >
            <Printer className="h-3.5 w-3.5 text-slate-600" />
            <span>Print / PDF</span>
          </Button>

          <Button
            href="/input"
            variant="secondary"
            size="sm"
            className="text-xs gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-600" />
            <span>New Analysis</span>
          </Button>
        </div>
      </div>

      {/* Main Branding & Report Title Strip */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold tracking-wider text-blue-700 uppercase">
              LAKSHYA AI
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-medium text-slate-500">
              Rural Business Advisory & Financial Structuring
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Enterprise Feasibility & Advisory Report
          </h1>
        </div>

        {(location || businessCategory) && (
          <div className="text-xs sm:text-right font-medium text-slate-600 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded border sm:border-0 border-slate-200">
            <span className="text-slate-400">Context: </span>
            <strong className="text-slate-900">{businessCategory || "Micro-Enterprise"}</strong>
            {location && <span> in <strong className="text-slate-900">{location}</strong></span>}
          </div>
        )}
      </div>
    </div>
  );
}
