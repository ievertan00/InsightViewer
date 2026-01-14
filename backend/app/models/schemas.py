from typing import Optional, List
from pydantic import BaseModel, Field, model_validator

# --- Shared / Base Models ---

class FinancialItem(BaseModel):
    """Base model for a generic financial item if needed, 
    but mostly we use explicit fields for strict validation."""
    pass

# --- Income Statement Models ---

class TotalOperatingRevenue(BaseModel):
    amount: float = 0
    operating_revenue: float = 0
    interest_income: float = 0
    earned_premiums: float = 0
    fee_and_commission_income: float = 0
    other_business_revenue: float = 0
    other_items: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'TotalOperatingRevenue':
        if self.amount == 0:
            self.amount = (
                self.operating_revenue +
                self.interest_income +
                self.earned_premiums +
                self.fee_and_commission_income +
                self.other_business_revenue +
                self.other_items
            )
        return self

class FinancialExpenses(BaseModel):
    amount: float = 0
    interest_expenses: float = 0
    interest_income: float = 0

class TotalOperatingCost(BaseModel):
    amount: float = 0
    operating_cost: float = 0
    interest_expenses: float = 0
    fee_and_commission_expenses: float = 0
    taxes_and_surcharges: float = 0
    selling_expenses: float = 0
    admin_expenses: float = 0
    rd_expenses: float = 0
    financial_expenses: FinancialExpenses = Field(default_factory=FinancialExpenses)
    asset_impairment_loss: float = 0
    credit_impairment_loss: float = 0
    surrender_value: float = 0
    net_compensation_expenses: float = 0
    net_insurance_contract_reserves: float = 0
    policy_dividend_expenses: float = 0
    reinsurance_expenses: float = 0
    other_business_costs: float = 0
    other_items: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'TotalOperatingCost':
        if self.amount == 0:
            self.amount = (
                self.operating_cost +
                self.interest_expenses +
                self.fee_and_commission_expenses +
                self.taxes_and_surcharges +
                self.selling_expenses +
                self.admin_expenses +
                self.rd_expenses +
                self.financial_expenses.amount +
                self.asset_impairment_loss +
                self.credit_impairment_loss +
                self.surrender_value +
                self.net_compensation_expenses +
                self.net_insurance_contract_reserves +
                self.policy_dividend_expenses +
                self.reinsurance_expenses +
                self.other_business_costs +
                self.other_items
            )
        return self

class OtherOperatingIncome(BaseModel):
    amount: float = 0
    fair_value_change_income: float = 0
    investment_income: float = 0
    investment_income_from_associates_jv: float = 0
    net_exposure_hedging_income: float = 0
    exchange_income: float = 0
    asset_disposal_income: float = 0
    asset_impairment_loss_new: float = 0
    credit_impairment_loss_new: float = 0
    other_income: float = 0
    operating_profit_other_items: float = 0
    operating_profit_balance_items: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'OtherOperatingIncome':
        calculated_total = (
            self.fair_value_change_income +
            self.investment_income +
            self.net_exposure_hedging_income +
            self.exchange_income +
            self.asset_disposal_income +
            self.asset_impairment_loss_new +
            self.credit_impairment_loss_new +
            self.other_income +
            self.operating_profit_other_items +
            self.operating_profit_balance_items
        )
        # Only update if amount is 0 to avoid overwriting source data if provided
        if self.amount == 0 and calculated_total != 0:
            self.amount = calculated_total
        return self

class OperatingProfit(BaseModel):
    amount: float = 0
    non_operating_revenue: float = 0
    non_current_asset_disposal_gain: float = 0
    non_operating_expenses: float = 0
    non_current_asset_disposal_loss: float = 0
    other_items_affecting_total_profit: float = 0
    total_profit_balance_items: float = 0

class TotalProfit(BaseModel):
    amount: float = 0
    income_tax: float = 0
    unconfirmed_investment_loss: float = 0
    other_items_affecting_net_profit: float = 0
    net_profit_difference: float = 0

