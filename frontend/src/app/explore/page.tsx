"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Search, Database, ArrowRight, Eye, EyeOff, Filter, Check, Calendar } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { useLanguage } from "@/lib/LanguageContext";

// Helper to flatten nested object keys into a readable format
const formatKey = (key: string) => {
    return key.split('.').pop()?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || key;
};

// Custom sort for periods: Year DESC, then Period (Annual > Q4 > Q3 > Q2 > Q1)
const sortPeriods = (periods: string[]) => {
    const priority: Record<string, number> = { "ANNUAL": 10, "Q4": 4, "Q3": 3, "Q2": 2, "Q1": 1 };
    
    return [...periods].sort((a, b) => {
        const partsA = a.trim().split(/\s+/);
        const partsB = b.trim().split(/\s+/);
        
        const yearA = parseInt(partsA[0]) || 0;
        const yearB = parseInt(partsB[0]) || 0;
        
        if (yearA !== yearB) {
            return yearB - yearA; // Year Descending
        }
        
        const pA = (partsA.length > 1 ? partsA[1] : "").toUpperCase();
        const pB = (partsB.length > 1 ? partsB[1] : "").toUpperCase();
        
        return (priority[pB] || 0) - (priority[pA] || 0); // Priority Descending
    });
};

// Standard schema order for consistent row sorting - using full paths
const STANDARD_SCHEMA_ORDER: Record<string, number> = (() => {
    const order: string[] = [
        // Income Statement
        "income_statement.total_operating_revenue",
        "income_statement.total_operating_revenue.operating_revenue",
        "income_statement.total_operating_revenue.interest_income",
        "income_statement.total_operating_revenue.earned_premiums",
        "income_statement.total_operating_revenue.fee_and_commission_income",
        "income_statement.total_operating_revenue.other_business_revenue",
        "income_statement.total_operating_revenue.other_items",
        "income_statement.total_operating_cost",
        "income_statement.total_operating_cost.operating_cost",
        "income_statement.total_operating_cost.interest_expenses",
        "income_statement.total_operating_cost.fee_and_commission_expenses",
        "income_statement.total_operating_cost.taxes_and_surcharges",
        "income_statement.total_operating_cost.selling_expenses",
        "income_statement.total_operating_cost.admin_expenses",
        "income_statement.total_operating_cost.rd_expenses",
        "income_statement.total_operating_cost.financial_expenses",
        "income_statement.total_operating_cost.financial_expenses.interest_expenses",
        "income_statement.total_operating_cost.financial_expenses.interest_income",
        "income_statement.total_operating_cost.asset_impairment_loss",
        "income_statement.total_operating_cost.credit_impairment_loss",
        "income_statement.total_operating_cost.surrender_value",
        "income_statement.total_operating_cost.net_compensation_expenses",
        "income_statement.total_operating_cost.net_insurance_contract_reserves",
        "income_statement.total_operating_cost.policy_dividend_expenses",
        "income_statement.total_operating_cost.reinsurance_expenses",
        "income_statement.total_operating_cost.other_business_costs",
        "income_statement.total_operating_cost.other_items",
        "income_statement.other_operating_income",
        "income_statement.other_operating_income.fair_value_change_income",
        "income_statement.other_operating_income.investment_income",
        "income_statement.other_operating_income.investment_income_from_associates_jv",
        "income_statement.other_operating_income.net_exposure_hedging_income",
        "income_statement.other_operating_income.exchange_income",
        "income_statement.other_operating_income.asset_disposal_income",
        "income_statement.other_operating_income.asset_impairment_loss_new",
        "income_statement.other_operating_income.credit_impairment_loss_new",
        "income_statement.other_operating_income.other_income",
        "income_statement.other_operating_income.operating_profit_other_items",
        "income_statement.other_operating_income.operating_profit_balance_items",
        "income_statement.operating_profit",
        "income_statement.operating_profit.non_operating_revenue",
        "income_statement.operating_profit.non_current_asset_disposal_gain",
        "income_statement.operating_profit.non_operating_expenses",
        "income_statement.operating_profit.non_current_asset_disposal_loss",
        "income_statement.operating_profit.other_items_affecting_total_profit",
        "income_statement.operating_profit.total_profit_balance_items",
        "income_statement.total_profit",
        "income_statement.total_profit.income_tax",
        "income_statement.total_profit.unconfirmed_investment_loss",
        "income_statement.total_profit.other_items_affecting_net_profit",
        "income_statement.total_profit.net_profit_difference",
        "income_statement.net_profit",
        "income_statement.net_profit.net_profit_continuing_ops",
        "income_statement.net_profit.net_profit_discontinued_ops",
        "income_statement.net_profit.profit_from_merged_party_before_merger",
        "income_statement.net_profit.net_profit_attr_to_parent",
        "income_statement.net_profit.minority_interest_income",
        "income_statement.net_profit.net_profit_deducting_non_recurring",
        "income_statement.net_profit.other_items",
        "income_statement.net_profit.balance_items",
        "income_statement.earnings_per_share",
        "income_statement.earnings_per_share.basic_eps",
        "income_statement.earnings_per_share.diluted_eps",
        "income_statement.other_comprehensive_income",
        "income_statement.other_comprehensive_income.attr_to_parent",
        "income_statement.other_comprehensive_income.attr_to_minority",
        "income_statement.total_comprehensive_income",
        "income_statement.total_comprehensive_income.attr_to_parent",
        "income_statement.total_comprehensive_income.attr_to_minority",
        "income_statement.total_comprehensive_income.derecognition_income_amortized_cost",

        // Balance Sheet - Assets
        "balance_sheet.current_assets",
        "balance_sheet.current_assets.monetary_funds",
        "balance_sheet.current_assets.clearing_settlement_funds",
        "balance_sheet.current_assets.lending_funds",
        "balance_sheet.current_assets.funds_lent",
        "balance_sheet.current_assets.trading_financial_assets",
        "balance_sheet.current_assets.financial_assets_fvpl",
        "balance_sheet.current_assets.financial_assets_fvpl.trading_financial_assets",
        "balance_sheet.current_assets.financial_assets_fvpl.designated_financial_assets_fvpl",
        "balance_sheet.current_assets.derivative_financial_assets",
        "balance_sheet.current_assets.notes_and_accounts_receivable",
        "balance_sheet.current_assets.notes_and_accounts_receivable.notes_receivable",
        "balance_sheet.current_assets.notes_and_accounts_receivable.accounts_receivable",
        "balance_sheet.current_assets.receivables_financing",
        "balance_sheet.current_assets.prepayments",
        "balance_sheet.current_assets.premiums_receivable",
        "balance_sheet.current_assets.reinsurance_accounts_receivable",
        "balance_sheet.current_assets.reinsurance_contract_reserves_receivable",
        "balance_sheet.current_assets.other_receivables_total",
        "balance_sheet.current_assets.other_receivables_total.interest_receivable",
        "balance_sheet.current_assets.other_receivables_total.dividends_receivable",
        "balance_sheet.current_assets.other_receivables_total.other_receivables",
        "balance_sheet.current_assets.export_tax_refund_receivable",
        "balance_sheet.current_assets.subsidies_receivable",
        "balance_sheet.current_assets.internal_receivables",
        "balance_sheet.current_assets.buy_back_financial_assets",
        "balance_sheet.current_assets.financial_assets_amortized_cost",
        "balance_sheet.current_assets.inventories",
        "balance_sheet.current_assets.financial_assets_fvoci",
        "balance_sheet.current_assets.contract_assets",
        "balance_sheet.current_assets.assets_held_for_sale",
        "balance_sheet.current_assets.non_current_assets_due_within_1y",
        "balance_sheet.current_assets.agency_business_assets",
        "balance_sheet.current_assets.other_current_assets",
        "balance_sheet.current_assets.other_items",
        "balance_sheet.current_assets.balance_items",
        "balance_sheet.current_assets.total_current_assets",
        "balance_sheet.non_current_assets",
        "balance_sheet.non_current_assets.loans_and_advances",
        "balance_sheet.non_current_assets.debt_investments",
        "balance_sheet.non_current_assets.other_debt_investments",
        "balance_sheet.non_current_assets.financial_assets_amortized_cost_non_current",
        "balance_sheet.non_current_assets.financial_assets_fvoci_non_current",
        "balance_sheet.non_current_assets.available_for_sale_financial_assets",
        "balance_sheet.non_current_assets.held_to_maturity_investments",
        "balance_sheet.non_current_assets.long_term_receivables",
        "balance_sheet.non_current_assets.long_term_equity_investments",
        "balance_sheet.non_current_assets.investment_properties",
        "balance_sheet.non_current_assets.fixed_assets",
        "balance_sheet.non_current_assets.construction_in_progress",
        "balance_sheet.non_current_assets.construction_materials",
        "balance_sheet.non_current_assets.other_equity_instrument_investments",
        "balance_sheet.non_current_assets.other_non_current_financial_assets",
        "balance_sheet.non_current_assets.fixed_assets_liquidation",
        "balance_sheet.non_current_assets.productive_biological_assets",
        "balance_sheet.non_current_assets.oil_and_gas_assets",
        "balance_sheet.non_current_assets.right_of_use_assets",
        "balance_sheet.non_current_assets.intangible_assets",
        "balance_sheet.non_current_assets.balance_items",
        "balance_sheet.non_current_assets.development_expenses",
        "balance_sheet.non_current_assets.goodwill",
        "balance_sheet.non_current_assets.long_term_deferred_expenses",
        "balance_sheet.non_current_assets.deferred_tax_assets",
        "balance_sheet.non_current_assets.other_non_current_assets",
        "balance_sheet.non_current_assets.other_items",
        "balance_sheet.non_current_assets.total_non_current_assets",
        "balance_sheet.assets_summary.other_asset_items",
        "balance_sheet.assets_summary.asset_balance_items",
        "balance_sheet.assets_summary.total_assets",

        // Balance Sheet - Liabilities
        "balance_sheet.current_liabilities",
        "balance_sheet.current_liabilities.short_term_borrowings",
        "balance_sheet.current_liabilities.borrowings_from_central_bank",
        "balance_sheet.current_liabilities.deposits_and_interbank_placements",
        "balance_sheet.current_liabilities.borrowings_from_interbank",
        "balance_sheet.current_liabilities.trading_financial_liabilities",
        "balance_sheet.current_liabilities.financial_liabilities_fvpl",
        "balance_sheet.current_liabilities.financial_liabilities_fvpl.trading_financial_liabilities",
        "balance_sheet.current_liabilities.financial_liabilities_fvpl.designated_financial_liabilities_fvpl",
        "balance_sheet.current_liabilities.derivative_financial_liabilities",
        "balance_sheet.current_liabilities.notes_and_accounts_payable",
        "balance_sheet.current_liabilities.notes_and_accounts_payable.notes_payable",
        "balance_sheet.current_liabilities.notes_and_accounts_payable.accounts_payable",
        "balance_sheet.current_liabilities.advances_from_customers",
        "balance_sheet.current_liabilities.contract_liabilities",
        "balance_sheet.current_liabilities.sell_buy_back_financial_assets",
        "balance_sheet.current_liabilities.fees_and_commissions_payable",
        "balance_sheet.current_liabilities.payroll_payable",
        "balance_sheet.current_liabilities.taxes_payable",
        "balance_sheet.current_liabilities.other_payables_total",
        "balance_sheet.current_liabilities.other_payables_total.interest_payable",
        "balance_sheet.current_liabilities.other_payables_total.dividends_payable",
        "balance_sheet.current_liabilities.other_payables_total.other_payables",
        "balance_sheet.current_liabilities.reinsurance_accounts_payable",
        "balance_sheet.current_liabilities.internal_payables",
        "balance_sheet.current_liabilities.estimated_current_liabilities",
        "balance_sheet.current_liabilities.insurance_contract_reserves",
        "balance_sheet.current_liabilities.acting_trading_securities",
        "balance_sheet.current_liabilities.acting_underwriting_securities",
        "balance_sheet.current_liabilities.deferred_revenue_within_1y",
        "balance_sheet.current_liabilities.financial_liabilities_amortized_cost",
        "balance_sheet.current_liabilities.short_term_bonds_payable",
        "balance_sheet.current_liabilities.liabilities_held_for_sale",
        "balance_sheet.current_liabilities.non_current_liabilities_due_within_1y",
        "balance_sheet.current_liabilities.agency_business_liabilities",
        "balance_sheet.current_liabilities.other_current_liabilities",
        "balance_sheet.current_liabilities.other_items",
        "balance_sheet.current_liabilities.balance_items",
        "balance_sheet.current_liabilities.total_current_liabilities",
        "balance_sheet.non_current_liabilities",
        "balance_sheet.non_current_liabilities.long_term_borrowings",
        "balance_sheet.non_current_liabilities.financial_liabilities_amortized_cost_non_current",
        "balance_sheet.non_current_liabilities.bonds_payable",
        "balance_sheet.non_current_liabilities.bonds_payable.preference_shares",
        "balance_sheet.non_current_liabilities.bonds_payable.perpetual_bonds",
        "balance_sheet.non_current_liabilities.lease_liabilities",
        "balance_sheet.non_current_liabilities.long_term_payables",
        "balance_sheet.non_current_liabilities.long_term_payroll_payable",
        "balance_sheet.non_current_liabilities.special_payables",
        "balance_sheet.non_current_liabilities.estimated_liabilities",
        "balance_sheet.non_current_liabilities.deferred_revenue",
        "balance_sheet.non_current_liabilities.deferred_tax_liabilities",
        "balance_sheet.non_current_liabilities.other_non_current_liabilities",
        "balance_sheet.non_current_liabilities.other_items",
        "balance_sheet.non_current_liabilities.balance_items",
        "balance_sheet.non_current_liabilities.total_non_current_liabilities",
        "balance_sheet.liabilities_summary.other_liability_items",
        "balance_sheet.liabilities_summary.liability_balance_items",
        "balance_sheet.liabilities_summary.total_liabilities",

        // Balance Sheet - Equity
        "balance_sheet.equity.paid_in_capital",
        "balance_sheet.equity.other_equity_instruments",
        "balance_sheet.equity.other_equity_instruments.preference_shares",
        "balance_sheet.equity.other_equity_instruments.perpetual_bonds",
        "balance_sheet.equity.other_equity_instruments.other",
        "balance_sheet.equity.capital_reserves",
        "balance_sheet.equity.other_comprehensive_income",
        "balance_sheet.equity.treasury_stock",
        "balance_sheet.equity.special_reserves",
        "balance_sheet.equity.surplus_reserves",
        "balance_sheet.equity.general_risk_reserves",
        "balance_sheet.equity.unconfirmed_investment_loss",
        "balance_sheet.equity.undistributed_profit",
        "balance_sheet.equity.proposed_cash_dividends",
        "balance_sheet.equity.currency_translation_diff",
        "balance_sheet.equity.parent_equity_other_items",
        "balance_sheet.equity.parent_equity_balance_items",
        "balance_sheet.equity.total_parent_equity",
        "balance_sheet.equity.minority_interests",
        "balance_sheet.equity.equity_other_items",
        "balance_sheet.equity.equity_balance_items",
        "balance_sheet.equity.total_equity",
        "balance_sheet.balance_check.liabilities_and_equity_other_items",
        "balance_sheet.balance_check.liabilities_and_equity_balance_items",
        "balance_sheet.balance_check.total_liabilities_and_equity",

        // Cash Flow - Operating
        "cash_flow_statement.operating_activities.cash_received_from_goods_and_services",
        "cash_flow_statement.operating_activities.net_increase_deposits_interbank",
        "cash_flow_statement.operating_activities.net_increase_borrowings_central_bank",
        "cash_flow_statement.operating_activities.net_increase_borrowings_other_financial",
        "cash_flow_statement.operating_activities.cash_received_original_premiums",
        "cash_flow_statement.operating_activities.net_cash_received_reinsurance",
        "cash_flow_statement.operating_activities.net_increase_insured_investment",
        "cash_flow_statement.operating_activities.net_increase_disposal_trading_assets",
        "cash_flow_statement.operating_activities.cash_received_interest_commission",
        "cash_flow_statement.operating_activities.net_increase_borrowed_funds",
        "cash_flow_statement.operating_activities.net_decrease_loans_advances",
        "cash_flow_statement.operating_activities.net_increase_repurchase_funds",
        "cash_flow_statement.operating_activities.tax_refunds_received",
        "cash_flow_statement.operating_activities.other_cash_received_operating",
        "cash_flow_statement.operating_activities.inflow_other_items",
        "cash_flow_statement.operating_activities.inflow_balance_items",
        "cash_flow_statement.operating_activities.subtotal_cash_inflow_operating",
        "cash_flow_statement.operating_activities.cash_paid_for_goods_and_services",
        "cash_flow_statement.operating_activities.net_increase_loans_advances",
        "cash_flow_statement.operating_activities.net_increase_deposits_central_bank_interbank",
        "cash_flow_statement.operating_activities.cash_paid_original_contract_claims",
        "cash_flow_statement.operating_activities.cash_paid_interest_commission",
        "cash_flow_statement.operating_activities.cash_paid_policy_dividends",
        "cash_flow_statement.operating_activities.cash_paid_to_employees",
        "cash_flow_statement.operating_activities.taxes_paid",
        "cash_flow_statement.operating_activities.other_cash_paid_operating",
        "cash_flow_statement.operating_activities.outflow_other_items",
        "cash_flow_statement.operating_activities.outflow_balance_items",
        "cash_flow_statement.operating_activities.subtotal_cash_outflow_operating",
        "cash_flow_statement.operating_activities.net_cash_flow_other_items",
        "cash_flow_statement.operating_activities.net_cash_flow_balance_items",
        "cash_flow_statement.operating_activities.net_cash_flow_from_operating",

        // Cash Flow - Investing
        "cash_flow_statement.investing_activities.cash_received_from_investment_recovery",
        "cash_flow_statement.investing_activities.cash_received_from_investment_income",
        "cash_flow_statement.investing_activities.net_cash_from_disposal_assets",
        "cash_flow_statement.investing_activities.net_cash_from_disposal_subsidiaries",
        "cash_flow_statement.investing_activities.cash_received_from_pledge_deposit_reduction",
        "cash_flow_statement.investing_activities.other_cash_received_investing",
        "cash_flow_statement.investing_activities.inflow_other_items",
        "cash_flow_statement.investing_activities.inflow_balance_items",
        "cash_flow_statement.investing_activities.subtotal_cash_inflow_investing",
        "cash_flow_statement.investing_activities.cash_paid_for_assets",
        "cash_flow_statement.investing_activities.cash_paid_for_investments",
        "cash_flow_statement.investing_activities.net_increase_pledged_loans",
        "cash_flow_statement.investing_activities.net_cash_paid_subsidiaries",
        "cash_flow_statement.investing_activities.cash_paid_for_pledge_deposit_increase",
        "cash_flow_statement.investing_activities.other_cash_paid_investing",
        "cash_flow_statement.investing_activities.outflow_other_items",
        "cash_flow_statement.investing_activities.outflow_balance_items",
        "cash_flow_statement.investing_activities.subtotal_cash_outflow_investing",
        "cash_flow_statement.investing_activities.net_cash_flow_other_items",
        "cash_flow_statement.investing_activities.net_cash_flow_balance_items",
        "cash_flow_statement.investing_activities.net_cash_flow_from_investing",

        // Cash Flow - Financing
        "cash_flow_statement.financing_activities.cash_received_from_investments",
        "cash_flow_statement.financing_activities.cash_received_from_investments.from_minority_shareholders",
        "cash_flow_statement.financing_activities.cash_received_from_borrowings",
        "cash_flow_statement.financing_activities.cash_received_from_bond_issue",
        "cash_flow_statement.financing_activities.other_cash_received_financing",
        "cash_flow_statement.financing_activities.inflow_other_items",
        "cash_flow_statement.financing_activities.inflow_balance_items",
        "cash_flow_statement.financing_activities.subtotal_cash_inflow_financing",
        "cash_flow_statement.financing_activities.cash_paid_for_debt_repayment",
        "cash_flow_statement.financing_activities.cash_paid_for_dividends_and_profits",
        "cash_flow_statement.financing_activities.dividends_paid_to_minority",
        "cash_flow_statement.financing_activities.cash_paid_for_minority_equity",
        "cash_flow_statement.financing_activities.other_cash_paid_financing",
        "cash_flow_statement.financing_activities.other_cash_paid_financing.paid_to_minority_for_capital_reduction",
        "cash_flow_statement.financing_activities.outflow_other_items",
        "cash_flow_statement.financing_activities.outflow_balance_items",
        "cash_flow_statement.financing_activities.subtotal_cash_outflow_financing",
        "cash_flow_statement.financing_activities.net_cash_flow_other_items",
        "cash_flow_statement.financing_activities.net_cash_flow_balance_items",
        "cash_flow_statement.financing_activities.net_cash_flow_from_financing",

        // Cash Flow - End
        "cash_flow_statement.cash_increase.exchange_rate_effect",
        "cash_flow_statement.cash_increase.increase_other_items",
        "cash_flow_statement.cash_increase.increase_balance_items",
        "cash_flow_statement.cash_increase.net_increase_cash_and_equivalents",
        "cash_flow_statement.cash_increase.cash_at_beginning",
        "cash_flow_statement.cash_increase.end_balance_other_items",
        "cash_flow_statement.cash_increase.end_balance_balance_items",
        "cash_flow_statement.cash_increase.cash_at_end",
        
        // Supplementary
        "cash_flow_statement.supplementary_info.net_profit_adjustment",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.net_profit",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.asset_impairment_reserves",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.depreciation_fixed_assets_investment_props",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.depreciation_others",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.depreciation_investment_props",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.amortization_intangible_assets",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.amortization_long_term_deferred",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.amortization_deferred_revenue",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.decrease_deferred_expenses",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.increase_accrued_expenses",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.loss_disposal_assets",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.loss_scrapping_assets",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.loss_fair_value_change",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.financial_expenses",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.investment_loss",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.deferred_tax",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.decrease_deferred_tax_assets",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.increase_deferred_tax_liabilities",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.increase_estimated_liabilities",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.decrease_inventories",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.decrease_operating_receivables",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.increase_operating_payables",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.other",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.net_cash_flow_other_items",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.net_cash_flow_balance_items",
        "cash_flow_statement.supplementary_info.net_profit_adjustment.net_cash_flow_from_operating_indirect",
        "cash_flow_statement.supplementary_info.significant_non_cash.debt_to_capital",
        "cash_flow_statement.supplementary_info.significant_non_cash.convertible_bonds_due_within_1y",
        "cash_flow_statement.supplementary_info.significant_non_cash.fixed_assets_finance_lease",
        "cash_flow_statement.supplementary_info.significant_non_cash.non_cash_items_other",
        "cash_flow_statement.supplementary_info.cash_change_check.cash_end_balance",
        "cash_flow_statement.supplementary_info.cash_change_check.cash_begin_balance",
        "cash_flow_statement.supplementary_info.cash_change_check.equivalents_end_balance",
        "cash_flow_statement.supplementary_info.cash_change_check.equivalents_begin_balance",
        "cash_flow_statement.supplementary_info.cash_change_check.net_increase_other",
        "cash_flow_statement.supplementary_info.cash_change_check.net_increase_balance",
        "cash_flow_statement.supplementary_info.cash_change_check.net_increase_cash_and_equivalents_indirect",
        "cash_flow_statement.supplementary_info.credit_impairment_loss"
    ];
    
    const map: Record<string, number> = {};
    order.forEach((key, idx) => {
        map[key] = idx;
    });
    return map;
})();

