"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  ShieldAlert, 
  HeartPulse, 
  Loader2, 
  AlertCircle,
  FileCode,
  Download
} from "lucide-react";
import clsx from "clsx";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { extractAnalysisContext, generateReport } from "@/lib/reportService";
import { GeneratedReport, ReportRequest } from "@/lib/types";

export default function InterpretPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  
  const [options, setOptions] = useState<ReportRequest>({
    report_profile: "executive_summary",
    model_provider: "gemini",
    include_reasoning: true
  });

  useEffect(() => {
    const savedReports = localStorage.getItem("insight_viewer_reports");
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (e) {
        console.error("Failed to parse saved reports", e);
      }
    }

    // Load cached AI report
    const cachedReport = localStorage.getItem("insight_viewer_cached_ai_report");
    if (cachedReport) {
      try {
        setGeneratedReport(JSON.parse(cachedReport));
      } catch (e) {
        console.error("Failed to parse cached AI report", e);
      }
    }
  }, []);

  const handleGenerate = async () => {
    if (reports.length === 0) {
      setError("No financial data found. Please import data first.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const context = extractAnalysisContext(reports);
      const result = await generateReport(context, options);
      setGeneratedReport(result);
      // Save to localStorage
      localStorage.setItem("insight_viewer_cached_ai_report", JSON.stringify(result));
    } catch (err: any) {
      setError(err.message || "An error occurred during report generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearCache = () => {
    setGeneratedReport(null);
    localStorage.removeItem("insight_viewer_cached_ai_report");
  };

  const downloadMarkdown = () => {
    if (!generatedReport) return;
    const blob = new Blob([generatedReport.full_markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedReport.title.replace(/\s+/g, '_')}_Report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
           <p className="text-gray-500 mt-1">AI-assisted analysis of key financial ratios and anomalies.</p>
        </div>
        <div className="flex items-center space-x-3">
             {generatedReport && (
                <>
                  <button 
                      onClick={clearCache}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors mr-2"
                  >
                      Clear Cache
                  </button>
                  <button 
                      onClick={downloadMarkdown}
                      className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                  >
                      <Download className="w-5 h-5 mr-2" />
                      Download MD
                  </button>
                </>
            )}
            <button 
                onClick={handleGenerate}
                disabled={isGenerating || reports.length === 0}
                className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-900 transition-colors shadow-lg disabled:bg-gray-400"
            >
                {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                {isGenerating ? "Analyzing..." : "Generate Insights"}
            </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Controls */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6 sticky top-6">
                
                {/* Profile Selector */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Analysis Profile</label>
                    <div className="space-y-3">
                        {[
                            { id: "executive_summary", name: "Executive Summary", icon: Sparkles, desc: "High-level strategic overview" },
                            { id: "forensic_deep_dive", name: "Forensic Deep Dive", icon: ShieldAlert, desc: "Accounting anomalies & risks" },
                            { id: "health_check", name: "Health Check", icon: HeartPulse, desc: "Balanced educational overview" },
                        ].map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setOptions({...options, report_profile: p.id as any})}
                                className={clsx(
                                    "w-full text-left p-3 rounded-xl border-2 transition-all flex items-start space-x-3",
                                    options.report_profile === p.id ? "border-primary bg-blue-50/50 ring-1 ring-primary/20" : "border-gray-100 hover:border-gray-200"
                                )}
                            >
                                <div className={clsx(
                                    "p-2 rounded-lg",
                                    options.report_profile === p.id ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                                )}>
                                    <p.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className={clsx("font-bold text-sm", options.report_profile === p.id ? "text-primary" : "text-gray-700")}>{p.name}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{p.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Model Selector */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">AI Model</label>
                    <select 
                        value={options.model_provider}
                        onChange={(e) => setOptions({...options, model_provider: e.target.value as any})}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    >
                        <option value="gemini">Google Gemini (Balanced)</option>
                        <option value="deepseek">DeepSeek R1 (Forensic)</option>
                        <option value="qwen">Alibaba Qwen (CN Context)</option>
                    </select>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Data Context</h4>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>Periods Found:</span>
                            <span className="font-bold">{reports.length}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>Latest Period:</span>
                            <span className="font-bold">{reports[0]?.fiscal_year || "N/A"}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-h-[600px] bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between rounded-t-xl">
                <span className="text-sm font-medium text-gray-500 flex items-center">
                    {generatedReport ? generatedReport.title : "Report Preview Area"}
                </span>
                {generatedReport && (
                    <span className="text-xs font-mono text-gray-400">
                        Generated via {generatedReport.model_used.toUpperCase()}
                    </span>
                )}
            </div>
            
            <div className="flex-1 p-8 lg:p-12">
                {isGenerating ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <div>
                            <p className="text-lg font-bold text-gray-800">Synthesizing Financial Narrative...</p>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto">Connecting to {options.model_provider.toUpperCase()} to evaluate flags and compute trends.</p>
                        </div>
                    </div>
                ) : generatedReport ? (
                    <div className="prose prose-blue max-w-none prose-headings:text-primary prose-a:text-primary prose-strong:text-gray-900 prose-table:border prose-table:border-gray-200 prose-th:bg-gray-50 prose-th:p-2 prose-td:p-2">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {generatedReport.full_markdown}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4 border-2 border-dashed border-gray-100 rounded-xl py-20">
                        <FileCode className="w-16 h-16 opacity-20" />
                        <div>
                            <p className="text-lg font-medium">No Analysis Generated Yet</p>
                            <p className="text-sm">Select a profile on the left and click "Generate Insights".</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}