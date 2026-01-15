"use client";

import { useState, useEffect } from "react";
import { Search, X, Loader2, AlertCircle } from "lucide-react";
import clsx from "clsx";
import { API_BASE_URL } from "@/lib/config";

interface TargetMeta {
  name: string;
  code: string;
}

interface ComparisonControlsProps {
  comparisonMode: "YoY" | "Sequential" | "Target";
  setComparisonMode: (mode: "YoY" | "Sequential" | "Target") => void;
  onTargetDataChange: (meta: TargetMeta | null, reports: any[]) => void;
}

export default function ComparisonControls({
  comparisonMode,
  setComparisonMode,
  onTargetDataChange,
}: ComparisonControlsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [targetMeta, setTargetMeta] = useState<TargetMeta | null>(null);

  // Load persisted target on mount
  useEffect(() => {
    const savedTargetMeta = localStorage.getItem("insight_viewer_target_meta");
    const savedTargetReports = localStorage.getItem(
      "insight_viewer_target_reports"
    );

    if (savedTargetMeta && savedTargetReports) {
      try {
        const meta = JSON.parse(savedTargetMeta);
        const reports = JSON.parse(savedTargetReports);
        setTargetMeta(meta);
        onTargetDataChange(meta, reports);
      } catch (e) {
        console.error("Failed to load saved target data", e);
      }
    }
  }, []);

  const handleSearch = async () => {
    if (!searchTerm) return;

    // Simple validation
    if (!/^\d{6}$/.test(searchTerm)) {
      setError("Invalid stock code format. Use 6 digits (e.g., 600519).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const symbol = searchTerm.startsWith("6")
        ? `${searchTerm}.SH`
        : `${searchTerm}.SZ`; // Default to SH if not specified, though backend handles some logic
      // Ideally, the backend should be robust enough, or we let user specify.
      // For now, mirroring existing upload page logic which defaults to trying generic or appending .SH
      // The backend actually expects just the code or code.suffix.

      const response = await fetch(`${API_BASE_URL}/stock/${symbol}`);

      if (!response.ok) {
        throw new Error("Failed to fetch data. Check the code.");
      }

      const data = await response.json();

      if (!data.reports || data.reports.length === 0) {
        throw new Error("No financial reports found for this company.");
      }

      const meta = {
        name: data.company_meta?.name || "Unknown Company",
        code: data.company_meta?.stock_code || searchTerm,
      };

      // Update State
      setTargetMeta(meta);
      onTargetDataChange(meta, data.reports);
      setComparisonMode("Target");

      // Persist
      localStorage.setItem("insight_viewer_target_meta", JSON.stringify(meta));
      localStorage.setItem(
        "insight_viewer_target_reports",
        JSON.stringify(data.reports)
      );

      setSearchTerm("");
    } catch (err: any) {
      setError(err.message || "Error fetching target company.");
    } finally {
      setLoading(false);
    }
  };

  const clearTarget = () => {
    setTargetMeta(null);
    onTargetDataChange(null, []);
    setComparisonMode("YoY"); // Revert to default
    localStorage.removeItem("insight_viewer_target_meta");
    localStorage.removeItem("insight_viewer_target_reports");
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
      {/* Mode Toggles */}
      <div className="flex bg-gray-100 p-1 rounded-md shrink-0">
        <button
          onClick={() => setComparisonMode("YoY")}
          className={clsx(
            "px-3 py-1.5 text-xs font-medium rounded-sm transition-all",
            comparisonMode === "YoY"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          YoY
        </button>
        <button
          onClick={() => setComparisonMode("Sequential")}
          className={clsx(
            "px-3 py-1.5 text-xs font-medium rounded-sm transition-all",
            comparisonMode === "Sequential"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Sequential
        </button>
        <button
          onClick={() => setComparisonMode("Target")}
          disabled={!targetMeta}
          className={clsx(
            "px-3 py-1.5 text-xs font-medium rounded-sm transition-all",
            comparisonMode === "Target"
              ? "bg-white text-primary shadow-sm"
              : "text-gray-500 hover:text-gray-700",
            !targetMeta && "opacity-50 cursor-not-allowed"
          )}
        >
          Vs. Target
        </button>
      </div>

      <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

      {/* Target Search / Display */}
      <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
        {targetMeta ? (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-md text-sm border border-emerald-100">
            <span className="font-medium truncate max-w-[150px]">
              {targetMeta.name}
            </span>
            <span className="text-emerald-500/80 text-xs">({targetMeta.code})</span>
            <button
              onClick={clearTarget}
              className="ml-1 hover:text-emerald-900 focus:outline-none"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="relative flex items-center w-full sm:w-64">
            <Search className="absolute left-2.5 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Compare (e.g. 600519)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {loading && (
              <div className="absolute right-2.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="absolute top-full mt-2 left-0 right-0 z-10 flex justify-center pointer-events-none">
          <div className="bg-red-50 text-red-600 text-xs px-3 py-1 rounded shadow-lg border border-red-100 flex items-center pointer-events-auto">
            <AlertCircle className="w-3 h-3 mr-1.5" />
            {error}
            <button onClick={() => setError(null)} className="ml-2">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
