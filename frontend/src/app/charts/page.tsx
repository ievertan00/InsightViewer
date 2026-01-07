"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import ChartCard from "@/components/charts/ChartCard";
import StructureAreaChart from "@/components/charts/StructureAreaChart";
import TrendLineChart from "@/components/charts/TrendLineChart";
import CompositionBarChart from "@/components/charts/CompositionBarChart";
import FlowBarChart from "@/components/charts/FlowBarChart";
import GrowthComboChart from "@/components/charts/GrowthComboChart";
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
} from "@/lib/chartDataMapper";

// --- Color Constants (from Financial Visualization.md) ---
const COLORS = {
  red: "#C00000",
  orange: "#ED7D31",
  grey: "#A5A5A5",
  yellow: "#FFC000",
  blue: "#4472C4",
  green: "#70AD47",
  darkBlue: "#255E91",
  lightBlue: "#5B9BD5",
  darkGrey: "#595959",
  lightGrey: "#D9D9D9",
  paleYellow: "#FFF2CC",
  brown: "#C65911",
  cyan: "#00B0F0",
  purple: "#7030A0",
};

const ASSET_COLORS = [
  COLORS.red,
  COLORS.orange,
  COLORS.grey,
  COLORS.yellow,
  COLORS.blue,
  COLORS.green,
  COLORS.darkBlue,
  "#AFABAB",
  COLORS.lightGrey,
  "#997300",
  "#E7E6E6",
  "#404040",
];

const LIABILITY_COLORS = [
  COLORS.lightBlue,
  COLORS.orange,
  COLORS.grey,
  COLORS.yellow,
  COLORS.blue,
  COLORS.green,
  COLORS.darkBlue,
  "#9E480E",
  "#636363",
];

const EQUITY_COLORS = [
  COLORS.blue,
  COLORS.lightBlue,
  "#DAE3F3",
  COLORS.grey,
  "#2F5597",
  "#548235",
  "#D0CECE",
  "#e96e1de1",
  COLORS.darkGrey,
];

const PROFIT_SOURCE_COLORS = [
  COLORS.blue,
  COLORS.orange,
  COLORS.yellow,
  COLORS.green,
  COLORS.lightBlue,
  COLORS.lightGrey,
  COLORS.brown,
  COLORS.darkGrey,
  COLORS.grey,
];

export default function ChartsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [annualOnly, setAnnualOnly] = useState(true);

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

  useEffect(() => {
    const storedReports = localStorage.getItem("insight_viewer_reports");
    if (storedReports) {
      try {
        const parsed = JSON.parse(storedReports);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sort ASC for charts (Time series left to right)
          const sorted = [...parsed].sort((a: any, b: any) => {
            const yA = parseInt(a.fiscal_year.split(" ")[0]);
            const yB = parseInt(b.fiscal_year.split(" ")[0]);

            if (yA !== yB) return yA - yB;

            // Same year, sort by period priority
            const priority: Record<string, number> = {
              Q1: 1,
              Q2: 2,
              Q3: 3,
              Q4: 4,
              Annual: 10,
            };
            const pA =
              a.period_type ||
              (a.fiscal_year.includes("Annual") ? "Annual" : "Q4");
            const pB =
              b.period_type ||
              (b.fiscal_year.includes("Annual") ? "Annual" : "Q4");
            return (priority[pA] || 0) - (priority[pB] || 0);
          });

          // Filter for Annual if toggle is on
          const filtered = annualOnly
            ? sorted.filter(
                (r: any) =>
                  r.period_type === "Annual" || r.fiscal_year.includes("Annual")
              )
            : sorted;

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
        }
      } catch (e) {
        console.error("Error loading reports", e);
      }
    }
  }, [annualOnly]);

  if (reports.length === 0 && !annualOnly) {
    return (
      <div className="p-10 text-center text-gray-500">
        No report data found. Please import data first.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Charts</h1>
          <p className="text-gray-500">
            Visual analysis of financial structure and performance.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAnnualOnly(!annualOnly)}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
              annualOnly
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            {annualOnly ? "Annual Data Only" : "All Periods"}
          </button>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
            Unit: 100 Million CNY
          </div>
        </div>
      </div>

      {/* 1. Profitability Trends */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        Profitability Trends
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Return Metrics (%)">
            <TrendLineChart
              data={profitTrendData}
              dataKeys={["ROE", "Net Margin", "Gross Margin"]}
              colors={[COLORS.lightBlue, COLORS.red, COLORS.green]}
              unit="%"
            />
          </ChartCard>
          <ChartCard title="Revenue vs Cash Collection">
            <TrendLineChart
              data={revenueVsCashData}
              dataKeys={["Revenue", "Cash From Sales"]}
              colors={[COLORS.blue, COLORS.red]}
            />
          </ChartCard>
        </div>

        <ChartCard title="Profit Sources Breakdown">
          <FlowBarChart
            data={profitSourceData}
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
            ]}
            colors={PROFIT_SOURCE_COLORS}
          />
        </ChartCard>
      </div>

      {/* 2. Efficiency & Cost */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        Efficiency & Cost Structure
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Turnover Ratios">
          <TrendLineChart
            data={efficiencyData}
            dataKeys={[
              "Inventory Turnover",
              "AR Turnover",
              "Fixed Asset Turnover",
              "Total Asset Turnover",
            ]}
            colors={[COLORS.blue, COLORS.orange, COLORS.grey, COLORS.yellow]}
          />
        </ChartCard>
        <ChartCard title="Cost & Expense Structure (%)">
          <CompositionBarChart
            data={costData}
            dataKeys={[
              "COGS",
              "Tax & Surcharge",
              "Selling Exp",
              "Admin Exp",
              "R&D Exp",
              "Main Profit",
            ]}
            colors={[
              COLORS.red,
              COLORS.brown,
              "#F4B084",
              COLORS.yellow,
              COLORS.paleYellow,
              COLORS.blue,
            ]}
          />
        </ChartCard>
      </div>

      {/* 3. Cash Flow & Growth */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        Cash Flow & Growth
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Cash Flow Summary">
          <FlowBarChart
            data={cashFlowData}
            dataKeys={["Operating CF", "Investing CF", "Financing CF"]}
            colors={[COLORS.red, COLORS.orange, COLORS.blue]}
          />
        </ChartCard>
        <ChartCard title="Revenue Growth">
          <GrowthComboChart
            data={growthData}
            barKey="Revenue"
            lineKey="Revenue Growth"
            barColor={COLORS.blue}
            lineColor={COLORS.orange}
          />
        </ChartCard>
        <ChartCard title="Net Profit Growth">
          <GrowthComboChart
            data={growthData}
            barKey="Net Profit"
            lineKey="Net Profit Growth"
            barColor={COLORS.lightBlue}
            lineColor={COLORS.orange}
          />
        </ChartCard>
      </div>

      {/* 4. Structure Analysis */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        Structure Analysis
      </h2>
      <div className="space-y-8">
        <ChartCard title="Asset Structure">
          <StructureAreaChart
            data={assetData}
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
            ]}
            colors={ASSET_COLORS}
          />
        </ChartCard>
        <ChartCard title="Liability Structure">
          <StructureAreaChart
            data={liabilityData}
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
            ]}
            colors={LIABILITY_COLORS}
          />
        </ChartCard>
        <ChartCard title="Equity Structure">
          <StructureAreaChart
            data={equityData}
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
            ]}
            colors={EQUITY_COLORS}
          />
        </ChartCard>
      </div>
    </div>
  );
}
