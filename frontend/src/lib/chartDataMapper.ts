/**
 * chartDataMapper.ts
 * Transforms standardized financial report JSON into Recharts-compatible data structures
 * following the logic specified in Financial Visualization.md
 */

import { StandardizedReport, ReportData } from "./types";

// Helper to safely get nested values
const getVal = (data: ReportData | undefined, path: string): number => {
  if (!data) return 0;
  const parts = path.split(".");
  let curr: any = data;
  for (const part of parts) {
    curr = curr?.[part];
  }
  return typeof curr === "number" ? curr : curr?.amount || 0;
};

// Helper to get sortable score for fiscal_year string
export const getFiscalYearScore = (fy: string): number => {
  const clean = fy.trim();
  
  // Try to find Year
  const yearMatch = clean.match(/20\d{2}/);
  const year = yearMatch ? parseInt(yearMatch[0]) : 0;
  
  let subScore = 0.99; // Default to end of year (Annual)
  
  if (clean.includes("Q1")) subScore = 0.20;
  else if (clean.includes("Q2") || clean.includes("Semi")) subScore = 0.45;
  else if (clean.includes("Q3")) subScore = 0.70;
  else if (clean.includes("Q4")) subScore = 0.95;
  else if (clean.includes("-") || clean.includes(".")) {
    // Monthly: "2023-01" -> 0.01 to 0.12
    const monthMatch = clean.match(/[-/\.年](\d{1,2})/);
    if (monthMatch) {
      const month = parseInt(monthMatch[1]);
      subScore = month / 100;
    }
  }
  
  return year + subScore;
};

// Custom Aggregations
export const aggregations = {
  // 货币资金等 = 货币资金 + 拆出资金 + 交易性金融资产
  cashAndEquivalents: (data: ReportData) => 
    getVal(data, "balance_sheet.current_assets.monetary_funds") +
    getVal(data, "balance_sheet.current_assets.funds_lent") +
    getVal(data, "balance_sheet.current_assets.trading_financial_assets") +
    getVal(data, "balance_sheet.current_assets.financial_assets_fvpl.trading_financial_assets"),

  // 应收账款等 = 应收票据 + 应收账款 + 应收账款融资 + 合同资产
  receivables: (data: ReportData) =>
    getVal(data, "balance_sheet.current_assets.notes_and_accounts_receivable.notes_receivable") +
    getVal(data, "balance_sheet.current_assets.notes_and_accounts_receivable.accounts_receivable") +
    getVal(data, "balance_sheet.current_assets.receivables_financing") +
    getVal(data, "balance_sheet.current_assets.contract_assets"),

  // 有息负债 = 短期借款 + 长期借款 + 应付债券 + 一年内到期的非流动负债
  interestBearingDebt: (data: ReportData) =>
    getVal(data, "balance_sheet.current_liabilities.short_term_borrowings") +
    getVal(data, "balance_sheet.non_current_liabilities.long_term_borrowings") +
    getVal(data, "balance_sheet.non_current_liabilities.bonds_payable.amount") +
    getVal(data, "balance_sheet.current_liabilities.non_current_liabilities_due_within_1y"),

  // 应付账款等 = 应付票据 + 应付账款
  payables: (data: ReportData) =>
    getVal(data, "balance_sheet.current_liabilities.notes_and_accounts_payable.notes_payable") +
    getVal(data, "balance_sheet.current_liabilities.notes_and_accounts_payable.accounts_payable"),

  // 预收款项等 = 预收款项 + 合同负债
  prepaymentsReceived: (data: ReportData) =>
    getVal(data, "balance_sheet.current_liabilities.advances_from_customers") +
    getVal(data, "balance_sheet.current_liabilities.contract_liabilities"),

  // 应付职工薪酬等 = 应付职工薪酬 + 长期应付职工薪酬
  payrollPayable: (data: ReportData) =>
    getVal(data, "balance_sheet.current_liabilities.payroll_payable") +
    getVal(data, "balance_sheet.non_current_liabilities.long_term_payroll_payable"),

  // 主营业务利润 = 营业收入 - 营业成本 - 营业税金及附加 - 销售费用 - 管理费用 - 研发费用
  mainBusinessProfit: (data: ReportData) => {
    const rev = getVal(data, "income_statement.total_operating_revenue");
    const cost = getVal(data, "income_statement.total_operating_cost.operating_cost");
    const tax = getVal(data, "income_statement.total_operating_cost.taxes_and_surcharges");
    const sell = getVal(data, "income_statement.total_operating_cost.selling_expenses");
    const admin = getVal(data, "income_statement.total_operating_cost.admin_expenses");
    const rd = getVal(data, "income_statement.total_operating_cost.rd_expenses");
    return rev - cost - tax - sell - admin - rd;
  }
};

