"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import ChartCard from "@/components/charts/ChartCard";
import StructureAreaChart from "@/components/charts/StructureAreaChart";
import TrendLineChart from "@/components/charts/TrendLineChart";
import CompositionBarChart from "@/components/charts/CompositionBarChart";
import FlowBarChart from "@/components/charts/FlowBarChart";
import GrowthComboChart from "@/components/charts/GrowthComboChart";
import SankeyChart from "@/components/charts/SankeyChart";
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
  mapLeverageTrends,
  mapProfitVsCashFlow,
  mapOperatingCashFlowDetail,
  mapInvestingCashFlowDetail,
  mapFinancingCashFlowDetail,
  mapSankeyData,
  getFiscalYearScore,
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
  const [sankeyData, setSankeyData] = useState<any>({ nodes: [], links: [] });
  const [leverageData, setLeverageData] = useState<any[]>([]);
  const [profitVsCashData, setProfitVsCashData] = useState<any[]>([]);
  const [ocfDetailData, setOcfDetailData] = useState<any[]>([]);
  const [icfDetailData, setIcfDetailData] = useState<any[]>([]);
  const [fcfDetailData, setFcfDetailData] = useState<any[]>([]);

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
          setSankeyData(mapSankeyData(filtered));
          setLeverageData(mapLeverageTrends(filtered));
          setProfitVsCashData(mapProfitVsCashFlow(filtered));
          setOcfDetailData(mapOperatingCashFlowDetail(filtered));
          setIcfDetailData(mapInvestingCashFlowDetail(filtered));
          setFcfDetailData(mapFinancingCashFlowDetail(filtered));
        }
      } catch (e) {
        console.error("Error parsing reports", e);
      }
    }
  }, [filterType]);

  if (reports.length === 0 && filterType === "All") {
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
                {type}
              </button>
            ))}
          </div>
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
          <ChartCard title="Net Profit vs Operating Cash Flow">
            <TrendLineChart
              data={profitVsCashData}
              dataKeys={["Net Profit", "Operating CF"]}
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

      {/* 2. Liquidity & Cycle Analysis */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        Liquidity & Cycle Analysis
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Liquidity Ratios Trend">
          <TrendLineChart
            data={liquidityData}
            dataKeys={["Current Ratio", "Quick Ratio", "Cash Ratio"]}
            colors={[COLORS.blue, COLORS.green, COLORS.orange]}
          />
        </ChartCard>
        <ChartCard title="Working Capital Cycle (Days)">
          <TrendLineChart
            data={wcCycleData}
            dataKeys={["DIO", "DSO", "DPO", "CCC"]}
            colors={[COLORS.blue, COLORS.orange, COLORS.grey, COLORS.purple]}
          />
        </ChartCard>
        <ChartCard title="Equity Multiplier (Leverage)">
          <TrendLineChart
            data={leverageData}
            dataKeys={["Equity Multiplier"]}
            colors={[COLORS.lightBlue]}
          />
        </ChartCard>
      </div>

      {/* 3. Efficiency & Cost */}
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
              COLORS.lightBlue,
              COLORS.blue,
            ]}
          />
        </ChartCard>
      </div>

      {/* 3. Cash Flow & Growth */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        Cash Flow & Growth
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Cash Flow Summary">
            <FlowBarChart
              data={cashFlowData}
              dataKeys={["Operating CF", "Investing CF", "Financing CF"]}
              colors={[COLORS.red, COLORS.orange, COLORS.blue]}
            />
          </ChartCard>
          <ChartCard title="OCF vs Capex vs FCF Trend">
            <TrendLineChart
              data={capexData}
              dataKeys={["Operating CF", "Capex", "Free CF"]}
              colors={[COLORS.green, COLORS.darkBlue, COLORS.orange]}
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
        
        <h3 className="text-lg font-semibold text-gray-700 mt-4">Detailed Cash Flow Breakdown</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <ChartCard title="Investing Cash Flow Detail">
            <FlowBarChart
              data={icfDetailData}
              dataKeys={[
                "Inv. Recovery", "Inv. Income", "Asset Disposal", "Sub. Disposal", "Other Investing In",
                "Asset Purchase", "Inv. Payment", "Sub. Purchase", "Other Investing Out"
              ]}
              colors={[COLORS.lightBlue, COLORS.orange, COLORS.grey, COLORS.yellow, COLORS.darkBlue, COLORS.green, COLORS.blue, COLORS.purple, COLORS.brown]}
              stacked={true}
            />
          </ChartCard>
          <ChartCard title="Financing Cash Flow Detail">
            <FlowBarChart
              data={fcfDetailData}
              dataKeys={[
                "Inv. Received", "Borrowings Rec.", "Bond Issue", "Other Financing In",
                "Debt Repayment", "Div/Profit/Int Paid", "Other Financing Out"
              ]}
              colors={[COLORS.lightBlue, COLORS.orange, COLORS.grey, COLORS.yellow, COLORS.darkBlue, COLORS.green, COLORS.blue]}
              stacked={true}
            />
          </ChartCard>
        </div>
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

      {/* 5. Income Flow Analysis */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">
        Income Flow Analysis (Latest Period)
      </h2>
      <div className="space-y-8">
        <ChartCard title="Income Statement Sankey Diagram" height={500}>
          <SankeyChart data={sankeyData} />
        </ChartCard>
      </div>
    </div>
  );
}