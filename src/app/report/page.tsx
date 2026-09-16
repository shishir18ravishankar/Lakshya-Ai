"use client";

import React, { useEffect, useState } from "react";
import { UnifiedVerdictResponse, BusinessRecapData } from "@/types/verdict";
import { ReportHeaderNav } from "@/components/report/report-header-nav";
import { VerdictBannerSection } from "@/components/report/verdict-banner-section";
import { BusinessRecapSection } from "@/components/report/business-recap-section";
import { MarketReachSection } from "@/components/report/market-reach-section";
import { SwotAnalysisSection } from "@/components/report/swot-analysis-section";
import { CompetitorMappingSection } from "@/components/report/competitor-mapping-section";
import { PricingRecommendationSection } from "@/components/report/pricing-recommendation-section";
import { FinancialStructuringSection } from "@/components/report/financial-structuring-section";
import { SchemeMatchSection } from "@/components/report/scheme-match-section";
import { RepaymentScheduleSection } from "@/components/report/repayment-schedule-section";
import { SourcesSection } from "@/components/report/sources-section";
import { ActionPlanSection } from "@/components/report/action-plan-section";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Loader2, RefreshCw } from "lucide-react";

export default function ReportPage() {
  const [data, setData] = useState<UnifiedVerdictResponse | null>(null);
  const [userInput, setUserInput] = useState<{ location?: string; marginCapital?: number; businessCategory?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDefaultVerdict = async () => {
    setIsLoading(true);
    setError(null);

    const payload = {
      location: userInput?.location || "Channapatna",
      marginCapital: userInput?.marginCapital || 100000,
      businessCategory: userInput?.businessCategory || "Dairy",
    };

    try {
      const res = await fetch("/api/verdict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const json = await res.json();
      if (!json || typeof json !== "object") {
        throw new Error("Invalid response format received from server");
      }

      setData(json);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("lakshya_verdict_data", JSON.stringify(json));
        } catch {
          // ignore quota
        }
      }
    } catch (err) {
      console.error("Report fetch error:", err);
      setError("Unable to generate the advisory right now. Please check your inputs and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedInput = localStorage.getItem("lakshya_user_input");
        if (storedInput) {
          const parsedInput = JSON.parse(storedInput);
          if (parsedInput && typeof parsedInput === "object") {
            setUserInput(parsedInput);
          }
        }

        const cached = localStorage.getItem("lakshya_verdict_data");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === "object" && (parsed.verdict || parsed.marketReach)) {
            setData(parsed);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn("Error reading local storage cache, requesting fresh verdict:", e);
      }
    }

    // If no cache or invalid cache, fetch fresh default demo verdict
    fetchDefaultVerdict();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loading State
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3.5 rounded-full bg-blue-50 text-blue-700">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900">
            Assembling Unified Advisory Report
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Synthesizing hyper-local market metrics, competition mapping, and PMEGP/MUDRA financial structures for your enterprise...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto py-16 space-y-6">
        <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 sm:p-8 text-center space-y-4 shadow-sm">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-100 text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-slate-900">
              Advisory Generation Issue
            </h2>
            <p className="text-xs sm:text-sm text-red-700 max-w-md mx-auto leading-relaxed">
              {error || "Unable to generate the advisory right now. Please check your inputs and try again."}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <Button href="/input" variant="primary" size="md">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              <span>Back to Input</span>
            </Button>
            <Button
              type="button"
              onClick={fetchDefaultVerdict}
              variant="outline"
              size="md"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              <span>Retry Analysis</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Synthesize recap if missing
  const recapData: BusinessRecapData = data.recap || {
    location: userInput?.location || "Channapatna",
    marginCapital: userInput?.marginCapital || 100000,
    businessCategory: userInput?.businessCategory || "Dairy",
    dossierId: "LAK-2026-CHN-1001",
    generatedDate: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Report Header & Utility Navigation */}
      <ReportHeaderNav
        dossierId={recapData.dossierId || "LAK-2026-CHN-1001"}
        generatedDate={recapData.generatedDate || new Date().toLocaleDateString("en-IN")}
        location={recapData.location}
        businessCategory={recapData.businessCategory}
      />

      {/* 
        MANDATORY UNIFIED REPORT SECTION ORDER (SIH 2026 Problem Statement 26091):
        1. Verdict
        2. Business Recap
        3. Hyper-Local Market Reach (PRODUCT HEADLINE)
        4. SWOT
        5. Competitor Mapping
        6. Suggested Pricing
        7. Financial Structuring
        8. Scheme Match
        9. Repayment Schedule
        10. Sources
        11. Action Plan
      */}

      {/* 1. Verdict */}
      <VerdictBannerSection
        verdict={data.verdict || "Proceed"}
        reason={data.reason}
        caveat={data.caveat}
      />

      {/* 2. Business Recap */}
      <BusinessRecapSection recap={recapData} />

      {/* 3. Hyper-Local Market Reach */}
      <MarketReachSection marketReach={data.marketReach} />

      {/* 4. SWOT */}
      <SwotAnalysisSection swot={data.swot} />

      {/* 5. Competitor Mapping */}
      <CompetitorMappingSection competitors={data.competitorMapping} />

      {/* 6. Suggested Pricing */}
      <PricingRecommendationSection pricing={data.suggestedPricing} />

      {/* 7. Financial Structuring */}
      <FinancialStructuringSection financial={data.financials} />

      {/* 8. Scheme Match */}
      <SchemeMatchSection schemeMatch={data.schemeMatch} />

      {/* 9. Repayment Schedule */}
      <RepaymentScheduleSection schedule={data.repaymentSchedule} />

      {/* 10. Sources */}
      <SourcesSection sources={data.sources} />

      {/* 11. Action Plan */}
      <ActionPlanSection actionPlan={data.actionPlan} />
    </div>
  );
}
