import * as React from "react";
import { CheckCircle2, Calculator, UserCheck, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type DataBadgeType = "verified" | "ai" | "user";

export interface DataBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: DataBadgeType;
  size?: "sm" | "md";
  showTooltip?: boolean;
}

const BADGE_CONFIG = {
  verified: {
    label: "Verified Data",
    icon: CheckCircle2,
    dotColor: "bg-emerald-600",
    styles: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70",
    description: "Sourced from government registries, MSME cluster handbooks, and official district census."
  },
  ai: {
    label: "AI Estimate",
    icon: Calculator,
    dotColor: "bg-amber-600",
    styles: "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100/70",
    description: "Calculated projection based on regional demand trends and economic modeling."
  },
  user: {
    label: "User Input",
    icon: UserCheck,
    dotColor: "bg-blue-600",
    styles: "bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100/70",
    description: "Provided directly by the entrepreneur during initial profiling."
  }
};

export function DataBadge({
  type,
  size = "md",
  showTooltip = false,
  className,
  ...props
}: DataBadgeProps) {
  const config = BADGE_CONFIG[type];
  const Icon = config.icon;

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px] gap-1.5" : "px-2.5 py-1 text-xs gap-1.5";

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-md border tracking-tight transition-colors group select-none",
        config.styles,
        sizeClasses,
        className
      )}
      title={showTooltip ? config.description : undefined}
      {...props}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", config.dotColor)} />
      <Icon className="h-3 w-3 shrink-0 opacity-85" />
      <span className="font-semibold">{config.label}</span>
      {showTooltip && <HelpCircle className="h-3 w-3 opacity-40 ml-0.5" />}
    </span>
  );
}