class NetProfit(BaseModel):
    amount: float = 0
    net_profit_continuing_ops: float = 0
    net_profit_discontinued_ops: float = 0
    profit_from_merged_party_before_merger: float = 0
    net_profit_attr_to_parent: float = 0
    minority_interest_income: float = 0
    net_profit_deducting_non_recurring: float = 0
    other_items: float = 0
    balance_items: float = 0


class EarningsPerShare(BaseModel):
    basic_eps: float = 0
    diluted_eps: float = 0

class OtherComprehensiveIncome(BaseModel):
    amount: float = 0
    attr_to_parent: float = 0
    attr_to_minority: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'OtherComprehensiveIncome':
        if self.amount == 0:
            self.amount = self.attr_to_parent + self.attr_to_minority
        return self

class TotalComprehensiveIncome(BaseModel):
    amount: float = 0
    attr_to_parent: float = 0
    attr_to_minority: float = 0
    derecognition_income_amortized_cost: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'TotalComprehensiveIncome':
        if self.amount == 0:
            self.amount = self.attr_to_parent + self.attr_to_minority
        return self

class IncomeStatement(BaseModel):
    title: str = "Income Statement"
    total_operating_revenue: TotalOperatingRevenue = Field(default_factory=TotalOperatingRevenue)
    total_operating_cost: TotalOperatingCost = Field(default_factory=TotalOperatingCost)
    other_operating_income: OtherOperatingIncome = Field(default_factory=OtherOperatingIncome)
    operating_profit: OperatingProfit = Field(default_factory=OperatingProfit)
    total_profit: TotalProfit = Field(default_factory=TotalProfit)
    net_profit: NetProfit = Field(default_factory=NetProfit)
    earnings_per_share: EarningsPerShare = Field(default_factory=EarningsPerShare)
    other_comprehensive_income: OtherComprehensiveIncome = Field(default_factory=OtherComprehensiveIncome)
    total_comprehensive_income: TotalComprehensiveIncome = Field(default_factory=TotalComprehensiveIncome)


# --- Balance Sheet Models ---

class FinancialAssetsFVPL(BaseModel):
    amount: float = 0
    trading_financial_assets: float = 0
    designated_financial_assets_fvpl: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'FinancialAssetsFVPL':
        if self.amount == 0:
            self.amount = self.trading_financial_assets + self.designated_financial_assets_fvpl
        return self

class NotesAndAccountsReceivable(BaseModel):
    amount: float = 0
    notes_receivable: float = 0
    accounts_receivable: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'NotesAndAccountsReceivable':
        if self.amount == 0:
            self.amount = self.notes_receivable + self.accounts_receivable
        return self

class OtherReceivablesTotal(BaseModel):
    amount: float = 0
    interest_receivable: float = 0
    dividends_receivable: float = 0
    other_receivables: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'OtherReceivablesTotal':
        if self.amount == 0:
            self.amount = self.interest_receivable + self.dividends_receivable + self.other_receivables
        return self

