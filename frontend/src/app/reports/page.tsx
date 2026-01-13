"use client";

import { useState } from "react";
import { FileText, FileCode, Download, Eye } from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/lib/LanguageContext";

export default function ExportPage() {
  const { t } = useLanguage();
  const [format, setFormat] = useState<"pdf" | "markdown">("pdf");

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('reportTitle')}</h1>
        <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors shadow-sm">
            <Download className="w-5 h-5 mr-2" />
            {t('download')} {format.toUpperCase()}
        </button>
      </div>

      <div className="flex flex-1 space-x-8 overflow-hidden">
        {/* Settings Panel */}
        <div className="w-80 flex-shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('exportSettings')}</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('format')}</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setFormat("pdf")}
                                className={clsx(
                                    "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all",
                                    format === "pdf" ? "border-primary bg-blue-50 text-primary" : "border-gray-200 hover:border-gray-300 text-gray-600"
                                )}
                            >
                                <FileText className="w-6 h-6 mb-1" />
                                <span className="text-sm font-medium">PDF</span>
                            </button>
                            <button
                                onClick={() => setFormat("markdown")}
                                className={clsx(
                                    "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all",
                                    format === "markdown" ? "border-primary bg-blue-50 text-primary" : "border-gray-200 hover:border-gray-300 text-gray-600"
                                )}
                            >
                                <FileCode className="w-6 h-6 mb-1" />
                                <span className="text-sm font-medium">Markdown</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('includeSections')}</label>
                        <div className="space-y-2">
                            {[
                                "companySummary",
                                "financialMetrics",
                                "chartsVisuals",
                                "signalAnalysis",
                                "rawDataAppendix"
                            ].map((sectionKey) => (
                                <label key={sectionKey} className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary h-4 w-4 border-gray-300" />
                                    <span className="text-sm text-gray-700">{t(sectionKey)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    {t('preview')}: {format === 'pdf' ? 'Report_2024.pdf' : 'Report_2024.md'}
                </span>
                <span className="text-xs text-gray-400">{t('page')} 1 {t('of')} 5</span>
            </div>
            <div className="flex-1 overflow-auto p-8 bg-gray-500/10 flex justify-center">
                <div className={clsx(
                    "bg-white shadow-lg transition-all",
                    format === 'pdf' ? "w-[210mm] min-h-[297mm] p-[20mm]" : "w-full max-w-3xl min-h-[500px] p-12 font-mono text-sm"
                )}>
                    {format === 'pdf' ? (
                        // Mock PDF Content
                        <div className="space-y-6 text-gray-800">
                             <div className="border-b-2 border-primary pb-4 mb-8">
                                <h1 className="text-3xl font-bold text-primary">{t('mockReportTitle')}</h1>
                                <p className="text-gray-500 mt-2">{t('generatedOn')} Jan 05, 2026</p>
                             </div>
                             
                             <div>
                                <h2 className="text-xl font-bold mb-2">1. {t('executiveSummary')}</h2>
                                <p className="text-sm leading-relaxed text-gray-600">
                                    {t('mockExecSummaryText')}
                                </p>
                             </div>

                             <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="p-4 bg-gray-50 rounded">
                                    <p className="text-xs text-gray-500 uppercase">{t('grossMarginDesc')}</p>
                                    <p className="text-xl font-bold">24.5%</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded">
                                    <p className="text-xs text-gray-500 uppercase">{t('netProfitMarginDesc')}</p>
                                    <p className="text-xl font-bold">8.2%</p>
                                </div>
                             </div>

                             <div className="mt-8 p-4 border-l-4 border-red-500 bg-red-50">
                                 <h3 className="font-bold text-red-700 mb-1">{t('risks')}: {t('High-Cash, High-Debt')}</h3>
                                 <p className="text-sm text-red-600">
                                     {t('mockSignalTriggered')}
                                 </p>
                             </div>
                        </div>
                    ) : (
                        // Mock Markdown Content
                        <div className="text-gray-800 whitespace-pre-wrap">
{`# ${t('mockReportTitle')}
${t('generatedOn')}: 2026-01-05

## 1. ${t('executiveSummary')}
${t('mockExecSummaryText')}

## 2. ${t('financialMetrics')}
| ${t('metric')} | ${t('current')} |
|--------|-------|
| ${t('grossMarginDesc')} | 24.5% |
| ${t('netProfitMarginDesc')} | 8.2% |

## 3. ${t('flagsTitle')}
### 🚩 ${t('High-Cash, High-Debt')}
${t('mockSignalTriggered')}
`}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
