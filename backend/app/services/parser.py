import re
import io
import openpyxl
from typing import List, Dict, Any, Tuple, Optional
from app.models.schemas import (
    StandardizedReport, Report, FinancialReportData,
    IncomeStatement, BalanceSheet, CashFlowStatement, CompanyMeta
)
from app.core.mappings import INCOME_STATEMENT_MAP, BALANCE_SHEET_MAP, CASH_FLOW_MAP

def detect_sheet_type(sheet_name: str, content_sample: str) -> Optional[str]:
    """Detects if a sheet is Income, Balance, or Cash Flow."""
    name = sheet_name.lower()
    content = content_sample
    
    if "利润" in name or "损益" in name or "income" in name:
        return "income_statement"
    if "资产负债" in name or "balance" in name:
        return "balance_sheet"
    if "现金" in name or "cash" in name:
        return "cash_flow_statement"
    
    # Fallback to content check
    if "营业收入" in content and "净利润" in content:
        return "income_statement"
    if "资产总计" in content and "负债合计" in content:
        return "balance_sheet"
    if "经营活动" in content and "现金流量" in content:
        return "cash_flow_statement"
        
    return None

def find_header_row(sheet, max_rows=30) -> Tuple[int, List[Dict[str, Any]]]:
    """
    Scans the first `max_rows` to find the header row.
    Returns:
        header_row_index (0-based)
        years_map: List of {col_idx: int, year: str}
    """
    header_row_index = -1
    years_map = []
    
    # Heuristic 1: Look for regex dates (2019, 2020-12, 2020.12, 2023年1月)
    # Matches: 2023, 2023-01, 2023.01, 202301, 2023年, 2023年1月
    date_pattern = re.compile(r"20\d{2}(?:[-\./年]\d{1,2}(?:月)?)?|20\d{4}")
    
    for r_idx, row in enumerate(sheet.iter_rows(min_row=1, max_row=max_rows, values_only=True)):
        current_row_years = []
        found_date = False
        
        for c_idx, cell_value in enumerate(row):
            str_val = str(cell_value).strip() if cell_value else ""
            # Simple check first
            if "20" in str_val:
                year_match = date_pattern.search(str_val)
                if year_match:
                    year_str = year_match.group(0)
                    # Basic cleanup
                    year_str = year_str.replace("年", "-").replace("月", "")
                    if year_str.endswith("-"): year_str = year_str[:-1]
                    
                    current_row_years.append({"col_idx": c_idx, "year": year_str})
                    found_date = True
        
        if found_date:
            # We found a row with dates. Assume this is the header.
            header_row_index = r_idx
            years_map = current_row_years
            break
            
    # Heuristic 2 (Fallback): Look for "Subject"/"Item" keywords if no dates found
    # (Sometimes columns are "Current Period", "Prior Period" without explicit years in header)
    if header_row_index == -1:
        pass # To be implemented if strict date matching fails
        
    return header_row_index, years_map

def set_nested_value(data_dict: Dict, path: str, value: float):
    """
    Sets a value in a nested dictionary using a dot-notation path.
    e.g., path="total_operating_revenue.operating_revenue"
    """
    keys = path.split('.')
    current = data_dict
    for i, key in enumerate(keys[:-1]):
        if key not in current:
            current[key] = {}
        current = current[key]
        
    last_key = keys[-1]
    current[last_key] = value

def post_process_totals(sheet_type: str, data: Dict):
    """
    Recalculates totals for compound fields if they are 0 but children have values.
    This handles cases where Excel only provides child items but schema expects a total.
    """
    if sheet_type == "balance_sheet":
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