export default function DataPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [displayRows, setDisplayRows] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [rawReports, setRawReports] = useState<any[]>([]);
  const hasInitializedSelection = useRef(false);

  // Filters State
  const [hideZeros, setHideZeros] = useState(false);
  const [annualOnly, setAnnualOnly] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(["Income Statement", "Balance Sheet", "Cash Flow"]));
  const [allItems, setAllItems] = useState<{id: string, name: string, type: string}[]>([]);

  // Scroll Sync Refs
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const [tableWidth, setTableWidth] = useState(0);

    // Flatten reports logic moved inside component to use t()

    const flattenReports = useCallback((reports: any[]) => {

        const flattened: Record<string, any> = {};

    

        reports.forEach((report: any) => {

            let yearKey = report.fiscal_year.trim();

            

            if (report.period_type && report.period_type.toLowerCase() === 'annual') {

                if (!yearKey.toLowerCase().includes('annual')) {

                    yearKey = `${yearKey} Annual`;

                }

            }

    

            const data = report.data;

    

            if (!data) return;

    

            const processSection = (sectionName: string, sectionData: any, typeLabel: string) => {

                if (!sectionData) return;

    

                const traverse = (obj: any, prefix: string = "") => {

                    const parts = prefix ? prefix.split('.') : [];

                    const level = parts.length + 1;

    

                    for (const key in obj) {

                        if (key === "title" || key === "amount" || typeof obj[key] === 'string') continue;

    

                        const value = obj[key];

                        const currentPath = prefix ? `${prefix}.${key}` : `${sectionName}.${key}`;

                        

                                              const uniqueId = `${typeLabel}-${currentPath}`;

                        

                          

                        

                                              const processItem = (val: number | any) => {

                        

                                                  if (!flattened[uniqueId]) {

                        

                                                      let accountName = t(formatKey(key)); // Use t() for translation

                        

                                                      

                        

                                                      // Default level based on depth

                        

                                                      let itemLevel = currentPath.split('.').length;

                        

                                                      // Override Levels based on specific keys (English & Chinese context handled by t())

                        

                                                      // L2 Overrides

                        

                                                      if ([

                        

                                                          "Total Assets", "Total Liabilities", "Total Equity", 

                                                          "资产总计", "负债合计", "所有者权益合计", "股东权益合计",

                                                          "Total Current Assets", "Total Non Current Assets", 

                        

                                                          "Total Current Liabilities", "Total Non Current Liabilities",

                        

                                                          "Net Cash Flow From Operating", "Net Cash Flow From Investing", "Net Cash Flow From Financing",

                        

                                                          "流动资产", "流动资产合计", "非流动资产合计",

                        

                                                          "流动负债合计", "非流动负债合计",

                        

                                                          "经营活动产生的现金流量净额", "投资活动产生的现金流量净额", "筹资活动产生的现金流量净额"

                        

                                                      ].includes(accountName)) {

                        

                                                          itemLevel = 2;

                        

                                                      }

                        

                        

                        

                                                      flattened[uniqueId] = { 

                        

                                                          account: accountName, 

                        

                                                          type: typeLabel, 

                        

                                                          originalKey: currentPath,

                        

                                                          orderKey: currentPath, 

                        

                                                          id: uniqueId,

                        

                                                          itemLevel: itemLevel

                        

                                                      };

                        

                                                  }

                        

                                                  flattened[uniqueId][yearKey] = typeof val === 'number' ? val : val?.amount || 0;

                        

                                              };

                        

                          

                        

                                              if (typeof value === 'object' && value !== null) {

                            if ('amount' in value) {

                                 processItem(value);

                            }

                            traverse(value, prefix ? `${prefix}.${key}` : `${sectionName}.${key}`);

                        } else if (typeof value === 'number') {

                             processItem(value);

                        }

                    }

                };

                traverse(sectionData);

            };

    

            processSection("income_statement", data.income_statement, "Income Statement");

            processSection("balance_sheet", data.balance_sheet, "Balance Sheet");

            processSection("cash_flow_statement", data.cash_flow_statement, "Cash Flow");

        });

    

        return Object.values(flattened).sort((a, b) => {

            const typeOrder: Record<string, number> = { "Income Statement": 1, "Balance Sheet": 2, "Cash Flow": 3 };

            const typeDiff = (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);

            if (typeDiff !== 0) return typeDiff;

    

            const orderA = STANDARD_SCHEMA_ORDER[a.orderKey] ?? 9999;

            const orderB = STANDARD_SCHEMA_ORDER[b.orderKey] ?? 9999;

            

            return orderA - orderB;

        });

    }, [t]);

  useEffect(() => {
    const storedReports = localStorage.getItem("insight_viewer_reports");
    const storedTime = localStorage.getItem("insight_viewer_last_update");
    
    if (storedReports) {
        try {
            const reports = JSON.parse(storedReports);
            if (Array.isArray(reports) && reports.length > 0) {
                 const allYearsRaw = Array.from(new Set(reports.map((r: any) => {
                     let y = r.fiscal_year.trim();
                     if (r.period_type && r.period_type.toLowerCase() === 'annual' && !y.toLowerCase().includes('annual')) {
                         y = `${y} Annual`;
                     }
                     return y;
                 }))) as string[];
                 
                 const sortedYears = sortPeriods(allYearsRaw);
                 setYears(sortedYears);
                 setRawReports(reports);
            } else {
                 setLoading(false);
            }
        } catch (e) {
            console.error("Failed to parse stored reports", e);
            setLoading(false);
        }
    } else {
        setLoading(false);
    }
    
    if (storedTime) {
        setLastUpdate(new Date(storedTime).toLocaleString());
    }
  }, []);

  useEffect(() => {
      if (!rawReports.length) return;

      const flattened = flattenReports(rawReports);
      setDisplayRows(flattened);

      const itemsList = flattened.map(r => ({ id: r.id, name: r.account, type: r.type }));
      setAllItems(itemsList);
      
      if (!hasInitializedSelection.current) {
           setSelectedItems(new Set(itemsList.map(i => i.id)));
           hasInitializedSelection.current = true;
      }
      
      setLoading(false);
  }, [rawReports, flattenReports]);

  // Filter Logic
  const filteredYears = useMemo(() => {
      if (annualOnly) {
          return years.filter(y => y.includes("Annual"));
      }
      return years;
  }, [years, annualOnly]);

  const filteredData = useMemo(() => {
      return displayRows.filter(row => {
          if (!selectedTypes.has(row.type)) return false;

          const matchesSearch = 
            row.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.type.toLowerCase().includes(searchTerm.toLowerCase());
          
          if (!matchesSearch) return false;

          if (hideZeros) {
              const allZeros = filteredYears.every(year => !row[year] || row[year] === 0);
              if (allZeros) return false;
          }

          if (!selectedItems.has(row.id)) return false;

          return true;
      });
  }, [displayRows, searchTerm, hideZeros, selectedItems, selectedTypes, filteredYears]);

  // Update table width for top scrollbar
  useEffect(() => {
      if (tableContainerRef.current) {
          const table = tableContainerRef.current.querySelector('table');
          if (table) {
              setTableWidth(table.offsetWidth);
          }
      }
  }, [filteredData, filteredYears]);

  // Sync Scroll Handlers
  const handleTopScroll = (e: any) => {
      if (tableContainerRef.current) {
          tableContainerRef.current.scrollLeft = e.target.scrollLeft;
      }
  };

  const handleTableScroll = (e: any) => {
      if (topScrollRef.current) {
          topScrollRef.current.scrollLeft = e.target.scrollLeft;
      }
  };

  if (loading) {
      return <div className="p-8 text-center text-gray-500">{t('loading')}</div>;
  }

  if (displayRows.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
              <div className="p-4 bg-gray-100 rounded-full">
                  <Database className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{t('noDataFound')}</h2>
              <p className="text-gray-500 max-w-md">{t('noData')}</p>
              <Link href="/import" className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-900 transition-colors flex items-center">
                  {t('getFinancialData')} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
          </div>
      );
  }

  return (
    <div className="space-y-6" onClick={() => { setShowFilterDropdown(false); setShowTypeDropdown(false); }}>
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('explorerTitle')}</h1>
            {lastUpdate && <p className="text-xs text-gray-500 mt-1">{t('note')}: {lastUpdate}</p>}
        </div>
        
        <div className="flex items-center space-x-3">
            {/* Annual Only Toggle */}
            <button 
                onClick={() => setAnnualOnly(!annualOnly)}
                className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-all ${annualOnly ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
                <Calendar className="w-4 h-4 mr-2" />
                {t('annualOnly')}
            </button>

            {/* Hide Zeros Toggle */}
            <button 
                onClick={() => setHideZeros(!hideZeros)}
                className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-all ${hideZeros ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
                {hideZeros ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {hideZeros ? t('zerosHidden') : t('hideZeros')}
            </button>

            {/* Filter Type Dropdown */}
            <div className="relative" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowFilterDropdown(false); }}
                    className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${showTypeDropdown ? 'border-primary text-primary bg-blue-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    {t('sheet')} ({selectedTypes.size})
                </button>
                {showTypeDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 flex flex-col p-2 space-y-1">
                        {["Income Statement", "Balance Sheet", "Cash Flow"].map(type => (
                            <div key={type} className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer" onClick={() => {
                                const newSet = new Set(selectedTypes);
                                if (newSet.has(type)) newSet.delete(type); else newSet.add(type);
                                setSelectedTypes(newSet);
                            }}>
                                <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${selectedTypes.has(type) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                    {selectedTypes.has(type) && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <div className="flex-1 truncate text-sm text-gray-700">{type}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Filter Items Dropdown */}
            <div className="relative" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={() => { setShowFilterDropdown(!showFilterDropdown); setShowTypeDropdown(false); }}
                    className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${showFilterDropdown ? 'border-primary text-primary bg-blue-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    {t('items')} ({selectedItems.size})
                </button>
                {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[400px] flex flex-col">
                        <div className="p-3 border-b border-gray-100 flex justify-between bg-gray-50 rounded-t-lg">
                            <button onClick={() => setSelectedItems(new Set(allItems.map(i => i.id)))} className="text-xs text-primary font-medium hover:underline">{t('selectAll')}</button>
                            <button onClick={() => setSelectedItems(new Set())} className="text-xs text-red-500 font-medium hover:underline">{t('deselectAll')}</button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-2 space-y-1">
                            {allItems.map(item => (
                                <div key={item.id} className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer" onClick={() => {
                                    const newSet = new Set(selectedItems);
                                    if (newSet.has(item.id)) newSet.delete(item.id); else newSet.add(item.id);
                                    setSelectedItems(newSet);
                                }}>
                                    <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${selectedItems.has(item.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                        {selectedItems.has(item.id) && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <div className="flex-1 truncate text-sm text-gray-700">{item.name} <span className="text-xs text-gray-400">({item.type})</span></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder={t('search')}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Top Scrollbar */}
        <div 
            ref={topScrollRef}
            className="overflow-x-auto border-b border-gray-100 bg-gray-50/50"
            onScroll={handleTopScroll}
        >
            <div style={{ width: tableWidth, height: '1px' }}></div>
        </div>

        <div 
            ref={tableContainerRef}
            className="overflow-x-auto"
            onScroll={handleTableScroll}
        >
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                  <th className="py-3 px-6 font-semibold w-[300px] min-w-[300px]">{t('lineItem')}</th>
                  <th className="py-3 px-6 font-semibold w-[150px] min-w-[150px]">{t('type')}</th>
                  {filteredYears.map(year => (
                      <th key={year} className="py-3 px-6 font-semibold text-right whitespace-nowrap min-w-[120px]">{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((row, idx) => (
                  <tr key={idx} className={clsx(
                    "transition-colors",
                    // Level 1: Major Totals (Extra bold, distinct bg, large gap)
                    row.itemLevel === 1 ? "bg-gray-100 hover:bg-gray-200" :
                    // Level 2: Main Categories (bold, subtle bg, extra top padding)
                    row.itemLevel === 2 ? "bg-gray-50 hover:bg-gray-100" : 
                    "hover:bg-blue-50/30"
                  )}>
                    <td className={clsx(
                        "pr-6 text-gray-900 truncate max-w-[300px]",
                        // Visual Hierarchy Logic
                        row.itemLevel === 1 ? "font-extrabold pl-4 pt-10 pb-4 text-lg border-t-2 border-gray-300 uppercase tracking-wide" :
                        row.itemLevel === 2 ? "font-bold pl-6 pt-8 pb-3 text-base border-t border-gray-200" : 
                        row.itemLevel === 3 ? "font-medium pl-12 py-2.5 text-gray-700" :
                        "pl-20 py-1.5 text-gray-500 text-sm italic"
                    )} title={row.originalKey}>
                        {row.account}
                    </td>
                    <td className={clsx(
                        "px-6 truncate max-w-[150px]",
                        row.itemLevel === 1 ? "pt-10 pb-4 font-bold" :
                        row.itemLevel === 2 ? "pt-8 pb-3" : "py-2"
                    )}>
                        <span className={clsx(
                            "px-2 py-1 rounded text-xs",
                            row.itemLevel === 1 ? "bg-gray-800 text-white shadow-md" :
                            row.itemLevel === 2 ? "bg-white border border-gray-200 shadow-sm" : "bg-gray-100"
                        )}>{row.type}</span>
                    </td>
                    {filteredYears.map(year => (
                        <td key={year} className={clsx(
                            "px-6 text-right font-mono",
                            row.itemLevel === 1 ? "pt-10 pb-4 font-extrabold text-gray-900 text-lg border-t-2 border-gray-300" :
                            row.itemLevel === 2 ? "pt-8 pb-3 font-semibold text-gray-900" : 
                            row.itemLevel === 3 ? "py-2.5 text-gray-800" : "py-1.5 text-gray-500 text-sm"
                        )}>
                            {row[year] !== undefined ? row[year].toLocaleString() : '-'}
                        </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between">
            <span>{t('showingRecords')} {filteredData.length}</span>
            <span>{t('source')}: Browser Storage (Standardized)</span>
        </div>
      </div>
    </div>
  );
}