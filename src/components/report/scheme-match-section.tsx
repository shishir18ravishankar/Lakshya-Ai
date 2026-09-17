import React from "react";
import { SchemeMatchData } from "@/types/verdict";
import { DataBadge } from "@/components/ui/data-badge";
import { formatINR } from "@/lib/utils";
import { Landmark, CheckCircle2, FileText, AlertCircle, ShieldCheck } from "lucide-react";

interface SchemeMatchSectionProps {
  schemeMatch?: SchemeMatchData | null;
}

export function SchemeMatchSection({ schemeMatch }: SchemeMatchSectionProps) {
  if (!schemeMatch || (!schemeMatch.scheme && !schemeMatch.primaryScheme?.name && !schemeMatch.tier)) {
    return (
      <section aria-labelledby="scheme-match-heading" className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Section 8
                </span>
                <span className="text-slate-300">•</span>
                <h2 id="scheme-match-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-amber-700" />
                  <span>Scheme Match</span>
                </h2>
              </div>
            </div>
            <DataBadge type="verified" size="sm" showTooltip />
          </div>

          <div className="p-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center space-y-2">
            <AlertCircle className="h-5 w-5 text-slate-400 mx-auto" />
            <p className="text-sm font-medium text-slate-700">
              Information unavailable for this section.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Institutional scheme matching rules require additional demographic parameters.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const schemeName = schemeMatch.scheme || schemeMatch.primaryScheme?.name || "Target Institutional Framework";
  const tier = schemeMatch.tier;
  const applicableAmount = schemeMatch.applicableAmount;
  const interest = schemeMatch.interest;
  const tenure = schemeMatch.tenure;
  const moratorium = schemeMatch.moratorium;
  const explanation = schemeMatch.explanation || schemeMatch.description || schemeMatch.primaryScheme?.description;
  const nodalAgency = schemeMatch.nodalAgency || schemeMatch.primaryScheme?.nodalAgency;
  const eligibility = schemeMatch.eligibilityCriteria || schemeMatch.primaryScheme?.eligibilityCriteria;
  const documentation = schemeMatch.documentationRequired || schemeMatch.primaryScheme?.documentationRequired;
  const secondarySchemes = schemeMatch.secondarySchemes;

  const getTierBadge = () => {
    switch (tier) {
      case "Micro Finance Scheme":
        return "bg-blue-100 text-blue-900 border-blue-200";
      case "Term Loan Scheme":
        return "bg-emerald-100 text-emerald-900 border-emerald-200";
      case "Outside Scheme / Flagged":
        return "bg-rose-100 text-rose-900 border-rose-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <section aria-labelledby="scheme-match-heading" className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Section 8
              </span>
              <span className="text-slate-300">•</span>
              <h2 id="scheme-match-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Landmark className="h-4 w-4 text-amber-700" />
                <span>Scheme Match</span>
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Matched against Central and State institutional MSME support frameworks for rural micro-units.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DataBadge type="verified" size="sm" showTooltip />
            <DataBadge type="ai" size="sm" showTooltip />
          </div>
        </div>

        {/* Primary Scheme Feature Box */}
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50/30 p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                {tier && (
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${getTierBadge()}`}>
                    {tier}
                  </span>
                )}
                {nodalAgency && (
                  <span className="text-xs font-semibold text-slate-600">
                    Nodal Agency: {nodalAgency}
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {schemeName}
              </h3>
              {explanation && (
                <p className="text-xs text-slate-700 leading-relaxed">
                  {explanation}
                </p>
              )}
            </div>

            {applicableAmount !== undefined && (
              <div className="shrink-0 bg-white p-3.5 rounded-lg border border-blue-200 text-center sm:min-w-[160px] shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Applicable Sanction
                </span>
                <span className="text-2xl font-black text-emerald-700">
                  {formatINR(applicableAmount)}
                </span>
                <span className="text-[10px] font-semibold text-slate-600 block mt-0.5">
                  Term / Margin Allocation
                </span>
              </div>
            )}
          </div>

          {/* Scheme Parameters Bar: Interest, Tenure, Moratorium */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {interest !== undefined && (
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Interest Rate</span>
                <span className="text-sm font-extrabold text-blue-700">
                  {typeof interest === "number" ? `${interest}% p.a.` : interest}
                </span>
              </div>
            )}
            {tenure !== undefined && (
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Tenure</span>
                <span className="text-sm font-extrabold text-slate-900">
                  {typeof tenure === "number" ? `${tenure} Months` : tenure}
                </span>
              </div>
            )}
            {moratorium !== undefined && (
              <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Moratorium</span>
                <span className="text-sm font-extrabold text-amber-700">
                  {typeof moratorium === "number" ? `${moratorium} Months` : moratorium}
                </span>
              </div>
            )}
          </div>

          {/* Eligibility & Documentation */}
          {(eligibility?.length || documentation?.length) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-blue-200/60">
              {eligibility && eligibility.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-700" />
                    <span>Eligibility Criteria</span>
                  </span>
                  <ul className="space-y-1.5">
                    {eligibility.map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                        <span className="leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {documentation && documentation.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-blue-700" />
                    <span>Required Documentation Checklist</span>
                  </span>
                  <ul className="space-y-1.5">
                    {documentation.map((doc, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span className="leading-tight">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Secondary Schemes if available */}
        {secondarySchemes && secondarySchemes.length > 0 && (
          <div className="space-y-3 pt-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
              <span>Complementary Credit Support & Guarantee Schemes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {secondarySchemes.map((scheme, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs space-y-1.5"
                >
                  <span className="text-xs font-bold text-slate-900 leading-snug block">
                    {scheme.name}
                  </span>
                  {scheme.agency && (
                    <p className="text-[10px] text-slate-500 font-mono">
                      {scheme.agency}
                    </p>
                  )}
                  <p className="text-xs text-slate-700 pt-1 leading-snug">
                    {scheme.benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