class CurrentAssets(BaseModel):
    monetary_funds: float = 0
    clearing_settlement_funds: float = 0
    lending_funds: float = 0
    funds_lent: float = 0
    trading_financial_assets: float = 0
    financial_assets_fvpl: FinancialAssetsFVPL = Field(default_factory=FinancialAssetsFVPL)
    derivative_financial_assets: float = 0
    notes_and_accounts_receivable: NotesAndAccountsReceivable = Field(default_factory=NotesAndAccountsReceivable)
    receivables_financing: float = 0
    prepayments: float = 0
    premiums_receivable: float = 0
    reinsurance_accounts_receivable: float = 0
    reinsurance_contract_reserves_receivable: float = 0
    other_receivables_total: OtherReceivablesTotal = Field(default_factory=OtherReceivablesTotal)
    export_tax_refund_receivable: float = 0
    subsidies_receivable: float = 0
    internal_receivables: float = 0
    buy_back_financial_assets: float = 0
    financial_assets_amortized_cost: float = 0
    inventories: float = 0
    financial_assets_fvoci: float = 0
    contract_assets: float = 0
    assets_held_for_sale: float = 0
    non_current_assets_due_within_1y: float = 0
    agency_business_assets: float = 0
    other_current_assets: float = 0
    other_items: float = 0
    balance_items: float = 0
    total_current_assets: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'CurrentAssets':
        if self.total_current_assets == 0:
            self.total_current_assets = (
                self.monetary_funds +
                self.clearing_settlement_funds +
                self.lending_funds +
                self.funds_lent +
                self.trading_financial_assets +
                self.financial_assets_fvpl.amount +
                self.derivative_financial_assets +
                self.notes_and_accounts_receivable.amount +
                self.receivables_financing +
                self.prepayments +
                self.premiums_receivable +
                self.reinsurance_accounts_receivable +
                self.reinsurance_contract_reserves_receivable +
                self.other_receivables_total.amount +
                self.export_tax_refund_receivable +
                self.subsidies_receivable +
                self.internal_receivables +
                self.buy_back_financial_assets +
                self.financial_assets_amortized_cost +
                self.inventories +
                self.financial_assets_fvoci +
                self.contract_assets +
                self.assets_held_for_sale +
                self.non_current_assets_due_within_1y +
                self.agency_business_assets +
                self.other_current_assets +
                self.other_items +
                self.balance_items
            )
        return self

class NonCurrentAssets(BaseModel):
    loans_and_advances: float = 0
    debt_investments: float = 0
    other_debt_investments: float = 0
    financial_assets_amortized_cost_non_current: float = 0
    financial_assets_fvoci_non_current: float = 0
    available_for_sale_financial_assets: float = 0
    held_to_maturity_investments: float = 0
    long_term_receivables: float = 0
    long_term_equity_investments: float = 0
    investment_properties: float = 0
    fixed_assets: float = 0
    construction_in_progress: float = 0
    construction_materials: float = 0
    other_equity_instrument_investments: float = 0
    other_non_current_financial_assets: float = 0
    fixed_assets_liquidation: float = 0
    productive_biological_assets: float = 0
    oil_and_gas_assets: float = 0
    right_of_use_assets: float = 0
    intangible_assets: float = 0
    balance_items: float = 0
    development_expenses: float = 0
    goodwill: float = 0
    long_term_deferred_expenses: float = 0
    deferred_tax_assets: float = 0
    other_non_current_assets: float = 0
    other_items: float = 0
    total_non_current_assets: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'NonCurrentAssets':
        if self.total_non_current_assets == 0:
            self.total_non_current_assets = (
                self.loans_and_advances +
                self.debt_investments +
                self.other_debt_investments +
                self.financial_assets_amortized_cost_non_current +
                self.financial_assets_fvoci_non_current +
                self.available_for_sale_financial_assets +
                self.held_to_maturity_investments +
                self.long_term_receivables +
                self.long_term_equity_investments +
                self.investment_properties +
                self.fixed_assets +
                self.construction_in_progress +
                self.construction_materials +
                self.other_equity_instrument_investments +
                self.other_non_current_financial_assets +
                self.fixed_assets_liquidation +
                self.productive_biological_assets +
                self.oil_and_gas_assets +
                self.right_of_use_assets +
                self.intangible_assets +
                self.development_expenses +
                self.goodwill +
                self.long_term_deferred_expenses +
                self.deferred_tax_assets +
                self.other_non_current_assets +
                self.other_items +
                self.balance_items
            )
        return self

class AssetsSummary(BaseModel):
    other_asset_items: float = 0
    asset_balance_items: float = 0
    total_assets: float = 0

class FinancialLiabilitiesFVPL(BaseModel):
    amount: float = 0
    trading_financial_liabilities: float = 0
    designated_financial_liabilities_fvpl: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'FinancialLiabilitiesFVPL':
        if self.amount == 0:
            self.amount = self.trading_financial_liabilities + self.designated_financial_liabilities_fvpl
        return self

