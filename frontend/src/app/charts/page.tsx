"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import ChartCard from "@/components/charts/ChartCard";
import StructureAreaChart from "@/components/charts/StructureAreaChart";
import TrendLineChart from "@/components/charts/TrendLineChart";
import CompositionBarChart from "@/components/charts/CompositionBarChart";
import FlowBarChart from "@/components/charts/FlowBarChart";
import GrowthComboChart from "@/components/charts/GrowthComboChart";
import { useLanguage } from "@/lib/LanguageContext";
import {
  mapAssetStructure,
  mapLiabilityStructure,
  mapEquityStructure,
  mapProfitabilityTrends,
  mapEfficiencyMetrics,
  mapCostStructure,
  mapProfitSources,
  mapCashFlowSummary,
  mapGrowthIndicators,
  mapRevenueVsCash,
  mapCapexTrend,
  mapLiquidityTrends,
  mapWorkingCapitalCycle,
  mapDebtToAssetDelta,
  mapProfitVsCashFlow,
  getFiscalYearScore,
} from "@/lib/chartDataMapper";

// --- Color Constants (Professional Tech Theme) ---
const COLORS = {
  red: "#EF4444",      // Red-500
  orange: "#F97316",   // Orange-500
  yellow: "#EAB308",   // Yellow-500
  green: "#10B981",    // Emerald-500
  cyan: "#06B6D4",     // Cyan-500
  blue: "#3B82F6",     // Blue-500
  darkBlue: "#1E3A8A", // Blue-900
  lightBlue: "#60A5FA",// Blue-400
  purple: "#8B5CF6",   // Violet-500
  grey: "#94A3B8",     // Slate-400
  darkGrey: "#475569", // Slate-600
  lightGrey: "#CBD5E1",// Slate-300
  paleYellow: "#FEF08A", // Yellow-200
  brown: "#92400E",    // Amber-800
};

const ASSET_COLORS = [
  COLORS.blue,        // Cash/Liquid
  COLORS.cyan,        // Receivables
  COLORS.lightBlue,   // Inventory
  COLORS.purple,      // Investments
  COLORS.darkBlue,    // Fixed Assets
  COLORS.grey,        // Intangibles
  COLORS.orange,      // Other
  COLORS.green,       // Biological/Special
  COLORS.red,         // Risky/Impaired
  COLORS.yellow,      // Other Current
  COLORS.darkGrey,    // Deferred
  COLORS.lightGrey,   // Other Non-Current
];

const LIABILITY_COLORS = [
  COLORS.red,         // Short-term Debt
  COLORS.orange,      // Payables
  COLORS.yellow,      // Contract Liabilities
  COLORS.brown,       // Tax Payable
  COLORS.darkBlue,    // Long-term Debt
  COLORS.purple,      // Bonds
  COLORS.cyan,        // Lease
  COLORS.grey,        // Provisions
  COLORS.darkGrey,    // Other
];

const EQUITY_COLORS = [
  COLORS.green,       // Capital
  COLORS.lightBlue,   // Reserves
  COLORS.cyan,        // Retained Earnings
  COLORS.blue,        // Minority Interest
  COLORS.purple,      // Other Equity
  COLORS.grey,        // Treasury
  COLORS.lightGrey,   // Translation Diff
  COLORS.orange,      // Special Reserves
  COLORS.darkGrey,    // General Risk Prep
];

const PROFIT_SOURCE_COLORS = [
  COLORS.blue,        // Revenue
  COLORS.cyan,        // Gross Profit
  COLORS.purple,      // Operating Profit
  COLORS.green,       // Net Profit
  COLORS.orange,      // Non-operating
  COLORS.red,         // Losses/Expenses
  COLORS.grey,        // Tax
  COLORS.darkBlue,    // Comprehensive
  COLORS.lightBlue,   // Minority
];

