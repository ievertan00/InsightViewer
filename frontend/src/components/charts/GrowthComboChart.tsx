"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface GrowthComboChartProps {
  data: any[];
  barKey: string;
  lineKey: string;
  barColor: string;
  lineColor: string;
  barUnit?: string;
}

export default function GrowthComboChart({ 
  data, 
  barKey, 
  lineKey, 
  barColor, 
  lineColor, 
  barUnit = "" 
}: GrowthComboChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis 
            dataKey="year" 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
        />
        <YAxis 
            yAxisId="left"
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `${val.toFixed(0)}${barUnit}`}
        />
        <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `${val}%`}
        />
        <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number, name: string) => {
                if (name === lineKey) return [`${value.toFixed(2)}%`, name];
                return [`${value.toFixed(2)}${barUnit}`, name];
            }}
        />
        <Legend 
            verticalAlign="bottom" 
            height={36} 
            wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
        />
        <Bar yAxisId="left" dataKey={barKey} fill={barColor} barSize={40} radius={[4, 4, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey={lineKey} stroke={lineColor} strokeWidth={2} dot={{ r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
