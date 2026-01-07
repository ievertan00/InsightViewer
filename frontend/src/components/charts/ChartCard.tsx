"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  height?: number;
}

export default function ChartCard({ title, children, height = 400 }: ChartCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">{title}</h3>
      <div style={{ height: height, width: "100%" }}>
        {children}
      </div>
    </div>
  );
}
