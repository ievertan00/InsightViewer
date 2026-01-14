"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Download, 
  Check, 
  FileJson, 
  Settings 
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { GeneratedReport } from "@/lib/types";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ExportPage() {
  const { t } = useLanguage();
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<"markdown" | "pdf">("markdown");

  useEffect(() => {
    // Load cached AI report
    const cachedReport = localStorage.getItem("insight_viewer_cached_ai_report");
    if (cachedReport) {
      try {
        setReport(JSON.parse(cachedReport));
      } catch (e) {
        console.error("Failed to parse cached AI report", e);
      }
    }
  }, []);

  const handleDownload = () => {
    if (!report) return;

    if (selectedFormat === "markdown") {
        const blob = new Blob([report.full_markdown], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${report.title.replace(/\s+/g, '_')}_Report.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else {
        // PDF placeholder
        alert("PDF generation coming soon! Please use 'Print to PDF' from the browser for now.");
        window.print();
    }
  };

  if (!report) {
      return (
          <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
              <FileText className="w-16 h-16 text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-700">{t('noAnalysis')}</h2>
              <p className="text-gray-500 mt-2">{t('clickToGenerate')} ({t('aiInsights')})</p>
          </div>
      )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('reportGenerator')}</h1>
          <p className="text-gray-500 mt-1">{t('exportSettings')}</p>
        </div>
        
        <button
            onClick={handleDownload}
            className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors shadow-lg"
        >
            <Download className="w-5 h-5 mr-2" />
            {selectedFormat === "markdown" ? t('downloadMarkdown') : t('downloadPDF')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 flex items-center mb-4">
                      <Settings className="w-5 h-5 mr-2 text-gray-500" />
                      {t('exportSettings')}
                  </h3>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t('format')}</label>
                          <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() => setSelectedFormat("markdown")}
                                className={`flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                                    selectedFormat === "markdown" 
                                    ? "bg-blue-50 border-blue-200 text-primary" 
                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                              >
                                  <FileText className="w-4 h-4 mr-2" />
                                  Markdown
                              </button>
                              <button
                                onClick={() => setSelectedFormat("pdf")}
                                className={`flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                                    selectedFormat === "pdf" 
                                    ? "bg-blue-50 border-blue-200 text-primary" 
                                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                              >
                                  <FileJson className="w-4 h-4 mr-2" />
                                  PDF
                              </button>
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{t('includeSections')}</label>
                          <div className="space-y-2">
                              {[
                                  "executiveSummary",
                                  "financialMetrics",
                                  "signalAnalysis",
                                  "chartsVisuals",
                                  "rawDataAppendix"
                              ].map((section) => (
                                  <label key={section} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                                      <div className="flex items-center justify-center w-5 h-5 border-2 border-primary bg-primary rounded text-white">
                                          <Check className="w-3 h-3" />
                                      </div>
                                      <span className="text-sm text-gray-700">{t(section as any) || section}</span>
                                  </label>
                              ))}
                          </div>
                          <p className="text-xs text-gray-400 mt-2 italic">
                              * {t('preview')} only. Full content export logic to be implemented.
                          </p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[600px] flex flex-col">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center rounded-t-xl">
                      <span className="font-medium text-gray-500">{t('preview')}</span>
                      <span className="text-xs text-gray-400">{report.title}</span>
                  </div>
                  <div className="p-8 lg:p-12 prose prose-blue max-w-none prose-headings:text-primary">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {report.full_markdown}
                        </ReactMarkdown>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
