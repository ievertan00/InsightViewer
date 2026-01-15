"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrendLineChartProps {
  data: any[];
  dataKeys: string[];
  colors: string[];
  unit?: string;
}

export default function TrendLineChart({ data, dataKeys, colors, unit = "" }: TrendLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <XAxis 
            dataKey="year" 
            tick={{ fill: '#64748B', fontSize: 12 }} 
            axisLine={{ stroke: '#E2E8F0' }}
            tickLine={false}
        />
        <YAxis 
            tick={{ fill: '#64748B', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) => `${val.toFixed(0)}${unit}`}
        />
        <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number, name: string) => [`${value.toFixed(2)}${unit}`, name]}
        />
        <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="line"
            wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
        />
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4, fill: colors[index % colors.length], strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
