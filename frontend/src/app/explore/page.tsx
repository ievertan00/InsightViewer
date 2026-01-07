"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Database, ArrowRight, Eye, EyeOff, Filter, Check, Calendar } from "lucide-react";
import Link from "next/link";

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

// Standard schema order for consistent row sorting
const STANDARD_SCHEMA_ORDER: Record<string, number> = (() => {
    const order: string[] = [
        // Income Statement
        "total_operating_revenue", "operating_revenue", "interest_income", "earned_premiums", "fee_and_commission_income", "other_business_revenue",
        "total_operating_cost", "operating_cost", "interest_expenses", "fee_and_commission_expenses", "taxes_and_surcharges", "selling_expenses", "admin_expenses", "rd_expenses", "financial_expenses", 
        "asset_impairment_loss", "credit_impairment_loss", "surrender_value", "net_compensation_expenses", "net_insurance_contract_reserves", "policy_dividend_expenses", "reinsurance_expenses", "other_business_costs",
        "other_operating_income", "fair_value_change_income", "investment_income", "investment_income_from_associates_jv", "net_exposure_hedging_income", "exchange_income", "asset_disposal_income",
        "operating_profit", "non_operating_revenue", "non_operating_expenses", 
        "total_profit", "income_tax", 
        "net_profit", "net_profit_continuing_ops", "net_profit_discontinued_ops", "net_profit_attr_to_parent", "minority_interest_income",
        "earnings_per_share", "basic_eps", "diluted_eps",
        "other_comprehensive_income", "total_comprehensive_income",

        // Balance Sheet - Assets
        "current_assets", "monetary_funds", "clearing_settlement_funds", "lending_funds", "trading_financial_assets", "derivative_financial_assets", "notes_and_accounts_receivable", "notes_receivable", "accounts_receivable", "receivables_financing", "prepayments", "premiums_receivable", "reinsurance_accounts_receivable", "other_receivables_total", "other_receivables", "inventories", "contract_assets", "assets_held_for_sale", "non_current_assets_due_within_1y", "other_current_assets", "total_current_assets",
        "non_current_assets", "loans_and_advances", "debt_investments", "long_term_receivables", "long_term_equity_investments", "investment_properties", "fixed_assets", "construction_in_progress", "right_of_use_assets", "intangible_assets", "development_expenses", "goodwill", "long_term_deferred_expenses", "deferred_tax_assets", "other_non_current_assets", "total_non_current_assets",
        "total_assets",

        // Balance Sheet - Liabilities
        "current_liabilities", "short_term_borrowings", "borrowings_from_central_bank", "trading_financial_liabilities", "derivative_financial_liabilities", "notes_and_accounts_payable", "notes_payable", "accounts_payable", "advances_from_customers", "contract_liabilities", "payroll_payable", "taxes_payable", "other_payables_total", "other_payables", "non_current_liabilities_due_within_1y", "other_current_liabilities", "total_current_liabilities",
        "non_current_liabilities", "long_term_borrowings", "bonds_payable", "lease_liabilities", "long_term_payables", "estimated_liabilities", "deferred_revenue", "deferred_tax_liabilities", "other_non_current_liabilities", "total_non_current_liabilities",
        "total_liabilities",

        // Balance Sheet - Equity
        "equity", "paid_in_capital", "other_equity_instruments", "capital_reserves", "treasury_stock", "other_comprehensive_income", "special_reserves", "surplus_reserves", "general_risk_reserves", "undistributed_profit", "total_parent_equity", "minority_interests", "total_equity", "total_liabilities_and_equity",

        // Cash Flow - Operating
        "operating_activities", "cash_received_from_goods_and_services", "tax_refunds_received", "other_cash_received_operating", "subtotal_cash_inflow_operating",
        "cash_paid_for_goods_and_services", "cash_paid_to_employees", "taxes_paid", "other_cash_paid_operating", "subtotal_cash_outflow_operating", "net_cash_flow_from_operating",

        // Cash Flow - Investing
        "investing_activities", "cash_received_from_investment_recovery", "cash_received_from_investment_income", "net_cash_from_disposal_assets", "subtotal_cash_inflow_investing",
        "cash_paid_for_assets", "cash_paid_for_investments", "subtotal_cash_outflow_investing", "net_cash_flow_from_investing",

        // Cash Flow - Financing
        "financing_activities", "cash_received_from_investments", "cash_received_from_borrowings", "subtotal_cash_inflow_financing",
        "cash_paid_for_debt_repayment", "cash_paid_for_dividends_and_profits", "subtotal_cash_outflow_financing", "net_cash_flow_from_financing",

        // Cash Flow - End
        "cash_increase", "exchange_rate_effect", "net_increase_cash_and_equivalents", "cash_at_beginning", "cash_at_end",
        "supplementary_info", "net_profit_adjustment"
    ];
    
    const map: Record<string, number> = {};
    order.forEach((key, idx) => {
        map[key] = idx;
    });
    return map;
})();

