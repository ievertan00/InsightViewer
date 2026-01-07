"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from "recharts";

const data = [
  { year: "2019", revenue: 4000, profit: 2400, cashFlow: 2400 },
  { year: "2020", revenue: 3000, profit: 1398, cashFlow: 2210 },
  { year: "2021", revenue: 2000, profit: 9800, cashFlow: 2290 },
  { year: "2022", revenue: 2780, profit: 3908, cashFlow: 2000 },
  { year: "2023", revenue: 1890, profit: 4800, cashFlow: 2181 },
  { year: "2024", revenue: 2390, profit: 3800, cashFlow: 2500 },
];

export default function VisualizePage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financial Charts</h1>
        <div className="bg-white border border-gray-200 rounded-lg p-1 flex space-x-1">
            <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded font-medium text-sm">Annual</button>
            <button className="px-3 py-1 text-gray-500 hover:bg-gray-50 rounded font-medium text-sm transition-colors">Quarterly</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Chart 1: Revenue & Profit */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Revenue vs Net Profit</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" vertical={false} />
                <XAxis dataKey="year" scale="band" />
                <YAxis />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="revenue" barSize={40} fill="#1e3a8a" name="Revenue" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="profit" stroke="#E53E3E" strokeWidth={3} name="Net Profit" dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Cash Flow Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Operating Cash Flow</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid stroke="#f5f5f5" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="cashFlow" stroke="#38A169" strokeWidth={3} name="Op. Cash Flow" dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
