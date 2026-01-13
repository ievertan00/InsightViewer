"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'zh';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    dashboard: "Dashboard",
    dataImport: "Data Import",
    dataExplorer: "Data Explorer",
    ratios: "Ratios",
    charts: "Charts",
    flags: "Flags",
    aiInsights: "AI Insights",
    reportGenerator: "Report Generator",
    insightViewer: "Insight Viewer",
    user: "User",
  },
  zh: {
    dashboard: "仪表板",
    dataImport: "数据导入",
    dataExplorer: "数据浏览",
    ratios: "财务比率",
    charts: "图表分析",
    flags: "风险标记",
    aiInsights: "AI 洞察",
    reportGenerator: "报告生成",
    insightViewer: "洞察查看器",
    user: "用户",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from local storage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('insight_viewer_language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'zh')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('insight_viewer_language', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
