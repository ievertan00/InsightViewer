import os
import tushare as ts
import pandas as pd
from typing import Dict, Any, List
from app.models.schemas import (
    StandardizedReport, Report, FinancialReportData,
    IncomeStatement, BalanceSheet, CashFlowStatement, CompanyMeta
)
from app.core.tushare_mappings import TUSHARE_INCOME_MAP, TUSHARE_BALANCE_MAP, TUSHARE_CASH_MAP

class TushareClient:
    """
    Tushare API client for fetching financial data.

    This class handles fetching and mapping financial data from Tushare API to the
    standardized schema used by Insight Viewer. It includes fallback mechanisms to
    calculate missing values from available components and supports different
    company types (General business, Bank, Insurance, Securities).
    """
    def __init__(self, token: str):
        self.pro = ts.pro_api(token)

    def _set_nested_value(self, data_dict: Dict, path: str, value: float):
        """Helper to set value in nested dict by dot path"""
        keys = path.split('.')
        current = data_dict
        for key in keys[:-1]:
            if key not in current:
                current[key] = {}
            current = current[key]

        # Only set the value if it's not zero or if the key doesn't already exist
        target_key = keys[-1]
        if value != 0 or target_key not in current:
            current[target_key] = value

    def _map_dataframe_to_dict(self, df_row: pd.Series, mapping: Dict) -> Dict:
        """Maps a single row of Tushare data to a nested dictionary"""
        result = {}
        for ts_field, target_path in mapping.items():
            if ts_field in df_row and pd.notna(df_row[ts_field]):
                try:
                    val = float(df_row[ts_field])
                    # Only set the value if it's not zero or if the path doesn't already exist
                    if val != 0 or not self._get_nested_value(result, target_path):
                        self._set_nested_value(result, target_path, val)
                except (ValueError, TypeError):
                    pass
        return result

    def _get_nested_value(self, data_dict: Dict, path: str):
        """Helper to get value from nested dict by dot path"""
        keys = path.split('.')
        current = data_dict
        for key in keys:
            if isinstance(current, dict) and key in current:
                current = current[key]
            else:
                return None
        return current

    def _apply_company_specific_mappings(self, data: Dict, comp_type: int):
        """
        Applies company type-specific mappings and adjustments.

        Args:
            data: Financial data dictionary containing income_statement, balance_sheet, cash_flow_statement
            comp_type: Company type (1-General business, 2-Bank, 3-Insurance, 4-Securities)
        """
        # Adjust mappings based on company type
        if comp_type == 2:  # Bank
            # Banks have specific financial metrics
            if "income_statement" in data:
                inc_stmt = data["income_statement"]

                # Calculate net interest income for banks
                if "net_interest_income" not in inc_stmt:
                    interest_income = inc_stmt.get("total_operating_revenue", {}).get("interest_income", 0)
                    interest_expense = inc_stmt.get("total_operating_cost", {}).get("interest_expenses", 0)
                    net_interest_income = interest_income - abs(interest_expense)

                    if net_interest_income != 0:
                        if "other_operating_income" not in inc_stmt:
                            inc_stmt["other_operating_income"] = {}
                        inc_stmt["other_operating_income"]["net_interest_income"] = net_interest_income

        elif comp_type == 3:  # Insurance
            # Insurance companies have specific metrics
            if "income_statement" in data:
                inc_stmt = data["income_statement"]

                # Calculate net underwriting income for insurers
                if "net_underwriting_income" not in inc_stmt:
                    premium_earned = inc_stmt.get("total_operating_revenue", {}).get("earned_premiums", 0)
                    compensation_payout = inc_stmt.get("total_operating_cost", {}).get("net_compensation_expenses", 0)
                    net_underwriting_income = premium_earned - abs(compensation_payout)

                    if net_underwriting_income != 0:
                        if "other_operating_income" not in inc_stmt:
                            inc_stmt["other_operating_income"] = {}
                        inc_stmt["other_operating_income"]["net_underwriting_income"] = net_underwriting_income

        elif comp_type == 4:  # Securities
            # Securities firms have specific metrics
            if "income_statement" in data:
                inc_stmt = data["income_statement"]

                # Calculate net trading income for securities firms
                if "net_trading_income" not in inc_stmt:
                    net_agency_trading_income = inc_stmt.get("total_operating_revenue", {}).get("net_agency_trading_securities_business_income", 0)
                    net_underwriting_income = inc_stmt.get("total_operating_revenue", {}).get("securities_underwriting_business_net_income", 0)
                    net_asset_mgmt_income = inc_stmt.get("total_operating_revenue", {}).get("net_entrusted_customer_asset_management_business_income", 0)

                    net_trading_income = net_agency_trading_income + net_underwriting_income + net_asset_mgmt_income

                    if net_trading_income != 0:
                        if "other_operating_income" not in inc_stmt:
                            inc_stmt["other_operating_income"] = {}
                        inc_stmt["other_operating_income"]["net_trading_income"] = net_trading_income

    def _post_process_totals(self, sheet_type: str, data: Dict):
        """
        Recalculates totals for compound fields if they are 0 but children have values.
        """
        if sheet_type == "income_statement":
            # Calculate total operating revenue if not available
            if "total_operating_revenue" in data:
                tor = data["total_operating_revenue"]
                if tor.get("amount", 0) == 0:
                    # Sum up known revenue components
                    revenue_sum = (
                        tor.get("operating_revenue", 0) +
                        tor.get("interest_income", 0) +
                        tor.get("earned_premiums", 0) +
                        tor.get("fee_and_commission_income", 0) +
                        tor.get("net_commission_and_handling_fee_income", 0) +
                        tor.get("other_operating_net_income", 0) +
                        tor.get("other_business_net_income", 0) +
                        tor.get("insurance_premium_income", 0) +
                        tor.get("including_reinsurance_premium_income", 0) +
                        tor.get("net_agency_trading_securities_business_income", 0) +
                        tor.get("securities_underwriting_business_net_income", 0) +
                        tor.get("net_entrusted_customer_asset_management_business_income", 0) +
                        tor.get("other_business_income", 0)
                    )
                    if revenue_sum != 0:
                        tor["amount"] = revenue_sum

            # Calculate total operating cost if not available
            if "total_operating_cost" in data:
                toc = data["total_operating_cost"]
                if toc.get("amount", 0) == 0:
                    # Sum up known cost components
                    cost_sum = (
                        toc.get("operating_cost", 0) +
                        toc.get("interest_expenses", 0) +
                        toc.get("fee_and_commission_expenses", 0) +
                        toc.get("taxes_and_surcharges", 0) +
                        toc.get("selling_expenses", 0) +
                        toc.get("admin_expenses", 0) +
                        toc.get("financial_expenses", {}).get("amount", 0) +
                        toc.get("asset_impairment_loss", 0) +
                        toc.get("credit_impairment_loss", 0) +
                        toc.get("surrender_value", 0) +
                        toc.get("net_compensation_expenses", 0) +
                        toc.get("net_insurance_contract_reserves", 0) +
                        toc.get("policy_dividend_expenses", 0) +
                        toc.get("reinsurance_expenses", 0) +
                        toc.get("operating_expenses", 0) +
                        toc.get("other_business_costs", 0) +
                        toc.get("rd_expenses", 0)
                    )
                    if cost_sum != 0:
                        toc["amount"] = cost_sum

        elif sheet_type == "balance_sheet":
            # Receivables
            if "current_assets" in data:
                ca = data["current_assets"]

                # Notes & Accounts Receivable
                if "notes_and_accounts_receivable" in ca:
                    nar = ca["notes_and_accounts_receivable"]
                    if nar.get("amount", 0) == 0:
                        nar["amount"] = nar.get("notes_receivable", 0) + nar.get("accounts_receivable", 0)

                # Other Receivables
                if "other_receivables_total" in ca:
                    ort = ca["other_receivables_total"]
                    if ort.get("amount", 0) == 0:
                        ort["amount"] = ort.get("interest_receivable", 0) + ort.get("dividends_receivable", 0) + ort.get("other_receivables", 0)

            # Payables
            if "current_liabilities" in data:
                cl = data["current_liabilities"]

                # Notes & Accounts Payable
                if "notes_and_accounts_payable" in cl:
                    nap = cl["notes_and_accounts_payable"]
                    if nap.get("amount", 0) == 0:
                        nap["amount"] = nap.get("notes_payable", 0) + nap.get("accounts_payable", 0)

                # Other Payables
                if "other_payables_total" in cl:
                    opt = cl["other_payables_total"]
                    if opt.get("amount", 0) == 0:
                        opt["amount"] = opt.get("interest_payable", 0) + opt.get("dividends_payable", 0) + opt.get("other_payables", 0)

            # Calculate total non-current assets if not available
            if "non_current_assets" in data:
                nca = data["non_current_assets"]
                if nca.get("total_non_current_assets", 0) == 0:
                    # Sum up known non-current asset components
                    nca_sum = (
                        nca.get("long_term_equity_investments", 0) +
                        nca.get("investment_properties", 0) +
                        nca.get("fixed_assets", 0) +
                        nca.get("construction_in_progress", 0) +
                        nca.get("construction_materials", 0) +
                        nca.get("right_of_use_assets", 0) +
                        nca.get("intangible_assets", 0) +
                        nca.get("development_expenses", 0) +
                        nca.get("goodwill", 0) +
                        nca.get("long_term_deferred_expenses", 0) +
                        nca.get("deferred_tax_assets", 0) +
                        nca.get("available_for_sale_financial_assets", 0) +
                        nca.get("held_to_maturity_investments", 0) +
                        nca.get("time_deposits", 0) +
                        nca.get("other_assets", 0) +
                        nca.get("long_term_receivables", 0) +
                        nca.get("disposal_of_fixed_assets", 0) +
                        nca.get("productive_biological_assets", 0) +
                        nca.get("oil_and_gas_assets", 0) +
                        nca.get("decrease_in_disbursements", 0) +
                        nca.get("other_non_current_assets", 0)
                    )
                    if nca_sum != 0:
                        nca["total_non_current_assets"] = nca_sum

            # Calculate total non-current liabilities if not available
            if "non_current_liabilities" in data:
                ncl = data["non_current_liabilities"]
                if ncl.get("total_non_current_liabilities", 0) == 0:
                    # Sum up known non-current liability components
                    ncl_sum = (
                        ncl.get("long_term_borrowings", 0) +
                        ncl.get("bonds_payable", {}).get("amount", 0) +
                        ncl.get("lease_liabilities", 0) +
                        ncl.get("long_term_payables", 0) +
                        ncl.get("deferred_tax_liabilities", 0) +
                        ncl.get("borrowings_from_central_bank", 0) +
                        ncl.get("acceptance_deposits_and_interbank_placements", 0) +
                        ncl.get("interbank_borrowings", 0) +
                        ncl.get("trading_financial_liabilities", 0) +
                        ncl.get("derivative_financial_liabilities", 0) +
                        ncl.get("deposits", 0) +
                        ncl.get("agency_business_liabilities", 0) +
                        ncl.get("other_liabilities", 0) +
                        ncl.get("specific_payables", 0) +
                        ncl.get("estimated_liabilities", 0) +
                        ncl.get("deferred_income_non_current_liabilities", 0) +
                        ncl.get("other_non_current_liabilities", 0)
                    )
                    if ncl_sum != 0:
                        ncl["total_non_current_liabilities"] = ncl_sum

        elif sheet_type == "cash_flow_statement":
            # Calculate net cash flow from operating if not available
            if "operating_activities" in data:
                oa = data["operating_activities"]
                if oa.get("net_cash_flow_from_operating", 0) == 0:
                    # Calculate from inflows and outflows if available
                    inflow = oa.get("subtotal_cash_inflow_operating", 0)
                    outflow = oa.get("subtotal_cash_outflow_operating", 0)
                    if inflow != 0 or outflow != 0:
                        oa["net_cash_flow_from_operating"] = inflow - outflow

            # Calculate net cash flow from investing if not available
            if "investing_activities" in data:
                ia = data["investing_activities"]
                if ia.get("net_cash_flow_from_investing", 0) == 0:
                    # Calculate from inflows and outflows if available
                    inflow = ia.get("subtotal_cash_inflow_investing", 0)
                    outflow = ia.get("subtotal_cash_outflow_investing", 0)
                    if inflow != 0 or outflow != 0:
                        ia["net_cash_flow_from_investing"] = inflow - outflow

            # Calculate net cash flow from financing if not available
            if "financing_activities" in data:
                fa = data["financing_activities"]
                if fa.get("net_cash_flow_from_financing", 0) == 0:
                    # Calculate from inflows and outflows if available
                    inflow = fa.get("subtotal_cash_inflow_financing", 0)
                    outflow = fa.get("subtotal_cash_outflow_financing", 0)
                    if inflow != 0 or outflow != 0:
                        fa["net_cash_flow_from_financing"] = inflow - outflow

    def fetch_financial_data(self, symbol: str, start_date: str = None, end_date: str = None) -> StandardizedReport:
        """
        Fetches Income, Balance, Cashflow from Tushare and merges them into StandardizedReport.

        This method fetches financial data from Tushare API and maps it to the standardized
        schema. It includes fallback mechanisms to calculate missing values from available
        components and supports different company types (General business, Bank, Insurance, Securities).

        Args:
            symbol: Stock symbol in Tushare format (e.g., '000001.SZ')
            start_date: Start date in YYYYMMDD format (optional)
            end_date: End date in YYYYMMDD format (optional)

        Returns:
            StandardizedReport: A standardized report containing company meta info and financial reports
        """
        # 0. Fetch Company Name
        try:
            df_stock = self.pro.stock_basic(ts_code=symbol, fields='name')
            company_name = df_stock.iloc[0]['name'] if not df_stock.empty else symbol
        except Exception:
            company_name = symbol

        # 1. Fetch DataFrames
        df_income = self.pro.income(ts_code=symbol, start_date=start_date, end_date=end_date)
        df_balance = self.pro.balancesheet(ts_code=symbol, start_date=start_date, end_date=end_date)
        df_cash = self.pro.cashflow(ts_code=symbol, start_date=start_date, end_date=end_date)

        # --- PRE-FILTER: Only keep Consolidated Reports (type 1) and handle NaN ---
        def clean_df(df):
            if df.empty: return df
            # Filter for report_type '1'. Note: Tushare sometimes returns it as string or int
            df['report_type'] = df['report_type'].astype(str)
            df = df[df['report_type'] == '1'].copy()
            return df.fillna(0)

        df_income = clean_df(df_income)
        df_balance = clean_df(df_balance)
        df_cash = clean_df(df_cash)

        # --- TEMP LOGGING START ---
        def log_df_types(name, df):
            print(f"\n--- {name} Columns Analysis ---")
            if df.empty:
                print("DataFrame is empty.")
                return
            
            # Use the most recent row for sample check
            sample_row = df.iloc[0]
            
            print(f"Context -> Date: {sample_row.get('end_date')}, Report Type: {sample_row.get('report_type')}, Comp Type: {sample_row.get('comp_type')}")
            
            float_count = 0
            object_count = 0
            
            for col in df.columns:
                val = sample_row[col]
                # Determine "Effective Type" based on value
                eff_type = "Object" # Default to Object (0/Null logic)
                try:
                    num_val = float(val)
                    if num_val != 0 and not pd.isna(num_val):
                        eff_type = "Float"
                        float_count += 1
                    else:
                        object_count += 1
                except (ValueError, TypeError):
                    object_count += 1
                
                print(f"{col}: {eff_type} (Raw: {val})")
            
            print(f"\n--- {name} Summary ---")
            print(f"Total Columns: {len(df.columns)}")
            print(f"Dense Fields (Float): {float_count}")
            print(f"Sparse/Empty Fields (Object): {object_count}")
            print(f"Density: {(float_count/len(df.columns))*100:.1f}%")

        log_df_types("Income Statement", df_income)
        log_df_types("Balance Sheet", df_balance)
        log_df_types("Cash Flow", df_cash)
        # --- TEMP LOGGING END ---
        
        # 2. Preprocess
        # We need to merge by 'end_date'. Tushare returns multiple rows per year (quarters).
        # We filter for Annual Reports (end_date usually 1231) or just return all periods.
        # Let's group by end_date.
        
        # Create a set of all unique end_dates across the 3 dfs
        dates = set()
        if not df_income.empty: dates.update(df_income['end_date'].unique())
        if not df_balance.empty: dates.update(df_balance['end_date'].unique())
        if not df_cash.empty: dates.update(df_cash['end_date'].unique())
        
        sorted_dates = sorted(list(dates), reverse=True)
        
        reports_list = []
        
        for date in sorted_dates:
            # Get row for this date from each DF
            inc_row = df_income[df_income['end_date'] == date].iloc[0] if not df_income[df_income['end_date'] == date].empty else pd.Series()
            bal_row = df_balance[df_balance['end_date'] == date].iloc[0] if not df_balance[df_balance['end_date'] == date].empty else pd.Series()
            cash_row = df_cash[df_cash['end_date'] == date].iloc[0] if not df_cash[df_cash['end_date'] == date].empty else pd.Series()
            
            # Map Data
            inc_data = self._map_dataframe_to_dict(inc_row, TUSHARE_INCOME_MAP)
            bal_data = self._map_dataframe_to_dict(bal_row, TUSHARE_BALANCE_MAP)
            cash_data = self._map_dataframe_to_dict(cash_row, TUSHARE_CASH_MAP)

            # Apply company type-specific mappings and adjustments
            comp_type = int(inc_row.get('comp_type', 1))  # Default to general business if not specified

            # Combine all data for company-specific processing
            combined_data = {
                "income_statement": inc_data,
                "balance_sheet": bal_data,
                "cash_flow_statement": cash_data
            }

            self._apply_company_specific_mappings(combined_data, comp_type)

            # Extract back individual components
            inc_data = combined_data["income_statement"]
            bal_data = combined_data["balance_sheet"]
            cash_data = combined_data["cash_flow_statement"]

            # Post-Process Totals
            self._post_process_totals("income_statement", inc_data)
            self._post_process_totals("balance_sheet", bal_data)
            self._post_process_totals("cash_flow_statement", cash_data)

            # Construct Pydantic Models
            # We initialize with parsed data. Missing fields get defaults (0) from schema.
            inc_obj = IncomeStatement(**inc_data)
            bal_obj = BalanceSheet(**bal_data)
            cash_obj = CashFlowStatement(**cash_data)
            
            fin_data = FinancialReportData(
                income_statement=inc_obj,
                balance_sheet=bal_obj,
                cash_flow_statement=cash_obj
            )
            
            # Determine Year and Period Type
            year = date[:4]
            month = date[4:6]
            period_type = "Annual" if month == "12" else f"Q{int(month)//3}"
            
            # UNIQUE ID for the report period to prevent frontend overwriting
            period_label = f"{year} {period_type}"

            reports_list.append(Report(
                fiscal_year=period_label, # Use the full label as the ID
                period_type=period_type,
                data=fin_data
            ))
            
        return StandardizedReport(
            company_meta=CompanyMeta(name=company_name, stock_code=symbol),
            reports=reports_list
        )

# Singleton instance or factory can be created in API
