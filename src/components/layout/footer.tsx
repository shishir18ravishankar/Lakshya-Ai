import React from "react";
import { Compass, ShieldAlert, BookOpen, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Compass className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">
                LAKSHYA <span className="text-blue-600">AI</span>
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800">
              &ldquo;Start Smart. Scale Smarter.&rdquo;
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant designed for rural micro-entrepreneurs. Developed for Smart India Hackathon 2026.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Platform Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="/#intelligence" className="hover:text-slate-900 transition-colors">Hyper-Local Intelligence</a>
              </li>
              <li>
                <a href="/#financial-planning" className="hover:text-slate-900 transition-colors">Financial Structuring</a>
              </li>
              <li>
                <a href="/#verdict" className="hover:text-slate-900 transition-colors">Sample Advisory Report</a>
              </li>
            </ul>
          </div>

          {/* Governance & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Governance & Integrity
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#disclaimer" className="hover:text-slate-900 transition-colors">Advisory Disclaimer</a>
              </li>
              <li>
                <a href="#sources" className="hover:text-slate-900 transition-colors">Verified Data Sources</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-slate-900 transition-colors">Data Privacy Guidelines</a>
              </li>
              <li>
                <a
                  href="https://github.com/shishir18ravishankar/Lakshya-Ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1 text-slate-700 font-medium"
                >
                  GitHub Repository <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Informational Gov-tech Disclaimer & Sources Row */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-slate-500 leading-relaxed">
          <div id="disclaimer" className="space-y-1">
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
              Advisory Disclaimer:
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lakshya AI is a strategic decision-support platform designed for Smart India Hackathon 2026. Advisory evaluations, subsidy eligibility, and debt servicing projections are for financial planning purposes and do not represent a formal sanction or credit commitment from any financial institution.
            </p>
          </div>

          <div id="sources" className="space-y-1">
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-blue-600" />
              Institutional Benchmarks:
            </span>
            <p>
              Scheme parameters and margin rules are derived from published guidelines of the Ministry of MSME, KVIC (PMEGP), NABARD, and Pradhan Mantri MUDRA Yojana (PMMY).
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 LAKSHYA AI • Smart India Hackathon 2026. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span id="privacy" className="hover:text-slate-800 cursor-pointer">Privacy</span>
            <span>•</span>
            <span>Terms of Use</span>
            <span>•</span>
            <span className="text-blue-600 font-medium">SIH Prototype</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
