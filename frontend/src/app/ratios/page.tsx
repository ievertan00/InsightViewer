"use client";

import { useState, useEffect } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronDown,
  Filter,
  Minus,
  Info,
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
  formula?: string;
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
  const revenue = getVal(currentData, "income_statement.total_operating_revenue");
  const costOfSales = getVal(currentData, "income_statement.total_operating_cost.operating_cost");
  const grossProfit = revenue - costOfSales;
  
  const sellingExp = getVal(currentData, "income_statement.total_operating_cost.selling_expenses");
  const adminExp = getVal(currentData, "income_statement.total_operating_cost.admin_expenses");
  const financeExp = getVal(currentData, "income_statement.total_operating_cost.financial_expenses.amount") || 
                     getVal(currentData, "income_statement.total_operating_cost.financial_expenses"); // Handle structure variation
  const rdExp = getVal(currentData, "income_statement.total_operating_cost.rd_expenses");
  
  const assetImpairment = getVal(currentData, "income_statement.total_operating_cost.asset_impairment_loss") + 
                          getVal(currentData, "income_statement.total_operating_cost.credit_impairment_loss");

  const operatingProfit = getVal(currentData, "income_statement.operating_profit.amount");
  const totalProfit = getVal(currentData, "income_statement.total_profit.amount");
  const netIncome = getVal(currentData, "income_statement.net_profit.net_profit_attr_to_parent");
  const incomeTax = getVal(currentData, "income_statement.total_profit.income_tax");
  
  const interestExpense = getVal(currentData, "income_statement.total_operating_cost.financial_expenses.interest_expenses");
  const interestIncome = getVal(currentData, "income_statement.total_operating_cost.financial_expenses.interest_income");
  const interestPaid = getVal(currentData, "cash_flow_statement.financing_activities.cash_paid_for_dividends_and_profits");
  
  // EBIT Proxy: Total Profit + Interest Expense
  const ebit = totalProfit + interestExpense; 
  const taxRate = totalProfit !== 0 ? safeDiv(incomeTax, totalProfit) : 0; // Effective tax rate

  // Balance Sheet
  const totalAssets = getVal(currentData, "balance_sheet.assets_summary.total_assets");
  const totalLiabilities = getVal(currentData, "balance_sheet.liabilities_summary.total_liabilities");
  const totalEquity = getVal(currentData, "balance_sheet.equity.total_parent_equity");
  
  const currentAssets = getVal(currentData, "balance_sheet.current_assets.total_current_assets");
  const currentLiabilities = getVal(currentData, "balance_sheet.current_liabilities.total_current_liabilities");
  
  const inventory = getVal(currentData, "balance_sheet.current_assets.inventories");
  const receivables = getVal(currentData, "balance_sheet.current_assets.notes_and_accounts_receivable.amount");
  const monetaryFunds = getVal(currentData, "balance_sheet.current_assets.monetary_funds");
  const tradingAssets = getVal(currentData, "balance_sheet.current_assets.trading_financial_assets") + 
                        getVal(currentData, "balance_sheet.current_assets.financial_assets_fvpl.trading_financial_assets");
  
  // Debt
  const shortTermDebt = getVal(currentData, "balance_sheet.current_liabilities.short_term_borrowings") +
                        getVal(currentData, "balance_sheet.current_liabilities.non_current_liabilities_due_within_1y");
  const longTermDebt = getVal(currentData, "balance_sheet.non_current_liabilities.long_term_borrowings") +
                       getVal(currentData, "balance_sheet.non_current_liabilities.bonds_payable.amount");
  const interestBearingDebt = shortTermDebt + longTermDebt;
  const investedCapital = totalEquity + interestBearingDebt;

  // Cash Flow
  const ocf = getVal(currentData, "cash_flow_statement.operating_activities.net_cash_flow_from_operating");
  const capex = getVal(currentData, "cash_flow_statement.investing_activities.cash_paid_for_assets"); 
  const salesCash = getVal(currentData, "cash_flow_statement.operating_activities.cash_received_from_goods_and_services");
  
  // Free Cash Flow Proxy (Simple): OCF - Capex
  const fcf = ocf - capex;

  // --- 2. Extract Previous Year & Averages ---
  const getPrevVal = (path: string) => prevData ? getVal(prevData, path) : 0;
  
  const prevShortTermDebt = getVal(prevData, "balance_sheet.current_liabilities.short_term_borrowings") +
                            getVal(prevData, "balance_sheet.current_liabilities.non_current_liabilities_due_within_1y");
  const prevLongTermDebt = getVal(prevData, "balance_sheet.non_current_liabilities.long_term_borrowings") +
                           getVal(prevData, "balance_sheet.non_current_liabilities.bonds_payable.amount");
  const prevInterestBearingDebt = prevData ? (prevShortTermDebt + prevLongTermDebt) : interestBearingDebt;

  const avgAssets = (totalAssets + (prevData ? getVal(prevData, "balance_sheet.assets_summary.total_assets") : totalAssets)) / 2;
  const avgEquity = (totalEquity + (prevData ? getVal(prevData, "balance_sheet.equity.total_parent_equity") : totalEquity)) / 2;
  const avgInventory = (inventory + (prevData ? getVal(prevData, "balance_sheet.current_assets.inventories") : inventory)) / 2;
  const avgReceivables = (receivables + (prevData ? getVal(prevData, "balance_sheet.current_assets.notes_and_accounts_receivable.amount") : receivables)) / 2;
  const avgMonetaryFunds = (monetaryFunds + (prevData ? getVal(prevData, "balance_sheet.current_assets.monetary_funds") : monetaryFunds)) / 2;
  const avgInterestBearingDebt = (interestBearingDebt + prevInterestBearingDebt) / 2;

  // --- 3. Helper to Add Metric ---
  const addMetric = (category: string, name: string, value: number, formatter: (v: number) => string, desc: string, formula: string) => {
    metrics.push({
      category,
      name,
      value: formatter(value),
      rawValue: value,
      trend: "stable",
      change: "-",
      description: desc,
      formula: formula
    });
  };

  // ==========================================
  // 1. Profitability & Margins (盈利能力)
  // ==========================================
  addMetric("Profitability & Margins", "Gross Margin", safeDiv(grossProfit, revenue), formatPercent, "销售毛利率", "(Revenue - COGS) / Revenue");
  addMetric("Profitability & Margins", "Net Profit Margin", safeDiv(netIncome, revenue), formatPercent, "销售净利率", "Net Income / Revenue");
  addMetric("Profitability & Margins", "Cost of Sales Ratio", safeDiv(costOfSales, revenue), formatPercent, "销售成本率", "COGS / Revenue");
  addMetric("Profitability & Margins", "Expense of Sales Ratio", safeDiv(sellingExp + adminExp + financeExp, revenue), formatPercent, "销售期间费用率", "(Selling + Admin + Finance Exp) / Revenue");
  addMetric("Profitability & Margins", "EBIT Margin", safeDiv(ebit, revenue), formatPercent, "息税前利润率", "EBIT / Total Revenue");
  addMetric("Profitability & Margins", "Operating Margin", safeDiv(operatingProfit, revenue), formatPercent, "营业利润率", "Operating Income / Total Revenue");
  addMetric("Profitability & Margins", "Asset Impairment Ratio", safeDiv(assetImpairment, revenue), formatPercent, "资产减值损失率", "Asset Impairment Loss / Total Revenue");

  // ==========================================
  // 2. Return on Investment (回报率)
  // ==========================================
  addMetric("Return on Investment", "ROE", safeDiv(netIncome, avgEquity), formatPercent, "净资产收益率", "Net Income / Avg Shareholders' Equity");
  addMetric("Return on Investment", "ROA", safeDiv(netIncome, avgAssets), formatPercent, "总资产报酬率", "Net Income / Avg Total Assets");
  addMetric("Return on Investment", "ROIC", safeDiv(ebit * (1 - taxRate), investedCapital), formatPercent, "投入资本回报率", "EBIT * (1 - Tax Rate) / Invested Capital");
  addMetric("Return on Investment", "CFROI (Proxy)", safeDiv(ocf, investedCapital), formatPercent, "现金流投资回报率 (Proxy)", "Operating Cash Flow / Invested Capital");
  addMetric("Return on Investment", "CROIC", safeDiv(fcf, investedCapital), formatPercent, "现金投入资本回报率", "Free Cash Flow / (Equity + Debt)");

  // ==========================================
  // 3. Solvency & Liquidity (偿债能力)
  // ==========================================
  addMetric("Solvency & Liquidity", "Current Ratio", safeDiv(currentAssets, currentLiabilities), formatNumber, "流动比率", "Current Assets / Current Liabilities");
  addMetric("Solvency & Liquidity", "Quick Ratio", safeDiv(currentAssets - inventory, currentLiabilities), formatNumber, "速动比率", "(Current Assets - Inventory) / Current Liabilities");
  addMetric("Solvency & Liquidity", "Cash Ratio", safeDiv(monetaryFunds + tradingAssets, currentLiabilities), formatNumber, "现金比率", "(Cash + Cash Equiv) / Current Liabilities");
  addMetric("Solvency & Liquidity", "Debt to Assets", safeDiv(totalLiabilities, totalAssets), formatPercent, "资产负债率", "Total Liabilities / Total Assets");
  addMetric("Solvency & Liquidity", "Debt to Equity", safeDiv(totalLiabilities, totalEquity), formatPercent, "产权比率", "Total Liabilities / Shareholders' Equity");
  addMetric("Solvency & Liquidity", "Interest Coverage", safeDiv(ebit, interestExpense), formatNumber, "已获利息倍数", "EBIT / Interest Expense");
  addMetric("Solvency & Liquidity", "Accrued Interest Rate", safeDiv(interestExpense, avgInterestBearingDebt), formatPercent, "有息负债利率", "Interest Expense / Avg Total Debt");
  addMetric("Solvency & Liquidity", "Cash Interest Rate", safeDiv(interestPaid, avgInterestBearingDebt), formatPercent, "现金利率", "Interest Paid (Proxy) / Avg Total Debt");
  addMetric("Solvency & Liquidity", "Operating Cash Flow Ratio", safeDiv(ocf, currentLiabilities), formatNumber, "经营现金流比率", "Operating Cash Flow / Current Liabilities");
  addMetric("Solvency & Liquidity", "NWC to Assets", safeDiv(currentAssets - currentLiabilities, totalAssets), formatPercent, "营运资金占总资产比率", "(Current Assets - Current Liabilities) / Total Assets");
  addMetric("Solvency & Liquidity", "Net Debt", interestBearingDebt - monetaryFunds, (v) => (v / 100000000).toFixed(2) + "B", "净债务 (100M)", "Interest Bearing Debt - Cash");

  // ==========================================
  // 4. Operating Efficiency (营运能力)
  // ==========================================
  addMetric("Operating Efficiency", "Selling Expense Ratio", safeDiv(sellingExp, revenue), formatPercent, "销售费用率", "Selling Expenses / Revenue");
  addMetric("Operating Efficiency", "Admin Expense Ratio", safeDiv(adminExp, revenue), formatPercent, "管理费用率", "Administrative Expenses / Revenue");
  addMetric("Operating Efficiency", "R&D Expense Ratio", safeDiv(rdExp, revenue), formatPercent, "研发费用率", "R&D Expenses / Revenue");
  
  const invTurn = safeDiv(costOfSales, avgInventory);
  const arTurn = safeDiv(revenue, avgReceivables);
  const dio = safeDiv(365, invTurn);
  const dso = safeDiv(365, arTurn);

  addMetric("Operating Efficiency", "Inventory Turnover", invTurn, formatNumber, "存货周转率", "COGS / Avg Inventory");
  addMetric("Operating Efficiency", "Days Inventory Outstanding", dio, formatDays, "存货周转天数", "365 / Inventory Turnover");
  addMetric("Operating Efficiency", "AR Turnover", arTurn, formatNumber, "应收账款周转率", "Revenue / Avg AR");
  addMetric("Operating Efficiency", "Days Sales Outstanding", dso, formatDays, "应收账款周转天数", "365 / AR Turnover");
  addMetric("Operating Efficiency", "Total Asset Turnover", safeDiv(revenue, avgAssets), formatNumber, "总资产周转率", "Revenue / Avg Total Assets");
  addMetric("Operating Efficiency", "Operating Cycle", dio + dso, formatDays, "营业周期", "DIO + DSO");
  addMetric("Operating Efficiency", "Working Capital", currentAssets - currentLiabilities, (v) => (v / 100000000).toFixed(2) + "B", "营运资金 (100M)", "Current Assets - Current Liabilities");

  // ==========================================
  // 5. Cash Flow Quality (现金流质量)
  // ==========================================
  addMetric("Cash Flow Quality", "OCF to Revenue", safeDiv(ocf, revenue), formatPercent, "经营现金流与收入比", "Operating Cash Flow / Revenue");
  addMetric("Cash Flow Quality", "OCF to Operating Income", safeDiv(ocf, operatingProfit), formatNumber, "盈利现金比率", "Operating Cash Flow / Operating Income");
  addMetric("Cash Flow Quality", "Free Cash Flow (FCFF)", fcf, (v) => (v / 100000000).toFixed(2) + "B", "企业自由现金流量 (100M)", "OCF - Capex (Simplified)");
  addMetric("Cash Flow Quality", "Cash Collection Ratio", safeDiv(salesCash, revenue), formatPercent, "收现比", "Cash Received from Sales / Revenue");
  addMetric("Cash Flow Quality", "OCF to Debt", safeDiv(ocf, totalLiabilities), formatPercent, "经营现金流与负债比", "Operating Cash Flow / Total Liabilities");
  addMetric("Cash Flow Quality", "OCF to Capex", safeDiv(ocf, capex), formatNumber, "经营现金流与资本支出比", "Operating Cash Flow / Capital Expenditures");

  // ==========================================
  // 6. Growth Indicators (成长性)
  // ==========================================
  if (prevData) {
      const prevRevenue = getVal(prevData, "income_statement.total_operating_revenue");
      const prevNetIncome = getVal(prevData, "income_statement.net_profit.net_profit_attr_to_parent");
      const prevOCF = getVal(prevData, "cash_flow_statement.operating_activities.net_cash_flow_from_operating");

      addMetric("Growth Indicators", "Revenue Growth (YoY)", safeDiv(revenue - prevRevenue, prevRevenue), formatPercent, "营业总收入增长率", "(Current Revenue - Prev) / Prev");
      addMetric("Growth Indicators", "Net Profit Growth (YoY)", safeDiv(netIncome - prevNetIncome, Math.abs(prevNetIncome)), formatPercent, "净利润增长率", "(Current Net Income - Prev) / |Prev|");
      addMetric("Growth Indicators", "OCF Growth (YoY)", safeDiv(ocf - prevOCF, Math.abs(prevOCF)), formatPercent, "经营现金流增长率", "(Current OCF - Prev) / |Prev|");
  } else {
      addMetric("Growth Indicators", "Revenue Growth", 0, () => "-", "Requires prev year data", "N/A");
      addMetric("Growth Indicators", "Net Profit Growth", 0, () => "-", "Requires prev year data", "N/A");
      addMetric("Growth Indicators", "OCF Growth", 0, () => "-", "Requires prev year data", "N/A");
  }

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
  const [comparisonMode, setComparisonMode] = useState<"YoY" | "Sequential" | "Target">("YoY");
  const [targetReports, setTargetReports] = useState<any[]>([]);
  const [targetMeta, setTargetMeta] = useState<TargetMeta | null>(null);
  const [displayMetrics, setDisplayMetrics] = useState<(Metric & { compareValue?: string })[]>([]);
  const [dupontData, setDupontData] = useState<{ 
      current: DupontMetrics;
      comparison: DupontMetrics | null;
      period: string;
      comparePeriod: string | undefined;
  } | null>(null);

  const [comparisonLabel, setComparisonLabel] = useState<string>("");

  useEffect(() => {
    const storedReports = localStorage.getItem("insight_viewer_reports");
    if (storedReports) {
      try {
        const parsed = JSON.parse(storedReports);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.sort((a: any, b: any) => {
            const yA = parseInt(a.fiscal_year.split(" ")[0]);
            const yB = parseInt(b.fiscal_year.split(" ")[0]);
            if (yA === yB) {
              const priority: Record<string, number> = { Annual: 10, Q4: 4, Q3: 3, Q2: 2, Q1: 1 };
              const pA = a.period_type || (a.fiscal_year.includes("Annual") ? "Annual" : "Q4");
              const pB = b.period_type || (b.fiscal_year.includes("Annual") ? "Annual" : "Q4");
              return (priority[pB] || 0) - (priority[pA] || 0);
            }
            return yB - yA;
          });
          setReports(parsed);
          const availableYears = parsed.map((r: any) => r.fiscal_year);
          setYears(availableYears);
          setSelectedYear(availableYears[0]);
        }
      } catch (e) {
        console.error("Error loading reports", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!selectedYear || reports.length === 0) return;
    const currentIndex = reports.findIndex((r) => r.fiscal_year === selectedYear);
    if (currentIndex === -1) return;
    const currentReport = reports[currentIndex];
    const currentPeriodType = currentReport.period_type;
    const currentYearNum = parseInt(selectedYear.split(" ")[0]);
    const prevYearReport = reports.find((r) => {
        const rYearNum = parseInt(r.fiscal_year.split(" ")[0]);
        return rYearNum === currentYearNum - 1 && r.period_type === currentPeriodType;
    });

    const currentMetrics = calculateMetrics(currentReport.data, prevYearReport?.data);
    const currentDupont = calculateDupont(currentReport, prevYearReport);

    let comparisonMetrics: Metric[] = [];
    let comparisonDupont: DupontMetrics | null = null;
    let comparisonReport: any = null;

    if (comparisonMode === "Target" && targetReports.length > 0) {
        comparisonReport = targetReports.find(r => r.fiscal_year === selectedYear);
        if (comparisonReport) {
            const targetPrevReport = targetReports.find(r => {
                const rYearNum = parseInt(r.fiscal_year.split(" ")[0]);
                return rYearNum === currentYearNum - 1 && r.period_type === currentPeriodType;
            });
            comparisonMetrics = calculateMetrics(comparisonReport.data, targetPrevReport?.data);
            comparisonDupont = calculateDupont(comparisonReport, targetPrevReport);
        }
    } else if (comparisonMode === "YoY") {
      comparisonReport = prevYearReport;
      if (comparisonReport) {
        const prevPrevReport = reports.find((r) => {
            const rYearNum = parseInt(r.fiscal_year.split(" ")[0]);
            return rYearNum === currentYearNum - 2 && r.period_type === currentPeriodType;
        });
        comparisonMetrics = calculateMetrics(comparisonReport.data, prevPrevReport?.data);
        comparisonDupont = calculateDupont(comparisonReport, prevPrevReport);
      }
    } else if (comparisonMode === "Sequential" && currentIndex + 1 < reports.length) {
        comparisonReport = reports[currentIndex + 1];
        comparisonMetrics = calculateMetrics(comparisonReport.data, null);
        comparisonDupont = calculateDupont(comparisonReport, null);
    }

    setComparisonLabel(comparisonReport ? comparisonReport.fiscal_year : "");

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
          const absDiff = Math.abs(diff);
          if (absDiff >= 1_000_000_000) {
              changeStr = (diff / 1_000_000_000).toFixed(2) + "B";
          } else if (absDiff >= 1_000_000) {
              changeStr = (diff / 1_000_000).toFixed(2) + "M";
          } else if (absDiff >= 1_000) {
              changeStr = (diff / 1_000).toFixed(2) + "K";
          } else {
              changeStr = diff.toFixed(2);
          }
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

  const categories = [
      "Profitability & Margins",
      "Return on Investment",
      "Solvency & Liquidity",
      "Operating Efficiency",
      "Cash Flow Quality",
      "Growth Indicators"
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Ratios</h1>
          <p className="text-gray-500">Advanced financial performance metrics and ratio analysis.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <ComparisonControls 
                comparisonMode={comparisonMode}
                setComparisonMode={setComparisonMode}
                onTargetDataChange={(meta, reports) => { setTargetMeta(meta); setTargetReports(reports); }}
            />
            <div className="flex items-center bg-white p-2 rounded-lg border border-gray-200 shadow-sm relative min-w-[160px]">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
                <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-transparent text-sm font-medium text-gray-700 focus:outline-none appearance-none cursor-pointer"
                >
                {years.map((y) => (<option key={y} value={y}>{y}</option>))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 pointer-events-none" />
            </div>
        </div>
      </div>

      {dupontData && (
        <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400 flex items-center flex-wrap">
            Analyzing{" "}
            <span className="font-medium text-gray-600 mx-1">{dupontData.period}</span>
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
                <span className="ml-1 text-orange-400">(Comparison data unavailable)</span>
            )}
          </p>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold hidden sm:block">Standardized Financial Analysis</div>
        </div>
      )}

      {dupontData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
            <div><h2 className="text-lg font-semibold text-gray-800">DuPont Identity (ROE Decomposition)</h2></div>
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 hidden sm:block">ROE = Net Margin × Asset Turnover × Fin. Leverage</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
              <span className="text-sm text-blue-600 font-medium mb-1">Return on Equity</span>
              <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-bold text-blue-900">{formatPercent(dupontData.current.roe)}</span>
                  {dupontData.comparison && (<span className="text-lg text-blue-400 font-medium">vs {formatPercent(dupontData.comparison.roe)}</span>)}
              </div>
              <span className="text-xs text-blue-400 mt-2">Owner Value Creation</span>
            </div>
            <div className="flex items-center justify-center text-gray-300"><span className="text-2xl">=</span></div>
            <div className="grid grid-cols-3 col-span-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center flex flex-col justify-between">
                <div className="text-xs text-gray-500 font-medium uppercase mb-1">Profitability</div>
                <div>
                    <div className="text-xl font-bold text-gray-900">{formatPercent(dupontData.current.netMargin)}</div>
                    {dupontData.comparison && (<div className="text-base text-gray-400 font-medium mt-1">vs {formatPercent(dupontData.comparison.netMargin)}</div>)}
                </div>
                <div className="text-xs text-gray-400 mt-2">Net Margin</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center flex flex-col justify-between">
                <div className="text-xs text-gray-500 font-medium uppercase mb-1">Efficiency</div>
                <div>
                    <div className="text-xl font-bold text-gray-900">{formatNumber(dupontData.current.assetTurnover)}x</div>
                    {dupontData.comparison && (<div className="text-base text-gray-400 font-medium mt-1">vs {formatNumber(dupontData.comparison.assetTurnover)}x</div>)}
                </div>
                <div className="text-xs text-gray-400 mt-2">Asset Turnover</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center flex flex-col justify-between">
                <div className="text-xs text-gray-500 font-medium uppercase mb-1">Leverage</div>
                <div>
                    <div className="text-xl font-bold text-gray-900">{formatNumber(dupontData.current.equityMultiplier)}x</div>
                    {dupontData.comparison && (<div className="text-base text-gray-400 font-medium mt-1">vs {formatNumber(dupontData.comparison.equityMultiplier)}x</div>)}
                </div>
                <div className="text-xs text-gray-400 mt-2">Equity Multiplier</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div key={cat} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50"><h3 className="font-semibold text-gray-800">{cat}</h3></div>
            <div className="p-0">
              <table className="w-full text-left">
                <thead className="bg-gray-50/20 text-xs text-gray-400 uppercase tracking-wider font-medium">
                    <tr>
                        <th className="px-6 py-3">Metric</th>
                        <th className="px-4 py-3 text-right">Current</th>
                        <th className="px-4 py-3 text-right whitespace-nowrap">{comparisonMode === 'Target' ? 'Target' : 'Previous'}</th>
                        <th className="px-4 py-3 text-right">Diff</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayMetrics.filter((m) => m.category === cat).map((metric) => (
                      <tr key={metric.name} className="group hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 group relative">
                              <span className="font-medium text-gray-900 text-sm cursor-help">{metric.name}</span>
                              {metric.formula && (
                                  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10 w-max max-w-[250px] p-2 bg-gray-800 text-white text-xs rounded shadow-lg transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
                                      {metric.formula}
                                      <div className="absolute left-4 top-full -mt-1 border-4 border-transparent border-t-gray-800"></div>
                                  </div>
                              )}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{metric.description}</div>
                        </td>
                        <td className="px-4 py-4 text-right"><div className="font-bold text-gray-900">{metric.value}</div></td>
                        <td className="px-4 py-4 text-right"><div className="font-medium text-gray-500">{metric.compareValue}</div></td>
                        <td className="px-4 py-4 text-right w-24">
                          <div className="flex items-center justify-end space-x-1">
                            {metric.trend === "up" && (<ArrowUpRight className="w-4 h-4 text-green-500" />)}
                            {metric.trend === "down" && (<ArrowDownRight className="w-4 h-4 text-red-500" />)}
                            {metric.trend === "stable" && (<Minus className="w-4 h-4 text-gray-300" />)}
                            <span className={clsx("text-xs font-medium", metric.trend === "up" ? "text-green-600" : metric.trend === "down" ? "text-red-600" : "text-gray-400")}>{metric.change}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {displayMetrics.filter((m) => m.category === cat).length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-400 text-sm">No data available</td></tr>
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