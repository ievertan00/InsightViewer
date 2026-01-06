# Mapping Tushare API Fields to Pydantic Schema Paths (Dot Notation)

TUSHARE_INCOME_MAP = {
    # L1: 营业总收入
    "total_revenue": "total_operating_revenue.amount",
    "revenue": "total_operating_revenue.operating_revenue",
    "int_income": "total_operating_revenue.interest_income",
    "prem_earned": "total_operating_revenue.earned_premiums",
    "comm_income": "total_operating_revenue.fee_and_commission_income",
    # L1: 营业总成本
    "total_cogs": "total_operating_cost.amount",
    "oper_cost": "total_operating_cost.operating_cost",
    "int_exp": "total_operating_cost.interest_expenses",
    "comm_exp": "total_operating_cost.fee_and_commission_expenses",
    "biz_tax_surchg": "total_operating_cost.taxes_and_surcharges",
    "sell_exp": "total_operating_cost.selling_expenses",
    "admin_exp": "total_operating_cost.admin_expenses",
    "fin_exp": "total_operating_cost.financial_expenses.amount",
    "assets_impair_loss": "total_operating_cost.asset_impairment_loss",
    "credit_impa_loss": "total_operating_cost.credit_impairment_loss",
    "prem_refund": "total_operating_cost.surrender_value",
    "compens_payout": "total_operating_cost.net_compensation_expenses",
    "reser_insur_liab": "total_operating_cost.net_insurance_contract_reserves",
    "div_prem_exp": "total_operating_cost.policy_dividend_expenses",
    "reins_exp": "total_operating_cost.reinsurance_expenses",
    # L1: 其他经营收益
    "oth_income": "other_operating_income.other_income",
    "invest_income": "other_operating_income.investment_income",
    "ass_invest_income": "other_operating_income.investment_income_from_associates_jv",
    "fv_value_chg_gain": "other_operating_income.fair_value_change_income",
    "forex_gain": "other_operating_income.exchange_income",
    "asset_disp_income": "other_operating_income.asset_disposal_income",
    "net_expo_hedging_benefits": "other_operating_income.net_exposure_hedging_income",
    # L1: 营业利润
    "op_profit": "operating_profit.amount",
    "non_op_income": "operating_profit.non_operating_revenue",
    "non_op_exp": "operating_profit.non_operating_expenses",
    "n_loss_mt_assets": "operating_profit.non_current_asset_disposal_loss",
    # L1: 利润总额
    "total_profit": "total_profit.amount",
    "income_tax": "total_profit.income_tax",
    # L1: 净利润
    "n_income": "net_profit.amount",
    "continued_net_profit": "net_profit.net_profit_continuing_ops",
    "end_net_profit": "net_profit.net_profit_discontinued_ops",
    "n_income_attr_p": "net_profit.net_profit_attr_to_parent",
    "minority_gain": "net_profit.minority_interest_income",
    # L1: EPS
    "basic_eps": "earnings_per_share.basic_eps",
    "diluted_eps": "earnings_per_share.diluted_eps",
    # L1: Other Comprehensive Income
    "oth_compr_income": "other_comprehensive_income.amount",
    "compr_inc_attr_p": "other_comprehensive_income.attr_to_parent",
    "compr_inc_attr_m_s": "other_comprehensive_income.attr_to_minority",
    # L1: Total Comprehensive Income
    "t_compr_income": "total_comprehensive_income.amount",
}