/**
 * 1. Asset Structure (Stackplot)
 */
export const mapAssetStructure = (reports: any[]) => {
  return reports.map(r => ({
    year: r.fiscal_year,
    "Cash & Equiv Etc": aggregations.cashAndEquivalents(r.data) / 1e6,
    "Receivables Etc": aggregations.receivables(r.data) / 1e6,
    "Prepayments": getVal(r.data, "balance_sheet.current_assets.prepayments") / 1e6,
    "Inventory": getVal(r.data, "balance_sheet.current_assets.inventories") / 1e6,
    "Other Current Assets": getVal(r.data, "balance_sheet.current_assets.other_current_assets") / 1e6,
    "Long-term Equity Invest": getVal(r.data, "balance_sheet.non_current_assets.long_term_equity_investments") / 1e6,
    "Goodwill": getVal(r.data, "balance_sheet.non_current_assets.goodwill") / 1e6,
    "Fixed Assets": getVal(r.data, "balance_sheet.non_current_assets.fixed_assets") / 1e6,
    "Construction In Progress": getVal(r.data, "balance_sheet.non_current_assets.construction_in_progress") / 1e6,
    "Right-of-use Assets": getVal(r.data, "balance_sheet.non_current_assets.right_of_use_assets") / 1e6,
    "Intangible Assets": getVal(r.data, "balance_sheet.non_current_assets.intangible_assets") / 1e6,
    "Other Assets": (getVal(r.data, "balance_sheet.assets_summary.total_assets") - 
                    (aggregations.cashAndEquivalents(r.data) + 
                     aggregations.receivables(r.data) + 
                     getVal(r.data, "balance_sheet.current_assets.prepayments") +
                     getVal(r.data, "balance_sheet.current_assets.inventories") +
                     getVal(r.data, "balance_sheet.current_assets.other_current_assets") +
                     getVal(r.data, "balance_sheet.non_current_assets.long_term_equity_investments") +
                     getVal(r.data, "balance_sheet.non_current_assets.goodwill") +
                     getVal(r.data, "balance_sheet.non_current_assets.fixed_assets") +
                     getVal(r.data, "balance_sheet.non_current_assets.construction_in_progress") +
                     getVal(r.data, "balance_sheet.non_current_assets.right_of_use_assets") +
                     getVal(r.data, "balance_sheet.non_current_assets.intangible_assets"))) / 1e6
  }));
};

/**
 * 2. Liability Structure (Stackplot)
 */
