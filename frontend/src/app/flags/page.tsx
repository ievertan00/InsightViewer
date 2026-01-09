"use client";

import { useState, useEffect, useMemo } from "react";
import {
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Flag,
  Info,
  Activity,
  Calendar,
} from "lucide-react";
import { analyzeFlags, FlagResult } from "@/lib/flagsEngine";

export default function FlagsPage() {
  const [flags, setFlags] = useState<FlagResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [allReports, setAllReports] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");

  useEffect(() => {
    const storedReports = localStorage.getItem("insight_viewer_reports");
    if (storedReports) {
      try {
        const parsed = JSON.parse(storedReports);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllReports(parsed);

          // Initial selection: Latest Annual report
          const annuals = parsed.filter((r: any) =>
            r.fiscal_year.toLowerCase().includes("annual")
          );

          // Helper to sort by year
          const sortReports = (reports: any[]) => {
            return [...reports].sort((a, b) => {
              const yearA = parseInt(a.fiscal_year) || 0;
              const yearB = parseInt(b.fiscal_year) || 0;
              return yearA - yearB;
            });
          };

          const sortedAnnuals = sortReports(annuals);

          if (sortedAnnuals.length > 0) {
            setSelectedYear(
              sortedAnnuals[sortedAnnuals.length - 1].fiscal_year
            );
          } else {
            const sortedAll = sortReports(parsed);
            if (sortedAll.length > 0) {
              setSelectedYear(sortedAll[sortedAll.length - 1].fiscal_year);
            }
          }
        }
      } catch (e) {
        console.error("Error loading reports", e);
      }
    }
    setLoading(false);
  }, []);

  // Compute available annual years for dropdown
  const availableYears = useMemo(() => {
    return allReports
      .filter((r) => r.fiscal_year.toLowerCase().includes("annual"))
      .sort(
        (a, b) =>
          (parseInt(b.fiscal_year) || 0) - (parseInt(a.fiscal_year) || 0)
      )
      .map((r) => r.fiscal_year);
  }, [allReports]);

  // Re-run analysis when selectedYear or allReports changes
  useEffect(() => {
    if (!selectedYear || allReports.length === 0) return;

    const targetReport = allReports.find((r) => r.fiscal_year === selectedYear);
    if (!targetReport) return;

    const targetYearInt = parseInt(selectedYear) || 0;

    const relevantReports = allReports.filter((r) => {
      const isAnnual = r.fiscal_year.toLowerCase().includes("annual");
      const year = parseInt(r.fiscal_year) || 0;
      return isAnnual && year <= targetYearInt;
    });

    const results = analyzeFlags(relevantReports);
    setFlags(results);
  }, [selectedYear, allReports]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Analyzing financial health...
      </div>
    );
  }

  if (allReports.length === 0 && !loading) {
    return (
      <div className="p-10 text-center text-gray-500 flex flex-col items-center">
        <Activity className="w-12 h-12 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          No Data Available
        </h2>
        <p className="mt-2">
          Please import financial reports to run the risk analysis.
        </p>
      </div>
    );
  }

  const redFlags = flags.filter((f) => f.type === "Red");
  const greenFlags = flags.filter((f) => f.type === "Green");
  const infoFlags = flags.filter((f) => f.type === "Info");

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Flag className="w-6 h-6 mr-3 text-gray-700" />
            Flag Checklist
          </h1>
          <p className="text-gray-500 mt-1 ml-9">
            Automated forensic checks based on financial data.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
          {/* Year Selector */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar className="w-4 h-4 text-gray-500" />
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary focus:border-primary bg-white shadow-sm appearance-none"
              disabled={availableYears.length === 0}
            >
              {availableYears.length === 0 ? (
                <option>No Annual Data</option>
              ) : (
                availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))
              )}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>

          <div className="flex gap-4 h-[38px]">
            <div className="bg-rose-50 border border-rose-100 px-4 rounded-lg flex items-center h-full">
              <AlertCircle className="w-5 h-5 text-rose-500 mr-2" />
              <div className="flex items-center gap-2">
                <span className="block text-xl font-bold text-rose-700 leading-none">
                  {redFlags.length}
                </span>
                <span className="text-xs text-rose-600 font-medium uppercase pt-0.5">
                  Risks
                </span>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 px-4 rounded-lg flex items-center h-full">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" />
              <div className="flex items-center gap-2">
                <span className="block text-xl font-bold text-emerald-700 leading-none">
                  {greenFlags.length}
                </span>
                <span className="text-xs text-emerald-600 font-medium uppercase pt-0.5">
                  Health
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Red Flags Section */}
      {redFlags.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-rose-500" />
            Risk Indicators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {redFlags.map((flag, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-400"></div>
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-block px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded uppercase tracking-wide">
                    {flag.category}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  {flag.name}
                </h3>
                
                <div className="mb-4">
                  <span className="text-gray-400 uppercase text-[10px] font-bold block mb-1">
                    Trigger Condition
                  </span>
                  <div className="bg-rose-50/50 p-3 rounded-lg border border-rose-100">
                    <div className="text-sm font-bold text-rose-700">
                      {flag.value}
                    </div>
                    <div className="text-[10px] text-rose-500 mt-1 font-medium italic">
                      Logic: {flag.logic}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {flag.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Green Flags Section */}
      {greenFlags.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
            Health Signals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {greenFlags.map((flag, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded uppercase tracking-wide">
                    {flag.category}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  {flag.name}
                </h3>

                <div className="mb-4">
                  <span className="text-gray-400 uppercase text-[10px] font-bold block mb-1">
                    Target Criteria
                  </span>
                  <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                    <div className="text-sm font-bold text-emerald-700">
                      {flag.value}
                    </div>
                    <div className="text-[10px] text-emerald-500 mt-1 font-medium italic">
                      Logic: {flag.logic}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {flag.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Info / Placeholders */}
      {infoFlags.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-600 mb-4 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            Additional Data Required
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {infoFlags.map((flag, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-xl border border-gray-200 p-5 opacity-75"
              >
                <h3 className="font-semibold text-gray-700 mb-2">
                  {flag.name}
                </h3>
                <p className="text-sm text-gray-500 italic mb-2">
                  {flag.description}
                </p>
                <div className="text-xs text-gray-400 font-mono bg-gray-100 p-2 rounded">
                  Check: {flag.threshold}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {redFlags.length === 0 && greenFlags.length === 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-blue-900">
            No Significant Flags Detected
          </h3>
          <p className="text-blue-700 mt-2">
            The automated analysis did not find any extreme outliers matching
            the standard risk or health criteria for {selectedYear}.
          </p>
        </div>
      )}
    </div>
  );
}