def parse_sheet_data(sheet, header_row_idx: int, years_map: List[Dict], mapping: Dict) -> Dict[str, Dict]:
    """
    Parses rows and returns a dict keyed by YEAR containing the structured data.
    Result: { "2023": { "total_operating_revenue": { ... } }, "2022": ... }
    """
    results_by_year = { item['year']: {} for item in years_map }
    
    # Iterate rows starting after header
    for row in sheet.iter_rows(min_row=header_row_idx + 2, values_only=True):
        # Assume Column A (index 0) is the Account Name
        # TODO: Make this dynamic if Account Name isn't col 0
        account_name = str(row[0]).strip() if row[0] else ""
        
        # Clean account name (remove spaces, special chars for matching)
        clean_name = re.sub(r"\s+", "", account_name)
        
        if clean_name in mapping:
            target_path = mapping[clean_name]
            
            # Extract value for each year column
            for year_info in years_map:
                col_idx = year_info['col_idx']
                year = year_info['year']
                
                if col_idx < len(row):
                    raw_val = row[col_idx]
                    # Normalize number
                    num_val = 0.0
                    try:
                        if isinstance(raw_val, (int, float)):
                            num_val = float(raw_val)
                        elif isinstance(raw_val, str):
                            # Remove commas, handle parens?
                            raw_val = raw_val.replace(',', '')
                            if raw_val.strip() == '-' or raw_val.strip() == '':
                                num_val = 0.0
                            else:
                                num_val = float(raw_val)
                    except ValueError:
                        num_val = 0.0
                        
                    set_nested_value(results_by_year[year], target_path, num_val)
                    
    return results_by_year

def parse_excel_file(file_content: bytes, filename: str) -> StandardizedReport:
    """
    Main entry point for parsing an Excel file into the StandardizedReport format.
    """
    wb = openpyxl.load_workbook(io.BytesIO(file_content), data_only=True)
    
    # Initialize container for aggregated year data
    # Structure: { "2023": { "income_statement": {}, "balance_sheet": {}, ... } }
    aggregated_data = {}
    
    # Company Meta (Mock/Extraction)
    # Try to extract from first sheet title or filename
    company_name = filename.split('.')[0]
    
    for sheet_name in wb.sheetnames:
        sheet = wb[sheet_name]
        
        # 1. Detect Type
        # Sample first few rows for content check
        sample_content = ""
        for r in sheet.iter_rows(max_row=10, values_only=True):
            sample_content += " ".join([str(x) for x in r if x])
            
        sheet_type = detect_sheet_type(sheet_name, sample_content)
        if not sheet_type:
            continue
            
        # 2. Find Header
        header_idx, years_map = find_header_row(sheet)
        if header_idx == -1 or not years_map:
            print(f"Skipping sheet {sheet_name}: No header/years found.")
            continue
            
        # 3. Select Mapping
        mapping = {}
        if sheet_type == "income_statement":
            mapping = INCOME_STATEMENT_MAP
        elif sheet_type == "balance_sheet":
            mapping = BALANCE_SHEET_MAP
        elif sheet_type == "cash_flow_statement":
            mapping = CASH_FLOW_MAP
            
        # 4. Parse Rows
        parsed_years_data = parse_sheet_data(sheet, header_idx, years_map, mapping)
        
        # 5. Merge into Aggregated Data
        for year, data in parsed_years_data.items():
            # Post-process totals for this year's data
            post_process_totals(sheet_type, data)

            if year not in aggregated_data:
                aggregated_data[year] = {}
            
            # Init specific report section if not exists
            if sheet_type not in aggregated_data[year]:
                aggregated_data[year][sheet_type] = {}
                
            # Merge data (naive merge, assumes structure is built by parse_sheet_data)
            # Since parse_sheet_data returns the full nested dict for that sheet, we can just assign/update
            aggregated_data[year][sheet_type] = data

    # 6. Construct Final Report Objects
    reports_list = []
    for year, sections in aggregated_data.items():
        
        # Create Pydantic models with default values (0), then update with parsed data
        inc_stmt = IncomeStatement(**sections.get("income_statement", {}))
        bal_sheet = BalanceSheet(**sections.get("balance_sheet", {}))
        cash_flow = CashFlowStatement(**sections.get("cash_flow_statement", {}))
        
        fin_data = FinancialReportData(
            income_statement=inc_stmt,
            balance_sheet=bal_sheet,
            cash_flow_statement=cash_flow
        )
        
        # Determine period type based on year string format
        # e.g., "2023-01", "2023.12" -> Monthly
        # "2023" -> Annual
        p_type = "Annual"
        if "-" in year or "." in year:
            p_type = "Monthly"
        elif len(year) == 6 and year.isdigit(): # 202301
            p_type = "Monthly"
            
        report = Report(
            fiscal_year=year,
            period_type=p_type,
            data=fin_data
        )
        reports_list.append(report)
        
    # Sort reports by year descending
    reports_list.sort(key=lambda x: x.fiscal_year, reverse=True)
    
    return StandardizedReport(
        company_meta=CompanyMeta(name=company_name),
        reports=reports_list
    )