class NotesAndAccountsPayable(BaseModel):
    amount: float = 0
    notes_payable: float = 0
    accounts_payable: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'NotesAndAccountsPayable':
        if self.amount == 0:
            self.amount = self.notes_payable + self.accounts_payable
        return self

class OtherPayablesTotal(BaseModel):
    amount: float = 0
    interest_payable: float = 0
    dividends_payable: float = 0
    other_payables: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'OtherPayablesTotal':
        if self.amount == 0:
            self.amount = self.interest_payable + self.dividends_payable + self.other_payables
        return self

class CurrentLiabilities(BaseModel):
    short_term_borrowings: float = 0
    borrowings_from_central_bank: float = 0
    deposits_and_interbank_placements: float = 0
    borrowings_from_interbank: float = 0
    trading_financial_liabilities: float = 0
    financial_liabilities_fvpl: FinancialLiabilitiesFVPL = Field(default_factory=FinancialLiabilitiesFVPL)
    derivative_financial_liabilities: float = 0
    notes_and_accounts_payable: NotesAndAccountsPayable = Field(default_factory=NotesAndAccountsPayable)
    advances_from_customers: float = 0
    contract_liabilities: float = 0
    sell_buy_back_financial_assets: float = 0
    fees_and_commissions_payable: float = 0
    payroll_payable: float = 0
    taxes_payable: float = 0
    other_payables_total: OtherPayablesTotal = Field(default_factory=OtherPayablesTotal)
    reinsurance_accounts_payable: float = 0
    internal_payables: float = 0
    estimated_current_liabilities: float = 0
    insurance_contract_reserves: float = 0
    acting_trading_securities: float = 0
    acting_underwriting_securities: float = 0
    deferred_revenue_within_1y: float = 0
    financial_liabilities_amortized_cost: float = 0
    short_term_bonds_payable: float = 0
    liabilities_held_for_sale: float = 0
    non_current_liabilities_due_within_1y: float = 0
    agency_business_liabilities: float = 0
    other_current_liabilities: float = 0
    other_items: float = 0
    balance_items: float = 0
    total_current_liabilities: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'CurrentLiabilities':
        if self.total_current_liabilities == 0:
            self.total_current_liabilities = (
                self.short_term_borrowings +
                self.borrowings_from_central_bank +
                self.deposits_and_interbank_placements +
                self.borrowings_from_interbank +
                self.trading_financial_liabilities +
                self.financial_liabilities_fvpl.amount +
                self.derivative_financial_liabilities +
                self.notes_and_accounts_payable.amount +
                self.advances_from_customers +
                self.contract_liabilities +
                self.sell_buy_back_financial_assets +
                self.fees_and_commissions_payable +
                self.payroll_payable +
                self.taxes_payable +
                self.other_payables_total.amount +
                self.reinsurance_accounts_payable +
                self.internal_payables +
                self.estimated_current_liabilities +
                self.insurance_contract_reserves +
                self.acting_trading_securities +
                self.acting_underwriting_securities +
                self.deferred_revenue_within_1y +
                self.financial_liabilities_amortized_cost +
                self.short_term_bonds_payable +
                self.liabilities_held_for_sale +
                self.non_current_liabilities_due_within_1y +
                self.agency_business_liabilities +
                self.other_current_liabilities +
                self.other_items +
                self.balance_items
            )
        return self

class BondsPayable(BaseModel):
    amount: float = 0
    preference_shares: float = 0
    perpetual_bonds: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'BondsPayable':
        if self.amount == 0:
            self.amount = self.preference_shares + self.perpetual_bonds
        return self

