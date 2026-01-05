# Mapping Chinese Excel Terms to Pydantic Schema Paths (Dot Notation)

# Note: The keys are the Chinese terms found in standard reports.
# The values are the path in the JSON/Pydantic structure: "parent_field.child_field"
# If a field is a top-level total within a group (L1), it often maps to "group_name.amount"

INCOME_STATEMENT_MAP = {
    # L1: 营业总收入
    "一、营业总收入": "total_operating_revenue.amount",
    "营业总收入": "total_operating_revenue.amount",
    "营业收入": "total_operating_revenue.operating_revenue",
    "利息收入": "total_operating_revenue.interest_income",
    "已赚保费": "total_operating_revenue.earned_premiums",
    "手续费及佣金收入": "total_operating_revenue.fee_and_commission_income",
    "其他业务收入": "total_operating_revenue.other_business_revenue",
    # L1: 营业总成本
    "二、营业总成本": "total_operating_cost.amount",
    "营业总成本": "total_operating_cost.amount",
    "营业成本": "total_operating_cost.operating_cost",
    "利息支出": "total_operating_cost.interest_expenses",
    "手续费及佣金支出": "total_operating_cost.fee_and_commission_expenses",
    "营业税金及附加": "total_operating_cost.taxes_and_surcharges",
    "税金及附加": "total_operating_cost.taxes_and_surcharges",
    "销售费用": "total_operating_cost.selling_expenses",
    "管理费用": "total_operating_cost.admin_expenses",
    "研发费用": "total_operating_cost.rd_expenses",
    "财务费用": "total_operating_cost.financial_expenses.amount",
    "其中:利息费用": "total_operating_cost.financial_expenses.interest_expenses",
    "其中:利息收入": "total_operating_cost.financial_expenses.interest_income",
    "资产减值损失": "total_operating_cost.asset_impairment_loss",
    "信用减值损失": "total_operating_cost.credit_impairment_loss",
    "退保金": "total_operating_cost.surrender_value",
    "赔付支出净额": "total_operating_cost.net_compensation_expenses",
    "提取保险合同准备金净额": "total_operating_cost.net_insurance_contract_reserves",
    "保单红利支出": "total_operating_cost.policy_dividend_expenses",
    "分保费用": "total_operating_cost.reinsurance_expenses",
    "其他业务成本": "total_operating_cost.other_business_costs",
    # L1: 其他经营收益
    "加:其他收益": "other_operating_income.other_income",
    "其他收益": "other_operating_income.other_income",
    "投资收益": "other_operating_income.investment_income",
    "其中:对联营企业和合营企业的投资收益": "other_operating_income.investment_income_from_associates_jv",
    "公允价值变动收益": "other_operating_income.fair_value_change_income",
    "汇兑收益": "other_operating_income.exchange_income",
    "资产处置收益": "other_operating_income.asset_disposal_income",
    "净敞口套期收益": "other_operating_income.net_exposure_hedging_income",
    # L1: 营业利润
    "三、营业利润": "operating_profit.amount",
    "营业利润": "operating_profit.amount",
    "加:营业外收入": "operating_profit.non_operating_revenue",
    "营业外收入": "operating_profit.non_operating_revenue",
    "减:营业外支出": "operating_profit.non_operating_expenses",
    "营业外支出": "operating_profit.non_operating_expenses",
    "非流动资产处置利得": "operating_profit.non_current_asset_disposal_gain",
    "非流动资产处置净损失": "operating_profit.non_current_asset_disposal_loss",
    # L1: 利润总额
    "四、利润总额": "total_profit.amount",
    "利润总额": "total_profit.amount",
    "减:所得税费用": "total_profit.income_tax",
    "所得税费用": "total_profit.income_tax",
    # L1: 净利润
    "五、净利润": "net_profit.amount",
    "净利润": "net_profit.amount",
    "持续经营净利润": "net_profit.net_profit_continuing_ops",
    "终止经营净利润": "net_profit.net_profit_discontinued_ops",
    "归属于母公司所有者的净利润": "net_profit.net_profit_attr_to_parent",
    "少数股东损益": "net_profit.minority_interest_income",
    "扣除非经常性损益后的净利润": "net_profit.net_profit_deducting_non_recurring",
    # L1: EPS
    "基本每股收益": "earnings_per_share.basic_eps",
    "稀释每股收益": "earnings_per_share.diluted_eps",
    # L1: Other Comprehensive Income
    "六、其他综合收益的税后净额": "other_comprehensive_income.amount",
    "其他综合收益": "other_comprehensive_income.amount",
    "归属于母公司所有者的其他综合收益的税后净额": "other_comprehensive_income.attr_to_parent",
    "归属于少数股东的其他综合收益的税后净额": "other_comprehensive_income.attr_to_minority",
    # L1: Total Comprehensive Income
    "七、综合收益总额": "total_comprehensive_income.amount",
    "综合收益总额": "total_comprehensive_income.amount",
    "归属于母公司所有者的综合收益总额": "total_comprehensive_income.attr_to_parent",
    "归属于少数股东的综合收益总额": "total_comprehensive_income.attr_to_minority",
}

