import * as React from "react";
import { CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

export type VerdictType = "proceed" | "review" | "risk";

export interface VerdictBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  verdict: VerdictType;
  size?: "sm" | "md" | "lg";
  withSubtext?: boolean;
}

const VERDICT_CONFIG = {
  proceed: {
    label: "PROCEED",
    subtext: "High viability, strong local demand match",
    icon: CheckCircle2,
    pillStyles: "bg-emerald-50 text-emerald-900 border-emerald-300 shadow-sm",
    dotStyles: "bg-emerald-600",
  },
  review: {
    label: "REVIEW",
    subtext: "Moderate feasibility, adjust cost or capacity",
    icon: AlertTriangle,
    pillStyles: "bg-amber-50 text-amber-900 border-amber-300 shadow-sm",
    dotStyles: "bg-amber-600",
  },
  risk: {
    label: "HIGH RISK",
    subtext: "Severe margin pressure or high saturation",
    icon: AlertOctagon,
    pillStyles: "bg-rose-50 text-rose-900 border-rose-300 shadow-sm",
    dotStyles: "bg-rose-600",
  }
};

export function VerdictBadge({
  verdict,
  size = "md",
  withSubtext = false,
  className,
  ...props
}: VerdictBadgeProps) {
  const config = VERDICT_CONFIG[verdict];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs gap-1.5 font-bold",
    md: "px-3.5 py-1.5 text-xs sm:text-sm gap-2 font-bold tracking-wide",
    lg: "px-5 py-2 text-sm sm:text-base gap-2.5 font-extrabold tracking-wide"
  };

  return (
    <div className={cn("inline-flex flex-col items-start gap-1", className)} {...props}>
      <div
        className={cn(
          "inline-flex items-center rounded-lg border uppercase select-none",
          config.pillStyles,
          sizeClasses[size]
        )}
      >
        <span className={cn("h-2 w-2 rounded-full shrink-0", config.dotStyles)} />
        <Icon className={cn(size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5", "shrink-0 opacity-90")} />
        <span>{config.label}</span>
      </div>
      {withSubtext && (
        <span className="text-xs text-slate-500 font-sans tracking-normal pl-0.5">
          {config.subtext}
        </span>
      )}
    </div>
  );
}
