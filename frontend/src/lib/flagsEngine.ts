/**
 * flagsEngine.ts
 * Logic engine to evaluate financial health flags based on standardized reports.
 */

export interface FlagResult {
  name: string;
  category:
    | "Liquidity"
    | "Revenue"
    | "Cost"
    | "Asset"
    | "Debt"
    | "Earnings"
    | "Growth";
  type: "Red" | "Green" | "Info";
  status: boolean; // True if flag is triggered
  value: string;
  threshold: string;
  logic: string;
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
const safeGrowth = (curr: number, prev: number) =>
  prev !== 0 ? (curr - prev) / Math.abs(prev) : 0;

// Main Analysis Function
export const analyzeFlags = (reports: any[]): FlagResult[] => {
  if (!reports || reports.length < 2) return [];

  // Sort reports chronologically (Oldest -> Newest)
  const getFiscalScore = (fy: string) => {
    const year = parseInt(fy) || 0;
    let weight = 0.4; // Default to Annual (highest within year)
    const lower = fy.toLowerCase();
    
    if (lower.includes("q1")) weight = 0.1;
    else if (lower.includes("q2") || lower.includes("semi")) weight = 0.2;
    else if (lower.includes("q3")) weight = 0.3;
    else if (lower.includes("annual") || lower.includes("q4")) weight = 0.4;
    else if (lower.includes("-") || lower.includes(".")) {
        // Monthly: extract month
        const m = fy.match(/[-/\.年](\d{1,2})/);
        if(m) weight = parseInt(m[1]) / 100;
    }
    
    return year + weight;
  };

  const sorted = [...reports].sort(
    (a, b) => getFiscalScore(a.fiscal_year) - getFiscalScore(b.fiscal_year)
  );

  const curr = sorted[sorted.length - 1]; // Latest Year
  const prev = sorted[sorted.length - 2]; // Previous Year

  console.log("Analyzing Flags - Current Year:", curr.fiscal_year);
  console.log("Analyzing Flags - Previous Year:", prev.fiscal_year);

  const flags: FlagResult[] = [];

  // --- 1. Extract Key Metrics (Current Year) ---
  const d = curr.data;
  const pd = prev.data;

  // Period Handling (Annualization)
  const isMonthly = curr.period_type === "Monthly" || curr.fiscal_year.includes("-") || curr.fiscal_year.includes(".");
  const isQuarterly = curr.period_type === "Quarterly" || curr.fiscal_year.includes("Q");
  
  let flowMult = 1;
  if (isMonthly) flowMult = 12;
  else if (isQuarterly) flowMult = 4;

  // --- Balance Sheet Data (Stocks - No Mult) ---
  const cash = getVal(d, "balance_sheet.current_assets.monetary_funds");
  const tradingFinAssets = getVal(d, "balance_sheet.current_assets.trading_financial_assets") + 
                           getVal(d, "balance_sheet.current_assets.financial_assets_fvpl.trading_financial_assets");
  const arTotal = getVal(d, "balance_sheet.current_assets.notes_and_accounts_receivable.amount"); // Notes + AR
  const prepayments = getVal(d, "balance_sheet.current_assets.prepayments");
  const otherReceivables = getVal(d, "balance_sheet.current_assets.other_receivables_total.amount");
  const inventory = getVal(d, "balance_sheet.current_assets.inventories");
  const cip = getVal(d, "balance_sheet.non_current_assets.construction_in_progress");
  const goodwill = getVal(d, "balance_sheet.non_current_assets.goodwill");
  const longTermDeferredExp = getVal(d, "balance_sheet.non_current_assets.long_term_deferred_expenses");
  const totalAssets = getVal(d, "balance_sheet.assets_summary.total_assets");

  const shortTermBorrowings = getVal(d, "balance_sheet.current_liabilities.short_term_borrowings");
  const tradingFinLiab = getVal(d, "balance_sheet.current_liabilities.trading_financial_liabilities");
  const payablesTotal = getVal(d, "balance_sheet.current_liabilities.notes_and_accounts_payable.amount");
  const otherPayables = getVal(d, "balance_sheet.current_liabilities.other_payables_total.amount");
  const nonCurrentLiabDue1Y = getVal(d, "balance_sheet.current_liabilities.non_current_liabilities_due_within_1y");
  
  const longTermBorrowings = getVal(d, "balance_sheet.non_current_liabilities.long_term_borrowings");
  const bondsPayable = getVal(d, "balance_sheet.non_current_liabilities.bonds_payable.amount");
  const leaseLiab = getVal(d, "balance_sheet.non_current_liabilities.lease_liabilities");
  const totalLiabilities = getVal(d, "balance_sheet.liabilities_summary.total_liabilities");
  
  const totalEquity = getVal(d, "balance_sheet.equity.total_equity");
  const netAssets = totalEquity; 

  const totalDebt = shortTermBorrowings + nonCurrentLiabDue1Y + longTermBorrowings + bondsPayable;
  const interestBearingDebt = totalDebt + leaseLiab + tradingFinLiab; 
  const shortTermDebt = shortTermBorrowings + nonCurrentLiabDue1Y; 

  // --- Income Statement & Cash Flow Data (Flows - Need Mult) ---
  const revenue = getVal(d, "income_statement.total_operating_revenue");
  const costOfSales = getVal(d, "income_statement.total_operating_cost.operating_cost");
  const sellingExp = getVal(d, "income_statement.total_operating_cost.selling_expenses");
  const adminExp = getVal(d, "income_statement.total_operating_cost.admin_expenses");
  const interestExp = getVal(d, "income_statement.total_operating_cost.financial_expenses.interest_expenses");
  const interestIncome = getVal(d, "income_statement.total_operating_cost.financial_expenses.interest_income");
  
  const assetImpairmentLoss = getVal(d, "income_statement.total_operating_cost.asset_impairment_loss"); 
  const assetImpairmentLossNew = getVal(d, "income_statement.other_operating_income.asset_impairment_loss_new");
  const creditImpairmentLoss = getVal(d, "income_statement.total_operating_cost.credit_impairment_loss") + 
                               getVal(d, "income_statement.other_operating_income.credit_impairment_loss_new");
  const totalAssetImpairment = Math.abs(assetImpairmentLoss) + Math.abs(assetImpairmentLossNew); 
  const totalCreditImpairment = Math.abs(creditImpairmentLoss);

  const fairValueChange = getVal(d, "income_statement.other_operating_income.fair_value_change_income");
  const investmentIncome = getVal(d, "income_statement.other_operating_income.investment_income");
  const assetDisposalIncome = getVal(d, "income_statement.other_operating_income.asset_disposal_income");
  const otherIncome = getVal(d, "income_statement.other_operating_income.other_income");
  
  const operatingProfit = getVal(d, "income_statement.operating_profit.amount");
  const nonOperatingRev = getVal(d, "income_statement.operating_profit.non_operating_revenue");
  const totalProfit = getVal(d, "income_statement.total_profit.amount");
  const netProfit = getVal(d, "income_statement.net_profit.amount");
  const netProfitParent = getVal(d, "income_statement.net_profit.net_profit_attr_to_parent");

  const ocf = getVal(d, "cash_flow_statement.operating_activities.net_cash_flow_from_operating");
  const ocfInflow = getVal(d, "cash_flow_statement.operating_activities.subtotal_cash_inflow_operating");
  const otherCashReceivedOp = getVal(d, "cash_flow_statement.operating_activities.other_cash_received_operating");
  const cashPaidDivProfInt = getVal(d, "cash_flow_statement.financing_activities.cash_paid_for_dividends_and_profits");
  const capex = getVal(d, "cash_flow_statement.investing_activities.cash_paid_for_assets");

  // Annualized Flows
  const annRev = revenue * flowMult;
  const annCost = costOfSales * flowMult;
  const annOCF = ocf * flowMult;
  const annInterestExp = interestExp * flowMult;
  const annInterestIncome = interestIncome * flowMult;
  const annNetProfitParent = netProfitParent * flowMult;
  const annOpProfit = operatingProfit * flowMult;

  // --- Previous Year Data (for Growth) ---
  const prevRevenue = getVal(pd, "income_statement.total_operating_revenue");
  const prevCostOfSales = getVal(pd, "income_statement.total_operating_cost.operating_cost");
  const prevInventory = getVal(pd, "balance_sheet.current_assets.inventories");
  const prevAR = getVal(pd, "balance_sheet.current_assets.notes_and_accounts_receivable.amount"); 
  const prevPrepayments = getVal(pd, "balance_sheet.current_assets.prepayments");
  const prevSellingExp = getVal(pd, "income_statement.total_operating_cost.selling_expenses");
  const prevAdminExp = getVal(pd, "income_statement.total_operating_cost.admin_expenses");
  const prevPayables = getVal(pd, "balance_sheet.current_liabilities.notes_and_accounts_payable.amount"); 
  const prevCash = getVal(pd, "balance_sheet.current_assets.monetary_funds");
  const prevTotalDebt = getVal(pd, "balance_sheet.current_liabilities.short_term_borrowings") +
                        getVal(pd, "balance_sheet.non_current_liabilities.long_term_borrowings") +
                        getVal(pd, "balance_sheet.non_current_liabilities.bonds_payable.amount") +
                        getVal(pd, "balance_sheet.current_liabilities.non_current_liabilities_due_within_1y") + 
                        getVal(pd, "balance_sheet.non_current_liabilities.lease_liabilities"); 

  // --- Derived Metrics ---
  const avgInventory = (inventory + prevInventory) / 2;
  const avgMonetaryFunds = (cash + prevCash) / 2;
  const avgInterestBearingDebt = (interestBearingDebt + prevTotalDebt) / 2; 

  const revenueGrowth = safeGrowth(revenue, prevRevenue);
  const inventoryGrowth = safeGrowth(inventory, prevInventory);
  const arGrowth = safeGrowth(arTotal, prevAR);
  const sellingExpGrowth = safeGrowth(sellingExp, prevSellingExp);
  const adminExpGrowth = safeGrowth(adminExp, prevAdminExp);
  const prepaymentGrowth = safeGrowth(prepayments, prevPrepayments);
  const payablesGrowth = safeGrowth(payablesTotal, prevPayables);
  const cashGrowth = safeGrowth(cash, prevCash);

  const grossMargin = safeDiv(revenue - costOfSales, revenue);
  const prevGrossMargin = safeDiv(prevRevenue - prevCostOfSales, prevRevenue);
  const gmIncrease = grossMargin - prevGrossMargin;

  const invTurnover = safeDiv(annCost, avgInventory);
  const prevInvTurnoverApprox = safeDiv(prevCostOfSales * (isMonthly ? 12 : isQuarterly ? 4 : 1), prevInventory);
  const invTurnoverChange = safeGrowth(invTurnover, prevInvTurnoverApprox); 

  const dso = safeDiv(arTotal * 365, annRev);
  const prevDSO = safeDiv(prevAR * 365, prevRevenue * (isMonthly ? 12 : isQuarterly ? 4 : 1));
  const dpo = safeDiv(payablesTotal * 365, annCost);
  const prevDPO = safeDiv(prevPayables * 365, prevCostOfSales * (isMonthly ? 12 : isQuarterly ? 4 : 1));
  const dpoGrowth = safeGrowth(dpo, prevDPO);
  const opMargin = safeDiv(operatingProfit, revenue);
  const prevOpMargin = safeDiv(getVal(pd, "income_statement.operating_profit.amount"), prevRevenue);
  const niGrowth = safeGrowth(netProfitParent, getVal(pd, "income_statement.net_profit.net_profit_attr_to_parent"));
  const ocfGrowth = safeGrowth(ocf, getVal(pd, "cash_flow_statement.operating_activities.net_cash_flow_from_operating"));
  const fcf = ocf - capex;
  const annFCF = fcf * flowMult;
  const prevFCF = getVal(pd, "cash_flow_statement.operating_activities.net_cash_flow_from_operating") - getVal(pd, "cash_flow_statement.investing_activities.cash_paid_for_assets");
  const annPrevFCF = prevFCF * (isMonthly ? 12 : isQuarterly ? 4 : 1);

  // ==========================================
  // 1. Profitability & Inventory Signals
  // ==========================================

  // ID: F1
  flags.push({
    name: "Abnormal Gross Margin Expansion",
    category: "Cost",
    type: "Red",
    status: gmIncrease > 0.05 && invTurnoverChange < -0.10,
    value: `GM Inc: ${(gmIncrease*100).toFixed(1)}%, Inv Turn Chg: ${(invTurnoverChange*100).toFixed(1)}%`,
    threshold: "GM Inc > 5% & Inv Turn Dec > 10%",
    logic: `Gross Margin Increase = ${(gmIncrease*100).toFixed(1)}% (> 5%) & Inventory Turnover Change = ${(invTurnoverChange*100).toFixed(1)}% (< -10%)`,
    description: "Rising margins with slowing inventory turnover suggests potential earnings inflation via capitalization or failure to write down obsolete goods."
  });

  // ID: F2
  flags.push({
    name: "Inventory Divergence",
    category: "Asset",
    type: "Red",
    status: (inventoryGrowth - revenueGrowth) > 0.20,
    value: `Inv Growth: ${(inventoryGrowth*100).toFixed(1)}%, Rev Growth: ${(revenueGrowth*100).toFixed(1)}%`,
    threshold: "Inv Growth > Rev Growth + 20%",
    logic: `Gap = ${((inventoryGrowth - revenueGrowth)*100).toFixed(1)}% (> 20%)`,
    description: "Inventory growing significantly faster than sales suggests falling demand, obsolescence, or channel stuffing."
  });

  // ==========================================
  // 2. Interest & Cash Signals
  // ==========================================

  // ID: F3
  const annCashInterestPaid = cashPaidDivProfInt * flowMult;
  const cashInterestRate = safeDiv(annCashInterestPaid, avgInterestBearingDebt);
  flags.push({
    name: "High Cash Interest Rate",
    category: "Debt",
    type: "Red",
    status: cashInterestRate > 0.05, 
    value: `Rate: ${(cashInterestRate*100).toFixed(1)}%`,
    threshold: "> 5% (Distressed)",
    logic: `Annualized Cash Interest Paid / Avg Debt = ${(cashInterestRate*100).toFixed(1)}% (> 5%)`,
    description: "Paying an excessively high rate on debt (or dividends included) can signal high-risk borrowing status."
  });

  // ID: F4
  const depositRate = safeDiv(annInterestIncome, avgMonetaryFunds);
  flags.push({
    name: "Inverted Interest Rate",
    category: "Liquidity",
    type: "Red",
    status: depositRate < 0.005,
    value: `Yield: ${(depositRate*100).toFixed(2)}%`,
    threshold: "< 0.5%",
    logic: `Annualized Interest Income / Avg Cash = ${(depositRate*100).toFixed(2)}% (< 0.5%)`,
    description: "Extremely low yield on cash balances suggests funds may be restricted, pledged, or non-existent."
  });

  // ID: F5
  const hchd_c1 = (safeDiv(cash, (shortTermDebt + tradingFinLiab)) >= 1.0) && (shortTermDebt > 0);
  const hchd_c2 = (safeDiv(interestBearingDebt, totalAssets) >= 0.30);
  const hchd_c3 = (depositRate < 0.005);
  const hchd_c4 = (safeDiv(cashGrowth, revenueGrowth) >= 2.0) && (revenueGrowth > 0);
  const hchdCount = [hchd_c1, hchd_c2, hchd_c3, hchd_c4].filter(Boolean).length;

  flags.push({
    name: "High-Cash, High-Debt",
    category: "Liquidity",
    type: "Red",
    status: hchdCount >= 2,
    value: `Criteria Met: ${hchdCount}/4`,
    threshold: ">= 2 Indicators",
    logic: `1.Cash/ST Debt>=1: ${hchd_c1} | 2.Debt/Asset>=30%: ${hchd_c2} | 3.Yield<0.5%: ${hchd_c3} | 4.Cash/Rev Gr>=2: ${hchd_c4}`,
    description: "Coexistence of high cash coverage and high debt/leverage, often indicating restricted or fictitious cash."
  });

  // ==========================================
  // 3. Non-Recurring & "One-Time" Items
  // ==========================================

  // ID: F6
  flags.push({
    name: "Asset Disposal Reliance",
    category: "Earnings",
    type: "Red",
    status: safeDiv(assetDisposalIncome, netProfit) > 0.20,
    value: `Ratio: ${(safeDiv(assetDisposalIncome, netProfit)*100).toFixed(1)}%`,
    threshold: "> 20% of Net Profit",
    logic: `Asset Disposal Income / Net Profit = ${(safeDiv(assetDisposalIncome, netProfit)*100).toFixed(1)}% (> 20%)`,
    description: "Relying on selling assets to generate profit is unsustainable and masks core business weakness."
  });

  // ID: F7
  flags.push({
    name: "Asset Impairment Surge",
    category: "Earnings",
    type: "Red",
    status: safeDiv(totalAssetImpairment, operatingProfit) > 0.20,
    value: `Ratio: ${(safeDiv(totalAssetImpairment, operatingProfit)*100).toFixed(1)}%`,
    threshold: "> 20% of Op Profit",
    logic: `Asset Impairment / Op Profit = ${(safeDiv(totalAssetImpairment, operatingProfit)*100).toFixed(1)}% (> 20%)`,
    description: "Large write-downs ('Big Bath') indicate inflated past earnings or clearing decks for future."
  });

  // ID: F8
  flags.push({
    name: "Credit Impairment Surge",
    category: "Earnings",
    type: "Red",
    status: safeDiv(totalCreditImpairment, operatingProfit) > 0.15,
    value: `Ratio: ${(safeDiv(totalCreditImpairment, operatingProfit)*100).toFixed(1)}%`,
    threshold: "> 15% of Op Profit",
    logic: `Credit Impairment / Op Profit = ${(safeDiv(totalCreditImpairment, operatingProfit)*100).toFixed(1)}% (> 15%)`,
    description: "Sharp deterioration in receivables quality, suggesting customer defaults."
  });

  // ID: F9
  flags.push({
    name: "Non-Operating Rev Dependency",
    category: "Earnings",
    type: "Red",
    status: safeDiv(nonOperatingRev, totalProfit) > 0.20,
    value: `Ratio: ${(safeDiv(nonOperatingRev, totalProfit)*100).toFixed(1)}%`,
    threshold: "> 20% of Total Profit",
    logic: `Non-op Revenue / Total Profit = ${(safeDiv(nonOperatingRev, totalProfit)*100).toFixed(1)}% (> 20%)`,
    description: "Earnings driven by grants/fines rather than operations are low quality."
  });

  // ID: F10
  flags.push({
    name: "Fair Value Reliance",
    category: "Earnings",
    type: "Red",
    status: safeDiv(fairValueChange, netProfit) > 0.30,
    value: `Ratio: ${(safeDiv(fairValueChange, netProfit)*100).toFixed(1)}%`,
    threshold: "> 30% of Net Profit",
    logic: `Fair Value Income / Net Profit = ${(safeDiv(fairValueChange, netProfit)*100).toFixed(1)}% (> 30%)`,
    description: "Profits driven by paper gains are risky and don't reflect cash generation."
  });

  // ID: F11
  flags.push({
    name: "Investment Income Reliance",
    category: "Earnings",
    type: "Red",
    status: safeDiv(investmentIncome, operatingProfit) > 0.30,
    value: `Ratio: ${(safeDiv(investmentIncome, operatingProfit)*100).toFixed(1)}%`,
    threshold: "> 30% of Op Profit",
    logic: `Inv Income / Op Profit = ${(safeDiv(investmentIncome, operatingProfit)*100).toFixed(1)}% (> 30%)`,
    description: "Reliance on trading stocks or subsidiaries rather than main product."
  });

  // ID: F12
  flags.push({
    name: "Other Income Reliance",
    category: "Earnings",
    type: "Red",
    status: safeDiv(otherIncome, operatingProfit) > 0.30,
    value: `Ratio: ${(safeDiv(otherIncome, operatingProfit)*100).toFixed(1)}%`,
    threshold: "> 30% of Op Profit",
    logic: `Other Income / Op Profit = ${(safeDiv(otherIncome, operatingProfit)*100).toFixed(1)}% (> 30%)`,
    description: "Profit derived from 'Other Income' is often non-persistent."
  });

  // ==========================================
  // 4. Balance Sheet Anomalies
  // ==========================================

  // ID: F13
  const arToAssets = safeDiv(arTotal, totalAssets);
  const arGrowthGap = arGrowth - revenueGrowth;
  flags.push({
    name: "Accounts Receivable Bloat",
    category: "Asset",
    type: "Red",
    status: arToAssets > 0.30 || arGrowthGap > 0.15,
    value: `AR/Asset: ${(arToAssets*100).toFixed(1)}%, Gap: ${(arGrowthGap*100).toFixed(1)}%`,
    threshold: "AR/Asset > 30% OR Gap > 15%",
    logic: `AR/Assets = ${(arToAssets*100).toFixed(1)}% (> 30%) OR (AR Gr - Rev Gr) = ${(arGrowthGap*100).toFixed(1)}% (> 15%)`,
    description: "Receivables growing faster than sales signals channel stuffing or relaxed credit terms."
  });

  // ID: F14
  const invToAssets = safeDiv(inventory, totalAssets);
  const invGrowthGap = inventoryGrowth - revenueGrowth;
  flags.push({
    name: "Excessive Inventory",
    category: "Asset",
    type: "Red",
    status: invToAssets > 0.30 || invGrowthGap > 0.15,
    value: `Inv/Asset: ${(invToAssets*100).toFixed(1)}%, Gap: ${(invGrowthGap*100).toFixed(1)}%`,
    threshold: "Inv/Asset > 30% OR Gap > 15%",
    logic: `Inv/Assets = ${(invToAssets*100).toFixed(1)}% (> 30%) OR (Inv Gr - Rev Gr) = ${(invGrowthGap*100).toFixed(1)}% (> 15%)`,
    description: "Inventory growing faster than sales often signals potential write-downs."
  });

  // ID: F15
  const otherRecToAssets = safeDiv(otherReceivables, totalAssets);
  flags.push({
    name: "Other Receivables Anomaly",
    category: "Asset",
    type: "Red",
    status: otherRecToAssets > 0.05,
    value: `Ratio: ${(otherRecToAssets*100).toFixed(1)}%`,
    threshold: "> 5% of Total Assets",
    logic: `Other Rec / Total Assets = ${(otherRecToAssets*100).toFixed(1)}% (> 5%)`,
    description: "Hiding place for misappropriated funds or loans to shareholders."
  });

  // ID: F16
  const goodwillToNetAssets = safeDiv(goodwill, netAssets);
  flags.push({
    name: "Goodwill Risk",
    category: "Asset",
    type: "Red",
    status: goodwillToNetAssets > 0.20,
    value: `Ratio: ${(goodwillToNetAssets*100).toFixed(1)}%`,
    threshold: "> 20% of Net Assets",
    logic: `Goodwill / Net Assets = ${(goodwillToNetAssets*100).toFixed(1)}% (> 20%)`,
    description: "High goodwill suggests aggressive acquisitions; risk of massive write-offs."
  });

  // ID: F17
  const cipToAssets = safeDiv(cip, totalAssets);
  flags.push({
    name: "CIP Trap",
    category: "Asset",
    type: "Red",
    status: cipToAssets > 0.15,
    value: `Ratio: ${(cipToAssets*100).toFixed(1)}%`,
    threshold: "> 15% of Total Assets",
    logic: `CIP / Total Assets = ${(cipToAssets*100).toFixed(1)}% (> 15%)`,
    description: "CIP that doesn't convert to fixed assets may be capitalized expense or fraud."
  });

  // ID: F18
  const deferredExpToAssets = safeDiv(longTermDeferredExp, totalAssets);
  flags.push({
    name: "Deferred Expense Bloat",
    category: "Asset",
    type: "Red",
    status: deferredExpToAssets > 0.05,
    value: `Ratio: ${(deferredExpToAssets*100).toFixed(1)}%`,
    threshold: "> 5% of Total Assets",
    logic: `Deferred Exp / Total Assets = ${(deferredExpToAssets*100).toFixed(1)}% (> 5%)`,
    description: "Used to hide current expenses to artificially boost profits."
  });

  // ID: F19
  const otherPayToLiab = safeDiv(otherPayables, totalLiabilities);
  flags.push({
    name: "Other Payables Anomaly",
    category: "Debt",
    type: "Red",
    status: otherPayToLiab > 0.10,
    value: `Ratio: ${(otherPayToLiab*100).toFixed(1)}%`,
    threshold: "> 10% of Total Liabilities",
    logic: `Other Payables / Total Liabilities = ${(otherPayToLiab*100).toFixed(1)}% (> 10%)`,
    description: "Can hide off-book loans or illicit financing."
  });

  // ==========================================
  // 5. Expense & Growth Gaps
  // ==========================================

  // ID: F20
  const sellingEffGap = revenueGrowth - 0.20;
  flags.push({
    name: "Selling Expense Efficiency",
    category: "Cost",
    type: "Red",
    status: sellingExpGrowth < sellingEffGap && revenueGrowth > 0.1, 
    value: `Sell Gr: ${(sellingExpGrowth*100).toFixed(1)}%, Rev Gr: ${(revenueGrowth*100).toFixed(1)}%`,
    threshold: "Sell Exp Gr < Rev Gr - 20%",
    logic: `Selling Exp Growth = ${(sellingExpGrowth*100).toFixed(1)}% (< ${(sellingEffGap*100).toFixed(1)}%)`,
    description: "Revenue skyrocketing while marketing costs stay flat is highly suspicious."
  });

  // ID: F21
  const adminDivGap = adminExpGrowth - revenueGrowth;
  flags.push({
    name: "Admin Expense Divergence",
    category: "Cost",
    type: "Red",
    status: adminDivGap > 0.15,
    value: `Gap: ${(adminDivGap*100).toFixed(1)}%`,
    threshold: "(Admin Gr - Rev Gr) > 15%",
    logic: `Gap = ${(adminDivGap*100).toFixed(1)}% (> 15%)`,
    description: "Admin costs growing much faster than sales indicates inefficiency or unchecked compensation."
  });

  // ID: F22
  const prepayToAssets = safeDiv(prepayments, totalAssets);
  flags.push({
    name: "Prepayment Surge",
    category: "Asset",
    type: "Red",
    status: prepayToAssets > 0.05 || prepaymentGrowth > 0.50,
    value: `Ratio: ${(prepayToAssets*100).toFixed(1)}%, Gr: ${(prepaymentGrowth*100).toFixed(1)}%`,
    threshold: "> 5% Assets OR > 50% Growth",
    logic: `Prepay/Assets = ${(prepayToAssets*100).toFixed(1)}% (> 5%) OR Growth = ${(prepaymentGrowth*100).toFixed(1)}% (> 50%)`,
    description: "Massive prepayments are common vehicles for embezzlement or fund transfer."
  });

  // ID: F23
  const payablesGap = payablesGrowth - (revenueGrowth + 0.20);
  flags.push({
    name: "Payables Gap",
    category: "Liquidity",
    type: "Red",
    status: payablesGrowth > (revenueGrowth + 0.20),
    value: `Pay Gr: ${(payablesGrowth*100).toFixed(1)}%, Rev Gr: ${(revenueGrowth*100).toFixed(1)}%`,
    threshold: "Payables Gr > Rev Gr + 20%",
    logic: `Payables Growth = ${(payablesGrowth*100).toFixed(1)}% (> ${(revenueGrowth*100 + 20).toFixed(1)}%)`,
    description: "Excessive payables growth signals liquidity stress—suppliers are funding the company."
  });

  // ==========================================
  // 6. Cash Flow Quality
  // ==========================================

  // ID: F24
  const otherCashRecRatio = safeDiv(otherCashReceivedOp, ocfInflow);
  flags.push({
    name: "Other Cash Received Anomaly",
    category: "Earnings",
    type: "Red",
    status: otherCashRecRatio > 0.10,
    value: `Ratio: ${(otherCashRecRatio*100).toFixed(1)}%`,
    threshold: "> 10% of Op Inflow",
    logic: `Other Op Cash In / Total Op Inflow = ${(otherCashRecRatio*100).toFixed(1)}% (> 10%)`,
    description: "Often used to hide non-operating cash to inflate OCF."
  });

  // ==========================================
  // 🟢 GREEN FLAGS (Health)
  // ==========================================

  // ID: F25
  const ocfNiRatio = ocf / netProfitParent;
  flags.push({
    name: "Cash-Backed Profits",
    category: "Earnings",
    type: "Green",
    status: ocfNiRatio > 1.1,
    value: `Ratio: ${ocfNiRatio.toFixed(2)}`,
    threshold: "> 1.1",
    logic: `OCF / Net Income = ${ocfNiRatio.toFixed(2)} (threshold > 1.1)`,
    description:
      "Operating Cash Flow exceeds Net Income, indicating high quality of earnings.",
  });

  // ID: F26
  const ocfCapexRatio = ocf / capex;
  flags.push({
    name: "Self-Funding",
    category: "Growth",
    type: "Green",
    status: ocfCapexRatio > 1.5,
    value: `Ratio: ${ocfCapexRatio.toFixed(2)}`,
    threshold: "> 1.5",
    logic: `OCF / Capex = ${ocfCapexRatio.toFixed(2)} (threshold > 1.5)`,
    description:
      "The company generates enough cash to fully fund its capital expenditures and growth.",
  });

  // ID: F27
  const netDebt = interestBearingDebt - cash;
  const ebitdaProxy = totalProfit + interestExp + getVal(d, "cash_flow_statement.supplementary_info.net_profit_adjustment.depreciation_fixed_assets_investment_props");
  const annEbitda = ebitdaProxy * flowMult;
  const leverageRatio = safeDiv(netDebt, annEbitda);
  flags.push({
    name: "Conservative Leverage",
    category: "Debt",
    type: "Green",
    status: leverageRatio < 2.0 && netDebt > 0,
    value: `Net Debt/EBITDA: ${leverageRatio.toFixed(2)}`,
    threshold: "< 2.0x",
    logic: `Net Debt / Annualized EBITDA = ${leverageRatio.toFixed(2)} (threshold < 2.0x)`,
    description:
      "Debt levels are low relative to earnings, indicating a strong balance sheet.",
  });

  // ID: F28
  // "Kangde Xin Paradox"
  const intToDebt = totalDebt > 0 ? annInterestExp / totalDebt : 0;
  const cashToAssets = safeDiv(cash, totalAssets);
  flags.push({
    name: "Kangde Xin Paradox",
    category: "Liquidity",
    type: "Red",
    status: cashToAssets > 0.2 && intToDebt > 0.05,
    value: `Cash/Assets: ${(cashToAssets * 100).toFixed(1)}%, Int/Debt: ${(intToDebt * 100).toFixed(1)}%`,
    threshold: "> 20% & > 5%",
    logic: `Cash/Assets = ${(cashToAssets * 100).toFixed(1)}% (threshold > 20%) & Annualized Int/Debt = ${(intToDebt * 100).toFixed(1)}% (threshold > 5%)`,
    description:
      "High cash balance coexisting with high-interest debt suggests cash might be restricted or fictitious.",
  });

  // ID: F29
  // "Cash-Profit Divergence"
  flags.push({
    name: "Cash-Profit Divergence",
    category: "Earnings",
    type: "Red",
    status: niGrowth > 0.1 && ocfGrowth <= 0,
    value: `NI Growth: ${(niGrowth * 100).toFixed(1)}%, OCF Growth: ${(ocfGrowth * 100).toFixed(1)}%`,
    threshold: "NI > 10% & OCF <= 0%",
    logic: `NI Growth = ${(niGrowth * 100).toFixed(1)}% (threshold > 10%) & OCF Growth = ${(ocfGrowth * 100).toFixed(1)}% (threshold <= 0%)`,
    description: "Profits are growing rapidly while cash flow is stagnant or falling, indicating low quality earnings.",
  });

  // ID: F30
  // "Low OCF/NI Ratio"
  flags.push({
    name: "Low OCF/NI Ratio",
    category: "Earnings",
    type: "Red",
    status: ocf / netProfitParent < 0.8,
    value: `Ratio: ${(ocf / netProfitParent).toFixed(2)}`,
    threshold: "< 0.8",
    logic: `OCF / Net Income = ${(ocf / netProfitParent).toFixed(2)} (threshold < 0.8)`,
    description: "Operating cash flow is significantly lower than reported net income.",
  });

  // ID: F31
  // "Rising DSO"
  const dsoChange = dso - prevDSO;
  flags.push({
    name: "Rising DSO",
    category: "Revenue",
    type: "Red",
    status: dsoChange > 15,
    value: `Change: +${dsoChange.toFixed(0)} days`,
    threshold: "> +15 days",
    logic: `DSO Change = ${dsoChange.toFixed(0)} days (threshold > 15 days)`,
    description: "It is taking significantly longer to collect payment from customers.",
  });

  // ID: F32
  // "High Total Accruals"
  const annAccruals = (annNetProfitParent - annOCF);
  const accrualAssetsRatio = annAccruals / totalAssets;
  flags.push({
    name: "High Total Accruals",
    category: "Earnings",
    type: "Red",
    status: accrualAssetsRatio > 0.1,
    value: `Accruals/Assets: ${(accrualAssetsRatio * 100).toFixed(1)}%`,
    threshold: "> 10%",
    logic: `Annualized (NI - OCF) / Total Assets = ${(accrualAssetsRatio * 100).toFixed(1)}% (threshold > 10%)`,
    description: "Earnings are driven heavily by non-cash accruals rather than cash flow.",
  });

  // ID: F33
  // "Debt Cliff"
  const debtCliffRatio2 = safeDiv(shortTermDebt, totalDebt);
  flags.push({
    name: "Debt Cliff",
    category: "Debt",
    type: "Red",
    status: debtCliffRatio2 > 0.5,
    value: `ST Debt ratio: ${(debtCliffRatio2 * 100).toFixed(1)}%`,
    threshold: "> 50%",
    logic: `Short-term Debt / Total Debt = ${(debtCliffRatio2 * 100).toFixed(1)}% (threshold > 50%)`,
    description: "Reliance on short-term debt exposes the company to refinancing risks.",
  });

  // ID: F34
  // "Margin Divergence"
  flags.push({
    name: "Margin Divergence",
    category: "Cost",
    type: "Red",
    status: grossMargin > prevGrossMargin && opMargin < prevOpMargin,
    value: `GM: Up, OM: Down`,
    threshold: "GM Rising & OM Falling",
    logic: `Gross Margin: ${(grossMargin * 100).toFixed(1)}% (prev: ${(prevGrossMargin * 100).toFixed(1)}%) & Operating Margin: ${(opMargin * 100).toFixed(1)}% (prev: ${(prevOpMargin * 100).toFixed(1)}%)`,
    description: "Gross margin improved but Operating margin declined, suggesting rising overheads or expense reclassification.",
  });

  // ID: F35
  // "Negative FCF"
  flags.push({
    name: "Negative FCF",
    category: "Liquidity",
    type: "Red",
    status: annFCF < 0 && annPrevFCF < 0,
    value: `Current: ${(annFCF / 1e8).toFixed(2)}B, Prev: ${(annPrevFCF / 1e8).toFixed(2)}B`,
    threshold: "Negative for > 1 period",
    logic: `Annualized Current FCF = ${(annFCF / 1e8).toFixed(2)}B & Annualized Previous FCF = ${(annPrevFCF / 1e8).toFixed(2)}B (threshold both < 0)`,
    description: "Free Cash Flow has been negative for consecutive periods despite any reported profits.",
  });

  // ID: F36
  // "Payables Stretch"
  flags.push({
    name: "Payables Stretch",
    category: "Liquidity",
    type: "Red",
    status: dpoGrowth > 0.2,
    value: `DPO Growth: ${(dpoGrowth * 100).toFixed(1)}%`,
    threshold: "> 20% YoY/MoM",
    logic: `DPO Growth = ${(dpoGrowth * 100).toFixed(1)}% (threshold > 20%)`,
    description: "Days Payable Outstanding increased significantly, potentially delaying payments to suppliers to boost cash.",
  });

  return flags.filter((f) => f.status || f.type === "Info");
};