class NonCurrentLiabilities(BaseModel):
    long_term_borrowings: float = 0
    financial_liabilities_amortized_cost_non_current: float = 0
    bonds_payable: BondsPayable = Field(default_factory=BondsPayable)
    lease_liabilities: float = 0
    long_term_payables: float = 0
    long_term_payroll_payable: float = 0
    special_payables: float = 0
    estimated_liabilities: float = 0
    deferred_revenue: float = 0
    deferred_tax_liabilities: float = 0
    other_non_current_liabilities: float = 0
    other_items: float = 0
    balance_items: float = 0
    total_non_current_liabilities: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'NonCurrentLiabilities':
        if self.total_non_current_liabilities == 0:
            self.total_non_current_liabilities = (
                self.long_term_borrowings +
                self.financial_liabilities_amortized_cost_non_current +
                self.bonds_payable.amount +
                self.lease_liabilities +
                self.long_term_payables +
                self.long_term_payroll_payable +
                self.special_payables +
                self.estimated_liabilities +
                self.deferred_revenue +
                self.deferred_tax_liabilities +
                self.other_non_current_liabilities +
                self.other_items +
                self.balance_items
            )
        return self

class LiabilitiesSummary(BaseModel):
    other_liability_items: float = 0
    liability_balance_items: float = 0
    total_liabilities: float = 0

class OtherEquityInstruments(BaseModel):
    amount: float = 0
    preference_shares: float = 0
    perpetual_bonds: float = 0
    other: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'OtherEquityInstruments':
        if self.amount == 0:
            self.amount = self.preference_shares + self.perpetual_bonds + self.other
        return self

class Equity(BaseModel):
    title: str = "Owner's Equity"
    paid_in_capital: float = 0
    other_equity_instruments: OtherEquityInstruments = Field(default_factory=OtherEquityInstruments)
    capital_reserves: float = 0
    other_comprehensive_income: float = 0
    treasury_stock: float = 0
    special_reserves: float = 0
    surplus_reserves: float = 0
    general_risk_reserves: float = 0
    unconfirmed_investment_loss: float = 0
    undistributed_profit: float = 0
    proposed_cash_dividends: float = 0
    currency_translation_diff: float = 0
    parent_equity_other_items: float = 0
    parent_equity_balance_items: float = 0
    total_parent_equity: float = 0
    minority_interests: float = 0
    equity_other_items: float = 0
    equity_balance_items: float = 0
    total_equity: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'Equity':
        if self.total_parent_equity == 0:
            self.total_parent_equity = (
                self.paid_in_capital +
                self.other_equity_instruments.amount +
                self.capital_reserves +
                self.other_comprehensive_income +
                # treasury_stock is typically negative, but here we likely store absolute value. 
                # Standard formula: Equity = PaidIn + Reserves + ... - Treasury.
                # But schema definition is just values. Let's assume schema expects signed values or standard summation.
                # If we follow "sum sub-items", we might just sum them all.
                # However, treasury stock is a contra-equity account.
                # Let's check `backend/app/core/mappings.py` to see how it's mapped.
                # It says "减:库存股". So the value coming in might be positive, but needs to be subtracted?
                # The user instruction is "sum the values of its sub-items".
                # If I blindly sum, I might be wrong on signs.
                # But "Total Parent Equity" is the target.
                # For safety, I will sum all except treasury stock, and SUBTRACT treasury stock if it's positive?
                # Or assume the value is already signed?
                # In most financial data APIs (like Tushare), treasury stock is positive value, meaning deduction.
                # I will subtract treasury_stock.
                -self.treasury_stock + 
                self.special_reserves +
                self.surplus_reserves +
                self.general_risk_reserves +
                self.unconfirmed_investment_loss +
                self.undistributed_profit +
                self.proposed_cash_dividends +
                self.currency_translation_diff +
                self.parent_equity_other_items +
                self.parent_equity_balance_items
            )
        
        if self.total_equity == 0:
            self.total_equity = self.total_parent_equity + self.minority_interests + self.equity_other_items + self.equity_balance_items
            
        return self

class BalanceCheck(BaseModel):
    liabilities_and_equity_other_items: float = 0
    liabilities_and_equity_balance_items: float = 0
    total_liabilities_and_equity: float = 0

