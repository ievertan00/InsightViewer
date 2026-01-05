"use client";

import { useState } from "react";
import { Flag, ArrowUpRight, ArrowDownRight, Filter, Info } from "lucide-react";
import clsx from "clsx";

// Mock Data
const metrics = [
  { category: "Profitability", name: "Gross Margin", value: "24.5%", trend: "up", change: "+1.2%" },
  { category: "Profitability", name: "Net Profit Margin", value: "8.2%", trend: "down", change: "-0.5%" },
  { category: "Leverage", name: "Debt-to-Equity", value: "0.85", trend: "stable", change: "0.0" },
  { category: "Liquidity", name: "Current Ratio", value: "1.4", trend: "up", change: "+0.1" },
  { category: "Efficiency", name: "Asset Turnover", value: "0.75", trend: "stable", change: "0.0" },
];

const signals = [
  { type: "red", title: "High Inventory Days", description: "Inventory days increased from 45 to 60 days.", impact: "High" },
  { type: "green", title: "Strong Cash Flow", description: "Operating cash flow exceeds net income by 20%.", impact: "Medium" },
  { type: "red", title: "Declining Margins", description: "Gross margin contracted for 2 consecutive quarters.", impact: "High" },
];

export default function SignalsPage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Compute & Signals</h1>
        <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm font-medium text-gray-700">
                <Filter className="w-4 h-4" />
                <span>Filter Period</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Metrics Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500">
                  <th className="pb-3 font-medium">Metric</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Value</th>
                  <th className="pb-3 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {metrics.map((metric) => (
                  <tr key={metric.name} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-gray-900 font-medium">{metric.name}</td>
                    <td className="py-4 text-gray-500 text-sm">{metric.category}</td>
                    <td className="py-4 text-gray-900">{metric.value}</td>
                    <td className="py-4">
                        <div className="flex items-center space-x-1">
                            {metric.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-500" />}
                            {metric.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                            <span className={clsx("text-sm", metric.trend === 'up' ? "text-green-600" : metric.trend === 'down' ? "text-red-600" : "text-gray-400")}>
                                {metric.change}
                            </span>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Signals */}
        <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Active Signals</h2>
            {signals.map((signal, idx) => (
                <div key={idx} className={clsx("p-4 rounded-xl border-l-4 shadow-sm bg-white", signal.type === 'red' ? "border-signal-red" : "border-signal-green")}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                             <Flag className={clsx("w-5 h-5", signal.type === 'red' ? "text-signal-red" : "text-signal-green")} />
                             <h3 className="font-semibold text-gray-900">{signal.title}</h3>
                        </div>
                        <Info className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{signal.description}</p>
                    <div className="mt-3 flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Impact:</span>
                        <span className={clsx("text-xs font-bold px-2 py-0.5 rounded", signal.impact === 'High' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700")}>
                            {signal.impact}
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
