"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  FileText,
  BarChart4,
  Zap,
  Share2,
  Database,
  Calculator,
} from "lucide-react";

const navigation = [
  { name: "Executive Summary", href: "/visualize", icon: LayoutDashboard },
  { name: "Statement View", href: "/data", icon: FileText },
  { name: "Key Financial Ratios", href: "/signals", icon: Calculator },
  { name: "AI Interpretation", href: "/interpret", icon: Zap },
  { name: "Smart Export", href: "/export", icon: Share2 },
  { name: "Data Management", href: "/upload", icon: Database },
];
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform hidden md:block">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 bg-primary text-white">
        <span className="text-xl font-bold">Insight Viewer</span>
      </div>
      <div className="py-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center p-3 text-base font-medium rounded-lg mx-2 transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-900 hover:bg-gray-100"
                  )}
                >
                  <Icon className="w-6 h-6 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
