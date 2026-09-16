import React, { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SimpleInputForm } from "@/components/intake/simple-input-form";

export const metadata = {
  title: "Feasibility Intake | Lakshya AI",
  description:
    "Enter location, margin capital, and business category for hyper-local feasibility analysis. Smart India Hackathon 2026 Problem Statement 26091.",
};

export default function InputPage() {
  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Landing Page</span>
        </Link>

        <span className="text-xs text-slate-500 font-mono">
          SIH 2026 • PS 26091
        </span>
      </div>

      <Suspense
        fallback={
          <div className="max-w-2xl mx-auto p-12 text-center text-slate-500 text-sm">
            Loading Feasibility Intake Module...
          </div>
        }
      >
        <SimpleInputForm />
      </Suspense>
    </div>
  );
}