export const mapLiabilityStructure = (reports: any[]) => {
  return reports.map(r => ({
    year: r.fiscal_year,
    "Interest-bearing Debt": aggregations.interestBearingDebt(r.data) / 1e6,
    "Payables Etc": aggregations.payables(r.data) / 1e6,
    "Prepayments Received Etc": aggregations.prepaymentsReceived(r.data) / 1e6,
    "Payroll Payable Etc": aggregations.payrollPayable(r.data) / 1e6,
    "Taxes Payable": getVal(r.data, "balance_sheet.current_liabilities.taxes_payable") / 1e6,
    "Other Payables": getVal(r.data, "balance_sheet.current_liabilities.other_payables_total.other_payables") / 1e6,
    "Lease Liabilities": getVal(r.data, "balance_sheet.non_current_liabilities.lease_liabilities") / 1e6,
    "Long-term Payables": getVal(r.data, "balance_sheet.non_current_liabilities.long_term_payables") / 1e6,
    "Other Liabilities": (getVal(r.data, "balance_sheet.liabilities_summary.total_liabilities") - 
                         (aggregations.interestBearingDebt(r.data) + 
                          aggregations.payables(r.data) + 
                          aggregations.prepaymentsReceived(r.data) + 
                          aggregations.payrollPayable(r.data) + 
                          getVal(r.data, "balance_sheet.current_liabilities.taxes_payable") + 
                          getVal(r.data, "balance_sheet.current_liabilities.other_payables_total.other_payables") + 
                          getVal(r.data, "balance_sheet.non_current_liabilities.lease_liabilities") + 
                          getVal(r.data, "balance_sheet.non_current_liabilities.long_term_payables"))) / 1e6
  }));
};

/**
 * 3. Equity Structure (Stackplot)
 */
export const mapEquityStructure = (reports: any[]) => {
  return reports.map(r => ({
    year: r.fiscal_year,
    "Paid-in Capital": getVal(r.data, "balance_sheet.equity.paid_in_capital") / 1e6,
    "Other Equity Instruments": getVal(r.data, "balance_sheet.equity.other_equity_instruments.amount") / 1e6,
    "Capital Reserves": getVal(r.data, "balance_sheet.equity.capital_reserves") / 1e6,
    "Other Comprehensive Income": getVal(r.data, "balance_sheet.equity.other_comprehensive_income") / 1e6,
    "Treasury Stock": getVal(r.data, "balance_sheet.equity.treasury_stock") / 1e6,
    "Special Reserves": getVal(r.data, "balance_sheet.equity.special_reserves") / 1e6,
    "Surplus Reserves": getVal(r.data, "balance_sheet.equity.surplus_reserves") / 1e6,
    "Undistributed Profit": getVal(r.data, "balance_sheet.equity.undistributed_profit") / 1e6,
    "Minority Interests & Other": (getVal(r.data, "balance_sheet.equity.total_equity") - 
                                  (getVal(r.data, "balance_sheet.equity.paid_in_capital") + 
                                   getVal(r.data, "balance_sheet.equity.capital_reserves") + 
                                   getVal(r.data, "balance_sheet.equity.surplus_reserves") + 
                                   getVal(r.data, "balance_sheet.equity.undistributed_profit") + 
                                   getVal(r.data, "balance_sheet.equity.other_equity_instruments.amount") + 
                                   getVal(r.data, "balance_sheet.equity.treasury_stock") + 
                                   getVal(r.data, "balance_sheet.equity.special_reserves")
                                  )) / 1e6
  }));
};

/**
 * 4. Profitability Trends (Line Charts)
 * ROE, Net Margin, Gross Margin
 */
export const mapProfitabilityTrends = (reports: any[]) => {
  // We need to calculate averages for ROE/ROA, so we look at previous reports
  return reports.map((r, idx) => {
    const prev = reports[idx - 1]; // reports are sorted ASC
    const avgEquity = prev ? (getVal(r.data, "balance_sheet.equity.total_parent_equity") + getVal(prev.data, "balance_sheet.equity.total_parent_equity")) / 2 : getVal(r.data, "balance_sheet.equity.total_parent_equity");
    const revenue = getVal(r.data, "income_statement.total_operating_revenue");
    const netIncome = getVal(r.data, "income_statement.net_profit.net_profit_attr_to_parent");
    const grossProfit = revenue - getVal(r.data, "income_statement.total_operating_cost.operating_cost");

    return {
      year: r.fiscal_year,
      "ROE": (netIncome / avgEquity) * 100,
      "Net Margin": (netIncome / revenue) * 100,
      "Gross Margin": (grossProfit / revenue) * 100
    };
  });
};