class BalanceSheet(BaseModel):
    title: str = "Balance Sheet"
    current_assets: CurrentAssets = Field(default_factory=CurrentAssets)
    non_current_assets: NonCurrentAssets = Field(default_factory=NonCurrentAssets)
    assets_summary: AssetsSummary = Field(default_factory=AssetsSummary)
    current_liabilities: CurrentLiabilities = Field(default_factory=CurrentLiabilities)
    non_current_liabilities: NonCurrentLiabilities = Field(default_factory=NonCurrentLiabilities)
    liabilities_summary: LiabilitiesSummary = Field(default_factory=LiabilitiesSummary)
    equity: Equity = Field(default_factory=Equity)
    balance_check: BalanceCheck = Field(default_factory=BalanceCheck)

# --- Cash Flow Models ---

class OperatingActivities(BaseModel):
    cash_received_from_goods_and_services: float = 0
    net_increase_deposits_interbank: float = 0
    net_increase_borrowings_central_bank: float = 0
    net_increase_borrowings_other_financial: float = 0
    cash_received_original_premiums: float = 0
    net_cash_received_reinsurance: float = 0
    net_increase_insured_investment: float = 0
    net_increase_disposal_trading_assets: float = 0
    cash_received_interest_commission: float = 0
    net_increase_borrowed_funds: float = 0
    net_decrease_loans_advances: float = 0
    net_increase_repurchase_funds: float = 0
    tax_refunds_received: float = 0
    other_cash_received_operating: float = 0
    inflow_other_items: float = 0
    inflow_balance_items: float = 0
    subtotal_cash_inflow_operating: float = 0
    cash_paid_for_goods_and_services: float = 0
    net_increase_loans_advances: float = 0
    net_increase_deposits_central_bank_interbank: float = 0
    cash_paid_original_contract_claims: float = 0
    cash_paid_interest_commission: float = 0
    cash_paid_policy_dividends: float = 0
    cash_paid_to_employees: float = 0
    taxes_paid: float = 0
    other_cash_paid_operating: float = 0
    outflow_other_items: float = 0
    outflow_balance_items: float = 0
    subtotal_cash_outflow_operating: float = 0
    net_cash_flow_other_items: float = 0
    net_cash_flow_balance_items: float = 0
    net_cash_flow_from_operating: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'OperatingActivities':
        if self.subtotal_cash_inflow_operating == 0:
            self.subtotal_cash_inflow_operating = (
                self.cash_received_from_goods_and_services +
                self.net_increase_deposits_interbank +
                self.net_increase_borrowings_central_bank +
                self.net_increase_borrowings_other_financial +
                self.cash_received_original_premiums +
                self.net_cash_received_reinsurance +
                self.net_increase_insured_investment +
                self.net_increase_disposal_trading_assets +
                self.cash_received_interest_commission +
                self.net_increase_borrowed_funds +
                self.net_decrease_loans_advances +
                self.net_increase_repurchase_funds +
                self.tax_refunds_received +
                self.other_cash_received_operating +
                self.inflow_other_items +
                self.inflow_balance_items
            )
        
        if self.subtotal_cash_outflow_operating == 0:
            self.subtotal_cash_outflow_operating = (
                self.cash_paid_for_goods_and_services +
                self.net_increase_loans_advances +
                self.net_increase_deposits_central_bank_interbank +
                self.cash_paid_original_contract_claims +
                self.cash_paid_interest_commission +
                self.cash_paid_policy_dividends +
                self.cash_paid_to_employees +
                self.taxes_paid +
                self.other_cash_paid_operating +
                self.outflow_other_items +
                self.outflow_balance_items
            )
        
        if self.net_cash_flow_from_operating == 0:
            # Net = Inflow - Outflow
            self.net_cash_flow_from_operating = (
                self.subtotal_cash_inflow_operating - 
                self.subtotal_cash_outflow_operating +
                self.net_cash_flow_other_items +
                self.net_cash_flow_balance_items
            )
        return self

