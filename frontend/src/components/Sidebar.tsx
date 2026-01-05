"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  UploadCloud, 
  Table, 
  Flag, 
  BarChart3, 
  FileText, 
  Download, 
  Menu
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { name: "Upload", href: "/upload", icon: UploadCloud },
  { name: "Data View", href: "/data", icon: Table },
  { name: "Signals", href: "/signals", icon: Flag },
  { name: "Visualizations", href: "/visualize", icon: BarChart3 },
  { name: "Interpretation", href: "/interpret", icon: FileText },
  { name: "Export", href: "/export", icon: Download },
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
          {navItems.map((item) => {
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
