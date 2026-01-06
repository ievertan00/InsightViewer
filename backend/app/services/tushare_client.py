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
        current[keys[-1]] = value

    def _map_dataframe_to_dict(self, df_row: pd.Series, mapping: Dict) -> Dict:
        """Maps a single row of Tushare data to a nested dictionary"""
        result = {}
        for ts_field, target_path in mapping.items():
            if ts_field in df_row and pd.notna(df_row[ts_field]):
                try:
                    val = float(df_row[ts_field])
                    self._set_nested_value(result, target_path, val)
                except (ValueError, TypeError):
                    pass
        return result

    def fetch_financial_data(self, symbol: str, start_date: str = None, end_date: str = None) -> StandardizedReport:
        """
        Fetches Income, Balance, Cashflow from Tushare and merges them into StandardizedReport.
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
            
            reports_list.append(Report(
                fiscal_year=year,
                period_type=period_type,
                data=fin_data
            ))
            
        return StandardizedReport(
            company_meta=CompanyMeta(name=company_name, stock_code=symbol),
            reports=reports_list
        )

# Singleton instance or factory can be created in API
