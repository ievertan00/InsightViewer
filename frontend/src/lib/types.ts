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
