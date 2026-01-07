/**
 * flagsEngine.ts
 * Logic engine to evaluate financial health flags based on standardized reports.
 */

export interface FlagResult {
  name: string;
  category: "Liquidity" | "Revenue" | "Cost" | "Asset" | "Debt" | "Earnings" | "Growth";
  type: "Red" | "Green" | "Info";
  status: boolean; // True if flag is triggered
  value: string;
  threshold: string;
  description: string;
}

// Helper to get nested value safely
const getVal = (data: any, path: string): number => {
  if (!data) return 0;
  const parts = path.split(".");
  let curr = data;
  for (const part of parts) {
    curr = curr?.[part];
  }
  return typeof curr === "number" ? curr : curr?.amount || 0;
};

// Safe division
const safeDiv = (num: number, den: number) => (den === 0 ? 0 : num / den);

// Safe growth calculation
const safeGrowth = (curr: number, prev: number) => prev !== 0 ? (curr - prev) / Math.abs(prev) : 0;

// Main Analysis Function
export const analyzeFlags = (reports: any[]): FlagResult[] => {
  if (!reports || reports.length < 2) return [];

  // Sort reports chronologically (Oldest -> Newest)
  const sorted = [...reports].sort((a, b) => parseInt(a.fiscal_year) - parseInt(b.fiscal_year));
  
  const curr = sorted[sorted.length - 1]; // Latest Year
  const prev = sorted[sorted.length - 2]; // Previous Year
  
  // Need 3 years for some trends? Let's stick to 2 for now, or check length
  const prev2 = sorted.length > 2 ? sorted[sorted.length - 3] : null;

  const flags: FlagResult[] = [];

  // --- 1. Extract Key Metrics (Current Year) ---
  const d = curr.data;
  const pd = prev.data;

  // Balance Sheet
  const cash = getVal(d, "balance_sheet.current_assets.monetary_funds");
  const totalAssets = getVal(d, "balance_sheet.assets_summary.total_assets");
  const totalDebt = getVal(d, "balance_sheet.current_liabilities.short_term_borrowings") +
                    getVal(d, "balance_sheet.non_current_liabilities.long_term_borrowings") +
                    getVal(d, "balance_sheet.non_current_liabilities.bonds_payable.amount");
  const shortTermDebt = getVal(d, "balance_sheet.current_liabilities.short_term_borrowings") + 
                        getVal(d, "balance_sheet.current_liabilities.non_current_liabilities_due_within_1y");
  const inventory = getVal(d, "balance_sheet.current_assets.inventories");
  const ar = getVal(d, "balance_sheet.current_assets.notes_and_accounts_receivable.amount");
  const goodwill = getVal(d, "balance_sheet.non_current_assets.goodwill");
  const payables = getVal(d, "balance_sheet.current_liabilities.notes_and_accounts_payable.amount");

  // Income Statement
  const revenue = getVal(d, "income_statement.total_operating_revenue");
  const interestExp = getVal(d, "income_statement.total_operating_cost.financial_expenses.interest_expenses");
  const netIncome = getVal(d, "income_statement.net_profit.net_profit_attr_to_parent");
  const costOfSales = getVal(d, "income_statement.total_operating_cost.operating_cost");
  const operatingProfit = getVal(d, "income_statement.operating_profit.amount");
  const otherIncome = getVal(d, "income_statement.other_operating_income.other_income") + 
                      getVal(d, "income_statement.other_operating_income.investment_income"); 
  const totalProfit = getVal(d, "income_statement.total_profit.amount");

  // Cash Flow
  const ocf = getVal(d, "cash_flow_statement.operating_activities.net_cash_flow_from_operating");
  const capex = getVal(d, "cash_flow_statement.investing_activities.cash_paid_for_assets");
  const fcf = ocf - capex;

  // --- Previous Year Metrics ---
  const prevRevenue = getVal(pd, "income_statement.total_operating_revenue");
  const prevNetIncome = getVal(pd, "income_statement.net_profit.net_profit_attr_to_parent");
  const prevOCF = getVal(pd, "cash_flow_statement.operating_activities.net_cash_flow_from_operating");
  const prevAR = getVal(pd, "balance_sheet.current_assets.notes_and_accounts_receivable.amount");
  const prevInventory = getVal(pd, "balance_sheet.current_assets.inventories");
  const prevCostOfSales = getVal(pd, "income_statement.total_operating_cost.operating_cost");
  const prevPayables = getVal(pd, "balance_sheet.current_liabilities.notes_and_accounts_payable.amount");
  const prevFCF = prevOCF - getVal(pd, "cash_flow_statement.investing_activities.cash_paid_for_assets");

  // --- Derived Calculations ---
  const ebitdaProxy = totalProfit + interestExp + getVal(d, "cash_flow_statement.supplementary_info.net_profit_adjustment.depreciation_fixed_assets_investment_props"); // Approx
  const ebit = totalProfit + interestExp;

  // Growth Rates (Using safeGrowth)
  const revGrowth = safeGrowth(revenue, prevRevenue);
  const niGrowth = safeGrowth(netIncome, prevNetIncome);
  const ocfGrowth = safeGrowth(ocf, prevOCF);
  const arGrowth = safeGrowth(ar, prevAR);
  const invGrowth = safeGrowth(inventory, prevInventory);

  // DSO & DPO
  const dso = safeDiv(ar * 365, revenue);
  const prevDSO = safeDiv(prevAR * 365, prevRevenue);
  const dpo = safeDiv(payables * 365, costOfSales);
  const prevDPO = safeDiv(prevPayables * 365, prevCostOfSales);
  const dpoGrowth = safeGrowth(dpo, prevDPO);

  // Margins
  const grossMargin = safeDiv(revenue - costOfSales, revenue);
  const prevGrossMargin = safeDiv(prevRevenue - prevCostOfSales, prevRevenue);
  const opMargin = safeDiv(operatingProfit, revenue);
  const prevOpMargin = safeDiv(getVal(pd, "income_statement.operating_profit.amount"), prevRevenue);


  // ==========================
  // 🔴 RED FLAGS (Risk)
  // ==========================

  // 1. Kangde Xin Paradox
  const intToDebt = totalDebt > 0 ? (interestExp / totalDebt) : 0;
  flags.push({
    name: "Kangde Xin Paradox",
    category: "Liquidity",
    type: "Red",
    status: (cash / totalAssets > 0.20) && (intToDebt > 0.05),
    value: `Cash/Assets: ${(safeDiv(cash, totalAssets)*100).toFixed(1)}%, Int/Debt: ${(intToDebt*100).toFixed(1)}%`,
    threshold: "> 20% & > 5%",
    description: "High cash balance coexisting with high-interest debt suggests cash might be restricted or fictitious."
  });

  // 2. Cash vs Profit Divergence
  flags.push({
    name: "Cash-Profit Divergence",
    category: "Earnings",
    type: "Red",
    status: niGrowth > 0.10 && ocfGrowth <= 0,
    value: `NI Growth: ${(niGrowth*100).toFixed(1)}%, OCF Growth: ${(ocfGrowth*100).toFixed(1)}%`,
    threshold: "NI > 10% & OCF <= 0%",
    description: "Profits are growing rapidly while cash flow is stagnant or falling, indicating low quality earnings."
  });

  // 3. OCF/NI Ratio
  flags.push({
    name: "Low OCF/NI Ratio",
    category: "Earnings",
    type: "Red",
    status: ocf / netIncome < 0.8,
    value: `Ratio: ${(ocf/netIncome).toFixed(2)}`,
    threshold: "< 0.8",
    description: "Operating cash flow is significantly lower than reported net income."
  });

  // 4. Aggressive Revenue Recognition
  flags.push({
    name: "Aggressive Revenue Rec.",
    category: "Revenue",
    type: "Red",
    status: arGrowth > 2.0 * revGrowth && revGrowth > 0,
    value: `AR Growth: ${(arGrowth*100).toFixed(1)}% vs Rev Growth: ${(revGrowth*100).toFixed(1)}%`,
    threshold: "AR Growth > 2x Revenue Growth",
    description: "Receivables are growing much faster than revenue, suggesting channel stuffing or delayed collections."
  });

  // 5. Rising DSO
  flags.push({
    name: "Rising DSO",
    category: "Revenue",
    type: "Red",
    status: dso - prevDSO > 15,
    value: `Change: +${(dso - prevDSO).toFixed(0)} days`,
    threshold: "> +15 days",
    description: "It is taking significantly longer to collect payment from customers."
  });

  // 6. Inventory Buildup
  flags.push({
    name: "Inventory Buildup",
    category: "Asset",
    type: "Red",
    status: invGrowth > 1.5 * revGrowth && revGrowth > 0,
    value: `Inv Growth: ${(invGrowth*100).toFixed(1)}% vs Rev Growth: ${(revGrowth*100).toFixed(1)}%`,
    threshold: "Inv Growth > 1.5x Revenue Growth",
    description: "Inventory is growing faster than sales, risking obsolescence or write-downs."
  });

  // 7. Total Accruals
  flags.push({
    name: "High Total Accruals",
    category: "Earnings",
    type: "Red",
    status: (netIncome - ocf) / totalAssets > 0.10,
    value: `Accruals/Assets: ${(((netIncome - ocf) / totalAssets)*100).toFixed(1)}%`,
    threshold: "> 10%",
    description: "Earnings are driven heavily by non-cash accruals rather than cash flow."
  });

  // 8. Goodwill Density
  flags.push({
    name: "High Goodwill",
    category: "Asset",
    type: "Red",
    status: goodwill / totalAssets > 0.40,
    value: `Goodwill/Assets: ${(goodwill/totalAssets*100).toFixed(1)}%`,
    threshold: "> 40%",
    description: "A large portion of assets is Goodwill, posing a risk of future impairment."
  });

  // 9. Debt Cliff
  flags.push({
    name: "Debt Cliff",
    category: "Debt",
    type: "Red",
    status: shortTermDebt / totalDebt > 0.50,
    value: `ST Debt ratio: ${(shortTermDebt/totalDebt*100).toFixed(1)}%`,
    threshold: "> 50%",
    description: "Reliance on short-term debt exposes the company to refinancing risks."
  });

  // 10. Margin Divergence
  flags.push({
    name: "Margin Divergence",
    category: "Cost",
    type: "Red",
    status: grossMargin > prevGrossMargin && opMargin < prevOpMargin,
    value: `GM: Up, OM: Down`,
    threshold: "GM Rising & OM Falling",
    description: "Gross margin improved but Operating margin declined, suggesting rising overheads or expense reclassification."
  });

  // 11. Negative FCF (New)
  // Checking current and previous year
  flags.push({
    name: "Negative FCF",
    category: "Liquidity",
    type: "Red",
    status: fcf < 0 && prevFCF < 0,
    value: `Current: ${(fcf/1e8).toFixed(2)}B, Prev: ${(prevFCF/1e8).toFixed(2)}B`,
    threshold: "Negative for > 1 year",
    description: "Free Cash Flow has been negative for consecutive periods despite any reported profits."
  });

  // 12. Payables Stretch (New)
  flags.push({
    name: "Payables Stretch",
    category: "Liquidity",
    type: "Red",
    status: dpoGrowth > 0.20,
    value: `DPO Growth: ${(dpoGrowth*100).toFixed(1)}%`,
    threshold: "> 20% YoY",
    description: "Days Payable Outstanding increased significantly, potentially delaying payments to suppliers to boost cash."
  });

  // 13. VAT-Revenue Gap (Removed)

  // 14. Non-Core Revenue (New)
  flags.push({
    name: "Non-Core Revenue Dependence",
    category: "Earnings",
    type: "Red",
    status: otherIncome / ebit > 0.15,
    value: `Ratio: ${(otherIncome/ebit*100).toFixed(1)}%`,
    threshold: "> 15% of EBIT",
    description: "A significant portion of profit comes from non-operating sources (investment income, subsidies, etc.)."
  });


  // ==========================
  // 🟢 GREEN FLAGS (Health)
  // ==========================

  // 15. Cash-Backed Profits
  flags.push({
    name: "Cash-Backed Profits",
    category: "Earnings",
    type: "Green",
    status: ocf / netIncome > 1.1,
    value: `Ratio: ${(ocf/netIncome).toFixed(2)}`,
    threshold: "> 1.1",
    description: "Operating Cash Flow exceeds Net Income, indicating high quality of earnings."
  });

  // 16. Self-Funding Capability
  flags.push({
    name: "Self-Funding",
    category: "Growth",
    type: "Green",
    status: ocf / capex > 1.5,
    value: `Ratio: ${(ocf/capex).toFixed(2)}`,
    threshold: "> 1.5",
    description: "The company generates enough cash to fully fund its capital expenditures and growth."
  });

  // 17. Conservative Leverage
  // Net Debt = Total Debt - Cash
  const netDebt = totalDebt - cash;
  flags.push({
    name: "Conservative Leverage",
    category: "Debt",
    type: "Green",
    status: netDebt / ebitdaProxy < 2.0 && netDebt > 0, // Only if net debt is positive (if neg, it's super safe/cash rich)
    value: `Net Debt/EBITDA: ${(netDebt/ebitdaProxy).toFixed(2)}`,
    threshold: "< 2.0x",
    description: "Debt levels are low relative to earnings, indicating a strong balance sheet."
  });

  return flags.filter(f => f.status || f.type === "Info");
};
