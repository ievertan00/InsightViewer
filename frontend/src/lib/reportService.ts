import { AnalysisContext, ReportRequest, GeneratedReport, MetricTrend, ActiveFlag } from "./types";
import { analyzeFlags } from "./flagsEngine";

import { API_BASE_URL } from "./config";


export async function generateReport(
  context: AnalysisContext,
  options: ReportRequest
): Promise<GeneratedReport> {
  const response = await fetch(`${API_BASE_URL}/report/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      context,
      options,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(errorData.detail || "Failed to generate report");
  }

  return response.json();
}

/**
 * Extracts LLM-ready context from standardized report data and computed flags.
 */
export function extractAnalysisContext(reports: any[], language: string = "en", companyName?: string): AnalysisContext {
  if (!reports || reports.length === 0) {
    throw new Error("No reports available to analyze");
  }

  // Sort by year desc to get latest
  const sorted = [...reports].sort((a, b) => b.fiscal_year.localeCompare(a.fiscal_year));
  const latest = sorted[0];
  const previous = sorted[1];

  const d = latest.data;
  const pd = previous?.data;

  // 1. Computed Trends
  const trends: MetricTrend[] = [];
  const metricsToTrack = [
    { name: "Revenue", path: "income_statement.total_operating_revenue" },
    { name: "Net Profit", path: "income_statement.net_profit.net_profit_attr_to_parent" },
    { name: "OCF", path: "cash_flow_statement.operating_activities.net_cash_flow_from_operating" },
  ];

  for (const m of metricsToTrack) {
    const curr = getVal(d, m.path);
    const prev = pd ? getVal(pd, m.path) : undefined;
    const yoy = prev ? ((curr - prev) / Math.abs(prev)) * 100 : undefined;
    
    trends.push({
      metric_name: m.name,
      current_value: curr,
      previous_value: prev,
      yoy_change_percent: yoy,
      trend_direction: yoy === undefined ? "stable" : yoy > 2 ? "increasing" : yoy < -2 ? "decreasing" : "stable"
    });
  }

  // 2. Active Flags
  const computedFlags = analyzeFlags(reports);
  const active_flags: ActiveFlag[] = computedFlags.map(f => ({
    flag_name: f.name,
    flag_type: f.type as "Red" | "Green",
    severity: f.type === "Red" ? "Critical" : "Positive",
    triggered_value: f.value,
    threshold: f.threshold,
    description: f.description
  }));

  // 3. Calculated Ratios
  const ratios = calculateRatios(d, pd, latest.period_type);

  return {
    company_name: companyName || latest.company_meta?.name || "Unknown Company",
    stock_code: latest.company_meta?.stock_code || "N/A",
    fiscal_year: latest.fiscal_year,
    period_type: latest.period_type,
    language,
    full_report: latest.data,
    ratios,
    trends,
    active_flags,
    missing_data: []
  };
}

// Helper to get nested value safely (duplicated for utility inside this service)
function getVal(data: any, path: string): number {
  if (!data) return 0;
  const parts = path.split(".");
  let curr = data;
  for (const part of parts) {
    curr = curr?.[part];
  }
  return typeof curr === "number" ? curr : curr?.amount || 0;
}

const safeDiv = (num: number, den: number) => (den === 0 ? 0 : num / den);

function calculateRatios(currentData: any, prevData: any, periodType: string): Record<string, number> {
    if (!currentData) return {};
    
    const isMonthly = periodType === "Monthly";
    const isQuarterly = periodType === "Quarterly";
    const flowMult = isMonthly ? 12 : isQuarterly ? 4 : 1;

    // Extract needed values
    const revenue = getVal(currentData, "income_statement.total_operating_revenue");
    const costOfSales = getVal(currentData, "income_statement.total_operating_cost.operating_cost");
    const grossProfit = revenue - costOfSales;
    const netIncome = getVal(currentData, "income_statement.net_profit.net_profit_attr_to_parent");
    const totalAssets = getVal(currentData, "balance_sheet.assets_summary.total_assets");
    const totalLiabilities = getVal(currentData, "balance_sheet.liabilities_summary.total_liabilities");
    const totalEquity = getVal(currentData, "balance_sheet.equity.total_equity");
    const currentAssets = getVal(currentData, "balance_sheet.current_assets.total_current_assets");
    const currentLiabilities = getVal(currentData, "balance_sheet.current_liabilities.total_current_liabilities");
    const inventory = getVal(currentData, "balance_sheet.current_assets.inventories");
    const ocf = getVal(currentData, "cash_flow_statement.operating_activities.net_cash_flow_from_operating");

    // Calculate
    return {
        gross_margin: safeDiv(grossProfit, revenue),
        net_profit_margin: safeDiv(netIncome, revenue),
        roe: safeDiv(netIncome * flowMult, totalEquity), // Simplified ROE
        roa: safeDiv(netIncome * flowMult, totalAssets),
        current_ratio: safeDiv(currentAssets, currentLiabilities),
        quick_ratio: safeDiv(currentAssets - inventory, currentLiabilities),
        debt_to_assets: safeDiv(totalLiabilities, totalAssets),
        debt_to_equity: safeDiv(totalLiabilities, totalEquity),
        asset_turnover: safeDiv(revenue * flowMult, totalAssets),
        inventory_turnover: safeDiv(costOfSales * flowMult, inventory)
    };
}
