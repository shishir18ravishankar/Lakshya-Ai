import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "tech" | "learning" | "career" | "health" | "success" | "warning" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    tech: "bg-blue-50 text-blue-700 border-blue-200",
    learning: "bg-indigo-50 text-indigo-700 border-indigo-200",
    career: "bg-slate-100 text-slate-800 border-slate-300",
    health: "bg-emerald-50 text-emerald-800 border-emerald-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    outline: "bg-transparent text-slate-600 border-slate-300"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border tracking-wide transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