/**
 * 5. Efficiency Metrics (Turnover Line Chart)
 */
export const mapEfficiencyMetrics = (reports: any[]) => {
  return reports.map((r, idx) => {
    const prev = reports[idx - 1];
    const revenue = getVal(r.data, "income_statement.total_operating_revenue");
    const cogs = getVal(r.data, "income_statement.total_operating_cost.operating_cost");
    
    const avgInv = prev ? (getVal(r.data, "balance_sheet.current_assets.inventories") + getVal(prev.data, "balance_sheet.current_assets.inventories")) / 2 : getVal(r.data, "balance_sheet.current_assets.inventories");
    const avgAR = prev ? (getVal(r.data, "balance_sheet.current_assets.notes_and_accounts_receivable.amount") + getVal(prev.data, "balance_sheet.current_assets.notes_and_accounts_receivable.amount")) / 2 : getVal(r.data, "balance_sheet.current_assets.notes_and_accounts_receivable.amount");
    const avgFixed = prev ? (getVal(r.data, "balance_sheet.non_current_assets.fixed_assets") + getVal(prev.data, "balance_sheet.non_current_assets.fixed_assets")) / 2 : getVal(r.data, "balance_sheet.non_current_assets.fixed_assets");
    const avgAssets = prev ? (getVal(r.data, "balance_sheet.assets_summary.total_assets") + getVal(prev.data, "balance_sheet.assets_summary.total_assets")) / 2 : getVal(r.data, "balance_sheet.assets_summary.total_assets");

    return {
      year: r.fiscal_year,
      "Inventory Turnover": cogs / avgInv,
      "AR Turnover": revenue / avgAR,
      "Fixed Asset Turnover": revenue / avgFixed,
      "Total Asset Turnover": revenue / avgAssets
    };
  });
};

/**
 * 6. Cost & Expense Structure (Stacked Bar)
 */
export const mapCostStructure = (reports: any[]) => {
  return reports.map(r => {
    const rev = getVal(r.data, "income_statement.total_operating_revenue");
    return {
      year: r.fiscal_year,
      "COGS": (getVal(r.data, "income_statement.total_operating_cost.operating_cost") / rev) * 100,
      "Tax & Surcharge": (getVal(r.data, "income_statement.total_operating_cost.taxes_and_surcharges") / rev) * 100,
      "Selling Exp": (getVal(r.data, "income_statement.total_operating_cost.selling_expenses") / rev) * 100,
      "Admin Exp": (getVal(r.data, "income_statement.total_operating_cost.admin_expenses") / rev) * 100,
      "R&D Exp": (getVal(r.data, "income_statement.total_operating_cost.rd_expenses") / rev) * 100,
      "Main Profit": (aggregations.mainBusinessProfit(r.data) / rev) * 100
    };
  });
};

/**
 * 7. Profit Sources (Grouped Bar)
 */
export const mapProfitSources = (reports: any[]) => {
  return reports.map(r => ({
    year: r.fiscal_year,
    "Main Business Profit": aggregations.mainBusinessProfit(r.data) / 1e6,
    "Finance Expense": -getVal(r.data, "income_statement.total_operating_cost.financial_expenses.amount") / 1e6,
    "Impairment Loss": -(getVal(r.data, "income_statement.total_operating_cost.asset_impairment_loss") + getVal(r.data, "income_statement.total_operating_cost.credit_impairment_loss")) / 1e6,
    "Fair Value Change": getVal(r.data, "income_statement.other_operating_income.fair_value_change_income") / 1e6,
    "Investment Income": getVal(r.data, "income_statement.other_operating_income.investment_income") / 1e6,
    "Asset Disposal": getVal(r.data, "income_statement.other_operating_income.asset_disposal_income") / 1e6,
    "Other Income": getVal(r.data, "income_statement.other_operating_income.other_income") / 1e6,
    "Non-op Revenue": getVal(r.data, "income_statement.operating_profit.non_operating_revenue") / 1e6,
    "Non-op Expense": -getVal(r.data, "income_statement.operating_profit.non_operating_expenses") / 1e6
  }));
};

