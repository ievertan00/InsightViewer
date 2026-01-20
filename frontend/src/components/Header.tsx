"use client";

import { useState, useEffect } from "react";
import { User, Settings, Bell, Menu, Landmark } from "lucide-react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";
import { useSidebar } from "@/lib/SidebarContext";

export default function Header() {
  const [companyName, setCompanyName] = useState<string | null>(null);
  const pathname = usePathname();
  const { t } = useLanguage();
  const { toggle } = useSidebar();

  useEffect(() => {
    // Check for company name in localStorage periodically or on mount
    const name = localStorage.getItem("insight_viewer_company_name");
    if (name) setCompanyName(name);

    // Optional: Listen for storage changes if multiple tabs are used
    const handleStorage = () => {
      setCompanyName(localStorage.getItem("insight_viewer_company_name"));
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("companyNameUpdate", handleStorage); // Listen for local updates

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("companyNameUpdate", handleStorage);
    };
  }, []);

  return (
    <header className="flex items-center justify-between h-16 px-6 glass sticky top-0 z-30 md:ml-64 border-b-0">
      <div className="flex items-center">
        <button
          className="mr-4 md:hidden text-gray-500"
          aria-label="Menu"
          onClick={toggle}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center space-x-2">
          {companyName && pathname !== "/import" ? (
            <div className="flex items-center bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <Landmark className="w-4 h-4 text-primary mr-2" />
              <span className="text-sm font-semibold text-primary">
                {companyName}
              </span>
            </div>
          ) : (
            <h2 className="text-lg font-serif font-medium text-foreground">
              {t("dashboard")}
            </h2>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />
        <button className="p-2 text-gray-500 hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-primary transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-2 pl-4 border-l border-gray-200/50">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm">
            U
          </div>
          <span className="text-sm font-medium text-gray-700">{t("user")}</span>
        </div>
      </div>
    </header>
  );
}
