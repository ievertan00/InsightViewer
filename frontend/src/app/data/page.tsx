"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Database, ArrowRight, Eye, EyeOff, Filter, Check } from "lucide-react";
import Link from "next/link";

// Helper to flatten nested object keys into a readable format
// e.g. "total_operating_revenue.operating_revenue" -> "Operating Revenue"
const formatKey = (key: string) => {
    return key.split('.').pop()?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || key;
};

// Flatten logic: Recursively traverse the report object to generate rows
// Returns: { [accountName]: { type: string, [year]: value } }
const flattenReports = (reports: any[]) => {
    const flattened: Record<string, any> = {};

    reports.forEach((report: any) => {
        const year = report.fiscal_year;
        const data = report.data;

        if (!data) return;

        const processSection = (sectionName: string, sectionData: any, typeLabel: string) => {
            if (!sectionData) return;

            const traverse = (obj: any, prefix: string = "") => {
                for (const key in obj) {
                    // Skip 'title', generic strings, and 'amount'
                    if (key === "title" || key === "amount" || typeof obj[key] === 'string') continue;

                    const value = obj[key];
                    const fullKey = prefix ? `${prefix}.${key}` : key;
                    const uniqueId = `${typeLabel}-${fullKey}`;

                    if (typeof value === 'object' && value !== null) {
                        // Check if it's a leaf node with just 'amount'
                        if ('amount' in value) {
                             if (!flattened[uniqueId]) {
                                flattened[uniqueId] = { 
                                    account: formatKey(key), 
                                    type: typeLabel, 
                                    originalKey: fullKey,
                                    id: uniqueId
                                };
                             }
                             flattened[uniqueId][year] = value.amount;
                        }
                        
                        traverse(value, fullKey);
                    } else if (typeof value === 'number') {
                         if (!flattened[uniqueId]) {
                            flattened[uniqueId] = { 
                                account: formatKey(key), 
                                type: typeLabel, 
                                originalKey: fullKey,
                                id: uniqueId
                            };
                         }
                         flattened[uniqueId][year] = value;
                    }
                }
            };
            traverse(sectionData);
        };

        processSection("income_statement", data.income_statement, "Income Statement");
        processSection("balance_sheet", data.balance_sheet, "Balance Sheet");
        processSection("cash_flow_statement", data.cash_flow_statement, "Cash Flow");
    });

    return Object.values(flattened);
};

export default function DataPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayRows, setDisplayRows] = useState<any[]>([]);
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  // New Features State
  const [hideZeros, setHideZeros] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  
  // store selected uniqueIds
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  // store selected Types
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(["Income Statement", "Balance Sheet", "Cash Flow"]));
  
  // Available items for filter list (derived from loaded data)
  const [allItems, setAllItems] = useState<{id: string, name: string, type: string}[]>([]);

  useEffect(() => {
    const storedReports = localStorage.getItem("insight_viewer_reports");
    const storedTime = localStorage.getItem("insight_viewer_last_update");
    
    if (storedReports) {
        try {
            const reports = JSON.parse(storedReports);
            if (Array.isArray(reports) && reports.length > 0) {
                 const allYears = Array.from(new Set(reports.map((r: any) => r.fiscal_year))).sort().reverse();
                 setYears(allYears);

                 const flattened = flattenReports(reports);
                 setDisplayRows(flattened);

                 // Initialize selection to all items
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

  const toggleItemSelection = (id: string) => {
      const newSet = new Set(selectedItems);
      if (newSet.has(id)) {
          newSet.delete(id);
      } else {
          newSet.add(id);
      }
      setSelectedItems(newSet);
  };
  
  const toggleTypeSelection = (type: string) => {
      const newSet = new Set(selectedTypes);
      if (newSet.has(type)) {
          newSet.delete(type);
      } else {
          newSet.add(type);
      }
      setSelectedTypes(newSet);
  };

  const selectAll = () => {
      setSelectedItems(new Set(allItems.map(i => i.id)));
  };

  const deselectAll = () => {
      setSelectedItems(new Set());
  };

  // Filter Logic
  const filteredData = useMemo(() => {
      return displayRows.filter(row => {
          // 0. Type Selection Filter
          if (!selectedTypes.has(row.type)) return false;

          // 1. Search Filter
          const matchesSearch = 
            row.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.type.toLowerCase().includes(searchTerm.toLowerCase());
          
          if (!matchesSearch) return false;

          // 2. Hide Zeros Filter
          if (hideZeros) {
              const allZeros = years.every(year => !row[year] || row[year] === 0);
              if (allZeros) return false;
          }

          // 3. Item Selection Filter
          if (!selectedItems.has(row.id)) return false;

          return true;
      });
  }, [displayRows, searchTerm, hideZeros, selectedItems, selectedTypes, years]);


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
              <p className="text-gray-500 max-w-md">
                  It looks like you haven't fetched any financial reports yet.
              </p>
              <Link href="/upload" className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-900 transition-colors flex items-center">
                  Get Financial Data <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
          </div>
      );
  }

  return (
    <div className="space-y-6" onClick={() => { setShowFilterDropdown(false); setShowTypeDropdown(false); }}>
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Data View</h1>
            {lastUpdate && <p className="text-xs text-gray-500 mt-1">Last updated: {lastUpdate}</p>}
        </div>
        
        <div className="flex items-center space-x-3">
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
                            <div 
                                key={type} 
                                className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
                                onClick={() => toggleTypeSelection(type)}
                            >
                                <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${selectedTypes.has(type) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                    {selectedTypes.has(type) && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <div className="flex-1 truncate text-sm text-gray-700">
                                    {type}
                                </div>
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
                    Filter Items ({selectedItems.size})
                </button>
                
                {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[400px] flex flex-col">
                        <div className="p-3 border-b border-gray-100 flex justify-between bg-gray-50 rounded-t-lg">
                            <button onClick={selectAll} className="text-xs text-primary font-medium hover:underline">Select All</button>
                            <button onClick={deselectAll} className="text-xs text-red-500 font-medium hover:underline">Deselect All</button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-2 space-y-1">
                            {allItems.map(item => (
                                <div 
                                    key={item.id} 
                                    className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
                                    onClick={() => toggleItemSelection(item.id)}
                                >
                                    <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${selectedItems.has(item.id) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                                        {selectedItems.has(item.id) && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <div className="flex-1 truncate text-sm text-gray-700">
                                        {item.name}
                                        <span className="ml-2 text-xs text-gray-400">({item.type})</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Hide Zeros Toggle */}
            <button 
                onClick={() => setHideZeros(!hideZeros)}
                className={`flex items-center px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${hideZeros ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                title={hideZeros ? "Show Zero Rows" : "Hide Zero Rows"}
            >
                {hideZeros ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {hideZeros ? "Zeros Hidden" : "Hide Zeros"}
            </button>

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
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                  <th className="py-3 px-6 font-semibold w-[300px] min-w-[300px]">Line Item</th>
                  <th className="py-3 px-6 font-semibold w-[150px] min-w-[150px]">Type</th>
                  {years.map(year => (
                      <th key={year} className="py-3 px-6 font-semibold text-right whitespace-nowrap min-w-[120px]">{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-6 text-gray-900 font-medium truncate max-w-[300px]" title={row.account}>{row.account}</td>
                    <td className="py-3 px-6 text-gray-500 text-sm truncate max-w-[150px]">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{row.type}</span>
                    </td>
                    {years.map(year => (
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
