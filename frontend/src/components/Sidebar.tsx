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
    { name: t("dataImport"), href: "/import", icon: Database },
    { name: t("dataExplorer"), href: "/explore", icon: FileText },
    { name: t("ratios"), href: "/ratios", icon: Calculator },
    { name: t("charts"), href: "/charts", icon: LayoutDashboard },
    { name: t("flags"), href: "/flags", icon: Flag },
    { name: t("aiInsights"), href: "/insights", icon: Zap },
    { name: t("reportGenerator"), href: "/export", icon: Share2 },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 glass border-r-0 hidden md:block">
      <div className="flex h-16 items-center justify-center border-b border-gray-200/30 bg-primary/5">
        <span className="text-xl font-serif font-bold text-primary tracking-tight">
          {t("insightViewer")}
        </span>
      </div>
      <div className="py-6 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-gray-600 hover:bg-white/50 hover:text-primary"
                  )}
                >
                  <Icon
                    className={clsx(
                      "w-5 h-5 mr-3",
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-primary"
                    )}
                  />
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
