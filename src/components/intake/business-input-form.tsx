"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Building, 
  TrendingUp, 
  Sparkles, 
  HelpCircle,
  RotateCcw,
  Target,
  FileText
} from "lucide-react";
import { LocationFields } from "./location-fields";
import { CurrencyInput } from "./currency-input";
import { AnalysisProgress } from "./analysis-progress";
import { BusinessIntakePayload, LocationHierarchy } from "@/types";
import { DataBadge } from "@/components/ui/data-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_START_LOCATION: LocationHierarchy = {
  village: "",
  gramPanchayat: "",
  taluk: "",
  district: "",
  state: "Karnataka",
};

export function BusinessInputForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "scale" ? "scale" : "start";

  const [mode, setMode] = useState<"start" | "scale">(initialMode);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingPayload, setAnalyzingPayload] = useState<BusinessIntakePayload | null>(null);

  // Form State: Common
  const [location, setLocation] = useState<LocationHierarchy>(DEFAULT_START_LOCATION);
  const [businessIdea, setBusinessIdea] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [availableCapital, setAvailableCapital] = useState<number | "">("");
  const [expectedInvestment, setExpectedInvestment] = useState<number | "">("");
  const [goal, setGoal] = useState("start_new");

  // Form State: Scale Mode Specific
  const [currentBusiness, setCurrentBusiness] = useState("");
  const [currentRevenue, setCurrentRevenue] = useState<number | "">("");
  const [currentExpenses, setCurrentExpenses] = useState<number | "">("");
  const [expansionInvestment, setExpansionInvestment] = useState<number | "">("");
  const [expansionGoal, setExpansionGoal] = useState("machinery_automation");

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync mode with URL if query changes
  useEffect(() => {
    const qMode = searchParams.get("mode") === "scale" ? "scale" : "start";
    setMode(qMode);
  }, [searchParams]);

  const switchMode = (newMode: "start" | "scale") => {
    setMode(newMode);
    setErrors({});
    const url = newMode === "scale" ? "/input?mode=scale" : "/input";
    router.replace(url, { scroll: false });
  };

  // Demo Scenarios for Testing
  const loadHonganurToyDemo = () => {
    setMode("start");
    setLocation({
      village: "Honganur",
      gramPanchayat: "Honganur GP",
      taluk: "Channapatna",
      district: "Ramanagara",
      state: "Karnataka",
    });
    setBusinessIdea("Wooden toy manufacturing");
    setBusinessDescription(
      "I want to manufacture traditional wooden toys and sell them through local retailers, weekly tourist haats, and online gifting channels."
    );
    setAvailableCapital(50000);
    setExpectedInvestment(200000);
    setGoal("full_time_business");
    setErrors({});
    router.replace("/input", { scroll: false });
  };

  const loadKadathanamaleAgroDemo = () => {
    setMode("scale");
    setLocation({
      village: "Kadathanamale",
      gramPanchayat: "Kadathanamale GP",
      taluk: "Yelahanka",
      district: "Bengaluru Rural",
      state: "Karnataka",
    });
    setCurrentBusiness("Cold-Pressed Mustard & Groundnut Oil Unit");
    setBusinessDescription(
      "Currently operating a single rotary expeller oil unit selling directly to 8 local retail shops and 45 resident households in Kadathanamale."
    );
    setCurrentRevenue(45000);
    setCurrentExpenses(28000);
    setAvailableCapital(80000);
    setExpansionInvestment(350000);
    setExpansionGoal("new_product_line");
    setErrors({});
    router.replace("/input?mode=scale", { scroll: false });
  };

  const resetForm = () => {
    setLocation(DEFAULT_START_LOCATION);
    setBusinessIdea("");
    setBusinessDescription("");
    setAvailableCapital("");
    setExpectedInvestment("");
    setGoal("start_new");
    setCurrentBusiness("");
    setCurrentRevenue("");
    setCurrentExpenses("");
    setExpansionInvestment("");
    setExpansionGoal("machinery_automation");
    setErrors({});
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    // Location validation
    if (!location.village.trim()) {
      errs.village = "Please enter your village or Gram Panchayat.";
    }
    if (!location.taluk.trim()) {
      errs.taluk = "Please enter your taluk / block.";
    }
    if (!location.district.trim()) {
      errs.district = "Please enter your district.";
    }
    if (!location.state.trim()) {
      errs.state = "Please enter your state.";
    }

    if (mode === "start") {
      if (!businessIdea.trim()) {
        errs.businessIdea = "Please enter the business you want to start.";
      }
      if (!businessDescription.trim()) {
        errs.businessDescription = "Please tell us a little about your business idea (at least a sentence).";
      }
      if (availableCapital === "" || availableCapital < 0) {
        errs.availableCapital = "Please enter your available capital (₹0 or more).";
      }
      if (expectedInvestment === "" || expectedInvestment <= 0) {
        errs.expectedInvestment = "Please enter your expected project cost (must be greater than ₹0).";
      }
    } else {
      // Scale mode validation
      if (!currentBusiness.trim()) {
        errs.currentBusiness = "Please enter your current business type.";
      }
      if (!businessDescription.trim()) {
        errs.businessDescription = "Please describe your current business and expansion plan.";
      }
      if (currentRevenue === "" || currentRevenue < 0) {
        errs.currentRevenue = "Please enter your approximate monthly revenue.";
      }
      if (currentExpenses === "" || currentExpenses < 0) {
        errs.currentExpenses = "Please enter your approximate monthly expenses.";
      }
      if (availableCapital === "" || availableCapital < 0) {
        errs.availableCapital = "Please enter your capital available for expansion.";
      }
      if (expansionInvestment === "" || expansionInvestment <= 0) {
        errs.expansionInvestment = "Please enter your expected expansion investment (greater than ₹0).";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    const payload: BusinessIntakePayload = {
      mode,
      businessIdea: mode === "start" ? businessIdea : currentBusiness,
      businessDescription,
      location,
      availableCapital: typeof availableCapital === "number" ? availableCapital : 0,
      expectedInvestment:
        mode === "start"
          ? typeof expectedInvestment === "number"
            ? expectedInvestment
            : 0
          : typeof expansionInvestment === "number"
          ? expansionInvestment
          : 0,
      goal: mode === "start" ? goal : expansionGoal,
      ...(mode === "scale" && {
        currentBusiness,
        currentRevenue: typeof currentRevenue === "number" ? currentRevenue : 0,
        currentExpenses: typeof currentExpenses === "number" ? currentExpenses : 0,
        expansionInvestment: typeof expansionInvestment === "number" ? expansionInvestment : 0,
        expansionGoal,
      }),
      submittedAt: new Date().toISOString(),
    };

    // Store in localStorage for /intelligence consumption
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("lakshya_intake_payload", JSON.stringify(payload));
      } catch {
        // storage fallback
      }
    }

    setAnalyzingPayload(payload);
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = () => {
    router.push("/intelligence");
  };

  if (isAnalyzing && analyzingPayload) {
    return (
      <AnalysisProgress
        payload={analyzingPayload}
        onComplete={handleAnalysisComplete}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Mode Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 rounded-xl bg-slate-200/70 border border-slate-300/80">
        <div className="grid grid-cols-2 gap-1.5 flex-1">
          <button
            type="button"
            onClick={() => switchMode("start")}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all",
              mode === "start"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            )}
          >
            <Building className="h-4 w-4 text-blue-700" />
            <span>Start a Business</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode("scale")}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all",
              mode === "scale"
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            )}
          >
            <TrendingUp className="h-4 w-4 text-blue-700" />
            <span>Scale My Business</span>
          </button>
        </div>

        {/* Demo Data Quick Buttons for SIH Judges */}
        <div className="flex items-center gap-1.5 justify-end px-1">
          <button
            type="button"
            onClick={loadHonganurToyDemo}
            className="text-[11px] font-semibold text-blue-800 bg-white hover:bg-blue-50 border border-blue-200 rounded-md px-2.5 py-1.5 transition-colors flex items-center gap-1"
            title="Preload: Honganur Wooden Toys (Channapatna)"
          >
            <Sparkles className="h-3 w-3 text-blue-600" />
            <span>Fill Honganur Demo</span>
          </button>
          <button
            type="button"
            onClick={loadKadathanamaleAgroDemo}
            className="text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 transition-colors"
            title="Preload: Kadathanamale Oil Expeller (Yelahanka)"
          >
            <span>Kadathanamale</span>
          </button>
        </div>
      </div>

      {/* Main Intake Form Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-9 shadow-sm space-y-8">
        {/* Form Header */}
        <div className="space-y-2 pb-6 border-b border-slate-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {mode === "start" ? "Tell us about your business" : "Tell us about your existing business"}
            </h1>
            <DataBadge type="user" size="md" showTooltip />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            {mode === "start"
              ? "Share a few details about your idea. Lakshya will assess the local market, financial requirement and available financing options."
              : "Share details about your current turnover and expansion target. Lakshya will assess cluster capacity, additional working capital, and scheme eligibility."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7" noValidate>
          {/* SECTION A: LOCATION HIERARCHY */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <LocationFields
              location={location}
              onChange={setLocation}
              errors={{
                village: errors.village,
                taluk: errors.taluk,
                district: errors.district,
                state: errors.state,
              }}
            />
          </div>

          {/* SECTION B: BUSINESS IDEA / CURRENT VENTURE */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-100">
              <FileText className="h-4 w-4 text-blue-700" />
              <span>
                {mode === "start" ? "Business Concept & Description" : "Current Business Profile"}
              </span>
            </div>

            {mode === "start" ? (
              <div className="space-y-1.5">
                <label htmlFor="businessIdea" className="text-xs font-semibold text-slate-800">
                  What business do you want to start? <span className="text-red-500">*</span>
                </label>
                <input
                  id="businessIdea"
                  type="text"
                  value={businessIdea}
                  onChange={(e) => setBusinessIdea(e.target.value)}
                  placeholder="e.g. Wooden toy manufacturing, Solar cold storage, Dairy processing"
                  className={cn(
                    "w-full px-3.5 py-2.5 bg-white rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600",
                    errors.businessIdea ? "border-red-400 bg-red-50/20" : "border-slate-300 hover:border-slate-400"
                  )}
                />
                {errors.businessIdea ? (
                  <p className="text-xs text-red-600 font-medium">{errors.businessIdea}</p>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Enter the core trade, product, or micro-service you plan to establish.
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <label htmlFor="currentBusiness" className="text-xs font-semibold text-slate-800">
                  What is your existing business? <span className="text-red-500">*</span>
                </label>
                <input
                  id="currentBusiness"
                  type="text"
                  value={currentBusiness}
                  onChange={(e) => setCurrentBusiness(e.target.value)}
                  placeholder="e.g. Lacquerware wooden toys, Handloom weaving, Cold-pressed oil mill"
                  className={cn(
                    "w-full px-3.5 py-2.5 bg-white rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600",
                    errors.currentBusiness ? "border-red-400 bg-red-50/20" : "border-slate-300 hover:border-slate-400"
                  )}
                />
                {errors.currentBusiness && (
                  <p className="text-xs text-red-600 font-medium">{errors.currentBusiness}</p>
                )}
              </div>
            )}

            {/* SECTION C: DESCRIPTION (FOR NLP ENGINE) */}
            <div className="space-y-1.5">
              <label htmlFor="businessDescription" className="text-xs font-semibold text-slate-800">
                {mode === "start" ? "Tell us a little about your idea" : "Describe your current operations and expansion plan"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="businessDescription"
                rows={3}
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder={
                  mode === "start"
                    ? "e.g. I want to make traditional wooden toys and sell them through local shops, tourist markets, and online gifting platforms."
                    : "e.g. Currently running a small workshop with 3 artisans. We want to add an automatic wood turning lathe to increase daily output by 3x."
                }
                className={cn(
                  "w-full px-3.5 py-2.5 bg-white rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 leading-relaxed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600",
                  errors.businessDescription ? "border-red-400 bg-red-50/20" : "border-slate-300 hover:border-slate-400"
                )}
              />
              {errors.businessDescription ? (
                <p className="text-xs text-red-600 font-medium">{errors.businessDescription}</p>
              ) : (
                <p className="text-[11px] text-slate-500">
                  This description is processed by Lakshya&apos;s natural language advisory engine to extract operational scope.
                </p>
              )}
            </div>
          </div>

          {/* SCALE MODE SPECIFIC FINANCIAL PROFILE */}
          {mode === "scale" && (
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-200">
                Current Monthly Financial Performance
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CurrencyInput
                  id="currentRevenue"
                  label="Current Monthly Revenue"
                  value={currentRevenue}
                  onChange={setCurrentRevenue}
                  placeholder="e.g. 40,000"
                  helperText="Average total sales per month"
                  error={errors.currentRevenue}
                  required
                />

                <CurrencyInput
                  id="currentExpenses"
                  label="Current Monthly Expenses"
                  value={currentExpenses}
                  onChange={setCurrentExpenses}
                  placeholder="e.g. 26,000"
                  helperText="Raw materials, electricity, wages, rent"
                  error={errors.currentExpenses}
                  required
                />
              </div>
            </div>
          )}

          {/* SECTION D & E: FINANCIAL REQUIREMENTS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 pb-1 border-b border-slate-100">
              <Target className="h-4 w-4 text-blue-700" />
              <span>
                {mode === "start" ? "Capital & Investment Estimates" : "Expansion Financing Plan"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mode === "start" ? (
                <>
                  <CurrencyInput
                    id="availableCapital"
                    label="How much capital do you currently have?"
                    value={availableCapital}
                    onChange={setAvailableCapital}
                    placeholder="e.g. 50,000"
                    helperText="Your own savings / margin contribution"
                    error={errors.availableCapital}
                    required
                  />

                  <CurrencyInput
                    id="expectedInvestment"
                    label="What do you expect the business to cost?"
                    value={expectedInvestment}
                    onChange={setExpectedInvestment}
                    placeholder="e.g. 2,00,000"
                    helperText="Estimated total project cost (machinery + setup)"
                    error={errors.expectedInvestment}
                    required
                  />
                </>
              ) : (
                <>
                  <CurrencyInput
                    id="scaleAvailableCapital"
                    label="Available capital for expansion"
                    value={availableCapital}
                    onChange={setAvailableCapital}
                    placeholder="e.g. 80,000"
                    helperText="Retained profit or own funds for expansion"
                    error={errors.availableCapital}
                    required
                  />

                  <CurrencyInput
                    id="expansionInvestment"
                    label="Expected expansion investment"
                    value={expansionInvestment}
                    onChange={setExpansionInvestment}
                    placeholder="e.g. 3,50,000"
                    helperText="Cost of new equipment, renovation, or stock"
                    error={errors.expansionInvestment}
                    required
                  />
                </>
              )}
            </div>

            {/* Quick funding gap calculation readout */}
            {typeof availableCapital === "number" &&
              ((mode === "start" && typeof expectedInvestment === "number" && expectedInvestment > availableCapital) ||
                (mode === "scale" && typeof expansionInvestment === "number" && expansionInvestment > availableCapital)) && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                  <span>
                    Estimated Financing Gap (Bank Loan / Subsidy Needed):
                  </span>
                  <span className="font-bold text-sm text-blue-800">
                    ₹
                    {new Intl.NumberFormat("en-IN").format(
                      (mode === "start"
                        ? (expectedInvestment as number)
                        : (expansionInvestment as number)) - availableCapital
                    )}
                  </span>
                </div>
              )}
          </div>

          {/* SECTION F: BUSINESS GOAL / EXPANSION GOAL */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-800 block">
              {mode === "start" ? "What are you trying to achieve?" : "What is your primary expansion objective?"}{" "}
              <span className="text-red-500">*</span>
            </label>

            {mode === "start" ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "start_new",
                    label: "Start a new business",
                    desc: "Establish a fresh venture from scratch",
                  },
                  {
                    id: "additional_income",
                    label: "Create additional income",
                    desc: "Secondary source for household resilience",
                  },
                  {
                    id: "full_time_business",
                    label: "Build a full-time business",
                    desc: "Primary sustainable livelihood",
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      "flex flex-col p-3 rounded-lg border cursor-pointer transition-all",
                      goal === item.id
                        ? "border-blue-600 bg-blue-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{item.label}</span>
                      <input
                        type="radio"
                        name="businessGoal"
                        value={item.id}
                        checked={goal === item.id}
                        onChange={() => setGoal(item.id)}
                        className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 leading-snug">{item.desc}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "machinery_automation",
                    label: "Purchase machinery & automate",
                    desc: "Enhance output speed and reduce unit cost",
                  },
                  {
                    id: "new_product_line",
                    label: "Add new product line",
                    desc: "Diversify into higher-margin variants",
                  },
                  {
                    id: "expand_market_reach",
                    label: "Expand market reach",
                    desc: "Supply beyond village to district/state",
                  },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      "flex flex-col p-3 rounded-lg border cursor-pointer transition-all",
                      expansionGoal === item.id
                        ? "border-blue-600 bg-blue-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{item.label}</span>
                      <input
                        type="radio"
                        name="expansionGoal"
                        value={item.id}
                        checked={expansionGoal === item.id}
                        onChange={() => setExpansionGoal(item.id)}
                        className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 leading-snug">{item.desc}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* FORM ACTION BAR */}
          <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear Inputs</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8 font-bold text-base shadow-sm"
              >
                <span>Analyze My Business →</span>
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Trust & Methodology Notice */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
        <HelpCircle className="h-4 w-4 text-blue-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-slate-800">
            How Lakshya processes your information:
          </p>
          <p className="leading-relaxed">
            Your inputs are cross-referenced with official MSME block trade volumes, PMEGP subsidy slabs (25%–35%), and district lead bank guidelines to structure a bankable feasibility plan.
          </p>
        </div>
      </div>
    </div>
  );
}
