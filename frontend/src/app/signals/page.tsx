"use client";

import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronDown,
  Filter,
  Minus,
} from "lucide-react";
import clsx from "clsx";
import ComparisonControls from "@/components/ComparisonControls";

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

interface TargetMeta {
  name: string;
  code: string;
}

interface DupontMetrics {
    roe: number;
    netMargin: number;
    assetTurnover: number;
    equityMultiplier: number;
}

// --- Helper Functions ---

const safeDiv = (num: number, den: number) => (den === 0 ? 0 : num / den);

const formatPercent = (val: number) => `${(val * 100).toFixed(2)}%`;
const formatNumber = (val: number) => val.toFixed(2);
const formatDays = (val: number) => `${val.toFixed(0)} days`;

// --- Calculation Logic ---

const getVal = (data: any, path: string) => {
    if (!data) return 0;
    const parts = path.split(".");
    let curr = data;
    for (const part of parts) {
      curr = curr?.[part];
    }
    return typeof curr === "number" ? curr : curr?.amount || 0;
};

const calculateMetrics = (currentData: any, prevData: any): Metric[] => {
  if (!currentData) return [];

  const metrics: Metric[] = [];

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

const calculateDupont = (currentReport: any, prevReport: any): DupontMetrics => {
    if (!currentReport) return { roe: 0, netMargin: 0, assetTurnover: 0, equityMultiplier: 0 };

    const revenue = getVal(currentReport.data, "income_statement.total_operating_revenue");
    const netIncome = getVal(currentReport.data, "income_statement.net_profit.net_profit_attr_to_parent");

    const curAssets = getVal(currentReport.data, "balance_sheet.assets_summary.total_assets");
    const preAssets = prevReport ? getVal(prevReport.data, "balance_sheet.assets_summary.total_assets") : curAssets;
    const avgAssets = (curAssets + preAssets) / 2;

    const curEquity = getVal(currentReport.data, "balance_sheet.equity.total_parent_equity");
    const preEquity = prevReport ? getVal(prevReport.data, "balance_sheet.equity.total_parent_equity") : curEquity;
    const avgEquity = (curEquity + preEquity) / 2;

    const netMargin = safeDiv(netIncome, revenue);
    const assetTurnover = safeDiv(revenue, avgAssets);
    const equityMultiplier = safeDiv(avgAssets, avgEquity);
    const roe = netMargin * assetTurnover * equityMultiplier;

    return { roe, netMargin, assetTurnover, equityMultiplier };
};

// --- Component ---

export default function KeyRatiosPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [comparisonMode, setComparisonMode] = useState<"YoY" | "Sequential" | "Target">(
    "YoY"
  );
  
  // Target Company State
  const [targetReports, setTargetReports] = useState<any[]>([]);
  const [targetMeta, setTargetMeta] = useState<TargetMeta | null>(null);

  const [displayMetrics, setDisplayMetrics] = useState<(Metric & { compareValue?: string })[]>([]);
  const [comparisonLabel, setComparisonLabel] = useState<string>("");

  // Update Dupont state to hold both
  const [dupontData, setDupontData] = useState<{
      current: DupontMetrics;
      comparison: DupontMetrics | null;
      period: string;
      comparePeriod: string | undefined;
  } | null>(null);

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
    
    // Determine the "Previous" data (used for Current Company Averages)
    const currentPeriodType = currentReport.period_type;
    const currentYearNum = parseInt(selectedYear.split(" ")[0]);
    const prevYearReport = reports.find((r) => {
        const rYearNum = parseInt(r.fiscal_year.split(" ")[0]);
        return rYearNum === currentYearNum - 1 && r.period_type === currentPeriodType;
    });

    // 1. Calculate Metrics for Current Company
    const currentMetrics = calculateMetrics(currentReport.data, prevYearReport?.data);
    const currentDupont = calculateDupont(currentReport, prevYearReport);

    // 2. Determine Comparison Data
    let comparisonMetrics: Metric[] = [];
    let comparisonDupont: DupontMetrics | null = null;
    let label = "";
    let comparisonReport: any = null;

    if (comparisonMode === "Target" && targetReports.length > 0) {
        // Find matching year in target reports
        comparisonReport = targetReports.find(r => r.fiscal_year === selectedYear);
        
        if (comparisonReport) {
            label = `vs. ${targetMeta?.name || 'Target'} (${selectedYear})`;
            
            // Find target's previous year for its own averages
            const targetPrevReport = targetReports.find(r => {
                const rYearNum = parseInt(r.fiscal_year.split(" ")[0]);
                return rYearNum === currentYearNum - 1 && r.period_type === currentPeriodType;
            });
            
            comparisonMetrics = calculateMetrics(comparisonReport.data, targetPrevReport?.data);
            comparisonDupont = calculateDupont(comparisonReport, targetPrevReport);
        } else {
            label = "Target data unavailable for this period";
        }

    } else if (comparisonMode === "YoY") {
      comparisonReport = prevYearReport;
      if (comparisonReport) {
        label = `vs. Same Period Last Year (${comparisonReport.fiscal_year})`;
        const prevPrevReport = reports.find((r) => {
            const rYearNum = parseInt(r.fiscal_year.split(" ")[0]);
            return rYearNum === currentYearNum - 2 && r.period_type === currentPeriodType;
        });
        comparisonMetrics = calculateMetrics(comparisonReport.data, prevPrevReport?.data);
        comparisonDupont = calculateDupont(comparisonReport, prevPrevReport);
      } else {
        label = "No data for same period last year";
      }

    } else if (comparisonMode === "Sequential") {
      // Sequential: Immediately preceding report
      if (currentIndex + 1 < reports.length) {
        comparisonReport = reports[currentIndex + 1];
        label = `vs. Previous Period (${comparisonReport.fiscal_year})`;
        comparisonMetrics = calculateMetrics(comparisonReport.data, null);
        comparisonDupont = calculateDupont(comparisonReport, null);
      } else {
        label = "No previous period data";
      }
    }

    setComparisonLabel(label);

    // 3. Merge Metrics
    const finalMetrics = currentMetrics.map((m) => {
      const comp = comparisonMetrics.find((cm) => cm.name === m.name);
      
      let trend: "up" | "down" | "stable" = "stable";
      let changeStr = "-";
      let compareValStr = "-";

      if (comp) {
        const diff = m.rawValue - comp.rawValue;
        compareValStr = comp.value;

        if (diff > 0.00001) trend = "up";
        if (diff < -0.00001) trend = "down";

        if (m.value.includes("%")) {
          changeStr = `${(diff * 100).toFixed(2)}%`;
        } else {
          changeStr = diff.toFixed(2);
        }
        if (diff > 0) changeStr = "+" + changeStr;
      }

      return { ...m, trend, change: changeStr, compareValue: compareValStr };
    });

    setDisplayMetrics(finalMetrics);

    setDupontData({
      current: currentDupont,
      comparison: comparisonDupont,
      period: selectedYear,
      comparePeriod: comparisonReport?.fiscal_year,
    });
    
  }, [selectedYear, reports, comparisonMode, targetReports, targetMeta]);

  const categories = ["Liquidity", "Profitability", "Solvency", "Efficiency"];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Key Financial Ratios
          </h1>
          <p className="text-gray-500">
            Advanced financial performance metrics and ratio analysis.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <ComparisonControls 
                comparisonMode={comparisonMode}
                setComparisonMode={setComparisonMode}
                targetMeta={targetMeta}
                onTargetDataChange={(meta, reports) => {
                    setTargetMeta(meta);
                    setTargetReports(reports);
                }}
            />
            
            <div className="flex items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm relative min-w-[160px]">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
                <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-transparent text-sm font-medium text-gray-700 focus:outline-none appearance-none cursor-pointer"
                >
                {years.map((y) => (
                    <option key={y} value={y}>
                    {y}
                    </option>
                ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
            </div>
        </div>
      </div>

      {dupontData && (
        <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400 flex items-center flex-wrap">
            Analyzing{" "}
            <span className="font-medium text-gray-600 mx-1">
              {dupontData.period}
            </span>
            {dupontData.comparePeriod ? (
                <>
                    <span className="mx-1">{comparisonMode === "Target" ? "vs Target" : "vs"}</span>
                    <span className="font-medium text-gray-600">
                    {comparisonMode === "Target" && targetMeta ? targetMeta.name : dupontData.comparePeriod}
                    </span>
                    {comparisonMode !== "Target" && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] uppercase font-bold tracking-wide">
                        {comparisonMode === "YoY" ? "YoY" : "Seq"}
                        </span>
                    )}
                </>
            ) : (
                <span className="ml-1 text-orange-400">
                (Comparison data unavailable)
                </span>
            )}
          </p>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold hidden sm:block">
            Standardized Financial Analysis
          </div>
        </div>
      )}

      {/* DuPont Identity Section - with Comparison */}
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
            {/* ROE Box */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
              <span className="text-sm text-blue-600 font-medium mb-1">
                Return on Equity
              </span>
              <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-bold text-blue-900">
                    {formatPercent(dupontData.current.roe)}
                  </span>
                  {dupontData.comparison && (
                      <span className="text-lg text-blue-400 font-medium">
                          vs {formatPercent(dupontData.comparison.roe)}
                      </span>
                  )}
              </div>
              <span className="text-xs text-blue-400 mt-2">
                Owner Value Creation
              </span>
            </div>
            
            <div className="flex items-center justify-center text-gray-300">
              <span className="text-2xl">=</span>
            </div>

            <div className="grid grid-cols-3 col-span-2 gap-4">
              {/* Profitability */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center flex flex-col justify-between">
                <div className="text-xs text-gray-500 font-medium uppercase mb-1">
                  Profitability
                </div>
                <div>
                    <div className="text-xl font-bold text-gray-900">
                    {formatPercent(dupontData.current.netMargin)}
                    </div>
                    {dupontData.comparison && (
                        <div className="text-base text-gray-400 font-medium mt-1">
                        vs {formatPercent(dupontData.comparison.netMargin)}
                        </div>
                    )}
                </div>
                <div className="text-xs text-gray-400 mt-2">Net Margin</div>
              </div>

              {/* Efficiency */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center flex flex-col justify-between">
                <div className="text-xs text-gray-500 font-medium uppercase mb-1">
                  Efficiency
                </div>
                <div>
                    <div className="text-xl font-bold text-gray-900">
                    {formatNumber(dupontData.current.assetTurnover)}x
                    </div>
                    {dupontData.comparison && (
                        <div className="text-base text-gray-400 font-medium mt-1">
                        vs {formatNumber(dupontData.comparison.assetTurnover)}x
                        </div>
                    )}
                </div>
                <div className="text-xs text-gray-400 mt-2">Asset Turnover</div>
              </div>

              {/* Leverage */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center flex flex-col justify-between">
                <div className="text-xs text-gray-500 font-medium uppercase mb-1">
                  Leverage
                </div>
                <div>
                    <div className="text-xl font-bold text-gray-900">
                    {formatNumber(dupontData.current.equityMultiplier)}x
                    </div>
                    {dupontData.comparison && (
                        <div className="text-base text-gray-400 font-medium mt-1">
                        vs {formatNumber(dupontData.comparison.equityMultiplier)}x
                        </div>
                    )}
                </div>
                <div className="text-xs text-gray-400 mt-2">
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
                <thead className="bg-gray-50/20 text-xs text-gray-400 uppercase tracking-wider font-medium">
                    <tr>
                        <th className="px-6 py-3">Metric</th>
                        <th className="px-4 py-3 text-right">Current</th>
                        <th className="px-4 py-3 text-right whitespace-nowrap">
                            {comparisonMode === 'Target' ? 'Target' : 'Previous'}
                        </th>
                        <th className="px-4 py-3 text-right">Diff</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayMetrics
                    .filter((m) => m.category === cat)
                    .map((metric) => (
                      <tr
                        key={metric.name}
                        className="group hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 text-sm">
                            {metric.name}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                            {metric.description}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="font-bold text-gray-900">
                            {metric.value}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="font-medium text-gray-500">
                            {metric.compareValue}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right w-24">
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
                        colSpan={4}
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