TUSHARE_BALANCE_MAP = {
    # Assets - Current
    "total_cur_assets": "current_assets.total_current_assets",
    "money_cap": "current_assets.monetary_funds",
    "trad_asset": "current_assets.financial_assets_fvpl.trading_financial_assets",
    "notes_receiv": "current_assets.notes_and_accounts_receivable.notes_receivable",
    "accounts_receiv": "current_assets.notes_and_accounts_receivable.accounts_receivable",
    "oth_receiv": "current_assets.other_receivables_total.other_receivables",
    "prepayment": "current_assets.prepayments",
    "div_receiv": "current_assets.other_receivables_total.dividends_receivable",
    "int_receiv": "current_assets.other_receivables_total.interest_receivable",
    "inventories": "current_assets.inventories",
    "nca_within_1y": "current_assets.non_current_assets_due_within_1y",
    "oth_cur_assets": "current_assets.other_current_assets",
    # Assets - Non Current
    "total_nc_assets": "non_current_assets.total_non_current_assets", # Note: Tushare might not have this exact field, checking fallback or sum
    "lt_eqt_invest": "non_current_assets.long_term_equity_investments",
    "invest_real_estate": "non_current_assets.investment_properties",
    "fix_assets": "non_current_assets.fixed_assets",
    "cip": "non_current_assets.construction_in_progress", # common abbr
    "const_materials": "non_current_assets.construction_materials",
    "intan_assets": "non_current_assets.intangible_assets",
    "goodwill": "non_current_assets.goodwill",
    "lt_amor_exp": "non_current_assets.long_term_deferred_expenses",
    "defer_tax_assets": "non_current_assets.deferred_tax_assets",
    # Total Assets
    "total_assets": "assets_summary.total_assets",
    # Liabilities - Current
    "total_cur_liab": "current_liabilities.total_current_liabilities",
    "st_borr": "current_liabilities.short_term_borrowings",
    "notes_payable": "current_liabilities.notes_and_accounts_payable.notes_payable",
    "acct_payable": "current_liabilities.notes_and_accounts_payable.accounts_payable",
    "adv_receipts": "current_liabilities.advances_from_customers",
    "payroll_payable": "current_liabilities.payroll_payable",
    "taxes_payable": "current_liabilities.taxes_payable",
    "int_payable": "current_liabilities.other_payables_total.interest_payable",
    "div_payable": "current_liabilities.other_payables_total.dividends_payable",
    "oth_payable": "current_liabilities.other_payables_total.other_payables",
    "non_cur_liab_due_1y": "current_liabilities.non_current_liabilities_due_within_1y",
    # Liabilities - Non Current
    "total_nc_liab": "non_current_liabilities.total_non_current_liabilities",
    "lt_borr": "non_current_liabilities.long_term_borrowings",
    "bond_payable": "non_current_liabilities.bonds_payable.amount",
    "lt_payable": "non_current_liabilities.long_term_payables",
    "defer_tax_liab": "non_current_liabilities.deferred_tax_liabilities",
    # Total Liabilities
    "total_liab": "liabilities_summary.total_liabilities",
    # Equity
    "total_hldr_eqy_exc_min_int": "equity.total_parent_equity",
    "total_hldr_eqy_inc_min_int": "equity.total_equity",
    "capital_rese": "equity.capital_reserves",
    "surplus_rese": "equity.surplus_reserves",
    "undistr_porfit": "equity.undistributed_profit",
    "minority_int": "equity.minority_interests",
}

TUSHARE_CASH_MAP = {
    # Operating
    "n_cashflow_act_oper_a": "operating_activities.net_cash_flow_from_operating",
    "c_fr_sale_sg": "operating_activities.cash_received_from_goods_and_services",
    "recp_tax_rends": "operating_activities.tax_refunds_received",
    "c_fr_oth_operate_a": "operating_activities.other_cash_received_operating",
    "c_inf_fr_operate_a": "operating_activities.subtotal_cash_inflow_operating",
    "c_paid_goods_s": "operating_activities.cash_paid_for_goods_and_services",
    "c_paid_to_for_empl": "operating_activities.cash_paid_to_employees",
    "c_paid_for_taxes": "operating_activities.taxes_paid",
    "c_paid_oth_operate_a": "operating_activities.other_cash_paid_operating",
    "c_out_flow_operate_a": "operating_activities.subtotal_cash_outflow_operating",
    # Investing
    "n_cashflow_act_invest_a": "investing_activities.net_cash_flow_from_investing",
    "c_recp_return_invest": "investing_activities.cash_received_from_investment_income",
    "c_disp_withdrwl_invest": "investing_activities.cash_received_from_investment_recovery",
    "n_recp_disp_fix_intan_long": "investing_activities.net_cash_from_disposal_assets",
    "c_inf_fr_invest_act": "investing_activities.subtotal_cash_inflow_investing",
    "c_paid_acq_invest": "investing_activities.cash_paid_for_assets",
    "c_paid_invest": "investing_activities.cash_paid_for_investments",
    "c_out_flow_invest_act": "investing_activities.subtotal_cash_outflow_investing",
    # Financing
    "n_cashflow_act_fnc_a": "financing_activities.net_cash_flow_from_financing",
    "c_recp_cap_invest": "financing_activities.cash_received_from_investments.amount",
    "c_recp_borrow": "financing_activities.cash_received_from_borrowings",
    "c_inf_fr_fnc_act": "financing_activities.subtotal_cash_inflow_financing",
    "c_prepay_amt_borr": "financing_activities.cash_paid_for_debt_repayment",
    "c_dist_dm_profit": "financing_activities.cash_paid_for_dividends_and_profits",
    "c_out_flow_fnc_act": "financing_activities.subtotal_cash_outflow_financing",
    # Overall
    "n_incr_cash_cash_equ": "cash_increase.net_increase_cash_and_equivalents",
    "c_cash_equ_beg_period": "cash_increase.cash_at_beginning",
    "c_cash_equ_end_period": "cash_increase.cash_at_end",
}
