"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Flag,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Info,
  Minus,
} from "lucide-react";
import clsx from "clsx";

// --- Types ---
interface Metric {
  name: string;
  value: string; // Formatted value
  rawValue: number;
  trend: "up" | "down" | "stable";
  change: string;
  description?: string;
  category: string;
}

interface Signal {
  type: "red" | "green";
  title: string;
  description: string;
  impact: "High" | "Medium" | "Low";
}

// --- Helper Functions ---

const safeDiv = (num: number, den: number) => (den === 0 ? 0 : num / den);

const formatPercent = (val: number) => `${(val * 100).toFixed(2)}%`;
const formatNumber = (val: number) => val.toFixed(2);
const formatDays = (val: number) => `${val.toFixed(0)} days`;

const getYearData = (reports: any[], year: string) => {
  return reports.find((r: any) => r.fiscal_year === year)?.data;
};

// --- Calculation Logic ---

const calculateMetrics = (currentData: any, prevData: any): Metric[] => {
  if (!currentData) return [];

  const metrics: Metric[] = [];

  // Local helper to get values safely
  const getVal = (data: any, path: string) => {
    if (!data) return 0;
    const parts = path.split(".");
    let curr = data;
    for (const part of parts) {
      curr = curr?.[part];
    }
    return typeof curr === "number" ? curr : curr?.amount || 0;
  };

  // --- 1. Extract Core Variables (Current Year) ---
  const revenue = getVal(
    currentData,
    "income_statement.total_operating_revenue"
  );
  const costOfSales = getVal(
    currentData,
    "income_statement.total_operating_cost.operating_cost"
  );
  const netIncome = getVal(
    currentData,
    "income_statement.net_profit.net_profit_attr_to_parent"
  );
  const netIncomeTotal = getVal(
    currentData,
    "income_statement.net_profit.amount"
  );
  const operatingProfit = getVal(
    currentData,
    "income_statement.operating_profit.amount"
  );
  const totalProfit = getVal(
    currentData,
    "income_statement.total_profit.amount"
  );
  const incomeTax = getVal(
    currentData,
    "income_statement.total_profit.income_tax"
  );

  const totalAssets = getVal(
    currentData,
    "balance_sheet.assets_summary.total_assets"
  );
  const totalEquity = getVal(
    currentData,
    "balance_sheet.equity.total_parent_equity"
  );
  const totalLiabilities = getVal(
    currentData,
    "balance_sheet.liabilities_summary.total_liabilities"
  );

  const currentAssets = getVal(
    currentData,
    "balance_sheet.current_assets.total_current_assets"
  );
  const currentLiabilities = getVal(
    currentData,
    "balance_sheet.current_liabilities.total_current_liabilities"
  );

  const inventory = getVal(
    currentData,
    "balance_sheet.current_assets.inventories"
  );
  const receivables = getVal(
    currentData,
    "balance_sheet.current_assets.notes_and_accounts_receivable.amount"
  );
  const payables = getVal(
    currentData,
    "balance_sheet.current_liabilities.notes_and_accounts_payable.amount"
  );

          const cashFlowOperating = getVal(
          currentData,
          "cash_flow_statement.operating_activities.net_cash_flow_from_operating"
        );
      
        // --- 2. Extract Core Variables (Previous Year for Averages) ---
        const getAvg = (curr: number, path: string) => {
          const prev = prevData ? getVal(prevData, path) : curr;
          return (curr + prev) / 2;
        };
      
        const avgTotalAssets = getAvg(
          totalAssets,
          "balance_sheet.assets_summary.total_assets"
        );
        const avgEquity = getAvg(
          totalEquity,
          "balance_sheet.equity.total_parent_equity"
        );
        const avgCurrentLiabilities = getAvg(
          currentLiabilities,
          "balance_sheet.current_liabilities.total_current_liabilities"
        );
        const avgInventory = getAvg(
          inventory,
          "balance_sheet.current_assets.inventories"
        );
        const avgReceivables = getAvg(
          receivables,
          "balance_sheet.current_assets.notes_and_accounts_receivable.amount"
        );
        const avgPayables = getAvg(
          payables,
          "balance_sheet.current_liabilities.notes_and_accounts_payable.amount"
        );
      
        // --- 3. Derived Values ---
        const monetaryFunds = getVal(currentData, "balance_sheet.current_assets.monetary_funds");
        const tradingAssets = getVal(currentData, "balance_sheet.current_assets.trading_financial_assets") + 
                              getVal(currentData, "balance_sheet.current_assets.financial_assets_fvpl.trading_financial_assets");
      
        const interestExpense = getVal(currentData, "income_statement.total_operating_cost.financial_expenses.interest_expenses");
        const taxesPaid = getVal(currentData, "cash_flow_statement.operating_activities.taxes_paid");
      
        // NOPAT = EBIT * (1 - TaxRate)
        // EBIT ~ Operating Profit (approx)
        const effectiveTaxRate = safeDiv(incomeTax, totalProfit);
        const nopat = operatingProfit * (1 - effectiveTaxRate);
      
        // Debt
        const shortTermDebt =
          getVal(
            currentData,
            "balance_sheet.current_liabilities.short_term_borrowings"
          ) +
          getVal(
            currentData,
            "balance_sheet.current_liabilities.non_current_liabilities_due_within_1y"
          );
        const longTermDebt =
          getVal(
            currentData,
            "balance_sheet.non_current_liabilities.long_term_borrowings"
          ) +
          getVal(
            currentData,
            "balance_sheet.non_current_liabilities.bonds_payable.amount"
          );
        const totalDebt = shortTermDebt + longTermDebt;
      
        // Invested Capital = Total Equity + Total Debt (Simplified)
        const investedCapital = totalEquity + totalDebt;
      
        // Net Operating Assets (NOA) = Operating Assets - Operating Liabilities
        // Simplified: Total Assets - Financial Assets - (Total Liabilities - Total Debt)
        // Let's use a simpler proxy: Net Working Capital + Net Fixed Assets
        const netWorkingCapital = currentAssets - currentLiabilities;
        // Operating Working Capital: (Receivables + Inventory) - Payables (Proxy)
        const operatingWorkingCapital = receivables + inventory - payables;
        const avgOperatingWorkingCapital =
          avgReceivables + avgInventory - avgPayables;
      
        // --- 4. Calculate Ratios ---
      
        const addMetric = (
          category: string,
          name: string,
          value: number,
          formatter: (v: number) => string,
          desc?: string
        ) => {
          metrics.push({
            category,
            name,
            value: formatter(value),
            rawValue: value,
            trend: "stable", // Will be updated later
            change: "-", // Will be updated later
            description: desc,
          });
        };
      
        // === Liquidity ===
        addMetric(
          "Liquidity",
          "Current Ratio",
          safeDiv(currentAssets, currentLiabilities),
          formatNumber,
          "Current Assets / Current Liabilities"
        );
        addMetric(
          "Liquidity",
          "Quick Ratio",
          safeDiv(monetaryFunds + tradingAssets + receivables, currentLiabilities),
          formatNumber,
          "(Cash + ST Investments + Receivables) / Current Liabilities"
        );
        addMetric(
          "Liquidity",
          "Cash Ratio",
          safeDiv(monetaryFunds + tradingAssets, currentLiabilities),
          formatNumber,
          "(Cash + Marketable Securities) / Current Liabilities"
        );
        addMetric(
          "Liquidity",
          "Operating Cash Flow Ratio",
          safeDiv(cashFlowOperating, avgCurrentLiabilities),
          formatNumber,
          "Cash Flow from Operations / Avg Current Liabilities"
        );
        addMetric(
          "Liquidity",
          "Net Working Capital to Total Assets",
          safeDiv(netWorkingCapital, totalAssets),
          formatPercent,
          "(Current Assets - Current Liab) / Total Assets"
        );
        addMetric(
          "Liquidity",
          "Operating Working Capital to Sales",
          safeDiv(operatingWorkingCapital, revenue),
          formatPercent,
          "Operating Working Capital / Revenue"
        );
        // === Profitability ===
        addMetric(
          "Profitability",
          "Gross Profit Margin",
          safeDiv(revenue - costOfSales, revenue),
          formatPercent,
          "(Rev - Cost of Sales) / Revenue"
        );
        addMetric(
          "Profitability",
          "Net Operating Profit Margin",
          safeDiv(nopat, revenue),
          formatPercent,
          "NOPAT / Revenue"
        );
        addMetric(
          "Profitability",
          "Return on Assets (ROA)",
          safeDiv(netIncomeTotal, avgTotalAssets),
          formatPercent,
          "Net Income / Avg Assets"
        );
        addMetric(
          "Profitability",
          "Return on Equity (ROE)",
          safeDiv(netIncome, avgEquity),
          formatPercent,
          "Net Income / Avg Equity"
        );
        addMetric(
          "Profitability",
          "Return on Invested Capital (ROIC)",
          safeDiv(nopat, investedCapital),
          formatPercent,
          "NOPAT / (Debt + Equity)"
        );
        // RNOA (Proxy: NOPAT / Net Operating Assets). Using Total Assets - Non-interest liabilities as proxy for NOA is complex without detailed breakdown.
        // Let's use (Total Assets - Current Liabilities + Short Term Debt) as a rough proxy or just skip if too noisy.
        // addMetric("Profitability", "Return on Net Operating Assets", ...);
        addMetric(
          "Profitability",
          "Cash Return on Invested Capital",
          safeDiv(cashFlowOperating, investedCapital),
          formatPercent,
          "O.Cash Flow / Invested Capital"
        );
      
        // === Solvency ===
        addMetric(
          "Solvency",
          "Debt to Assets",
          safeDiv(totalDebt, totalAssets),
          formatPercent,
          "Total Debt / Total Assets"
        );
        addMetric(
          "Solvency",
          "Debt to Equity",
          safeDiv(totalDebt, totalEquity),
          formatPercent,
          "Total Debt / Total Equity"
        );
        addMetric(
          "Solvency",
          "Liabilities to Equity",
          safeDiv(totalLiabilities, totalEquity),
          formatPercent,
          "Total Liabilities / Total Equity"
        );
        addMetric(
          "Solvency",
          "Liabilities to Assets",
          safeDiv(totalLiabilities, totalAssets),
          formatPercent,
          "Total Liabilities / Total Assets"
        );
        addMetric(
          "Solvency",
          "Interest Coverage (Earnings)",
          safeDiv(netIncomeTotal + interestExpense + incomeTax, interestExpense),
          formatNumber,
          "(Net Income + Interest + Tax) / Interest"
        );
        addMetric(
          "Solvency",
          "Interest Coverage (Cash Flow)",
          safeDiv(cashFlowOperating + interestExpense + taxesPaid, interestExpense),
          formatNumber,
          "(OCF + Interest + Tax Paid) / Interest"
        );
        addMetric(
          "Solvency",
          "Debt to Capital",
          safeDiv(totalDebt, totalDebt + totalEquity),
          formatPercent,
          "Total Debt / (Total Debt + Equity)"
        );
        addMetric(
          "Solvency",
          "Equity Multiplier",
          safeDiv(totalAssets, totalEquity),
          formatNumber,
          "Total Assets / Total Equity"
        );
  // === Efficiency ===
  // Net Operating Asset Turnover (Sales / NOA). Using Invested Capital as proxy for NOA for consistency.
  addMetric(
    "Efficiency",
    "Capital Turnover",
    safeDiv(revenue, investedCapital),
    formatNumber,
    "Sales / Invested Capital"
  );
  addMetric(
    "Efficiency",
    "Op. Working Capital Turnover",
    safeDiv(revenue, avgOperatingWorkingCapital),
    formatNumber,
    "Sales / Avg Op. Working Capital"
  );

  addMetric(
    "Efficiency",
    "Receivables Turnover",
    safeDiv(revenue, avgReceivables),
    formatNumber,
    "Sales / Avg Receivables"
  );
  addMetric(
    "Efficiency",
    "Days Sales Outstanding",
    safeDiv(365, safeDiv(revenue, avgReceivables)),
    formatDays,
    "365 / Receivables Turnover"
  );

  addMetric(
    "Efficiency",
    "Inventory Turnover",
    safeDiv(costOfSales, avgInventory),
    formatNumber,
    "COGS / Avg Inventory"
  );
  addMetric(
    "Efficiency",
    "Days Inventory Outstanding",
    safeDiv(365, safeDiv(costOfSales, avgInventory)),
    formatDays,
    "365 / Inventory Turnover"
  );

  addMetric(
    "Efficiency",
    "Payables Turnover",
    safeDiv(costOfSales, avgPayables),
    formatNumber,
    "COGS / Avg Payables (Purchases proxy)"
  );
  addMetric(
    "Efficiency",
    "Days Payables Outstanding",
    safeDiv(365, safeDiv(costOfSales, avgPayables)),
    formatDays,
    "365 / Payables Turnover"
  );

  const dso = safeDiv(365, safeDiv(revenue, avgReceivables));
  const dio = safeDiv(365, safeDiv(costOfSales, avgInventory));
  const dpo = safeDiv(365, safeDiv(costOfSales, avgPayables));
  addMetric(
    "Efficiency",
    "Cash Conversion Cycle",
    dso + dio - dpo,
    formatDays,
    "DIO + DSO - DPO"
  );

  return metrics;
};

