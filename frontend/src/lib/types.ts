export interface FinancialDataPoint {
  account: string;
  value: number;
  year: string;
  type: "Income Statement" | "Balance Sheet" | "Cash Flow Statement";
}

export interface ParsedSheetData {
  fileName: string;
  type: string;
  data: FinancialDataPoint[];
}

// --- LLM Report Types ---

export interface MetricTrend {
  metric_name: string;
  current_value: number;
  previous_value?: number;
  yoy_change_percent?: number;
  trend_direction: "increasing" | "decreasing" | "stable";
}

export interface ActiveFlag {
  flag_name: string;
  flag_type: "Red" | "Green";
  severity: "Critical" | "Warning" | "Positive";
  triggered_value: string;
  threshold: string;
  description: string;
}

export interface AnalysisContext {
  company_name: string;
  stock_code: string;
  fiscal_year: string;
  period_type: string;
  key_metrics: Record<string, number>;
  trends: MetricTrend[];
  active_flags: ActiveFlag[];
  missing_data: string[];
}

export interface ReportRequest {
  report_profile: "executive_summary" | "forensic_deep_dive" | "health_check";
  model_provider: "gemini" | "deepseek" | "qwen";
  include_reasoning?: boolean;
}

export interface GeneratedReportSection {
  section_title: string;
  content_markdown: string;
}

export interface GeneratedReport {
  title: string;
  profile_used: string;
  model_used: string;
  sections: GeneratedReportSection[];
  full_markdown: string;
  verification_notes?: string[];
}