/**
 * 8. Cash Flow Summary (Grouped Bar)
 */
export const mapCashFlowSummary = (reports: any[]) => {
  return reports.map(r => ({
    year: r.fiscal_year,
    "Operating CF": getVal(r.data, "cash_flow_statement.operating_activities.net_cash_flow_from_operating") / 1e6,
    "Investing CF": getVal(r.data, "cash_flow_statement.investing_activities.net_cash_flow_from_investing") / 1e6,
    "Financing CF": getVal(r.data, "cash_flow_statement.financing_activities.net_cash_flow_from_financing") / 1e6
  }));
};

/**
 * 9. Revenue vs Cash Collection (Line/Combo)
 */
export const mapRevenueVsCash = (reports: any[]) => {
  return reports.map(r => ({
    year: r.fiscal_year,
    "Revenue": getVal(r.data, "income_statement.total_operating_revenue") / 1e6,
    "Cash From Sales": getVal(r.data, "cash_flow_statement.operating_activities.cash_received_from_goods_and_services") / 1e6
  }));
};

/**
 * 10. Growth Indicators (Combo Chart)
 */
export const mapGrowthIndicators = (reports: any[]) => {
  return reports.map((r, idx) => {
    const prev = reports[idx - 1];
    const rev = getVal(r.data, "income_statement.total_operating_revenue");
    const prevRev = prev ? getVal(prev.data, "income_statement.total_operating_revenue") : 0;
    const net = getVal(r.data, "income_statement.net_profit.net_profit_attr_to_parent");
    const prevNet = prev ? getVal(prev.data, "income_statement.net_profit.net_profit_attr_to_parent") : 0;

    return {
      year: r.fiscal_year,
      "Revenue": rev / 1e6,
      "Revenue Growth": prevRev ? ((rev - prevRev) / prevRev) * 100 : 0,
      "Net Profit": net / 1e6,
      "Net Profit Growth": prevNet ? ((net - prevNet) / Math.abs(prevNet)) * 100 : 0
    };
  });
};

/**
 * 14. OCF vs Capex vs FCF Trend (Line Chart)
 */
export const mapCapexTrend = (reports: any[]) => {
  return reports.map(r => {
    const ocf = getVal(r.data, "cash_flow_statement.operating_activities.net_cash_flow_from_operating");
    const capex = getVal(r.data, "cash_flow_statement.investing_activities.cash_paid_for_assets");
    return {
      year: r.fiscal_year,
      "Operating CF": ocf / 1e6,
      "Capex": capex / 1e6,
      "Free CF": (ocf - capex) / 1e6
    };
  });
};

/**
 * 15. Liquidity Ratios Trend (Line Chart)
 */
export const mapLiquidityTrends = (reports: any[]) => {
  return reports.map(r => {
    const currentAssets = getVal(r.data, "balance_sheet.current_assets.total_current_assets");
    const currentLiabilities = getVal(r.data, "balance_sheet.current_liabilities.total_current_liabilities");
    const inventory = getVal(r.data, "balance_sheet.current_assets.inventories");
    const monetaryFunds = getVal(r.data, "balance_sheet.current_assets.monetary_funds");
    const tradingAssets = getVal(r.data, "balance_sheet.current_assets.trading_financial_assets") + 
                          getVal(r.data, "balance_sheet.current_assets.financial_assets_fvpl.trading_financial_assets");

    return {
      year: r.fiscal_year,
      "Current Ratio": currentLiabilities ? currentAssets / currentLiabilities : 0,
      "Quick Ratio": currentLiabilities ? (currentAssets - inventory) / currentLiabilities : 0,
      "Cash Ratio": currentLiabilities ? (monetaryFunds + tradingAssets) / currentLiabilities : 0
    };
  });
};

