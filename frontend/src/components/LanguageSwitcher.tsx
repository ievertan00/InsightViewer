"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 text-gray-500 hover:text-primary transition-colors flex items-center space-x-1"
      aria-label="Toggle Language"
      title={language === 'en' ? "Switch to Chinese" : "Switch to English"}
    >
      <Globe className="w-5 h-5" />
      <span className="text-sm font-medium">{language.toUpperCase()}</span>
    </button>
  );
}
