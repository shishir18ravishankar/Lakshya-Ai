"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Coins, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ShieldCheck
} from "lucide-react";
import { DataBadge } from "@/components/ui/data-badge";
import { Button } from "@/components/ui/button";
import { formatINRWords } from "@/lib/utils";
import { LocationAutocomplete } from "@/components/intake/location-autocomplete";
import { VerdictInputPayload } from "@/types/verdict";

const LOADING_STEPS = [
  "Understanding your business idea",
  "Checking local market conditions",
  "Reviewing competition and pricing",
  "Structuring the finances",
  "Checking relevant schemes",
];

const POPULAR_CATEGORIES = [
  "Dairy",
  "Wooden Toy Manufacturing",
  "Solar Agri-Cold Storage",
  "Cold-Pressed Edible Oil Unit",
  "Handloom & Khadi Weaving",
  "Poultry & Egg Distribution",
];

export function SimpleInputForm() {
  const router = useRouter();

  // 3 Required Inputs per SIH 26091 Specification
  const [location, setLocation] = useState("Channapatna, Karnataka");
  const [marginCapital, setMarginCapital] = useState<number | "">(100000);
  const [businessCategory, setBusinessCategory] = useState("Dairy");

  // UX State
  const [isLoading, setIsLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    location?: string;
    marginCapital?: string;
    businessCategory?: string;
  }>({});

  // 1-Click Demo Presets for Evaluators
  const fillPrimaryDairyDemo = () => {
    setLocation("Channapatna, Karnataka");
    setMarginCapital(100000);
    setBusinessCategory("Dairy");
    setFieldErrors({});
    setErrorMessage(null);
  };

  const fillHonganurToyDemo = () => {
    setLocation("Honganur, Channapatna, Karnataka");
    setMarginCapital(50000);
    setBusinessCategory("Wooden Toy Manufacturing");
    setFieldErrors({});
    setErrorMessage(null);
  };

  const fillKadathanamaleDemo = () => {
    setLocation("Kadathanamale, Bengaluru Rural, Karnataka");
    setMarginCapital(80000);
    setBusinessCategory("Cold-Pressed Edible Oil Unit");
    setFieldErrors({});
    setErrorMessage(null);
  };

  // Currency input handler
  const handleCapitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw === "") {
      setMarginCapital("");
    } else {
      const num = parseInt(raw, 10);
      setMarginCapital(isNaN(num) ? "" : num);
    }
  };

  const validate = (): boolean => {
    const errs: {
      location?: string;
      marginCapital?: string;
      businessCategory?: string;
    } = {};

    if (!location || !location.trim()) {
      errs.location = "Please enter your business location (village, taluk, or district).";
    }

    if (marginCapital === "" || marginCapital <= 0) {
      errs.marginCapital = "Please enter your available margin capital (must be greater than ₹0).";
    }

    if (!businessCategory || !businessCategory.trim()) {
      errs.businessCategory = "Please enter or select your business category.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setCurrentStepIndex(0);

    // Sequential loading animation steps
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 450);

    const payload: VerdictInputPayload = {
      location: location.trim(),
      marginCapital: typeof marginCapital === "number" ? marginCapital : 0,
      businessCategory: businessCategory.trim(),
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
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Server responded with an error.");
      }

      const verdictData = await res.json();

      // Store response and user input safely in localStorage for /report
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("lakshya_verdict_data", JSON.stringify(verdictData));
          localStorage.setItem("lakshya_user_input", JSON.stringify(payload));
        } catch (e) {
          console.error("Storage error:", e);
        }
      }

      setTimeout(() => {
        clearInterval(stepInterval);
        router.push("/report");
      }, 500);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      setIsLoading(false);
      setErrorMessage(
        "Unable to generate the advisory right now. Please check your inputs and try again."
      );
      console.error("Verdict generation failed:", err);
    }
  };

  // Render Professional Loading State
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2 pb-4 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-blue-700" />
              <span>Analyzing Feasibility</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Evaluating your business parameters
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Cross-referencing {businessCategory} with local cluster demand and institutional subsidy frameworks in {location}.
            </p>
          </div>

          <div className="space-y-3 py-2">
            {LOADING_STEPS.map((step, idx) => {
              const isFinished = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step}
                  className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-all duration-300 ${
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
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span>{step}</span>
                    {isFinished && (
                      <span className="text-[11px] font-mono text-emerald-700 font-semibold uppercase">
                        ✓ Done
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[11px] font-mono text-blue-700 font-semibold uppercase animate-pulse">
                        Evaluating...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const capitalWords = typeof marginCapital === "number" ? formatINRWords(marginCapital) : "";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Demo Preset Buttons for Evaluators */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-1">
        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>Quick Demo Presets:</span>
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={fillPrimaryDairyDemo}
            className="text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-md px-3 py-1.5 transition-colors shadow-2xs"
          >
            Channapatna Dairy (₹1 Lakh)
          </button>
          <button
            type="button"
            onClick={fillHonganurToyDemo}
            className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 transition-colors shadow-2xs"
          >
            Honganur Toys (₹50k)
          </button>
          <button
            type="button"
            onClick={fillKadathanamaleDemo}
            className="text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 transition-colors shadow-2xs"
          >
            Kadathanamale Agro (₹80k)
          </button>
        </div>
      </div>

      {/* Main Intake Form Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-7">
        <div className="space-y-1.5 pb-5 border-b border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Rural Business Feasibility Intake
            </h1>
            <DataBadge type="user" size="md" showTooltip />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Enter three core parameters. Lakshya will evaluate hyper-local market viability and calculate optimal financing structures.
          </p>
        </div>

        {/* Global Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">{errorMessage}</p>
              <p className="text-[11px] text-red-600">Ensure the Next.js API server is active at /api/verdict.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* INPUT 1: LOCATION */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="location" className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <span>1. Location</span>
                <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-medium">Village, Taluk, or District</span>
            </div>
            
            <LocationAutocomplete
              id="location"
              value={location}
              onChange={(val) => {
                setLocation(val);
                if (fieldErrors.location) {
                  setFieldErrors((prev) => ({ ...prev, location: undefined }));
                }
              }}
              error={fieldErrors.location}
              placeholder="Search village, taluk, or cluster (e.g. Channapatna, Honganur)"
            />

            {fieldErrors.location ? (
              <p className="text-xs text-red-600 font-medium">{fieldErrors.location}</p>
            ) : (
              <p className="text-[11px] text-slate-500">
                Example: <em>Channapatna, Karnataka</em> or <em>Honganur, Channapatna</em>
              </p>
            )}
          </div>

          {/* INPUT 2: AVAILABLE MARGIN CAPITAL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="marginCapital" className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-emerald-700" />
                <span>2. Available Margin Capital</span>
                <span className="text-red-500">*</span>
              </label>
              {capitalWords && (
                <span className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  ≈ ₹{capitalWords}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-semibold text-sm">
                ₹
              </span>
              <input
                id="marginCapital"
                type="text"
                inputMode="numeric"
                value={
                  marginCapital !== "" && typeof marginCapital === "number"
                    ? new Intl.NumberFormat("en-IN").format(marginCapital)
                    : ""
                }
                onChange={handleCapitalChange}
                placeholder="e.g. 1,00,000"
                className={`w-full pl-8 pr-3.5 py-2.5 bg-white rounded-lg border text-sm text-slate-900 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 ${
                  fieldErrors.marginCapital ? "border-red-400 bg-red-50/20" : "border-slate-300 hover:border-slate-400"
                }`}
              />
            </div>
            {fieldErrors.marginCapital ? (
              <p className="text-xs text-red-600 font-medium">{fieldErrors.marginCapital}</p>
            ) : (
              <p className="text-[11px] text-slate-500">
                The entrepreneur&apos;s own savings or equity contribution towards project setup.
              </p>
            )}
          </div>

          {/* INPUT 3: BUSINESS CATEGORY */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="businessCategory" className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-blue-700" />
                <span>3. Business Category</span>
                <span className="text-red-500">*</span>
              </label>
            </div>
            <input
              id="businessCategory"
              type="text"
              value={businessCategory}
              onChange={(e) => {
                setBusinessCategory(e.target.value);
                if (fieldErrors.businessCategory) {
                  setFieldErrors((prev) => ({ ...prev, businessCategory: undefined }));
                }
              }}
              placeholder="e.g. Dairy, Wooden Toy Manufacturing"
              className={`w-full px-3.5 py-2.5 bg-white rounded-lg border text-sm text-slate-900 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 ${
                fieldErrors.businessCategory ? "border-red-400 bg-red-50/20" : "border-slate-300 hover:border-slate-400"
              }`}
            />
            {fieldErrors.businessCategory && (
              <p className="text-xs text-red-600 font-medium">{fieldErrors.businessCategory}</p>
            )}

            {/* Quick category chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setBusinessCategory(cat);
                    if (fieldErrors.businessCategory) {
                      setFieldErrors((prev) => ({ ...prev, businessCategory: undefined }));
                    }
                  }}
                  className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                    businessCategory === cat
                      ? "bg-blue-50 text-blue-800 border-blue-300 font-semibold"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 border-t border-slate-100">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center font-bold text-base py-3 shadow-sm"
            >
              <span>Analyze Feasibility</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
            <p className="text-[11px] text-slate-500 text-center mt-2.5">
              Processes hyper-local market reach, competitor mapping, pricing, and government financing structures.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