BALANCE_SHEET_MAP = {
    # Assets - Current
    "流动资产": "current_assets.total_current_assets", # Context dependent, sometimes header
    "流动资产合计": "current_assets.total_current_assets",
    "货币资金": "current_assets.monetary_funds",
    "结算备付金": "current_assets.clearing_settlement_funds",
    "拆出资金": "current_assets.funds_lent",
    "交易性金融资产": "current_assets.financial_assets_fvpl.trading_financial_assets", # Mapping to subset for simplicity or direct
    "衍生金融资产": "current_assets.derivative_financial_assets",
    "应收票据": "current_assets.notes_and_accounts_receivable.notes_receivable",
    "应收账款": "current_assets.notes_and_accounts_receivable.accounts_receivable",
    "应收款项融资": "current_assets.receivables_financing",
    "预付款项": "current_assets.prepayments",
    "应收保费": "current_assets.premiums_receivable",
    "应收分保账款": "current_assets.reinsurance_accounts_receivable",
    "应收利息": "current_assets.other_receivables_total.interest_receivable",
    "应收股利": "current_assets.other_receivables_total.dividends_receivable",
    "其他应收款": "current_assets.other_receivables_total.other_receivables",
    "存货": "current_assets.inventories",
    "合同资产": "current_assets.contract_assets",
    "持有待售资产": "current_assets.assets_held_for_sale",
    "一年内到期的非流动资产": "current_assets.non_current_assets_due_within_1y",
    "其他流动资产": "current_assets.other_current_assets",
    
    # Assets - Non Current
    "非流动资产合计": "non_current_assets.total_non_current_assets",
    "发放贷款及垫款": "non_current_assets.loans_and_advances",
    "债权投资": "non_current_assets.debt_investments",
    "其他债权投资": "non_current_assets.other_debt_investments",
    "长期应收款": "non_current_assets.long_term_receivables",
    "长期股权投资": "non_current_assets.long_term_equity_investments",
    "投资性房地产": "non_current_assets.investment_properties",
    "固定资产": "non_current_assets.fixed_assets",
    "在建工程": "non_current_assets.construction_in_progress",
    "生产性生物资产": "non_current_assets.productive_biological_assets",
    "油气资产": "non_current_assets.oil_and_gas_assets",
    "使用权资产": "non_current_assets.right_of_use_assets",
    "无形资产": "non_current_assets.intangible_assets",
    "开发支出": "non_current_assets.development_expenses",
    "商誉": "non_current_assets.goodwill",
    "长期待摊费用": "non_current_assets.long_term_deferred_expenses",
    "递延所得税资产": "non_current_assets.deferred_tax_assets",
    "其他非流动资产": "non_current_assets.other_non_current_assets",
    
    # Total Assets
    "资产总计": "assets_summary.total_assets",

    # Liabilities - Current
    "流动负债合计": "current_liabilities.total_current_liabilities",
    "短期借款": "current_liabilities.short_term_borrowings",
    "向中央银行借款": "current_liabilities.borrowings_from_central_bank",
    "拆入资金": "current_liabilities.borrowings_from_interbank",
    "交易性金融负债": "current_liabilities.financial_liabilities_fvpl.trading_financial_liabilities",
    "衍生金融负债": "current_liabilities.derivative_financial_liabilities",
    "应付票据": "current_liabilities.notes_and_accounts_payable.notes_payable",
    "应付账款": "current_liabilities.notes_and_accounts_payable.accounts_payable",
    "预收款项": "current_liabilities.advances_from_customers",
    "合同负债": "current_liabilities.contract_liabilities",
    "卖出回购金融资产款": "current_liabilities.sell_buy_back_financial_assets",
    "应付职工薪酬": "current_liabilities.payroll_payable",
    "应交税费": "current_liabilities.taxes_payable",
    "应付利息": "current_liabilities.other_payables_total.interest_payable",
    "应付股利": "current_liabilities.other_payables_total.dividends_payable",
    "其他应付款": "current_liabilities.other_payables_total.other_payables",
    "一年内到期的非流动负债": "current_liabilities.non_current_liabilities_due_within_1y",
    "其他流动负债": "current_liabilities.other_current_liabilities",

    # Liabilities - Non Current
    "非流动负债合计": "non_current_liabilities.total_non_current_liabilities",
    "长期借款": "non_current_liabilities.long_term_borrowings",
    "应付债券": "non_current_liabilities.bonds_payable.amount",
    "租赁负债": "non_current_liabilities.lease_liabilities",
    "长期应付款": "non_current_liabilities.long_term_payables",
    "预计负债": "non_current_liabilities.estimated_liabilities",
    "递延收益": "non_current_liabilities.deferred_revenue",
    "递延所得税负债": "non_current_liabilities.deferred_tax_liabilities",
    "其他非流动负债": "non_current_liabilities.other_non_current_liabilities",

    # Total Liabilities
    "负债合计": "liabilities_summary.total_liabilities",
    "负债总计": "liabilities_summary.total_liabilities",

    # Equity
    "所有者权益合计": "equity.total_equity",
    "股东权益合计": "equity.total_equity",
    "实收资本(或股本)": "equity.paid_in_capital",
    "实收资本": "equity.paid_in_capital",
    "股本": "equity.paid_in_capital",
    "资本公积": "equity.capital_reserves",
    "减:库存股": "equity.treasury_stock",
    "库存股": "equity.treasury_stock",
    "其他综合收益": "equity.other_comprehensive_income",
    "盈余公积": "equity.surplus_reserves",
    "一般风险准备": "equity.general_risk_reserves",
    "未分配利润": "equity.undistributed_profit",
    "归属于母公司所有者权益合计": "equity.total_parent_equity",
    "少数股东权益": "equity.minority_interests",

    # Total L&E
    "负债和所有者权益总计": "balance_check.total_liabilities_and_equity",
    "负债和股东权益总计": "balance_check.total_liabilities_and_equity",
}

