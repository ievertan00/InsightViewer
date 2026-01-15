#!/usr/bin/env python3
"""
Script to compare Tushare income statement fields in the mapping file with official documentation
"""

import re

def get_income_fields_from_mapping():
    """Extract income statement fields from the mapping file"""
    with open('backend/app/core/tushare_mappings.py', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the income map section
    start_marker = 'TUSHARE_INCOME_MAP = {'
    end_marker = 'TUSHARE_BALANCE_MAP = {'

    income_map_start = content.find(start_marker)
    income_map_end = content.find(end_marker, income_map_start)

    income_map_section = content[income_map_start:income_map_end]

    # Find all Tushare field names in the income map
    pattern = r'"([a-zA-Z_][a-zA-Z0-9_]*)":'
    income_mapped_fields = re.findall(pattern, income_map_section)

    return income_mapped_fields

def get_expected_income_fields():
    """Define expected fields from Tushare documentation"""
    expected_fields = [
        'ts_code', 'ann_date', 'f_ann_date', 'end_date', 'report_type', 'comp_type', 'end_type',
        'basic_eps', 'diluted_eps', 'total_revenue', 'revenue', 'int_income', 'prem_earned',
        'comm_income', 'n_commis_income', 'n_oth_income', 'n_oth_b_income', 'prem_income',
        'out_prem', 'une_prem_reser', 'reins_income', 'n_sec_tb_income', 'n_sec_uw_income',
        'n_asset_mg_income', 'oth_b_income', 'fv_value_chg_gain', 'invest_income',
        'ass_invest_income', 'forex_gain', 'total_cogs', 'oper_cost', 'int_exp', 'comm_exp',
        'biz_tax_surchg', 'sell_exp', 'admin_exp', 'fin_exp', 'assets_impair_loss', 'prem_refund',
        'compens_payout', 'reser_insur_liab', 'div_payt', 'reins_exp', 'oper_exp',
        'compens_payout_refu', 'insur_reser_refu', 'reins_cost_refund', 'other_bus_cost',
        'operate_profit', 'non_oper_income', 'non_oper_exp', 'nca_disploss', 'total_profit',
        'income_tax', 'n_income', 'n_income_attr_p', 'minority_gain', 'oth_compr_income',
        't_compr_income', 'compr_inc_attr_p', 'compr_inc_attr_m_s', 'ebit', 'ebitda',
        'insurance_exp', 'undist_profit', 'distable_profit', 'rd_exp', 'fin_exp_int_exp',
        'fin_exp_int_inc', 'transfer_surplus_rese', 'transfer_housing_imprest', 'transfer_oth',
        'adj_lossgain', 'withdra_legal_surplus', 'withdra_legal_pubfund', 'withdra_biz_devfund',
        'withdra_rese_fund', 'withdra_oth_ersu', 'workers_welfare', 'distr_profit_shrhder',
        'prfshare_payable_dvd', 'comshare_payable_dvd', 'capit_comstock_div',
        'net_after_nr_lp_correct', 'credit_impa_loss', 'net_expo_hedging_benefits',
        'oth_impair_loss_assets', 'total_opcost', 'amodcost_fin_assets', 'oth_income',
        'asset_disp_income', 'continued_net_profit', 'end_net_profit', 'update_flag'
    ]
    
    return expected_fields

def main():
    # Get fields from mapping file
    mapped_fields = get_income_fields_from_mapping()
    
    # Get expected fields from documentation
    expected_fields = get_expected_income_fields()
    
    # Find missing fields
    missing_fields = [field for field in expected_fields if field not in mapped_fields]
    
    # Find extra fields (fields in mapping but not in documentation)
    extra_fields = [field for field in mapped_fields if field not in expected_fields]
    
    print("=== COMPARISON RESULTS ===")
    print(f"Total fields in documentation: {len(expected_fields)}")
    print(f"Total fields in mapping: {len(mapped_fields)}")
    print()
    
    print("Missing fields from Tushare documentation:")
    for field in missing_fields:
        print(f"  - {field}")
    print(f"\nNumber of missing fields: {len(missing_fields)}")
    print("(Note: ts_code, ann_date, f_ann_date, end_date, report_type, comp_type, end_type, update_flag are metadata fields)")
    print("These are used for API filtering and identification, not financial data representation.")
    print()

    if extra_fields:
        print("Fields in mapping but not in documentation:")
        for field in extra_fields:
            print(f"  - {field}")
        print(f"\nNumber of extra fields: {len(extra_fields)}")
        print("(Note: These are alias mappings for API compatibility and flexibility)")
    else:
        print("Fields in mapping but not in documentation: None")
        print("\nNumber of extra fields: 0")
        print("(All mappings correspond to documented API fields)")
    print()
    
    # Check for common important fields
    important_fields = ['basic_eps', 'diluted_eps', 'total_revenue', 'revenue', 'total_cogs', 
                       'oper_cost', 'total_profit', 'n_income', 'n_income_attr_p', 'operate_profit']
    
    print("Status of important fields:")
    for field in important_fields:
        status = "OK" if field in mapped_fields else "MISSING"
        print(f"  {status} {field}")
    print()

if __name__ == "__main__":
    main()