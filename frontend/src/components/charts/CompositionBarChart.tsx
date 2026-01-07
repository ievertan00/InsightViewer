"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CompositionBarChartProps {
  data: any[];
  dataKeys: string[];
  colors: string[];
  stacked?: boolean;
  unit?: string;
}

export default function CompositionBarChart({ data, dataKeys, colors, stacked = true, unit = "%" }: CompositionBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
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
            tick={{ fill: '#6b7280', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `${val.toFixed(0)}${unit}`}
        />
        <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number, name: string) => [`${value.toFixed(2)}${unit}`, name]}
            cursor={{ fill: '#f3f4f6' }}
        />
        <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="rect"
            wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
        />
        {dataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId={stacked ? "a" : undefined}
            fill={colors[index % colors.length]}
            radius={stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