CASH_FLOW_MAP = {
    # Operating
    "经营活动产生的现金流量净额": "operating_activities.net_cash_flow_from_operating",
    "销售商品、提供劳务收到的现金": "operating_activities.cash_received_from_goods_and_services",
    "收到的税费返还": "operating_activities.tax_refunds_received",
    "收到其他与经营活动有关的现金": "operating_activities.other_cash_received_operating",
    "经营活动现金流入小计": "operating_activities.subtotal_cash_inflow_operating",
    "购买商品、接受劳务支付的现金": "operating_activities.cash_paid_for_goods_and_services",
    "支付给职工以及为职工支付的现金": "operating_activities.cash_paid_to_employees",
    "支付的各项税费": "operating_activities.taxes_paid",
    "支付其他与经营活动有关的现金": "operating_activities.other_cash_paid_operating",
    "经营活动现金流出小计": "operating_activities.subtotal_cash_outflow_operating",

    # Investing
    "投资活动产生的现金流量净额": "investing_activities.net_cash_flow_from_investing",
    "收回投资收到的现金": "investing_activities.cash_received_from_investment_recovery",
    "取得投资收益收到的现金": "investing_activities.cash_received_from_investment_income",
    "处置固定资产、无形资产和其他长期资产收回的现金净额": "investing_activities.net_cash_from_disposal_assets",
    "投资活动现金流入小计": "investing_activities.subtotal_cash_inflow_investing",
    "购建固定资产、无形资产和其他长期资产支付的现金": "investing_activities.cash_paid_for_assets",
    "投资支付的现金": "investing_activities.cash_paid_for_investments",
    "投资活动现金流出小计": "investing_activities.subtotal_cash_outflow_investing",

    # Financing
    "筹资活动产生的现金流量净额": "financing_activities.net_cash_flow_from_financing",
    "吸收投资收到的现金": "financing_activities.cash_received_from_investments.amount",
    "取得借款收到的现金": "financing_activities.cash_received_from_borrowings",
    "筹资活动现金流入小计": "financing_activities.subtotal_cash_inflow_financing",
    "偿还债务支付的现金": "financing_activities.cash_paid_for_debt_repayment",
    "分配股利、利润或偿付利息支付的现金": "financing_activities.cash_paid_for_dividends_and_profits",
    "筹资活动现金流出小计": "financing_activities.subtotal_cash_outflow_financing",

    # Overall
    "汇率变动对现金及现金等价物的影响": "cash_increase.exchange_rate_effect",
    "现金及现金等价物净增加额": "cash_increase.net_increase_cash_and_equivalents",
    "期初现金及现金等价物余额": "cash_increase.cash_at_beginning",
    "期末现金及现金等价物余额": "cash_increase.cash_at_end",
}
