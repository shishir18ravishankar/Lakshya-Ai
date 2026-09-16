import * as React from "react";
import { MapPin } from "lucide-react";
import { LocationHierarchy } from "@/types";
import { cn } from "@/lib/utils";

export interface LocationFieldsProps {
  location: LocationHierarchy;
  onChange: (updated: LocationHierarchy) => void;
  errors?: Partial<Record<keyof LocationHierarchy, string>>;
}

export function LocationFields({
  location,
  onChange,
  errors = {},
}: LocationFieldsProps) {
  const updateField = (field: keyof LocationHierarchy, value: string) => {
    onChange({
      ...location,
      [field]: value,
    });
  };

  const applyPreset = (preset: LocationHierarchy) => {
    onChange(preset);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <MapPin className="h-4 w-4 text-blue-700" />
          <span>Location Hierarchy (Block / Taluka)</span>
        </div>

        {/* Quick Demo Location Fillers */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Presets:</span>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                village: "Honganur",
                gramPanchayat: "Honganur GP",
                taluk: "Channapatna",
                district: "Ramanagara",
                state: "Karnataka",
              })
            }
            className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors"
          >
            Honganur, Channapatna
          </button>
          <button
            type="button"
            onClick={() =>
              applyPreset({
                village: "Kadathanamale",
                gramPanchayat: "Kadathanamale GP",
                taluk: "Yelahanka",
                district: "Bengaluru Rural",
                state: "Karnataka",
              })
            }
            className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 transition-colors"
          >
            Kadathanamale, Bengaluru Rural
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Village / Gram Panchayat */}
        <div className="space-y-1">
          <label htmlFor="loc-village" className="text-xs font-semibold text-slate-800">
            Village / Gram Panchayat <span className="text-red-500">*</span>
          </label>
          <input
            id="loc-village"
            type="text"
            value={location.village}
            onChange={(e) => updateField("village", e.target.value)}
            placeholder="e.g. Honganur or Kadathanamale"
            className={cn(
              "w-full px-3 py-2 bg-white rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600",
              errors.village ? "border-red-400 bg-red-50/20" : "border-slate-300 hover:border-slate-400"
            )}
          />
          {errors.village && <p className="text-xs text-red-600 font-medium">{errors.village}</p>}
        </div>

        {/* Taluk / Block */}
        <div className="space-y-1">
          <label htmlFor="loc-taluk" className="text-xs font-semibold text-slate-800">
            Taluk / Block <span className="text-red-500">*</span>
          </label>
          <input
            id="loc-taluk"
            type="text"
            value={location.taluk}
            onChange={(e) => updateField("taluk", e.target.value)}
            placeholder="e.g. Channapatna"
            className={cn(
              "w-full px-3 py-2 bg-white rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600",
              errors.taluk ? "border-red-400 bg-red-50/20" : "border-slate-300 hover:border-slate-400"
            )}
          />
          {errors.taluk && <p className="text-xs text-red-600 font-medium">{errors.taluk}</p>}
        </div>

        {/* District */}
        <div className="space-y-1">
          <label htmlFor="loc-district" className="text-xs font-semibold text-slate-800">
            District <span className="text-red-500">*</span>
          </label>
          <input
            id="loc-district"
            type="text"
            value={location.district}
            onChange={(e) => updateField("district", e.target.value)}
            placeholder="e.g. Ramanagara"
            className={cn(
              "w-full px-3 py-2 bg-white rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600",
              errors.district ? "border-red-400 bg-red-50/20" : "border-slate-300 hover:border-slate-400"
            )}
          />
          {errors.district && <p className="text-xs text-red-600 font-medium">{errors.district}</p>}
        </div>

        {/* State */}
        <div className="space-y-1">
          <label htmlFor="loc-state" className="text-xs font-semibold text-slate-800">
            State <span className="text-red-500">*</span>
          </label>
          <input
            id="loc-state"
            type="text"
            value={location.state}
            onChange={(e) => updateField("state", e.target.value)}
            placeholder="e.g. Karnataka"
            className={cn(
              "w-full px-3 py-2 bg-white rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600",
              errors.state ? "border-red-400 bg-red-50/20" : "border-slate-300 hover:border-slate-400"
            )}
          />
          {errors.state && <p className="text-xs text-red-600 font-medium">{errors.state}</p>}
        </div>
      </div>

      <p className="text-[11px] text-slate-500 leading-snug">
        Hyper-local demand, haat market trading volumes, and PMEGP subsidy ratios are evaluated at the Taluka & District level.
      </p>
    </div>
  );
}