class InvestingActivities(BaseModel):
    cash_received_from_investment_recovery: float = 0
    cash_received_from_investment_income: float = 0
    net_cash_from_disposal_assets: float = 0
    net_cash_from_disposal_subsidiaries: float = 0
    cash_received_from_pledge_deposit_reduction: float = 0
    other_cash_received_investing: float = 0
    inflow_other_items: float = 0
    inflow_balance_items: float = 0
    subtotal_cash_inflow_investing: float = 0
    cash_paid_for_assets: float = 0
    cash_paid_for_investments: float = 0
    net_increase_pledged_loans: float = 0
    net_cash_paid_subsidiaries: float = 0
    cash_paid_for_pledge_deposit_increase: float = 0
    other_cash_paid_investing: float = 0
    outflow_other_items: float = 0
    outflow_balance_items: float = 0
    subtotal_cash_outflow_investing: float = 0
    net_cash_flow_other_items: float = 0
    net_cash_flow_balance_items: float = 0
    net_cash_flow_from_investing: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'InvestingActivities':
        if self.subtotal_cash_inflow_investing == 0:
            self.subtotal_cash_inflow_investing = (
                self.cash_received_from_investment_recovery +
                self.cash_received_from_investment_income +
                self.net_cash_from_disposal_assets +
                self.net_cash_from_disposal_subsidiaries +
                self.cash_received_from_pledge_deposit_reduction +
                self.other_cash_received_investing +
                self.inflow_other_items +
                self.inflow_balance_items
            )

        if self.subtotal_cash_outflow_investing == 0:
            self.subtotal_cash_outflow_investing = (
                self.cash_paid_for_assets +
                self.cash_paid_for_investments +
                self.net_increase_pledged_loans +
                self.net_cash_paid_subsidiaries +
                self.cash_paid_for_pledge_deposit_increase +
                self.other_cash_paid_investing +
                self.outflow_other_items +
                self.outflow_balance_items
            )

        if self.net_cash_flow_from_investing == 0:
            self.net_cash_flow_from_investing = (
                self.subtotal_cash_inflow_investing - 
                self.subtotal_cash_outflow_investing +
                self.net_cash_flow_other_items +
                self.net_cash_flow_balance_items
            )
        return self

class CashReceivedFromInvestments(BaseModel):
    amount: float = 0
    from_minority_shareholders: float = 0

class OtherCashPaidFinancing(BaseModel):
    amount: float = 0
    paid_to_minority_for_capital_reduction: float = 0

class FinancingActivities(BaseModel):
    cash_received_from_investments: CashReceivedFromInvestments = Field(default_factory=CashReceivedFromInvestments)
    cash_received_from_borrowings: float = 0
    cash_received_from_bond_issue: float = 0
    other_cash_received_financing: float = 0
    inflow_other_items: float = 0
    inflow_balance_items: float = 0
    subtotal_cash_inflow_financing: float = 0
    cash_paid_for_debt_repayment: float = 0
    cash_paid_for_dividends_and_profits: float = 0
    dividends_paid_to_minority: float = 0
    cash_paid_for_minority_equity: float = 0
    other_cash_paid_financing: OtherCashPaidFinancing = Field(default_factory=OtherCashPaidFinancing)
    outflow_other_items: float = 0
    outflow_balance_items: float = 0
    subtotal_cash_outflow_financing: float = 0
    net_cash_flow_other_items: float = 0
    net_cash_flow_balance_items: float = 0
    net_cash_flow_from_financing: float = 0

    @model_validator(mode='after')
    def calculate_total(self) -> 'FinancingActivities':
        if self.subtotal_cash_inflow_financing == 0:
            self.subtotal_cash_inflow_financing = (
                self.cash_received_from_investments.amount +
                self.cash_received_from_borrowings +
                self.cash_received_from_bond_issue +
                self.other_cash_received_financing +
                self.inflow_other_items +
                self.inflow_balance_items
            )

        if self.subtotal_cash_outflow_financing == 0:
            self.subtotal_cash_outflow_financing = (
                self.cash_paid_for_debt_repayment +
                self.cash_paid_for_dividends_and_profits +
                self.cash_paid_for_minority_equity +
                self.other_cash_paid_financing.amount +
                self.outflow_other_items +
                self.outflow_balance_items
            )
        
        if self.net_cash_flow_from_financing == 0:
            self.net_cash_flow_from_financing = (
                self.subtotal_cash_inflow_financing - 
                self.subtotal_cash_outflow_financing +
                self.net_cash_flow_other_items +
                self.net_cash_flow_balance_items
            )
        return self

