import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient" | "danger" | "gov";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, href, children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]";

    const variants = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm border border-blue-700/20",
      secondary: "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-sm",
      gov: "bg-slate-900 hover:bg-slate-800 text-white shadow-sm border border-slate-900",
      outline: "bg-transparent hover:bg-slate-100 text-slate-700 border border-slate-300",
      ghost: "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900",
      gradient: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm", // Solid, dependable professional blue
      danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm"
    };

    const sizes = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-11 px-5 text-sm sm:text-base gap-2",
      icon: "h-9 w-9 p-0"
    };

    const combinedClass = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
      return (
        <Link href={href} className={combinedClass}>
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClass}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
