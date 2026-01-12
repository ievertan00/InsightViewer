import { AnalysisContext, ReportRequest, GeneratedReport, MetricTrend, ActiveFlag } from "./types";
import { analyzeFlags } from "./flagsEngine";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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
export function extractAnalysisContext(reports: any[]): AnalysisContext {
  if (!reports || reports.length === 0) {
    throw new Error("No reports available to analyze");
  }

  // Sort by year desc to get latest
  const sorted = [...reports].sort((a, b) => b.fiscal_year.localeCompare(a.fiscal_year));
  const latest = sorted[0];
  const previous = sorted[1];

  const d = latest.data;
  const pd = previous?.data;

  // 1. Key Metrics (Simplified for LLM)
  const key_metrics: Record<string, number> = {
    revenue: getVal(d, "income_statement.total_operating_revenue"),
    net_profit: getVal(d, "income_statement.net_profit.net_profit_attr_to_parent"),
    operating_cash_flow: getVal(d, "cash_flow_statement.operating_activities.net_cash_flow_from_operating"),
    total_assets: getVal(d, "balance_sheet.assets_summary.total_assets"),
    total_liabilities: getVal(d, "balance_sheet.liabilities_summary.total_liabilities"),
    cash_and_equiv: getVal(d, "balance_sheet.current_assets.monetary_funds"),
  };

  // 2. Computed Trends
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

  // 3. Active Flags
  const computedFlags = analyzeFlags(reports);
  const active_flags: ActiveFlag[] = computedFlags.map(f => ({
    flag_name: f.name,
    flag_type: f.type as "Red" | "Green",
    severity: f.type === "Red" ? "Critical" : "Positive",
    triggered_value: f.value,
    threshold: f.threshold,
    description: f.description
  }));

  return {
    company_name: latest.company_meta?.name || "Unknown Company",
    stock_code: latest.company_meta?.stock_code || "N/A",
    fiscal_year: latest.fiscal_year,
    period_type: latest.period_type,
    key_metrics,
    trends,
    active_flags,
    missing_data: [] // Can be populated by parsing logic later
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
