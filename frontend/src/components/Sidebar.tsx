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
  Flag,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navigation = [
    { name: t('dataImport'), href: "/import", icon: Database },
    { name: t('dataExplorer'), href: "/explore", icon: FileText },
    { name: t('ratios'), href: "/ratios", icon: Calculator },
    { name: t('charts'), href: "/charts", icon: LayoutDashboard },
    { name: t('flags'), href: "/flags", icon: Flag },
    { name: t('aiInsights'), href: "/insights", icon: Zap },
    { name: t('reportGenerator'), href: "/reports", icon: Share2 },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform hidden md:block">
      <div className="flex h-16 items-center justify-center border-b border-gray-200 bg-primary text-white">
        <span className="text-xl font-bold">{t('insightViewer')}</span>
      </div>
      <div className="py-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
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
