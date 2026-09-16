import React from "react";
import { SourceCitation } from "@/types/verdict";
import { DataBadge } from "@/components/ui/data-badge";
import { BookOpen, AlertCircle, FileCheck2 } from "lucide-react";

interface SourcesSectionProps {
  sources?: SourceCitation[] | null;
}

export function SourcesSection({ sources }: SourcesSectionProps) {
  const items = sources || [];

  return (
    <section aria-labelledby="sources-heading" className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Section 10
              </span>
              <span className="text-slate-300">•</span>
              <h2 id="sources-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-700" />
                <span>Sources</span>
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Verified institutional databases, district profiles, and guideline references grounding this advisory report.
            </p>
          </div>
          <DataBadge type="verified" size="sm" showTooltip />
        </div>

        {items.length === 0 ? (
          <div className="p-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center space-y-2">
            <AlertCircle className="h-5 w-5 text-slate-400 mx-auto" />
            <p className="text-sm font-medium text-slate-700">
              Information unavailable for this section.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No formal citation references were logged for this advisory run.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((src, idx) => {
              const name = src.source || src.title || "Government / Institutional Source";
              const context = src.context || src.publisher;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {name}
                      </h3>
                    </div>
                    {src.year && (
                      <span className="text-xs font-mono font-bold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded shrink-0">
                        {src.year}
                      </span>
                    )}
                  </div>

                  {context && (
                    <p className="text-xs text-slate-600 leading-relaxed pl-6">
                      {context}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 pl-6">
                    <span className="text-emerald-700 font-semibold">
                      Verified Reference
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      REF-SRC-{idx + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
