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
    // Brand (Fixed)
    insightViewer: "Insight Viewer",

    // Common
    dashboard: "Dashboard",
    user: "User",
    settings: "Settings",
    loading: "Loading...",
    processing: "Processing...",
    error: "Error",
    warning: "Warning",
    success: "Success",
    clearCache: "Clear Cache",
    download: "Download",
    preview: "Preview",
    page: "Page",
    of: "of",
    periodsFound: "Periods Found",
    latestPeriod: "Latest Period",
    noData: "No Data",
    fetchData: "Fetch Data",
    search: "Search",
    annualOnly: "Annual Only",
    hideZeros: "Hide Zeros",
    sheet: "Sheet",
    items: "Items",
    selectAll: "Select All",
    deselectAll: "Deselect All",
    metric: "Metric",
    current: "Current",
    previous: "Previous",
    diff: "Diff",
    target: "Target",
    yoy: "YoY",
    sequential: "Sequential",
    vs: "vs",
    unitMillionCNY: "Unit: Million CNY",
    note: "Note",
    source: "Source",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    delete: "Delete",
    remove: "Remove",
    browseFiles: "Browse Files",
    copiedToClipboard: "Copied to clipboard",

    // Navigation
    dataImport: "Data Import",
    dataExplorer: "Data Explorer",
    ratios: "Ratios",
    charts: "Charts",
    flags: "Flags",
    aiInsights: "AI Insights",
    reportGenerator: "Report Generator",

    // Import Page
    importTitle: "Data Import",
    importDesc: "Search by Stock Symbol or upload Excel/JSON files.",
    howToImport: "How to Import Data Correctly",
    searchAShare: "Search A-Share",
    searchAShareDesc: "For Chinese A-Share companies only.",
    pasteJson: "Paste JSON",
    pasteJsonDesc: "For structured data from LLMs.",
    uploadExcel: "Upload Excel",
    uploadExcelDesc: "For custom financial models.",
    dragDropTitle: "Drag & Drop Reports",
    dragDropDesc: "Drag and drop your Excel or JSON files here",
    selectedFiles: "Selected Files",
    parsing: "Parsing...",
    startProcessing: "Start Processing",
    copyLlmPrompt: "Copy LLM Prompt Template",
    loadProcessJson: "Load & Process JSON",
    addToExisting: "Add to existing data",
    fetchError: "Failed to fetch stock data",
    parseError: "Invalid JSON format",
    uploadError: "Upload failed",
    importWarnings: "Import Warnings",

    // Explorer Page
    explorerTitle: "Financial Data Explorer",
    noDataFound: "No Data Found",
    getFinancialData: "Get Financial Data",
    lineItem: "Line Item",
    type: "Type",
    showingRecords: "Showing records",
    zerosHidden: "Zeros Hidden",

    // Ratios Page
    ratiosTitle: "Financial Ratios",
    ratiosDesc: "Advanced financial performance metrics and ratio analysis.",
    comparisonMode: "Comparison Mode",
    dupontIdentity: "DuPont Identity (ROE Decomposition)",
    roeFormula: "ROE = Net Margin × Asset Turnover × Fin. Leverage",
    returnOnEquity: "Return on Equity",
    ownerValueCreation: "Owner Value Creation",
    profitability: "Profitability",
    efficiency: "Efficiency",
    leverage: "Leverage",
    netMargin: "Net Margin",
    assetTurnover: "Asset Turnover",
    equityMultiplier: "Equity Multiplier",
    profitabilityMargins: "Profitability & Margins",
    returnOnInvestment: "Return on Investment",
    solvencyLiquidity: "Solvency & Liquidity",
    operatingEfficiency: "Operating Efficiency",
    cashFlowQuality: "Cash Flow Quality",
    growthIndicators: "Growth Indicators",
    analyzing: "Analyzing",
    standardizedAnalysis: "Standardized Financial Analysis",

    // Charts Page
    chartsTitle: "Financial Charts",
    chartsDesc: "Visual analysis of financial structure and performance.",
    profitabilityTrends: "Profitability Trends",
    liquidityCycle: "Liquidity & Cycle Analysis",
    efficiencyCost: "Efficiency & Cost Structure",
    cashFlowGrowth: "Cash Flow & Growth",
    structureAnalysis: "Structure Analysis",
    returnMetrics: "Return Metrics (%)",
    revenueVsCash: "Revenue vs Cash Collection",
    netProfitVsOCF: "Net Profit vs Operating Cash Flow",
    profitSources: "Profit Sources Breakdown",
    liquidityRatios: "Liquidity Ratios Trend",
    workingCapitalCycle: "Working Capital Cycle (Days)",
    debtToAsset: "Debt-to-Asset Ratio & Delta",
    turnoverRatios: "Turnover Ratios",
    costStructure: "Cost & Expense Structure (%)",
    cashFlowSummary: "Cash Flow Summary",
    ocfCapexFcf: "OCF vs Capex vs FCF Trend",
    revenueGrowth: "Revenue Growth",
    netProfitGrowth: "Net Profit Growth",
    assetStructure: "Asset Structure",
    liabilityStructure: "Liability Structure",
    equityStructure: "Equity Structure",

    // Flags Page
    flagsTitle: "Flag Checklist",
    flagsDesc: "Automated forensic checks based on financial data.",
    riskIndicators: "Risk Indicators",
    healthSignals: "Health Signals",
    additionalData: "Additional Data Required",
    noFlags: "No Significant Flags Detected",
    noFlagsDesc: "The automated analysis did not find any extreme outliers matching the standard risk or health criteria.",
    triggerCondition: "Trigger Condition",
    targetCriteria: "Target Criteria",
    logic: "Logic",
    risks: "Risks",
    health: "Health",
    check: "Check",

    // Insights Page
    aiInsightsTitle: "AI Insights",
    aiInsightsDesc: "AI-assisted analysis of key financial ratios and anomalies.",
    aiModel: "AI Model",
    dataContext: "Data Context",
    generateInsights: "Generate Insights",
    analyzingSpinner: "Analyzing...",
    synthesizing: "Synthesizing Financial Narrative...",
    connectingTo: "Connecting to model...",
    noAnalysis: "No Analysis Generated Yet",
    clickToGenerate: "Click \"Generate Insights\" to start the analysis.",
    downloadMD: "Download MD",
    modelGemini: "Google Gemini (Balanced)",
    modelDeepseek: "DeepSeek R1 (Forensic)",
    modelQwen: "Alibaba Qwen (CN Context)",

    // Report Page
    reportTitle: "Report Generator",
    exportSettings: "Export Settings",
    format: "Format",
    includeSections: "Include Sections",
    downloadPDF: "Download PDF",
    downloadMarkdown: "Download Markdown",
    companySummary: "Company Summary",
    financialMetrics: "Financial Metrics",
    chartsVisuals: "Charts & Visuals",
    signalAnalysis: "Signal Analysis",
    rawDataAppendix: "Raw Data Appendix",
  },
  zh: {
    // Brand (Fixed)
    insightViewer: "Insight Viewer",

    // Common
    dashboard: "仪表板",
    user: "用户",
    settings: "设置",
    loading: "加载中...",
    processing: "处理中...",
    error: "错误",
    warning: "警告",
    success: "成功",
    clearCache: "清除缓存",
    download: "下载",
    preview: "预览",
    page: "页",
    of: "/",
    periodsFound: "发现周期数",
    latestPeriod: "最新周期",
    noData: "暂无数据",
    fetchData: "获取数据",
    search: "搜索",
    annualOnly: "仅显示年报",
    hideZeros: "隐藏零值",
    sheet: "报表",
    items: "项目",
    selectAll: "全选",
    deselectAll: "取消全选",
    metric: "指标",
    current: "当前",
    previous: "上期",
    diff: "变动",
    target: "目标",
    yoy: "同比",
    sequential: "环比",
    vs: "vs",
    unitMillionCNY: "单位：百万元 (CNY)",
    note: "注意",
    source: "来源",
    cancel: "取消",
    confirm: "确认",
    save: "保存",
    delete: "删除",
    remove: "移除",
    browseFiles: "浏览文件",
    copiedToClipboard: "已复制到剪贴板",

    // Navigation
    dataImport: "数据导入",
    dataExplorer: "数据浏览",
    ratios: "财务比率",
    charts: "图表分析",
    flags: "风险标记",
    aiInsights: "AI 洞察",
    reportGenerator: "报告生成",

    // Import Page
    importTitle: "数据导入",
    importDesc: "通过股票代码搜索或上传 Excel/JSON 文件。",
    howToImport: "如何正确导入数据",
    searchAShare: "搜索 A 股",
    searchAShareDesc: "仅限中国 A 股公司。",
    pasteJson: "粘贴 JSON",
    pasteJsonDesc: "用于 LLM 生成的结构化数据。",
    uploadExcel: "上传 Excel",
    uploadExcelDesc: "用于自定义财务模型。",
    dragDropTitle: "拖拽上传报表",
    dragDropDesc: "将 Excel 或 JSON 文件拖拽到此处",
    selectedFiles: "已选文件",
    parsing: "解析中...",
    startProcessing: "开始处理",
    copyLlmPrompt: "复制 LLM 提示词模板",
    loadProcessJson: "加载并处理 JSON",
    addToExisting: "添加到现有数据",
    fetchError: "获取股票数据失败",
    parseError: "JSON 格式无效",
    uploadError: "上传失败",
    importWarnings: "导入警告",

    // Explorer Page
    explorerTitle: "财务数据浏览",
    noDataFound: "未找到数据",
    getFinancialData: "获取财务数据",
    lineItem: "报表项目",
    type: "类型",
    showingRecords: "显示记录",
    zerosHidden: "已隐藏零值",

    // Ratios Page
    ratiosTitle: "财务比率",
    ratiosDesc: "高级财务绩效指标与比率分析。",
    comparisonMode: "比较模式",
    dupontIdentity: "杜邦分析 (ROE 分解)",
    roeFormula: "ROE = 净利率 × 资产周转率 × 权益乘数",
    returnOnEquity: "净资产收益率 (ROE)",
    ownerValueCreation: "股东价值创造",
    profitability: "盈利能力",
    efficiency: "营运效率",
    leverage: "杠杆水平",
    netMargin: "销售净利率",
    assetTurnover: "总资产周转率",
    equityMultiplier: "权益乘数",
    profitabilityMargins: "盈利能力与利润率",
    returnOnInvestment: "投资回报率",
    solvencyLiquidity: "偿债能力与流动性",
    operatingEfficiency: "营运效率",
    cashFlowQuality: "现金流质量",
    growthIndicators: "成长性指标",
    analyzing: "分析中",
    standardizedAnalysis: "标准化财务分析",

    // Charts Page
    chartsTitle: "财务图表",
    chartsDesc: "财务结构与绩效的可视化分析。",
    profitabilityTrends: "盈利趋势",
    liquidityCycle: "流动性与周期分析",
    efficiencyCost: "效率与成本结构",
    cashFlowGrowth: "现金流与增长",
    structureAnalysis: "结构分析",
    returnMetrics: "回报指标 (%)",
    revenueVsCash: "营收 vs 收现",
    netProfitVsOCF: "净利润 vs 经营现金流",
    profitSources: "利润来源构成",
    liquidityRatios: "流动性比率趋势",
    workingCapitalCycle: "营运资金周期 (天)",
    debtToAsset: "资产负债率及变动",
    turnoverRatios: "周转率指标",
    costStructure: "成本费用结构 (%)",
    cashFlowSummary: "现金流摘要",
    ocfCapexFcf: "经营现金流/资本支出/自由现金流",
    revenueGrowth: "营收增长",
    netProfitGrowth: "净利润增长",
    assetStructure: "资产结构",
    liabilityStructure: "负债结构",
    equityStructure: "权益结构",

    // Flags Page
    flagsTitle: "风险清单",
    flagsDesc: "基于财务数据的自动化取证检查。",
    riskIndicators: "风险指标",
    healthSignals: "健康信号",
    additionalData: "需补充数据",
    noFlags: "未检测到重大标记",
    noFlagsDesc: "自动化分析未发现符合标准风险或健康标准的极端异常值。",
    triggerCondition: "触发条件",
    targetCriteria: "目标标准",
    logic: "逻辑",
    risks: "风险",
    health: "健康",
    check: "检查",

    // Insights Page
    aiInsightsTitle: "AI 洞察",
    aiInsightsDesc: "关键财务比率与异常的 AI 辅助分析。",
    aiModel: "AI 模型",
    dataContext: "数据上下文",
    generateInsights: "生成洞察",
    analyzingSpinner: "分析中...",
    synthesizing: "正在合成财务叙事...",
    connectingTo: "正在连接模型...",
    noAnalysis: "尚未生成分析",
    clickToGenerate: "点击“生成洞察”开始分析。",
    downloadMD: "下载 Markdown",
    modelGemini: "Google Gemini (均衡)",
    modelDeepseek: "DeepSeek R1 (深度取证)",
    modelQwen: "Alibaba Qwen (中文语境)",

    // Report Page
    reportTitle: "报告生成器",
    exportSettings: "导出设置",
    format: "格式",
    includeSections: "包含章节",
    downloadPDF: "下载 PDF",
    downloadMarkdown: "下载 Markdown",
    companySummary: "公司摘要",
    financialMetrics: "财务指标",
    chartsVisuals: "图表与可视化",
    signalAnalysis: "信号分析",
    rawDataAppendix: "原始数据附录",
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