export default function ChartsPage() {
  const { t } = useLanguage();
  const [reports, setReports] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"Annual" | "Quarterly" | "Monthly" | "All">("Annual");

  // Data State
  const [assetData, setAssetData] = useState<any[]>([]);
  const [liabilityData, setLiabilityData] = useState<any[]>([]);
  const [equityData, setEquityData] = useState<any[]>([]);
  const [profitTrendData, setProfitTrendData] = useState<any[]>([]);
  const [efficiencyData, setEfficiencyData] = useState<any[]>([]);
  const [costData, setCostData] = useState<any[]>([]);
  const [profitSourceData, setProfitSourceData] = useState<any[]>([]);
  const [cashFlowData, setCashFlowData] = useState<any[]>([]);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [revenueVsCashData, setRevenueVsCashData] = useState<any[]>([]);
  const [capexData, setCapexData] = useState<any[]>([]);
  const [liquidityData, setLiquidityData] = useState<any[]>([]);
  const [wcCycleData, setWcCycleData] = useState<any[]>([]);
  const [debtAssetData, setDebtAssetData] = useState<any[]>([]);
  const [profitVsCashData, setProfitVsCashData] = useState<any[]>([]);

  // Helper to translate data keys within objects
  const translateData = (data: any[]) => {
    return data.map((item) => {
      const newItem: any = { ...item };
      Object.keys(item).forEach((key) => {
        // Skip metadata keys, translate metrics
        if (key !== "year" && key !== "fiscal_year" && key !== "period_type") {
          newItem[t(key)] = item[key];
        }
      });
      return newItem;
    });
  };

  useEffect(() => {
    const storedReports = localStorage.getItem("insight_viewer_reports");
    if (storedReports) {
      try {
        const parsed = JSON.parse(storedReports);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sort ASC using the robust helper
          const sorted = [...parsed].sort((a: any, b: any) => {
            return getFiscalYearScore(a.fiscal_year) - getFiscalYearScore(b.fiscal_year);
          });

          // Filter Logic
          const filtered = sorted.filter((r: any) => {
            const fy = r.fiscal_year || "";
            const pt = r.period_type || "";
            
            if (filterType === "All") return true;
            if (filterType === "Annual") return pt === "Annual" || fy.includes("Annual");
            if (filterType === "Quarterly") return pt === "Quarterly" || fy.includes("Q");
            if (filterType === "Monthly") return pt === "Monthly" || fy.includes("-") || fy.includes(".");
            return true;
          });

          setReports(filtered);

          // Map Data
          setAssetData(mapAssetStructure(filtered));
          setLiabilityData(mapLiabilityStructure(filtered));
          setEquityData(mapEquityStructure(filtered));
          setProfitTrendData(mapProfitabilityTrends(filtered));
          setEfficiencyData(mapEfficiencyMetrics(filtered));
          setCostData(mapCostStructure(filtered));
          setProfitSourceData(mapProfitSources(filtered));
          setCashFlowData(mapCashFlowSummary(filtered));
          setGrowthData(mapGrowthIndicators(filtered));
          setRevenueVsCashData(mapRevenueVsCash(filtered));
          setCapexData(mapCapexTrend(filtered));
          setLiquidityData(mapLiquidityTrends(filtered));
          setWcCycleData(mapWorkingCapitalCycle(filtered));
          setDebtAssetData(mapDebtToAssetDelta(filtered));
          setProfitVsCashData(mapProfitVsCashFlow(filtered));
        }
      } catch (e) {
        console.error("Error parsing reports", e);
      }
    }
  }, [filterType]);

  if (reports.length === 0 && filterType === "All") {
    return (
      <div className="p-10 text-center text-gray-500">
        {t('noDataFound')}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('chartsTitle')}</h1>
          <p className="text-gray-500">
            {t('chartsDesc')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(["Annual", "Quarterly", "Monthly", "All"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={clsx(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  filterType === type
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {type === "All" ? t('selectAll') : type === "Annual" ? "Annual" : type === "Quarterly" ? "Quarterly" : "Monthly"}
              </button>
            ))}
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
            {t('unitMillionCNY')}
          </div>
        </div>
      </div>

      {/* 1. Profitability Trends */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        {t('profitabilityTrends')}
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title={t('returnMetrics')}>
            <TrendLineChart
              data={translateData(profitTrendData)}
              dataKeys={["ROE", "Net Margin", "Gross Margin"].map(k => t(k))}
              colors={[COLORS.lightBlue, COLORS.red, COLORS.green]}
              unit="%"
            />
          </ChartCard>
          <ChartCard title={t('revenueVsCash')}>
            <TrendLineChart
              data={translateData(revenueVsCashData)}
              dataKeys={["Revenue", "Cash From Sales"].map(k => t(k))}
              colors={[COLORS.blue, COLORS.red]}
              unit="M"
            />
          </ChartCard>
          <ChartCard title={t('netProfitVsOCF')}>
            <TrendLineChart
              data={translateData(profitVsCashData)}
              dataKeys={["Net Profit", "Operating CF"].map(k => t(k))}
              colors={[COLORS.blue, COLORS.red]}
              unit="M"
            />
          </ChartCard>
        </div>

        <ChartCard title={t('profitSources')}>
          <FlowBarChart
            data={translateData(profitSourceData)}
            dataKeys={[
              "Main Business Profit",
              "Finance Expense",
              "Impairment Loss",
              "Fair Value Change",
              "Investment Income",
              "Asset Disposal",
              "Other Income",
              "Non-op Revenue",
              "Non-op Expense",
            ].map(k => t(k))}
            colors={PROFIT_SOURCE_COLORS}
            unit="M"
          />
        </ChartCard>
      </div>

      {/* 2. Liquidity & Cycle Analysis */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        {t('liquidityCycle')}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title={t('liquidityRatios')}>
          <TrendLineChart
            data={translateData(liquidityData)}
            dataKeys={["Current Ratio", "Quick Ratio", "Cash Ratio"].map(k => t(k))}
            colors={[COLORS.blue, COLORS.green, COLORS.orange]}
          />
        </ChartCard>
        <ChartCard title={t('workingCapitalCycle')}>
          <TrendLineChart
            data={translateData(wcCycleData)}
            dataKeys={["DIO", "DSO", "DPO", "CCC"].map(k => t(k))}
            colors={[COLORS.blue, COLORS.orange, COLORS.grey, COLORS.purple]}
            unit=" Days"
          />
        </ChartCard>
        <ChartCard title={t('debtToAsset')}>
          <GrowthComboChart
            data={translateData(debtAssetData)}
            barKey={t("Debt Ratio")}
            lineKey={t("Debt Ratio Delta")}
            barColor={COLORS.lightBlue}
            lineColor={COLORS.orange}
            barUnit="%"
          />
        </ChartCard>
      </div>

      {/* 3. Efficiency & Cost */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        {t('efficiencyCost')}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title={t('turnoverRatios')}>
          <TrendLineChart
            data={translateData(efficiencyData)}
            dataKeys={[
              "Inventory Turnover",
              "AR Turnover",
              "Fixed Asset Turnover",
              "Total Asset Turnover",
            ].map(k => t(k))}
            colors={[COLORS.blue, COLORS.orange, COLORS.grey, COLORS.yellow]}
          />
        </ChartCard>
        <ChartCard title={t('costStructure')}>
          <CompositionBarChart
            data={translateData(costData)}
            dataKeys={[
              "COGS",
              "Tax & Surcharge",
              "Selling Exp",
              "Admin Exp",
              "R&D Exp",
              "Main Profit",
            ].map(k => t(k))}
            colors={[
              COLORS.red,
              COLORS.brown,
              COLORS.orange,
              COLORS.yellow,
              COLORS.lightBlue,
              COLORS.blue,
            ]}
          />
        </ChartCard>
      </div>

      {/* 3. Cash Flow & Growth */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        {t('cashFlowGrowth')}
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title={t('cashFlowSummary')}>
            <FlowBarChart
              data={translateData(cashFlowData)}
              dataKeys={["Operating CF", "Investing CF", "Financing CF"].map(k => t(k))}
              colors={[COLORS.red, COLORS.orange, COLORS.blue]}
              unit="M"
            />
          </ChartCard>
          <ChartCard title={t('ocfCapexFcf')}>
            <TrendLineChart
              data={translateData(capexData)}
              dataKeys={["Operating CF", "Capex", "Free CF"].map(k => t(k))}
              colors={[COLORS.green, COLORS.darkBlue, COLORS.orange]}
              unit="M"
            />
          </ChartCard>
          <ChartCard title={t('revenueGrowth')}>
            <GrowthComboChart
              data={translateData(growthData)}
              barKey={t("Revenue")}
              lineKey={t("Revenue Growth")}
              barColor={COLORS.blue}
              lineColor={COLORS.orange}
              barUnit="M"
            />
          </ChartCard>
          <ChartCard title={t('netProfitGrowth')}>
            <GrowthComboChart
              data={translateData(growthData)}
              barKey={t("Net Profit")}
              lineKey={t("Net Profit Growth")}
              barColor={COLORS.lightBlue}
              lineColor={COLORS.orange}
              barUnit="M"
            />
          </ChartCard>
        </div>
      </div>

      {/* 4. Structure Analysis */}      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        {t('structureAnalysis')}
      </h2>
      <div className="space-y-8">
        <ChartCard title={t('assetStructure')}>
          <StructureAreaChart
            data={translateData(assetData)}
            dataKeys={[
              "Cash & Equiv Etc",
              "Receivables Etc",
              "Prepayments",
              "Inventory",
              "Other Current Assets",
              "Long-term Equity Invest",
              "Goodwill",
              "Fixed Assets",
              "Construction In Progress",
              "Right-of-use Assets",
              "Intangible Assets",
              "Other Assets",
            ].map(k => t(k))}
            colors={ASSET_COLORS}
            unit="M"
          />
        </ChartCard>
        <ChartCard title={t('liabilityStructure')}>
          <StructureAreaChart
            data={translateData(liabilityData)}
            dataKeys={[
              "Interest-bearing Debt",
              "Payables Etc",
              "Prepayments Received Etc",
              "Payroll Payable Etc",
              "Taxes Payable",
              "Other Payables",
              "Lease Liabilities",
              "Long-term Payables",
              "Other Liabilities",
            ].map(k => t(k))}
            colors={LIABILITY_COLORS}
            unit="M"
          />
        </ChartCard>
        <ChartCard title={t('equityStructure')}>
          <StructureAreaChart
            data={translateData(equityData)}
            dataKeys={[
              "Paid-in Capital",
              "Other Equity Instruments",
              "Capital Reserves",
              "Other Comprehensive Income",
              "Treasury Stock",
              "Special Reserves",
              "Surplus Reserves",
              "Undistributed Profit",
              "Minority Interests & Other",
            ].map(k => t(k))}
            colors={EQUITY_COLORS}
            unit="M"
          />
        </ChartCard>
      </div>
    </div>
  );
}