const flattenReports = (reports: any[]) => {
    const flattened: Record<string, any> = {};

    reports.forEach((report: any) => {
        let yearKey = report.fiscal_year.trim(); // e.g. "2024", "2024 Q3"
        
        // Normalize Annual keys for filtering consistency
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
                for (const key in obj) {
                    if (key === "title" || key === "amount" || typeof obj[key] === 'string') continue;

                    const value = obj[key];
                    const fullKey = prefix ? `${prefix}.${key}` : key;
                    // Use just the last key part for ID generation if it's unique enough for sorting, 
                    // or keep full path but map to order.
                    // Let's use the key itself (e.g. "operating_revenue") for matching schema order.
                    const keyForOrder = key; 
                    
                    const uniqueId = `${typeLabel}-${fullKey}`;

                    if (typeof value === 'object' && value !== null) {
                        if ('amount' in value) {
                             if (!flattened[uniqueId]) {
                                flattened[uniqueId] = { 
                                    account: formatKey(key), 
                                    type: typeLabel, 
                                    originalKey: fullKey,
                                    orderKey: keyForOrder, // Store for sorting
                                    id: uniqueId
                                };
                             }
                             flattened[uniqueId][yearKey] = value.amount;
                        }
                        traverse(value, fullKey);
                    } else if (typeof value === 'number') {
                         if (!flattened[uniqueId]) {
                            flattened[uniqueId] = { 
                                account: formatKey(key), 
                                type: typeLabel, 
                                originalKey: fullKey,
                                orderKey: keyForOrder, // Store for sorting
                                id: uniqueId
                            };
                         }
                         flattened[uniqueId][yearKey] = value;
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
        // Sort by Type first (Income > Balance > Cash)
        const typeOrder: Record<string, number> = { "Income Statement": 1, "Balance Sheet": 2, "Cash Flow": 3 };
        const typeDiff = (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
        if (typeDiff !== 0) return typeDiff;

        // Sort by Schema Order
        const orderA = STANDARD_SCHEMA_ORDER[a.orderKey] ?? 9999;
        const orderB = STANDARD_SCHEMA_ORDER[b.orderKey] ?? 9999;
        
        return orderA - orderB;
    });
};

export default function DataPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayRows, setDisplayRows] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

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

                 const flattened = flattenReports(reports);
                 setDisplayRows(flattened);

                 const itemsList = flattened.map(r => ({ id: r.id, name: r.account, type: r.type }));
                 setAllItems(itemsList);
                 setSelectedItems(new Set(itemsList.map(i => i.id)));
            }
        } catch (e) {
            console.error("Failed to parse stored reports", e);
        }
    }
    
    if (storedTime) {
        setLastUpdate(new Date(storedTime).toLocaleString());
    }

    setLoading(false);
  }, []);

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
      return <div className="p-8 text-center text-gray-500">Loading data...</div>;
  }

  if (displayRows.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
              <div className="p-4 bg-gray-100 rounded-full">
                  <Database className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">No Data Found</h2>
              <p className="text-gray-500 max-w-md">It looks like you haven't fetched any financial reports yet.</p>
              <Link href="/import" className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-900 transition-colors flex items-center">
                  Get Financial Data <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
          </div>
      );
  }

  return (
    <div className="space-y-6" onClick={() => { setShowFilterDropdown(false); setShowTypeDropdown(false); }}>
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Data Explorer</h1>
            {lastUpdate && <p className="text-xs text-gray-500 mt-1">Last updated: {lastUpdate}</p>}
        </div>
        
        <div className="flex items-center space-x-3">
            {/* Annual Only Toggle */}
            <button 
                onClick={() => setAnnualOnly(!annualOnly)}
                className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-all ${annualOnly ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
                <Calendar className="w-4 h-4 mr-2" />
                Annual Only
            </button>

            {/* Hide Zeros Toggle */}
            <button 
                onClick={() => setHideZeros(!hideZeros)}
                className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-all ${hideZeros ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
            >
                {hideZeros ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {hideZeros ? "Zeros Hidden" : "Hide Zeros"}
            </button>

            {/* Filter Type Dropdown */}
            <div className="relative" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={() => { setShowTypeDropdown(!showTypeDropdown); setShowFilterDropdown(false); }}
                    className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${showTypeDropdown ? 'border-primary text-primary bg-blue-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Sheet ({selectedTypes.size})
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
                    Items ({selectedItems.size})
                </button>
                {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[400px] flex flex-col">
                        <div className="p-3 border-b border-gray-100 flex justify-between bg-gray-50 rounded-t-lg">
                            <button onClick={() => setSelectedItems(new Set(allItems.map(i => i.id)))} className="text-xs text-primary font-medium hover:underline">Select All</button>
                            <button onClick={() => setSelectedItems(new Set())} className="text-xs text-red-500 font-medium hover:underline">Deselect All</button>
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
                    placeholder="Search accounts..." 
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
                  <th className="py-3 px-6 font-semibold w-[300px] min-w-[300px]">Line Item</th>
                  <th className="py-3 px-6 font-semibold w-[150px] min-w-[150px]">Type</th>
                  {filteredYears.map(year => (
                      <th key={year} className="py-3 px-6 font-semibold text-right whitespace-nowrap min-w-[120px]">{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-6 text-gray-900 font-medium truncate max-w-[300px]" title={row.originalKey}>{row.account}</td>
                    <td className="py-3 px-6 text-gray-500 text-sm truncate max-w-[150px]">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{row.type}</span>
                    </td>
                    {filteredYears.map(year => (
                        <td key={year} className="py-3 px-6 text-right text-gray-900 font-mono">
                            {row[year] !== undefined ? row[year].toLocaleString() : '-'}
                        </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between">
            <span>Showing {filteredData.length} records</span>
            <span>Source: Browser Storage (Standardized)</span>
        </div>
      </div>
    </div>
  );
}