// --- Component ---

export default function SignalsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [comparisonMode, setComparisonMode] = useState<"YoY" | "Sequential">(
    "YoY"
  );
  const [displayMetrics, setDisplayMetrics] = useState<Metric[]>([]);
  const [dupontData, setDupontData] = useState<any>(null);
  const [comparisonLabel, setComparisonLabel] = useState<string>("");

  useEffect(() => {
    const storedReports = localStorage.getItem("insight_viewer_reports");
    if (storedReports) {
      try {
        const parsed = JSON.parse(storedReports);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sort by year descending
          parsed.sort((a: any, b: any) => {
            const yA = parseInt(a.fiscal_year.split(" ")[0]);
            const yB = parseInt(b.fiscal_year.split(" ")[0]);

            // Secondary sort by period type priority if years are equal
            if (yA === yB) {
              const priority: Record<string, number> = {
                Annual: 10,
                Q4: 4,
                Q3: 3,
                Q2: 2,
                Q1: 1,
              };
              // Handle cases where period_type might be missing or different case
              const pA =
                a.period_type ||
                (a.fiscal_year.includes("Annual") ? "Annual" : "Q4");
              const pB =
                b.period_type ||
                (b.fiscal_year.includes("Annual") ? "Annual" : "Q4");
              return (priority[pB] || 0) - (priority[pA] || 0);
            }

            return yB - yA;
          });

          setReports(parsed);
          const availableYears = parsed.map((r: any) => r.fiscal_year);
          setYears(availableYears);
          setSelectedYear(availableYears[0]); // Default to latest
        }
      } catch (e) {
        console.error("Error loading reports", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!selectedYear || reports.length === 0) return;

    const currentIndex = reports.findIndex(
      (r) => r.fiscal_year === selectedYear
    );
    if (currentIndex === -1) return;

    const currentReport = reports[currentIndex];
    let prevReport: any = null;
    let label = "";

    if (comparisonMode === "YoY") {
      // Year-over-Year: Find same period type in previous year
      const currentPeriodType = currentReport.period_type;
      const currentYearNum = parseInt(selectedYear.split(" ")[0]);

      prevReport = reports.find((r) => {
        const rYearNum = parseInt(r.fiscal_year.split(" ")[0]);
        // Basic check: Year is previous year AND period type matches
        // Note: This assumes period_type is reliable.
        return (
          rYearNum === currentYearNum - 1 && r.period_type === currentPeriodType
        );
      });

      if (prevReport) {
        label = `vs. Same Period Last Year (${prevReport.fiscal_year})`;
      } else {
        label = "No data for same period last year";
      }
    } else {
      // Sequential: Immediately preceding report
      // Since reports are sorted descending, this is just the next index
      if (currentIndex + 1 < reports.length) {
        prevReport = reports[currentIndex + 1];
        label = `vs. Previous Period (${prevReport.fiscal_year})`;
      } else {
        label = "No previous period data";
      }
    }

    setComparisonLabel(label);

    if (currentReport) {
      // 1. Calculate Current Metrics
      const currentMetrics = calculateMetrics(
        currentReport.data,
        prevReport?.data
      );

      // 2. Calculate Previous Metrics (for Trend)
      let prevMetrics: Metric[] = [];
      if (prevReport) {
        // Calculate raw values for previous period
        prevMetrics = calculateMetrics(prevReport.data, null);
      }

      // 3. Compare and set Trend
      const finalMetrics = currentMetrics.map((m) => {
        const prev = prevMetrics.find((pm) => pm.name === m.name);
        if (prev) {
          const diff = m.rawValue - prev.rawValue;

          let trend: "up" | "down" | "stable" = "stable";
          if (diff > 0.00001) trend = "up";
          if (diff < -0.00001) trend = "down";

          let changeStr = "";
          if (m.value.includes("%")) {
            changeStr = `${(diff * 100).toFixed(2)}%`;
          } else {
            changeStr = diff.toFixed(2);
          }
          if (diff > 0) changeStr = "+" + changeStr;

          return { ...m, trend, change: changeStr };
        }
        // If no comparison data, reset trend
        return { ...m, trend: "stable", change: "-" } as Metric;
      });

      setDisplayMetrics(finalMetrics);

      // 4. DuPont Analysis Data (ROE Decomposition)
      const revenue = getVal(
        currentReport.data,
        "income_statement.total_operating_revenue"
      );
      const netIncome = getVal(
        currentReport.data,
        "income_statement.net_profit.net_profit_attr_to_parent"
      );

      const curAssets = getVal(
        currentReport.data,
        "balance_sheet.assets_summary.total_assets"
      );
      const preAssets = prevReport
        ? getVal(prevReport.data, "balance_sheet.assets_summary.total_assets")
        : curAssets;
      const avgAssets = (curAssets + preAssets) / 2;

      const curEquity = getVal(
        currentReport.data,
        "balance_sheet.equity.total_parent_equity"
      );
      const preEquity = prevReport
        ? getVal(prevReport.data, "balance_sheet.equity.total_parent_equity")
        : curEquity;
      const avgEquity = (curEquity + preEquity) / 2;

      const dupontNetMargin = safeDiv(netIncome, revenue);
      const dupontAssetTurnover = safeDiv(revenue, avgAssets);
      const dupontMultiplier = safeDiv(avgAssets, avgEquity);
      const dupontROE =
        dupontNetMargin * dupontAssetTurnover * dupontMultiplier;

      setDupontData({
        period: selectedYear,
        comparePeriod: prevReport?.fiscal_year,
        roe: dupontROE,
        netMargin: dupontNetMargin,
        assetTurnover: dupontAssetTurnover,
        equityMultiplier: dupontMultiplier,
      });
    }
  }, [selectedYear, reports, comparisonMode]);

  // Helper to get values safely (moved inside component or kept global)
  const getVal = (data: any, path: string) => {
    if (!data) return 0;
    const parts = path.split(".");
    let curr = data;
    for (const part of parts) {
      curr = curr?.[part];
    }
    return typeof curr === "number" ? curr : curr?.amount || 0;
  };

  const categories = ["Liquidity", "Profitability", "Solvency", "Efficiency"];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Compute & Signals
          </h1>
          <p className="text-gray-500">
            Advanced financial ratio analysis and performance drivers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Comparison Mode Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setComparisonMode("YoY")}
              className={clsx(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                comparisonMode === "YoY"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              Year-Over-Year
            </button>
            <button
              onClick={() => setComparisonMode("Sequential")}
              className={clsx(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                comparisonMode === "Sequential"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              Sequential
            </button>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {dupontData && (
        <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400 flex items-center">
            Analyzing{" "}
            <span className="font-medium text-gray-600 mx-1">
              {dupontData.period}
            </span>
            {dupontData.comparePeriod ? (
              <>
                <span className="mx-1">vs</span>
                <span className="font-medium text-gray-600">
                  {dupontData.comparePeriod}
                </span>
                <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] uppercase font-bold tracking-wide">
                  {comparisonMode === "YoY" ? "YoY" : "Seq"}
                </span>
              </>
            ) : (
              <span className="ml-1 text-orange-400">
                {" "}
                (No comparison data)
              </span>
            )}
          </p>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold hidden sm:block">
            Standardized Financial Analysis
          </div>
        </div>
      )}

      {/* DuPont Identity Section */}
      {dupontData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                DuPont Identity (ROE Decomposition)
              </h2>
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 hidden sm:block">
              ROE = Net Margin × Asset Turnover × Fin. Leverage
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
              <span className="text-sm text-blue-600 font-medium mb-1">
                Return on Equity
              </span>
              <span className="text-3xl font-bold text-blue-900">
                {formatPercent(dupontData.roe)}
              </span>
              <span className="text-xs text-blue-400 mt-2">
                Owner Value Creation
              </span>
            </div>
            <div className="flex items-center justify-center text-gray-300">
              <span className="text-2xl">=</span>
            </div>

            <div className="grid grid-cols-3 col-span-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <div className="text-xs text-gray-500 font-medium uppercase mb-1">
                  Profitability
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {formatPercent(dupontData.netMargin)}
                </div>
                <div className="text-xs text-gray-400 mt-1">Net Margin</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <div className="text-xs text-gray-500 font-medium uppercase mb-1">
                  Efficiency
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {formatNumber(dupontData.assetTurnover)}x
                </div>
                <div className="text-xs text-gray-400 mt-1">Asset Turnover</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <div className="text-xs text-gray-500 font-medium uppercase mb-1">
                  Leverage
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {formatNumber(dupontData.equityMultiplier)}x
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Equity Multiplier
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div
            key={cat}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">{cat} Ratios</h3>
            </div>
            <div className="p-0">
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-50">
                  {displayMetrics
                    .filter((m) => m.category === cat)
                    .map((metric) => (
                      <tr
                        key={metric.name}
                        className="group hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {metric.name}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            {metric.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="font-bold text-gray-900">
                            {metric.value}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right w-24">
                          <div className="flex items-center justify-end space-x-1">
                            {metric.trend === "up" && (
                              <ArrowUpRight className="w-4 h-4 text-green-500" />
                            )}
                            {metric.trend === "down" && (
                              <ArrowDownRight className="w-4 h-4 text-red-500" />
                            )}
                            {metric.trend === "stable" && (
                              <Minus className="w-4 h-4 text-gray-300" />
                            )}

                            <span
                              className={clsx(
                                "text-xs font-medium",
                                metric.trend === "up"
                                  ? "text-green-600"
                                  : metric.trend === "down"
                                  ? "text-red-600"
                                  : "text-gray-400"
                              )}
                            >
                              {metric.change}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {displayMetrics.filter((m) => m.category === cat).length ===
                    0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-gray-400 text-sm"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
