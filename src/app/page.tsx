import React from "react";
import { 
  ArrowRight, 
  MapPin, 
  Coins, 
  Landmark, 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck2, 
  ChevronRight,
  Sparkles,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DataBadge } from "@/components/ui/data-badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { HeroDashboardPreview } from "@/components/landing/hero-dashboard-preview";
import { VerdictPreviewCard } from "@/components/landing/verdict-preview-card";

export default function LandingPage() {
  const steps = [
    {
      num: "01",
      title: "Tell Us Your Idea",
      desc: "Share your business concept, target location (block and district), and available capital.",
      icon: Layers
    },
    {
      num: "02",
      title: "Understand Your Local Market",
      desc: "Review verified customer demand, competitor density, and pricing dynamics in your taluka.",
      icon: MapPin
    },
    {
      num: "03",
      title: "Plan Your Investment",
      desc: "Calculate required machinery CapEx, recurring working capital, unit margins, and break-even.",
      icon: Coins
    },
    {
      num: "04",
      title: "Explore Financing & Schemes",
      desc: "Map eligible government subsidies under PMEGP, MUDRA, Stand-Up India, and state policies.",
      icon: Landmark
    },
    {
      num: "05",
      title: "Get Your Lakshya",
      desc: "Receive a bank-ready advisory dossier with a single, clear decision: Proceed, Review, or High Risk.",
      icon: FileCheck2
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* ========================================================================= */}
      {/* 2. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Value Proposition & Grounded Institutional Copy */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span>Smart India Hackathon 2026</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-normal">Rural Micro-Enterprise Advisory</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.18]">
                Start Smart. <br />
                <span className="text-blue-700">Scale Smarter.</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
                Turn your business idea into a data-backed plan — using hyper-local intelligence, financial planning, and government scheme guidance.
              </p>
            </div>

            {/* CTAs: Solid professional blue primary + White with subtle navy/blue border secondary */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Button href="/input" variant="primary" size="lg">
                <span>Start a Business</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
              <Button href="/input" variant="secondary" size="lg">
                <span>Start Planning</span>
              </Button>
            </div>

            {/* Credibility Notes */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Tailored for Rural Talukas
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                PMEGP & MUDRA Integrated
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-slate-600" />
                Zero Jargon
              </span>
            </div>
          </div>

          {/* Right Column: Clean Institutional Dashboard Preview (NOT a Chatbot) */}
          <div className="lg:col-span-6">
            <HeroDashboardPreview />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TRUST / DATA STRIP                                                     */}
      {/* ========================================================================= */}
      <section className="relative">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-700 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Built on verified data + AI intelligence
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                We clearly distinguish between government/source-backed information, AI-generated estimates, and information provided by the entrepreneur.
              </p>
            </div>

            {/* Badges Display Strip */}
            <div className="flex flex-wrap items-center gap-2.5">
              <DataBadge type="verified" size="md" showTooltip />
              <DataBadge type="ai" size="md" showTooltip />
              <DataBadge type="user" size="md" showTooltip />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS (From Idea to Action - 5 Step Process)                    */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="scroll-mt-24 space-y-10">
        <SectionHeading
          kicker="Advisory Process"
          title="From Idea to Action"
          description="A structured, 5-step methodology that replaces guesswork with rigorous local feasibility."
        />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="flex flex-col p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-blue-300 transition-colors duration-150"
              >
                {/* Step Header */}
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    Step {step.num}
                  </span>
                  <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                  {step.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed mt-auto">
                  {step.desc}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-medium text-slate-500">
                  <span>Phase {step.num}</span>
                  <ChevronRight className="h-3 w-3 ml-auto text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PRODUCT CAPABILITIES (3 Professional Cards)                            */}
      {/* ========================================================================= */}
      <section id="intelligence" className="scroll-mt-24 space-y-10">
        <SectionHeading
          kicker="Core Capabilities"
          title="Designed for Ground-Level Economic Realities"
          description="Empowering rural entrepreneurs, Self-Help Groups (SHGs), and micro-enterprises with institutional-grade viability analysis."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Hyper-Local Intelligence */}
          <Card className="flex flex-col border-slate-200 bg-white hover:border-slate-300 transition-colors">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <DataBadge type="verified" size="sm" />
              </div>
              <CardTitle className="text-base sm:text-lg">Hyper-Local Intelligence</CardTitle>
              <CardDescription className="text-slate-700 font-medium">
                &ldquo;Understand local demand, competitors, customer segments, pricing opportunities and risks.&rdquo;
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2 text-xs text-slate-600 mt-auto">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-700 font-medium">
                  <span>Taluka Demand Density</span>
                  <span className="text-blue-800 font-semibold">High (12km radius)</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 font-medium">
                  <span>Cluster Saturation</span>
                  <span className="text-emerald-700 font-semibold">Low (2 Competitors)</span>
                </div>
              </div>
              <p className="leading-relaxed">
                Aggregates census data, weekly haat trading indicators, and rural retail benchmarks to validate product viability.
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Financial Planning */}
          <section id="financial-planning" className="scroll-mt-24 flex flex-col">
            <Card className="flex-1 flex flex-col border-slate-200 bg-white hover:border-slate-300 transition-colors">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                    <Coins className="h-5 w-5" />
                  </div>
                  <DataBadge type="ai" size="sm" />
                </div>
                <CardTitle className="text-base sm:text-lg">Financial Planning</CardTitle>
                <CardDescription className="text-slate-700 font-medium">
                  &ldquo;See investment requirements, funding gaps, quarterly repayments, monthly profit and break-even.&rdquo;
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2 text-xs text-slate-600 mt-auto">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-slate-700 font-medium">
                    <span>Estimated Break-even</span>
                    <span className="text-blue-800 font-semibold">Month 4.5</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 font-medium">
                    <span>Debt Service Coverage (DSCR)</span>
                    <span className="text-emerald-700 font-semibold">1.82 (Bankable)</span>
                  </div>
                </div>
                <p className="leading-relaxed">
                  Generates a bankable capital stack structuring own equity margin, working capital requirements, and projected monthly net surplus.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Card 3: Government Schemes */}
          <Card className="flex flex-col border-slate-200 bg-white hover:border-slate-300 transition-colors">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                  <Landmark className="h-5 w-5" />
                </div>
                <DataBadge type="verified" size="sm" />
              </div>
              <CardTitle className="text-base sm:text-lg">Government Schemes</CardTitle>
              <CardDescription className="text-slate-700 font-medium">
                &ldquo;Identify relevant government financing and support opportunities.&rdquo;
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2 text-xs text-slate-600 mt-auto">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-slate-700 font-medium">
                  <span>PMEGP Rural Subsidy</span>
                  <span className="text-emerald-700 font-semibold">25% - 35% Grant</span>
                </div>
                <div className="flex items-center justify-between text-slate-700 font-medium">
                  <span>MUDRA Scheme Category</span>
                  <span className="text-blue-800 font-semibold">Kishore (Up to ₹5L)</span>
                </div>
              </div>
              <p className="leading-relaxed">
                Rules-based matchmaker filters central and state subsidies, identifying collateral-free credit eligibility and margin money reductions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SINGLE-VERDICT SECTION (Visual preview of the final Lakshya report)    */}
      {/* ========================================================================= */}
      <section id="verdict" className="scroll-mt-24 space-y-10">
        <SectionHeading
          kicker="Advisory Output"
          title="One Clear Direction."
          description="Entrepreneurs do not need confusing 40-page spreadsheets. They need a definitive, trusted verdict backed by practical financial structuring."
        />

        <VerdictPreviewCard />
      </section>

      {/* ========================================================================= */}
      {/* 7. FINAL CTA                                                              */}
      {/* ========================================================================= */}
      <section id="about" className="scroll-mt-24 relative">
        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-8 sm:p-12 text-center shadow-sm">
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-blue-200 text-blue-900 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Smart India Hackathon 2026 Initiative</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Your next business decision starts here.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Whether you are launching a new village agro-processing enterprise or scaling an existing handloom workshop, get instant local intelligence and financing blueprints.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button href="/input" variant="primary" size="lg" className="w-full sm:w-auto px-8">
                <span>Start a Business</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
              <Button href="/input" variant="secondary" size="lg" className="w-full sm:w-auto">
                <span>Start Planning</span>
              </Button>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              Public service prototype for rural micro-entrepreneurs • SIH 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
