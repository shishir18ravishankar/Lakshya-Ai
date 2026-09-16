import * as React from "react";
import { cn, formatINRWords } from "@/lib/utils";

export interface CurrencyInputProps {
  id: string;
  label: string;
  value: number | "";
  onChange: (value: number | "") => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export function CurrencyInput({
  id,
  label,
  value,
  onChange,
  placeholder = "e.g. 50,000",
  helperText,
  error,
  required = false,
}: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw === "") {
      onChange("");
    } else {
      const num = parseInt(raw, 10);
      onChange(isNaN(num) ? "" : num);
    }
  };

  const formattedDisplay =
    value !== "" && typeof value === "number"
      ? new Intl.NumberFormat("en-IN").format(value)
      : "";

  const words = typeof value === "number" ? formatINRWords(value) : "";

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold text-slate-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {words && (
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            ≈ ₹{words}
          </span>
        )}
      </div>

      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-semibold text-sm">
          ₹
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={formattedDisplay}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "w-full pl-8 pr-3.5 py-2.5 bg-white rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600",
            error ? "border-red-400 bg-red-50/20" : "border-slate-300 hover:border-slate-400"
          )}
        />
      </div>

      {error ? (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500 leading-snug">{helperText}</p>
      ) : null}
    </div>
  );
}
