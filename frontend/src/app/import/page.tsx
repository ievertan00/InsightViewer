"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  File as FileIcon,
  CheckCircle,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import clsx from "clsx";

export default function UploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Split loading states
  const [isFetchingStock, setIsFetchingStock] = useState(false);
  const [isProcessingPaste, setIsProcessingPaste] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const [progress, setProgress] = useState(0);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [stockSymbol, setStockSymbol] = useState("");
  const [startYear, setStartYear] = useState("2020");
  const [endYear, setEndYear] = useState(new Date().getFullYear().toString());
  const [jsonContent, setJsonContent] = useState("");
  const [isAppendMode, setIsAppendMode] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter(
        (f) =>
          f.name.endsWith(".xlsx") ||
          f.name.endsWith(".xls") ||
          f.name.endsWith(".csv") ||
          f.name.endsWith(".json")
      );

      if (validFiles.length !== droppedFiles.length) {
        setUploadError(
          "File type is restricted to Excel (.xlsx, .xls) or JSON (.json) files."
        );
        return;
      }

      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(
        (f) =>
          f.name.endsWith(".xlsx") ||
          f.name.endsWith(".xls") ||
          f.name.endsWith(".csv") ||
          f.name.endsWith(".json")
      );

      if (validFiles.length !== selectedFiles.length) {
        setUploadError(
          "File type is restricted to Excel (.xlsx, .xls) or JSON (.json) files."
        );
        return;
      }

      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchStockData = async () => {
    if (!stockSymbol) return;

    // Validation: 6-digit number
    if (!/^\d{6}$/.test(stockSymbol)) {
      setSearchError("Stock Code must be a 6-digit number.");
      return;
    }

    setIsFetchingStock(true);
    setSearchError(null);
    setProgress(30);

    try {
      const symbol = stockSymbol.startsWith("6")
        ? `${stockSymbol}.SH`
        : `${stockSymbol}.SZ`;

      let url = `http://localhost:8000/api/v1/stock/${symbol}`;
      const params = new URLSearchParams();
      if (startYear) params.append("start_date", `${startYear}0101`);
      if (endYear) params.append("end_date", `${endYear}1231`);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch stock data");
      }

      const data = await response.json();
      setProgress(100);

      if (data.company_meta?.name) {
        localStorage.setItem(
          "insight_viewer_company_name",
          data.company_meta.name
        );
        window.dispatchEvent(new Event("companyNameUpdate"));
      }

      if (data.reports && data.reports.length > 0) {
        localStorage.setItem(
          "insight_viewer_reports",
          JSON.stringify(data.reports)
        );
        localStorage.setItem(
          "insight_viewer_last_update",
          new Date().toISOString()
        );

        setTimeout(() => {
          router.push("/explore");
        }, 800);
      } else {
        setSearchError(
          "No financial reports found for this symbol in the selected period."
        );
        setIsFetchingStock(false);
      }
    } catch (err: any) {
      console.error(err);
      setSearchError(
        err.message || "An error occurred while fetching stock data."
      );
      setIsFetchingStock(false);
    }
  };

  const handleJsonPaste = async () => {
    if (!jsonContent.trim()) return;

    try {
      JSON.parse(jsonContent);
    } catch (e) {
      setPasteError("Input must be valid JSON format only.");
      return;
    }

    setIsProcessingPaste(true);
    setPasteError(null);
    setProgress(20);

    try {
      const blob = new Blob([jsonContent], { type: "application/json" });
      const formData = new FormData();
      formData.append("file", blob, "pasted_data.json");

      const response = await fetch("http://localhost:8000/api/v1/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to process pasted JSON");
      }

      const reportData = await response.json();

      if (isAppendMode) {
        const existingName = localStorage.getItem(
          "insight_viewer_company_name"
        );
        const newName = reportData.company_meta?.name;

        if (existingName && newName && existingName !== newName) {
          alert(
            `Cannot append data. Company name mismatch: Existing '${existingName}' vs New '${newName}'.`
          );
          setIsProcessingPaste(false);
          return;
        }
      }

      if (
        reportData.company_meta?.name &&
        (!isAppendMode || !localStorage.getItem("insight_viewer_company_name"))
      ) {
        localStorage.setItem(
          "insight_viewer_company_name",
          reportData.company_meta.name
        );
        window.dispatchEvent(new Event("companyNameUpdate"));
      }

      if (reportData.reports) {
        let finalReports = reportData.reports;
        if (isAppendMode) {
          const existingReportsStr = localStorage.getItem(
            "insight_viewer_reports"
          );
          if (existingReportsStr) {
            try {
              const existingReports = JSON.parse(existingReportsStr);
              if (Array.isArray(existingReports)) {
                finalReports = [...existingReports, ...reportData.reports];
              }
            } catch (e) {
              console.error("Failed to parse existing reports", e);
            }
          }
        }

        finalReports.sort(
          (a: any, b: any) => parseInt(b.fiscal_year) - parseInt(a.fiscal_year)
        );

        localStorage.setItem(
          "insight_viewer_reports",
          JSON.stringify(finalReports)
        );
        localStorage.setItem(
          "insight_viewer_last_update",
          new Date().toISOString()
        );

        setProgress(100);
        setTimeout(() => {
          router.push("/explore");
        }, 800);
      } else {
        setPasteError("The pasted JSON is valid but contains no report data.");
        setIsProcessingPaste(false);
      }
    } catch (e: any) {
      console.error(e);
      setPasteError(
        e.message || "Invalid JSON format. Please check your syntax."
      );
      setIsProcessingPaste(false);
    }
  };

  const copyLlmPrompt = () => {
    const prompt = `You are a strict data extraction assistant. Convert the provided financial report (Image/Text/Excel) into the following JSON structure. 
Rules:
1. Return ONLY valid JSON. No markdown formatting, no explanations.
2. If a field is missing in the source, use 0.
3. Use the exact keys provided below.
4. "fiscal_year" Format:
   - Annual: "2023 Annual"
   - Quarterly: "2023 Q1", "2023 Q2", etc.
   - Monthly: "2023-01", "2023-02", etc.
5. "period_type": "Annual", "Quarterly", or "Monthly".
6. If the source contains multiple periods, generate a separate object in the "reports" array for EACH period.

Template:
{
  "company_meta": {
    "name": "Company Name Placeholder",
    "stock_code": "000000",
    "currency": "CNY"
  },
  "reports": [
    {
      "fiscal_year": "2023 Annual",
      "period_type": "Annual",
      "data": {
        "income_statement": {
          "title": "Income Statement",
          "total_operating_revenue": {
            "amount": 0.0,
            "operating_revenue": 0.0,
            "interest_income": 0.0,
            "earned_premiums": 0.0,
            "fee_and_commission_income": 0.0,
            "other_business_revenue": 0.0,
            "other_items": 0.0
          },
          "total_operating_cost": {
            "amount": 0.0,
            "operating_cost": 0.0,
            "interest_expenses": 0.0,
            "fee_and_commission_expenses": 0.0,
            "taxes_and_surcharges": 0.0,
            "selling_expenses": 0.0,
            "admin_expenses": 0.0,
            "rd_expenses": 0.0,
            "financial_expenses": {
              "amount": 0.0,
              "interest_expenses": 0.0,
              "interest_income": 0.0
            },
            "asset_impairment_loss": 0.0,
            "credit_impairment_loss": 0.0,
            "surrender_value": 0.0,
            "net_compensation_expenses": 0.0,
            "net_insurance_contract_reserves": 0.0,
            "policy_dividend_expenses": 0.0,
            "reinsurance_expenses": 0.0,
            "other_business_costs": 0.0,
            "other_items": 0.0
          },
          "other_operating_income": {
            "amount": 0.0,
            "fair_value_change_income": 0.0,
            "investment_income": 0.0,
            "investment_income_from_associates_jv": 0.0,
            "net_exposure_hedging_income": 0.0,
            "exchange_income": 0.0,
            "asset_disposal_income": 0.0,
            "asset_impairment_loss_new": 0.0,
            "credit_impairment_loss_new": 0.0,
            "other_income": 0.0,
            "operating_profit_other_items": 0.0,
            "operating_profit_balance_items": 0.0
          },
          "operating_profit": {
            "amount": 0.0,
            "non_operating_revenue": 0.0,
            "non_current_asset_disposal_gain": 0.0,
            "non_operating_expenses": 0.0,
            "non_current_asset_disposal_loss": 0.0,
            "other_items_affecting_total_profit": 0.0,
            "total_profit_balance_items": 0.0
          },
          "total_profit": {
            "amount": 0.0,
            "income_tax": 0.0,
            "unconfirmed_investment_loss": 0.0,
            "other_items_affecting_net_profit": 0.0,
            "net_profit_difference": 0.0
          },
          "net_profit": {
            "amount": 0.0,
            "net_profit_continuing_ops": 0.0,
            "net_profit_discontinued_ops": 0.0,
            "profit_from_merged_party_before_merger": 0.0,
            "net_profit_attr_to_parent": 0.0,
            "minority_interest_income": 0.0,
            "net_profit_deducting_non_recurring": 0.0,
            "other_items": 0.0,
            "balance_items": 0.0
          },
          "earnings_per_share": {
            "basic_eps": 0.0,
            "diluted_eps": 0.0
          },
          "other_comprehensive_income": {
            "amount": 0.0,
            "attr_to_parent": 0.0,
            "attr_to_minority": 0.0
          },
          "total_comprehensive_income": {
            "amount": 0.0,
            "attr_to_parent": 0.0,
            "attr_to_minority": 0.0,
            "derecognition_income_amortized_cost": 0.0
          }
        },
        "balance_sheet": {
          "title": "Balance Sheet",
          "current_assets": {
            "monetary_funds": 0.0,
            "clearing_settlement_funds": 0.0,
            "lending_funds": 0.0,
            "funds_lent": 0.0,
            "trading_financial_assets": 0.0,
            "financial_assets_fvpl": {
              "amount": 0.0,
              "trading_financial_assets": 0.0,
              "designated_financial_assets_fvpl": 0.0
            },
            "derivative_financial_assets": 0.0,
            "notes_and_accounts_receivable": {
              "amount": 0.0,
              "notes_receivable": 0.0,
              "accounts_receivable": 0.0
            },
            "receivables_financing": 0.0,
            "prepayments": 0.0,
            "premiums_receivable": 0.0,
            "reinsurance_accounts_receivable": 0.0,
            "reinsurance_contract_reserves_receivable": 0.0,
            "other_receivables_total": {
              "amount": 0.0,
              "interest_receivable": 0.0,
              "dividends_receivable": 0.0,
              "other_receivables": 0.0
            },
            "export_tax_refund_receivable": 0.0,
            "subsidies_receivable": 0.0,
            "internal_receivables": 0.0,
            "buy_back_financial_assets": 0.0,
            "financial_assets_amortized_cost": 0.0,
            "inventories": 0.0,
            "financial_assets_fvoci": 0.0,
            "contract_assets": 0.0,
            "assets_held_for_sale": 0.0,
            "non_current_assets_due_within_1y": 0.0,
            "agency_business_assets": 0.0,
            "other_current_assets": 0.0,
            "other_items": 0.0,
            "balance_items": 0.0,
            "total_current_assets": 0.0
          },
          "non_current_assets": {
            "loans_and_advances": 0.0,
            "debt_investments": 0.0,
            "other_debt_investments": 0.0,
            "financial_assets_amortized_cost_non_current": 0.0,
            "financial_assets_fvoci_non_current": 0.0,
            "available_for_sale_financial_assets": 0.0,
            "held_to_maturity_investments": 0.0,
            "long_term_receivables": 0.0,
            "long_term_equity_investments": 0.0,
            "investment_properties": 0.0,
            "fixed_assets": 0.0,
            "construction_in_progress": 0.0,
            "construction_materials": 0.0,
            "other_equity_instrument_investments": 0.0,
            "other_non_current_financial_assets": 0.0,
            "fixed_assets_liquidation": 0.0,
            "productive_biological_assets": 0.0,
            "oil_and_gas_assets": 0.0,
            "right_of_use_assets": 0.0,
            "intangible_assets": 0.0,
            "balance_items": 0.0,
            "development_expenses": 0.0,
            "goodwill": 0.0,
            "long_term_deferred_expenses": 0.0,
            "deferred_tax_assets": 0.0,
            "other_non_current_assets": 0.0,
            "other_items": 0.0,
            "total_non_current_assets": 0.0
          },
          "assets_summary": {
            "other_asset_items": 0.0,
            "asset_balance_items": 0.0,
            "total_assets": 0.0
          },
          "current_liabilities": {
            "short_term_borrowings": 0.0,
            "borrowings_from_central_bank": 0.0,
            "deposits_and_interbank_placements": 0.0,
            "borrowings_from_interbank": 0.0,
            "trading_financial_liabilities": 0.0,
            "financial_liabilities_fvpl": {
              "amount": 0.0,
              "trading_financial_liabilities": 0.0,
              "designated_financial_liabilities_fvpl": 0.0
            },
            "derivative_financial_liabilities": 0.0,
            "notes_and_accounts_payable": {
              "amount": 0.0,
              "notes_payable": 0.0,
              "accounts_payable": 0.0
            },
            "advances_from_customers": 0.0,
            "contract_liabilities": 0.0,
            "sell_buy_back_financial_assets": 0.0,
            "fees_and_commissions_payable": 0.0,
            "payroll_payable": 0.0,
            "taxes_payable": 0.0,
            "other_payables_total": {
              "amount": 0.0,
              "interest_payable": 0.0,
              "dividends_payable": 0.0,
              "other_payables": 0.0
            },
            "reinsurance_accounts_payable": 0.0,
            "internal_payables": 0.0,
            "estimated_current_liabilities": 0.0,
            "insurance_contract_reserves": 0.0,
            "acting_trading_securities": 0.0,
            "acting_underwriting_securities": 0.0,
            "deferred_revenue_within_1y": 0.0,
            "financial_liabilities_amortized_cost": 0.0,
            "short_term_bonds_payable": 0.0,
            "liabilities_held_for_sale": 0.0,
            "non_current_liabilities_due_within_1y": 0.0,
            "agency_business_liabilities": 0.0,
            "other_current_liabilities": 0.0,
            "other_items": 0.0,
            "balance_items": 0.0,
            "total_current_liabilities": 0.0
          },
          "non_current_liabilities": {
            "long_term_borrowings": 0.0,
            "financial_liabilities_amortized_cost_non_current": 0.0,
            "bonds_payable": {
              "amount": 0.0,
              "preference_shares": 0.0,
              "perpetual_bonds": 0.0
            },
            "lease_liabilities": 0.0,
            "long_term_payables": 0.0,
            "long_term_payroll_payable": 0.0,
            "special_payables": 0.0,
            "estimated_liabilities": 0.0,
            "deferred_revenue": 0.0,
            "deferred_tax_liabilities": 0.0,
            "other_non_current_liabilities": 0.0,
            "other_items": 0.0,
            "balance_items": 0.0,
            "total_non_current_liabilities": 0.0
          },
          "liabilities_summary": {
            "other_liability_items": 0.0,
            "liability_balance_items": 0.0,
            "total_liabilities": 0.0
          },
          "equity": {
            "title": "Owner's Equity",
            "paid_in_capital": 0.0,
            "other_equity_instruments": {
              "amount": 0.0,
              "preference_shares": 0.0,
              "perpetual_bonds": 0.0,
              "other": 0.0
            },
            "capital_reserves": 0.0,
            "other_comprehensive_income": 0.0,
            "treasury_stock": 0.0,
            "special_reserves": 0.0,
            "surplus_reserves": 0.0,
            "general_risk_reserves": 0.0,
            "unconfirmed_investment_loss": 0.0,
            "undistributed_profit": 0.0,
            "proposed_cash_dividends": 0.0,
            "currency_translation_diff": 0.0,
            "parent_equity_other_items": 0.0,
            "parent_equity_balance_items": 0.0,
            "total_parent_equity": 0.0,
            "minority_interests": 0.0,
            "equity_other_items": 0.0,
            "equity_balance_items": 0.0,
            "total_equity": 0.0
          },
          "balance_check": {
            "liabilities_and_equity_other_items": 0.0,
            "liabilities_and_equity_balance_items": 0.0,
            "total_liabilities_and_equity": 0.0
          }
        },
        "cash_flow_statement": {
          "title": "Cash Flow Statement",
          "operating_activities": {
            "cash_received_from_goods_and_services": 0.0,
            "net_increase_deposits_interbank": 0.0,
            "net_increase_borrowings_central_bank": 0.0,
            "net_increase_borrowings_other_financial": 0.0,
            "cash_received_original_premiums": 0.0,
            "net_cash_received_reinsurance": 0.0,
            "net_increase_insured_investment": 0.0,
            "net_increase_disposal_trading_assets": 0.0,
            "cash_received_interest_commission": 0.0,
            "net_increase_borrowed_funds": 0.0,
            "net_decrease_loans_advances": 0.0,
            "net_increase_repurchase_funds": 0.0,
            "tax_refunds_received": 0.0,
            "other_cash_received_operating": 0.0,
            "inflow_other_items": 0.0,
            "inflow_balance_items": 0.0,
            "subtotal_cash_inflow_operating": 0.0,
            "cash_paid_for_goods_and_services": 0.0,
            "net_increase_loans_advances": 0.0,
            "net_increase_deposits_central_bank_interbank": 0.0,
            "cash_paid_original_contract_claims": 0.0,
            "cash_paid_interest_commission": 0.0,
            "cash_paid_policy_dividends": 0.0,
            "cash_paid_to_employees": 0.0,
            "taxes_paid": 0.0,
            "other_cash_paid_operating": 0.0,
            "outflow_other_items": 0.0,
            "outflow_balance_items": 0.0,
            "subtotal_cash_outflow_operating": 0.0,
            "net_cash_flow_other_items": 0.0,
            "net_cash_flow_balance_items": 0.0,
            "net_cash_flow_from_operating": 0.0
          },
          "investing_activities": {
            "cash_received_from_investment_recovery": 0.0,
            "cash_received_from_investment_income": 0.0,
            "net_cash_from_disposal_assets": 0.0,
            "net_cash_from_disposal_subsidiaries": 0.0,
            "cash_received_from_pledge_deposit_reduction": 0.0,
            "other_cash_received_investing": 0.0,
            "inflow_other_items": 0.0,
            "inflow_balance_items": 0.0,
            "subtotal_cash_inflow_investing": 0.0,
            "cash_paid_for_assets": 0.0,
            "cash_paid_for_investments": 0.0,
            "net_increase_pledged_loans": 0.0,
            "net_cash_paid_subsidiaries": 0.0,
            "cash_paid_for_pledge_deposit_increase": 0.0,
            "other_cash_paid_investing": 0.0,
            "outflow_other_items": 0.0,
            "outflow_balance_items": 0.0,
            "subtotal_cash_outflow_investing": 0.0,
            "net_cash_flow_other_items": 0.0,
            "net_cash_flow_balance_items": 0.0,
            "net_cash_flow_from_investing": 0.0
          },
          "financing_activities": {
            "cash_received_from_investments": {
              "amount": 0.0,
              "from_minority_shareholders": 0.0
            },
            "cash_received_from_borrowings": 0.0,
            "cash_received_from_bond_issue": 0.0,
            "other_cash_received_financing": 0.0,
            "inflow_other_items": 0.0,
            "inflow_balance_items": 0.0,
            "subtotal_cash_inflow_financing": 0.0,
            "cash_paid_for_debt_repayment": 0.0,
            "cash_paid_for_dividends_and_profits": 0.0,
            "dividends_paid_to_minority": 0.0,
            "cash_paid_for_minority_equity": 0.0,
            "other_cash_paid_financing": {
              "amount": 0.0,
              "paid_to_minority_for_capital_reduction": 0.0
            },
            "outflow_other_items": 0.0,
            "outflow_balance_items": 0.0,
            "subtotal_cash_outflow_financing": 0.0,
            "net_cash_flow_other_items": 0.0,
            "net_cash_flow_balance_items": 0.0,
            "net_cash_flow_from_financing": 0.0
          },
          "cash_increase": {
            "exchange_rate_effect": 0.0,
            "increase_other_items": 0.0,
            "increase_balance_items": 0.0,
            "net_increase_cash_and_equivalents": 0.0,
            "cash_at_beginning": 0.0,
            "end_balance_other_items": 0.0,
            "end_balance_balance_items": 0.0,
            "cash_at_end": 0.0
          },
          "supplementary_info": {
            "net_profit_adjustment": {
              "net_profit": 0.0,
              "asset_impairment_reserves": 0.0,
              "depreciation_fixed_assets_investment_props": 0.0,
              "depreciation_others": 0.0,
              "depreciation_investment_props": 0.0,
              "amortization_intangible_assets": 0.0,
              "amortization_long_term_deferred": 0.0,
              "amortization_deferred_revenue": 0.0,
              "decrease_deferred_expenses": 0.0,
              "increase_accrued_expenses": 0.0,
              "loss_disposal_assets": 0.0,
              "loss_scrapping_assets": 0.0,
              "loss_fair_value_change": 0.0,
              "financial_expenses": 0.0,
              "investment_loss": 0.0,
              "deferred_tax": 0.0,
              "decrease_deferred_tax_assets": 0.0,
              "increase_deferred_tax_liabilities": 0.0,
              "increase_estimated_liabilities": 0.0,
              "decrease_inventories": 0.0,
              "decrease_operating_receivables": 0.0,
              "increase_operating_payables": 0.0,
              "other": 0.0,
              "net_cash_flow_other_items": 0.0,
              "net_cash_flow_balance_items": 0.0,
              "net_cash_flow_from_operating_indirect": 0.0
            },
            "significant_non_cash": {
              "debt_to_capital": 0.0,
              "convertible_bonds_due_within_1y": 0.0,
              "fixed_assets_finance_lease": 0.0,
              "non_cash_items_other": 0.0
            },
            "cash_change_check": {
              "cash_end_balance": 0.0,
              "cash_begin_balance": 0.0,
              "equivalents_end_balance": 0.0,
              "equivalents_begin_balance": 0.0,
              "net_increase_other": 0.0,
              "net_increase_balance": 0.0,
              "net_increase_cash_and_equivalents_indirect": 0.0
            },
            "credit_impairment_loss": 0.0
          }
        }
      }
    }
  ]
}
`;
    navigator.clipboard.writeText(prompt);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 3000); // Hide after 3 seconds
  };

  const processFiles = async () => {
    if (files.length === 0) return;

    setIsProcessingUpload(true);
    setUploadError(null);
    setProgress(10);

    try {
      let allReports: any[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:8000/api/v1/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Failed to parse ${file.name}`);
        }

        const reportData = await response.json();

        if (isAppendMode) {
          const existingName = localStorage.getItem(
            "insight_viewer_company_name"
          );
          const newName = reportData.company_meta?.name;

          if (existingName && newName && existingName !== newName) {
            alert(
              `Cannot append data. Company name mismatch: Existing '${existingName}' vs New '${newName}'.`
            );
            setIsProcessingUpload(false);
            return;
          }
        }

        if (
          reportData.company_meta?.name &&
          (!isAppendMode ||
            !localStorage.getItem("insight_viewer_company_name"))
        ) {
          localStorage.setItem(
            "insight_viewer_company_name",
            reportData.company_meta.name
          );
          window.dispatchEvent(new Event("companyNameUpdate"));
        }
        if (reportData.reports) {
          allReports = [...allReports, ...reportData.reports];
        }
        setProgress(10 + Math.round(((i + 1) / files.length) * 80));
      }

      if (allReports.length === 0) {
        setUploadError(
          "No valid data could be extracted. Please check the file format."
        );
        setIsProcessingUpload(false);
        return;
      }

      let finalReports = allReports;
      if (isAppendMode) {
        const existingReportsStr = localStorage.getItem(
          "insight_viewer_reports"
        );
        if (existingReportsStr) {
          try {
            const existingReports = JSON.parse(existingReportsStr);
            if (Array.isArray(existingReports)) {
              finalReports = [...existingReports, ...allReports];
            }
          } catch (e) {
            console.error("Failed to parse existing reports", e);
          }
        }
      }

      finalReports.sort(
        (a: any, b: any) => parseInt(b.fiscal_year) - parseInt(a.fiscal_year)
      );
      localStorage.setItem(
        "insight_viewer_reports",
        JSON.stringify(finalReports)
      );
      localStorage.setItem(
        "insight_viewer_last_update",
        new Date().toISOString()
      );

      setProgress(100);
      setTimeout(() => {
        router.push("/explore");
      }, 800);
    } catch (err: any) {
      console.error(err);
      setUploadError(
        err.message || "An error occurred while communicating with the backend."
      );
      setIsProcessingUpload(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Import</h1>
        <p className="text-gray-500">
          Search by Stock Symbol or upload Excel/JSON files.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-blue-900 flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-600" />
          How to Import Data Correctly
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-800">
          <div>
            <h3 className="font-bold mb-2">1. Search A-Share</h3>
            <p className="mb-2">For Chinese A-Share companies only.</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Enter 6-digit code (e.g., 600519).</li>
              <li>Set Start/End years (e.g., 2020-2023).</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">2. Paste JSON</h3>
            <p className="mb-2">For structured data from LLMs.</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Use the "Copy LLM Prompt" button.</li>
              <li>Paste the prompt into DeepSeek/ChatGPT/Claude.</li>
              <li>Upload your Excel/PDF/Image to the LLM.</li>
              <li>Paste the JSON response here.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">3. Upload Excel</h3>
            <p className="mb-2">For custom financial models.</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Download standard templates below.</li>
              <li>
                Ensure header row has years (e.g., 2023 Annual, 2023 Q1,
                2023-01).
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center mr-3 text-sm">
            1
          </span>
          Search A-Share
        </h3>
        {searchError && (
          <div className="text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-md">
            <AlertCircle className="w-4 h-4 mr-2" />
            {searchError}
          </div>
        )}
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Code (e.g. 600519)"
            className="flex-[2] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchStockData()}
          />
          <input
            type="number"
            placeholder="Start"
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
          />
          <span className="self-center text-gray-400">-</span>
          <input
            type="number"
            placeholder="End"
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
          />
          <button
            onClick={fetchStockData}
            disabled={isFetchingStock || !stockSymbol}
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors disabled:bg-gray-400 whitespace-nowrap flex items-center"
          >
            {isFetchingStock ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {isFetchingStock ? "Fetching..." : "Fetch Data"}
          </button>
        </div>
        <p className="text-xs text-gray-400">
          Note: Requires Tushare API Token configured on backend.
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-gray-50 px-2 text-gray-500">OR</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center mr-3 text-sm">
              2
            </span>
            Paste JSON Data
          </h3>
          <button
            onClick={copyLlmPrompt}
            className="text-xs text-primary hover:text-blue-800 font-medium underline"
          >
            Copy LLM Prompt Template
          </button>
        </div>
        {pasteError && (
          <div className="text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-md">
            <AlertCircle className="w-4 h-4 mr-2" />
            {pasteError}
          </div>
        )}
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder='{"company_meta": {...}, "reports": [...]}'
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
        />
        <div className="flex justify-end items-center space-x-4">
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isAppendMode}
              onChange={(e) => setIsAppendMode(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span>Add to existing data</span>
          </label>
          <button
            onClick={handleJsonPaste}
            disabled={!jsonContent.trim() || isProcessingPaste}
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors disabled:bg-gray-400 flex items-center"
          >
            {isProcessingPaste ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {isProcessingPaste ? "Processing..." : "Load & Process JSON"}
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-gray-50 px-2 text-gray-500">OR</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-primary flex items-center justify-center mr-3 text-sm">
            3
          </span>
          Drag & Drop Reports
        </h3>

        {uploadError && (
          <div className="text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-md">
            <AlertCircle className="w-4 h-4 mr-2" />
            {uploadError}
          </div>
        )}

        <div
          className={clsx(
            "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer bg-gray-50/50 min-h-[200px]",
            isDragging
              ? "border-primary bg-blue-50"
              : "border-gray-200 hover:border-primary"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud
            className={clsx(
              "w-12 h-12 mb-4",
              isDragging ? "text-primary" : "text-gray-400"
            )}
          />
          <p className="text-sm text-gray-500 mb-2 text-center">
            Drag and drop your Excel or JSON files here
          </p>
          
          <div className="flex space-x-3 text-xs mb-4 text-center">
            <span className="text-gray-400">Templates:</span>
            <a
              href="/templates/Standard_Income_Statement.xlsx"
              download
              className="text-primary hover:underline"
            >
              Income Statement
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/templates/Standard_Balance_Sheet.xlsx"
              download
              className="text-primary hover:underline"
            >
              Balance Sheet
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/templates/Standard_Cash_Flow.xlsx"
              download
              className="text-primary hover:underline"
            >
              Cash Flow
            </a>
          </div>

          <label className="bg-primary text-white px-6 py-2 rounded-lg font-medium cursor-pointer hover:bg-blue-900 transition-colors z-10 relative">
            Browse Files
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv,.json"
            />
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-800">
            Selected Files ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                {!isProcessingUpload && (
                  <button
                    onClick={() => removeFile(idx)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            {isProcessingUpload ? (
              <div className="flex-1 mr-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-primary font-medium">
                    Processing...
                  </span>
                  <span className="text-gray-500">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex-1"></div>
            )}

            <div className="flex items-center ml-4">
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer mr-4">
                <input
                  type="checkbox"
                  checked={isAppendMode}
                  onChange={(e) => setIsAppendMode(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>Add to existing data</span>
              </label>
              <button
                onClick={processFiles}
                disabled={isProcessingUpload}
                className={clsx(
                  "px-6 py-2 rounded-lg font-medium text-white transition-colors flex items-center",
                  isProcessingUpload
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-blue-900"
                )}
              >
                {isProcessingUpload && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isProcessingUpload ? "Parsing..." : "Start Processing"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copied to Clipboard Message */}
      <div
        className={clsx(
          "fixed bottom-4 left-4 px-4 py-2 bg-gray-800 text-white rounded-md shadow-lg transition-all duration-300 z-50",
          showCopiedMessage
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        Copied to clipboard
      </div>
    </div>
  );
}
