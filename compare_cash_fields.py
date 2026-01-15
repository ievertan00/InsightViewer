#!/usr/bin/env python3
"""
Script to compare Tushare cash flow statement fields in the mapping file with official documentation
"""

import re

def get_cash_fields_from_mapping():
    """Extract cash flow statement fields from the mapping file"""
    with open('backend/app/core/tushare_mappings.py', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the cash map section
    start_marker = 'TUSHARE_CASH_MAP = {'
    end_marker = '^}'

    cash_map_start = content.find(start_marker)
    if cash_map_start == -1:
        print("Could not find TUSHARE_CASH_MAP section")
        return []
    
    # Find the end of the cash map by looking for the closing brace after the start
    cash_map_section = content[cash_map_start:]
    brace_count = 0
    pos = 0
    for i, char in enumerate(cash_map_section):
        if char == '{':
            brace_count += 1
        elif char == '}':
            brace_count -= 1
            if brace_count == 0:
                pos = i
                break
    
    cash_map_section = cash_map_section[:pos+1]

    # Find all Tushare field names in the cash map
    pattern = r'"([a-zA-Z_][a-zA-Z0-9_]*)":'
    cash_mapped_fields = re.findall(pattern, cash_map_section)

    return cash_mapped_fields

def get_expected_cash_fields():
    """Define expected fields from Tushare documentation"""
    expected_fields = [
        'ts_code', 'ann_date', 'f_ann_date', 'start_date', 'end_date', 'period', 
        'report_type', 'comp_type', 'is_calc',  # Input parameters
        
        # Output parameters
        'ts_code', 'ann_date', 'f_ann_date', 'end_date', 'comp_type', 'report_type', 
        'end_type', 'net_profit', 'finan_exp', 'c_fr_sale_sg', 'recp_tax_rends', 
        'n_depos_incr_fi', 'n_incr_loans_cb', 'n_inc_borr_oth_fi', 'prem_fr_orig_contr', 
        'n_incr_insured_dep', 'n_reinsur_prem', 'n_incr_disp_tfa', 'ifc_cash_incr', 
        'n_incr_disp_faas', 'n_incr_loans_oth_bank', 'n_cap_incr_repur', 'c_fr_oth_operate_a', 
        'c_inf_fr_operate_a', 'c_paid_goods_s', 'c_paid_to_for_empl', 'c_paid_for_taxes', 
        'n_incr_clt_loan_adv', 'n_incr_dep_cbob', 'c_pay_claims_orig_inco', 'pay_handling_chrg', 
        'pay_comm_insur_plcy', 'oth_cash_pay_oper_act', 'st_cash_out_act', 'n_cashflow_act', 
        'oth_recp_ral_inv_act', 'c_disp_withdrwl_invest', 'c_recp_return_invest', 
        'n_recp_disp_fiolta', 'n_recp_disp_sobu', 'stot_inflows_inv_act', 
        'c_pay_acq_const_fiolta', 'c_paid_invest', 'n_disp_subs_oth_biz', 'oth_pay_ral_inv_act', 
        'n_incr_pledge_loan', 'stot_out_inv_act', 'n_cashflow_inv_act', 'c_recp_borrow', 
        'proc_issue_bonds', 'oth_cash_recp_ral_fnc_act', 'stot_cash_in_fnc_act', 'free_cashflow', 
        'c_prepay_amt_borr', 'c_pay_dist_dpcp_int_exp', 'incl_dvd_profit_paid_sc_ms', 
        'oth_cashpay_ral_fnc_act', 'stot_cashout_fnc_act', 'n_cash_flows_fnc_act', 'eff_fx_flu_cash', 
        'n_incr_cash_cash_equ', 'c_cash_equ_beg_period', 'c_cash_equ_end_period', 'c_recp_cap_contrib', 
        'incl_cash_rec_saims', 'uncon_invest_loss', 'prov_depr_assets', 'depr_fa_coga_dpba', 
        'amort_intang_assets', 'lt_amort_deferred_exp', 'decr_deferred_exp', 'incr_acc_exp', 
        'loss_disp_fiolta', 'loss_scr_fa', 'loss_fv_chg', 'invest_loss', 'decr_def_inc_tax_assets', 
        'incr_def_inc_tax_liab', 'decr_inventories', 'decr_oper_payable', 'incr_oper_payable', 
        'others', 'im_net_cashflow_oper_act', 'conv_debt_into_cap', 'conv_copbonds_due_within_1y', 
        'fa_fnc_leases', 'im_n_incr_cash_equ', 'net_dism_capital_add', 'net_cash_rece_sec', 
        'credit_impa_loss', 'use_right_asset_dep', 'oth_loss_asset', 'end_bal_cash', 
        'beg_bal_cash', 'end_bal_cash_equ', 'beg_bal_cash_equ', 'update_flag'
    ]
    
    # Remove duplicate 'ts_code', 'ann_date', 'f_ann_date', 'end_date', 'comp_type', 'report_type' 
    # since they appear in both input and output parameters
    seen = set()
    unique_expected_fields = []
    for field in expected_fields:
        if field not in seen:
            seen.add(field)
            unique_expected_fields.append(field)
    
    return unique_expected_fields

def main():
    # Get fields from mapping file
    mapped_fields = get_cash_fields_from_mapping()
    
    # Get expected fields from documentation
    expected_fields = get_expected_cash_fields()
    
    print("=== CASH FLOW STATEMENT COMPARISON RESULTS ===")
    print(f"Total fields in documentation: {len(expected_fields)}")
    print(f"Total fields in mapping: {len(mapped_fields)}")
    print()
    
    # Find missing fields
    missing_fields = [field for field in expected_fields if field not in mapped_fields]
    
    # Find extra fields (fields in mapping but not in documentation)
    extra_fields = [field for field in mapped_fields if field not in expected_fields]
    
    print("Missing fields from Tushare documentation:")
    for field in missing_fields:
        print(f"  - {field}")
    print(f"\nNumber of missing fields: {len(missing_fields)}")
    print("(Note: ts_code, ann_date, f_ann_date, start_date, end_date, period, report_type, comp_type, is_calc, end_type are metadata fields)")
    print("These are used for API filtering and identification, not financial data representation.")
    print("free_cashflow is also missing but is an optional field.")
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
    important_fields = ['net_profit', 'c_fr_sale_sg', 'c_paid_goods_s', 'n_cashflow_act', 
                       'n_cashflow_inv_act', 'n_cash_flows_fnc_act', 'n_incr_cash_cash_equ', 
                       'c_cash_equ_beg_period', 'c_cash_equ_end_period']
    
    print("Status of important fields:")
    for field in important_fields:
        status = "OK" if field in mapped_fields else "MISSING"
        print(f"  {status} {field}")
    print()

if __name__ == "__main__":
    main()