/**
 * 16. Working Capital Cycle (Line Chart)
 */
export const mapWorkingCapitalCycle = (reports: any[]) => {
  return reports.map((r, idx) => {
    const prev = reports[idx - 1];
    const revenue = getVal(r.data, "income_statement.total_operating_revenue");
    const cogs = getVal(r.data, "income_statement.total_operating_cost.operating_cost");
    
    // Average Balances
    const avgInv = prev ? (getVal(r.data, "balance_sheet.current_assets.inventories") + getVal(prev.data, "balance_sheet.current_assets.inventories")) / 2 : getVal(r.data, "balance_sheet.current_assets.inventories");
    const avgAR = prev ? (getVal(r.data, "balance_sheet.current_assets.notes_and_accounts_receivable.amount") + getVal(prev.data, "balance_sheet.current_assets.notes_and_accounts_receivable.amount")) / 2 : getVal(r.data, "balance_sheet.current_assets.notes_and_accounts_receivable.amount");
    const avgPayables = prev ? (getVal(r.data, "balance_sheet.current_liabilities.notes_and_accounts_payable.amount") + getVal(prev.data, "balance_sheet.current_liabilities.notes_and_accounts_payable.amount")) / 2 : getVal(r.data, "balance_sheet.current_liabilities.notes_and_accounts_payable.amount");

    // Days Calculations (using 365 for Annual)
    // If Quarterly/Monthly, we should adjust, but standard is often annualized.
    // Assuming data is annualized or we use ratio. 
    // To be precise for annual chart:
    const dio = cogs ? (avgInv / cogs) * 365 : 0;
    const dso = revenue ? (avgAR / revenue) * 365 : 0;
    const dpo = cogs ? (avgPayables / cogs) * 365 : 0;

    return {
      year: r.fiscal_year,
      "DIO": dio,
      "DSO": dso,
      "DPO": dpo,
      "CCC": dio + dso - dpo // Cash Conversion Cycle
    };
  });
};

/**
 * 17. Debt-to-Asset Ratio & Delta (Dual Axis)
 */
export const mapDebtToAssetDelta = (reports: any[]) => {
  return reports.map((r, idx) => {
    const prev = reports[idx - 1];
    const assets = getVal(r.data, "balance_sheet.assets_summary.total_assets");
    const liabilities = getVal(r.data, "balance_sheet.liabilities_summary.total_liabilities");
    
    const currentRatio = assets ? liabilities / assets : 0;
    
    let prevRatio = 0;
    if (prev) {
      const prevAssets = getVal(prev.data, "balance_sheet.assets_summary.total_assets");
      const prevLiabilities = getVal(prev.data, "balance_sheet.liabilities_summary.total_liabilities");
      prevRatio = prevAssets ? prevLiabilities / prevAssets : 0;
    }

    return {
      year: r.fiscal_year,
      "Debt Ratio": currentRatio * 100, // Scale to %
      "Debt Ratio Delta": prev ? (currentRatio - prevRatio) * 100 : 0 // Basis point change in %
    };
  });
};

/**
 * 18. Net Profit vs Operating Cash Flow (Line Chart)
 */
export const mapProfitVsCashFlow = (reports: any[]) => {
  return reports.map(r => ({
    year: r.fiscal_year,
    "Net Profit": getVal(r.data, "income_statement.net_profit.net_profit_attr_to_parent") / 1e6,
    "Operating CF": getVal(r.data, "cash_flow_statement.operating_activities.net_cash_flow_from_operating") / 1e6
  }));
};