class CashIncrease(BaseModel):
    exchange_rate_effect: float = 0
    increase_other_items: float = 0
    increase_balance_items: float = 0
    net_increase_cash_and_equivalents: float = 0
    cash_at_beginning: float = 0
    end_balance_other_items: float = 0
    end_balance_balance_items: float = 0
    cash_at_end: float = 0

class NetProfitAdjustment(BaseModel):
    net_profit: float = 0
    asset_impairment_reserves: float = 0
    depreciation_fixed_assets_investment_props: float = 0
    depreciation_others: float = 0
    depreciation_investment_props: float = 0
    amortization_intangible_assets: float = 0
    amortization_long_term_deferred: float = 0
    amortization_deferred_revenue: float = 0
    decrease_deferred_expenses: float = 0
    increase_accrued_expenses: float = 0
    loss_disposal_assets: float = 0
    loss_scrapping_assets: float = 0
    loss_fair_value_change: float = 0
    financial_expenses: float = 0
    investment_loss: float = 0
    deferred_tax: float = 0
    decrease_deferred_tax_assets: float = 0
    increase_deferred_tax_liabilities: float = 0
    increase_estimated_liabilities: float = 0
    decrease_inventories: float = 0
    decrease_operating_receivables: float = 0
    increase_operating_payables: float = 0
    other: float = 0
    net_cash_flow_other_items: float = 0
    net_cash_flow_balance_items: float = 0
    net_cash_flow_from_operating_indirect: float = 0

class SignificantNonCash(BaseModel):
    debt_to_capital: float = 0
    convertible_bonds_due_within_1y: float = 0
    fixed_assets_finance_lease: float = 0
    non_cash_items_other: float = 0

class CashChangeCheck(BaseModel):
    cash_end_balance: float = 0
    cash_begin_balance: float = 0
    equivalents_end_balance: float = 0
    equivalents_begin_balance: float = 0
    net_increase_other: float = 0
    net_increase_balance: float = 0
    net_increase_cash_and_equivalents_indirect: float = 0

class SupplementaryInfo(BaseModel):
    net_profit_adjustment: NetProfitAdjustment = Field(default_factory=NetProfitAdjustment)
    significant_non_cash: SignificantNonCash = Field(default_factory=SignificantNonCash)
    cash_change_check: CashChangeCheck = Field(default_factory=CashChangeCheck)
    credit_impairment_loss: float = 0

class CashFlowStatement(BaseModel):
    title: str = "Cash Flow Statement"
    operating_activities: OperatingActivities = Field(default_factory=OperatingActivities)
    investing_activities: InvestingActivities = Field(default_factory=InvestingActivities)
    financing_activities: FinancingActivities = Field(default_factory=FinancingActivities)
    cash_increase: CashIncrease = Field(default_factory=CashIncrease)
    supplementary_info: SupplementaryInfo = Field(default_factory=SupplementaryInfo)

# --- Top Level Report Wrapper ---

class FinancialReportData(BaseModel):
    income_statement: Optional[IncomeStatement] = None
    balance_sheet: Optional[BalanceSheet] = None
    cash_flow_statement: Optional[CashFlowStatement] = None

class Report(BaseModel):
    fiscal_year: str
    period_type: str = "Annual" # Annual, Quarterly
    data: FinancialReportData = Field(default_factory=FinancialReportData)

class CompanyMeta(BaseModel):
    name: str = "Unknown"
    stock_code: Optional[str] = None
    currency: str = "CNY"

class StandardizedReport(BaseModel):
    company_meta: CompanyMeta = Field(default_factory=CompanyMeta)
    reports: List[Report] = Field(default_factory=list)
    parsing_warnings: List[str] = Field(default_factory=list)
