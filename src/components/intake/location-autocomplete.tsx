"use client";

import React, { useState, useEffect, useRef, useId, useCallback } from "react";
import { MapPin, Search, X, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LocationSuggestion {
  id: string;
  primaryName: string;
  administrativeContext: string;
  fullFormatted: string;
  type: "village" | "town" | "taluk" | "district" | "cluster";
  state: string;
}

/**
 * Curated offline repository of Indian rural/semi-urban locations,
 * artisanal craft hubs, and agro-processing clusters.
 */
export const LOCAL_LOCATION_DATABASE: LocationSuggestion[] = [
  // Mandatory demo locations
  {
    id: "loc-honganur",
    primaryName: "Honganur",
    administrativeContext: "Channapatna Taluk, Ramanagara District, Karnataka",
    fullFormatted: "Honganur, Channapatna, Karnataka",
    type: "village",
    state: "Karnataka",
  },
  {
    id: "loc-kadathanamale",
    primaryName: "Kadathanamale",
    administrativeContext: "Yelahanka Taluk, Bengaluru Rural District, Karnataka",
    fullFormatted: "Kadathanamale, Bengaluru Rural, Karnataka",
    type: "village",
    state: "Karnataka",
  },
  {
    id: "loc-channapatna",
    primaryName: "Channapatna",
    administrativeContext: "Toy & Craft Industrial Hub, Ramanagara District, Karnataka",
    fullFormatted: "Channapatna, Karnataka",
    type: "cluster",
    state: "Karnataka",
  },
  {
    id: "loc-ramanagara",
    primaryName: "Ramanagara",
    administrativeContext: "District Headquarters, Silk & Cocoon Market, Karnataka",
    fullFormatted: "Ramanagara District, Karnataka",
    type: "district",
    state: "Karnataka",
  },
  {
    id: "loc-kanakapura",
    primaryName: "Kanakapura",
    administrativeContext: "Rural Agro & Granite Quarry Taluk, Ramanagara, Karnataka",
    fullFormatted: "Kanakapura, Ramanagara, Karnataka",
    type: "taluk",
    state: "Karnataka",
  },
  {
    id: "loc-magadi",
    primaryName: "Magadi",
    administrativeContext: "Rural Agrarian & Coir Belt, Ramanagara, Karnataka",
    fullFormatted: "Magadi, Ramanagara, Karnataka",
    type: "taluk",
    state: "Karnataka",
  },
  {
    id: "loc-doddaballapura",
    primaryName: "Doddaballapura",
    administrativeContext: "Powerloom & Silk Weaving Industrial Cluster, Bengaluru Rural",
    fullFormatted: "Doddaballapura, Bengaluru Rural, Karnataka",
    type: "cluster",
    state: "Karnataka",
  },
  {
    id: "loc-devanahalli",
    primaryName: "Devanahalli",
    administrativeContext: "Rural Horticulture & Pomelo GI Cluster, Bengaluru Rural",
    fullFormatted: "Devanahalli, Bengaluru Rural, Karnataka",
    type: "taluk",
    state: "Karnataka",
  },
  {
    id: "loc-hoskote",
    primaryName: "Hoskote",
    administrativeContext: "Rural Dairy & Auto Ancillary Corridor, Bengaluru Rural",
    fullFormatted: "Hoskote, Bengaluru Rural, Karnataka",
    type: "town",
    state: "Karnataka",
  },
  {
    id: "loc-nelamangala",
    primaryName: "Nelamangala",
    administrativeContext: "Logistics & Food Processing Junction, Bengaluru Rural",
    fullFormatted: "Nelamangala, Bengaluru Rural, Karnataka",
    type: "taluk",
    state: "Karnataka",
  },
  {
    id: "loc-kolar",
    primaryName: "Kolar",
    administrativeContext: "Gold Fields & High-Density Dairy / Tomato Market, Karnataka",
    fullFormatted: "Kolar, Karnataka",
    type: "district",
    state: "Karnataka",
  },
  {
    id: "loc-malur",
    primaryName: "Malur",
    administrativeContext: "Tiles, Pottery & Floriculture Taluk, Kolar, Karnataka",
    fullFormatted: "Malur, Kolar, Karnataka",
    type: "taluk",
    state: "Karnataka",
  },
  {
    id: "loc-mandya",
    primaryName: "Mandya",
    administrativeContext: "Sugarcane, Jaggery & Agro-Processing Hub, Karnataka",
    fullFormatted: "Mandya, Karnataka",
    type: "district",
    state: "Karnataka",
  },
  {
    id: "loc-maddur",
    primaryName: "Maddur",
    administrativeContext: "Tender Coconut & Rural Milling Center, Mandya, Karnataka",
    fullFormatted: "Maddur, Mandya, Karnataka",
    type: "taluk",
    state: "Karnataka",
  },
  {
    id: "loc-tiptur",
    primaryName: "Tiptur",
    administrativeContext: "Copra & Coconut Wholesale APMC Hub, Tumakuru, Karnataka",
    fullFormatted: "Tiptur, Tumakuru, Karnataka",
    type: "cluster",
    state: "Karnataka",
  },
  {
    id: "loc-ilkal",
    primaryName: "Ilkal",
    administrativeContext: "Traditional Handloom Saree GI Weaving Cluster, Bagalkote",
    fullFormatted: "Ilkal, Bagalkote, Karnataka",
    type: "cluster",
    state: "Karnataka",
  },
  {
    id: "loc-kinhal",
    primaryName: "Kinhal",
    administrativeContext: "Heritage Wooden Lacquerware Toy Village, Koppal, Karnataka",
    fullFormatted: "Kinhal, Koppal, Karnataka",
    type: "village",
    state: "Karnataka",
  },
  {
    id: "loc-dharwad",
    primaryName: "Dharwad Rural",
    administrativeContext: "Pedha Confectionery & Agro-Seed Hub, Karnataka",
    fullFormatted: "Dharwad Rural, Karnataka",
    type: "taluk",
    state: "Karnataka",
  },
  {
    id: "loc-sirsi",
    primaryName: "Sirsi",
    administrativeContext: "Spices & Arecanut Forest Produce Taluk, Uttara Kannada",
    fullFormatted: "Sirsi, Uttara Kannada, Karnataka",
    type: "taluk",
    state: "Karnataka",
  },
  {
    id: "loc-krishnagiri",
    primaryName: "Krishnagiri Rural",
    administrativeContext: "Mango Pulp & Agro-Horticulture Belt, Tamil Nadu",
    fullFormatted: "Krishnagiri Rural, Tamil Nadu",
    type: "district",
    state: "Tamil Nadu",
  },
  {
    id: "loc-anantapur",
    primaryName: "Anantapur Rural",
    administrativeContext: "Groundnut Oilseed & Silk Reeling Zone, Andhra Pradesh",
    fullFormatted: "Anantapur Rural, Andhra Pradesh",
    type: "district",
    state: "Andhra Pradesh",
  },
  {
    id: "loc-hindupur",
    primaryName: "Hindupur",
    administrativeContext: "Mulberry Silk & Commercial Trade Gateway, Sri Sathya Sai, AP",
    fullFormatted: "Hindupur, Sri Sathya Sai, Andhra Pradesh",
    type: "town",
    state: "Andhra Pradesh",
  },
];

export interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  id?: string;
  disabled?: boolean;
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = "e.g. Honganur, Channapatna, Karnataka",
  error,
  id = "location",
  disabled = false,
}: LocationAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Keep internal state synced if parent updates value (e.g. Preset buttons)
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Search logic: fuzzy / prefix matching against local database
  const searchLocations = useCallback((query: string) => {
    const clean = query.trim().toLowerCase();
    if (clean.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Simulate short network latency for realism & test loading states
    const timer = setTimeout(() => {
      const matches = LOCAL_LOCATION_DATABASE.filter((loc) => {
        const pName = loc.primaryName.toLowerCase();
        const admin = loc.administrativeContext.toLowerCase();
        const full = loc.fullFormatted.toLowerCase();
        return (
          pName.includes(clean) ||
          admin.includes(clean) ||
          full.includes(clean)
        );
      });

      setSuggestions(matches);
      setIsOpen(true);
      setHighlightedIndex(matches.length > 0 ? 0 : -1);
      setIsLoading(false);
    }, 120);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    searchLocations(val);
  };

  const handleSelect = (suggestion: LocationSuggestion) => {
    setInputValue(suggestion.fullFormatted);
    onChange(suggestion.fullFormatted);
    setIsOpen(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    setSuggestions([]);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      if (inputValue.trim().length >= 2) {
        searchLocations(inputValue);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;

      case "Enter":
        if (isOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          e.preventDefault();
          handleSelect(suggestions[highlightedIndex]);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;

      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const getTypeBadge = (type: LocationSuggestion["type"]) => {
    switch (type) {
      case "cluster":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "village":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "taluk":
        return "bg-purple-50 text-purple-800 border-purple-200";
      case "district":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input wrapper */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="h-4 w-4" />
        </span>

        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="off"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.trim().length >= 2) {
              searchLocations(inputValue);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          className={cn(
            "w-full pl-9 pr-9 py-2.5 bg-white rounded-lg border text-sm text-slate-900 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600",
            error ? "border-red-400 bg-red-50/20" : "border-slate-300 hover:border-slate-400",
            disabled && "bg-slate-100 cursor-not-allowed opacity-70"
          )}
        />

        {/* Right side indicator: Spinner or Clear Button */}
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
          ) : inputValue.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear location input"
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Autocomplete Dropdown Listbox */}
      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden max-h-72 overflow-y-auto animate-in fade-in-50 duration-150"
        >
          {suggestions.length > 0 ? (
            <div className="p-1 space-y-0.5">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                <span>Rural & Semi-Urban Clusters</span>
                <span>{suggestions.length} matching</span>
              </div>

              {suggestions.map((item, index) => {
                const isSelected = item.fullFormatted.toLowerCase() === inputValue.trim().toLowerCase();
                const isHighlighted = index === highlightedIndex;

                return (
                  <div
                    key={item.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg text-left cursor-pointer transition-colors select-none",
                      isHighlighted ? "bg-blue-50/80 text-blue-950" : "hover:bg-slate-50 text-slate-800",
                      isSelected && "bg-blue-50 font-semibold"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      <div
                        className={cn(
                          "h-6 w-6 rounded-md flex items-center justify-center text-xs",
                          isHighlighted ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                        )}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.primaryName}
                        </span>
                        <span
                          className={cn(
                            "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border shrink-0",
                            getTypeBadge(item.type)
                          )}
                        >
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {item.administrativeContext}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="shrink-0 self-center text-emerald-600">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center space-y-1.5">
              <p className="text-xs font-medium text-slate-700">
                No matching cluster found for &ldquo;<span className="font-bold">{inputValue}</span>&rdquo;
              </p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                You can still proceed with this custom location. Lakshya will evaluate based on your entered parameters.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
