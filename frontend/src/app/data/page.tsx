"use client";

import { useState, useEffect } from "react";
import { Search, Database, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FinancialDataPoint } from "@/lib/types";

export default function DataPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<FinancialDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("insight_viewer_data");
    const storedTime = localStorage.getItem("insight_viewer_last_update");
    
    if (storedData) {
        try {
            const parsed = JSON.parse(storedData);
            setData(parsed);
        } catch (e) {
            console.error("Failed to parse stored data", e);
        }
    }
    
    if (storedTime) {
        setLastUpdate(new Date(storedTime).toLocaleString());
    }

    setLoading(false);
  }, []);

  const filteredData = data.filter(row => 
    row.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group by Account and Type to show years as columns
  // This is a simplified transformation for display
  const groupedData: Record<string, any> = {};
  
  // Find all unique years
  const years = Array.from(new Set(data.map(d => d.year))).sort().reverse();

  filteredData.forEach(item => {
      const key = `${item.type}-${item.account}`;
      if (!groupedData[key]) {
          groupedData[key] = {
              account: item.account,
              type: item.type,
          };
      }
      groupedData[key][item.year] = item.value;
  });

  const displayRows = Object.values(groupedData);

  if (loading) {
      return <div className="p-8 text-center text-gray-500">Loading data...</div>;
  }

  if (data.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
              <div className="p-4 bg-gray-100 rounded-full">
                  <Database className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">No Data Found</h2>
              <p className="text-gray-500 max-w-md">
                  It looks like you haven't uploaded any financial reports yet. Please upload a file to view the data.
              </p>
              <Link href="/upload" className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-900 transition-colors flex items-center">
                  Go to Upload <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Data View</h1>
            {lastUpdate && <p className="text-xs text-gray-500 mt-1">Last updated: {lastUpdate}</p>}
        </div>
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                  <th className="py-3 px-6 font-semibold w-1/3">Line Item</th>
                  <th className="py-3 px-6 font-semibold">Type</th>
                  {years.map(year => (
                      <th key={year} className="py-3 px-6 font-semibold text-right">{year}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-6 text-gray-900 font-medium">{row.account}</td>
                    <td className="py-3 px-6 text-gray-500 text-sm">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">{row.type}</span>
                    </td>
                    {years.map(year => (
                        <td key={year} className="py-3 px-6 text-right text-gray-900 font-mono">
                            {row[year] ? row[year].toLocaleString() : '-'}
                        </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between">
            <span>Showing {displayRows.length} records</span>
            <span>Source: Browser Storage</span>
        </div>
      </div>
    </div>
  );
}