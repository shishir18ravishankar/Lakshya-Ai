import React from "react";
import { CheckCircle2, Layers, Palette, Terminal, ShieldCheck, Box } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function StatusChecklist() {
  const items = [
    { title: "Next.js 14 App Router", status: "Active", desc: "Using latest app directory routing pattern", icon: Layers },
    { title: "TypeScript Strict Typing", status: "Ready", desc: "Standard interfaces defined in @/types", icon: ShieldCheck },
    { title: "Tailwind CSS & Design Tokens", status: "Styled", desc: "Dark theme and glassmorphism configured", icon: Palette },
    { title: "Reusable Component Primitives", status: "Available", desc: "Button, Card, Badge, Input, ProgressBar ready", icon: Box },
    { title: "UI Asset Preservation", status: "Preserved", desc: "Banner asset mounted under /banner.jpg & /public", icon: Terminal },
  ];

  return (
    <Card className="border-indigo-500/20 bg-slate-900/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-400" />
            Frontend Architecture Readiness
          </CardTitle>
          <Badge variant="tech">SIH 2026 Ready</Badge>
        </div>
        <CardDescription>
          Baseline scaffolding initialized for the UI/UX team. Backend and database logic are intentionally decoupled.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-200">{item.title}</span>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
