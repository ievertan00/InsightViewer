"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  File as FileIcon,
  CheckCircle,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import clsx from "clsx";
import { useLanguage } from "@/lib/LanguageContext";
import { API_BASE_URL } from "@/lib/config";

export default function UploadPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Split loading states
  const [isFetchingStock, setIsFetchingStock] = useState(false);
  const [isProcessingPaste, setIsProcessingPaste] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [stockSymbol, setStockSymbol] = useState("");
  const [startYear, setStartYear] = useState("2020");
  const [endYear, setEndYear] = useState(new Date().getFullYear().toString());
  const [jsonContent, setJsonContent] = useState("");
  const [isAppendMode, setIsAppendMode] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError(null);
    setWarningMessage(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter(
        (f) =>
          f.name.endsWith(".xlsx") ||
          f.name.endsWith(".xls") ||
          f.name.endsWith(".csv") ||
          f.name.endsWith(".json")
      );

      if (validFiles.length !== droppedFiles.length) {
        setUploadError(t("fileTypeRestricted"));
        return;
      }

      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setWarningMessage(null);
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter(
        (f) =>
          f.name.endsWith(".xlsx") ||
          f.name.endsWith(".xls") ||
          f.name.endsWith(".csv") ||
          f.name.endsWith(".json")
      );

      if (validFiles.length !== selectedFiles.length) {
        setUploadError(t("fileTypeRestricted"));
        return;
      }

      setFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const fetchStockData = async () => {
    if (!stockSymbol) return;

    // Validation: 6-digit number
    if (!/^\d{6}$/.test(stockSymbol)) {
      setSearchError(t("stockCodeInvalid"));
      return;
    }

    setIsFetchingStock(true);
    setSearchError(null);
    setWarningMessage(null);
    setProgress(30);

    try {
      const symbol = stockSymbol.startsWith("6")
        ? `${stockSymbol}.SH`
        : `${stockSymbol}.SZ`;

      let url = `${API_BASE_URL}/stock/${symbol}`;
      const params = new URLSearchParams();
      if (startYear) params.append("start_date", `${startYear}0101`);
      if (endYear) params.append("end_date", `${endYear}1231`);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || t("fetchError"));
      }

      const data = await response.json();
      setProgress(100);

      if (data.company_meta?.name) {
        localStorage.setItem(
          "insight_viewer_company_name",
          data.company_meta.name
        );
        window.dispatchEvent(new Event("companyNameUpdate"));
      }

      if (data.reports && data.reports.length > 0) {
        localStorage.setItem(
          "insight_viewer_reports",
          JSON.stringify(data.reports)
        );
        localStorage.setItem(
          "insight_viewer_last_update",
          new Date().toISOString()
        );
        setIsFetchingStock(false);
      } else {
        setSearchError(t("noData"));
        setIsFetchingStock(false);
      }
    } catch (err: any) {
      console.error(err);
      setSearchError(err.message || t("fetchGenericError"));
      setIsFetchingStock(false);
    }
  };

  const handleJsonPaste = async () => {
    if (!jsonContent.trim()) return;

    try {
      JSON.parse(jsonContent);
    } catch (e) {
      setPasteError(t("parseError"));
      return;
    }

    setIsProcessingPaste(true);
    setPasteError(null);
    setWarningMessage(null);
    setProgress(20);

    try {
      const blob = new Blob([jsonContent], { type: "application/json" });
      const formData = new FormData();
      formData.append("file", blob, "pasted_data.json");

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || t("processJsonError"));
      }

      const reportData = await response.json();

      const existingName = localStorage.getItem("insight_viewer_company_name");
      const newName = reportData.company_meta?.name;

      if (
        isAppendMode &&
        existingName &&
        newName &&
        existingName !== newName &&
        newName !== "Unknown"
      ) {
        setPasteError(
          t("companyNameMismatch")
            .replace("{existing}", existingName)
            .replace("{new}", newName)
        );
        setIsProcessingPaste(false);
        return;
      }

      if (
        newName &&
        newName !== "Unknown" &&
        (!isAppendMode || !existingName)
      ) {
        localStorage.setItem("insight_viewer_company_name", newName);
        window.dispatchEvent(new Event("companyNameUpdate"));
      }

      if (reportData.reports) {
        let finalReports = reportData.reports;
        if (isAppendMode) {
          const existingReportsStr = localStorage.getItem(
            "insight_viewer_reports"
          );
          if (existingReportsStr) {
            try {
              const existingReports = JSON.parse(existingReportsStr);
              if (Array.isArray(existingReports)) {
                // Use backend API to properly merge reports
                const existingReportData = {
                  company_meta: {
                    name:
                      localStorage.getItem("insight_viewer_company_name") ||
                      "Unknown",
                    stock_code: null,
                    currency: "CNY",
                  },
                  reports: existingReports,
                  parsing_warnings: [],
                };

                const mergeFormData = new FormData();
                mergeFormData.append(
                  "existing_reports_json",
                  JSON.stringify(existingReportData)
                );
                mergeFormData.append(
                  "new_reports_json",
                  JSON.stringify(reportData)
                );

                const mergeResponse = await fetch(
                  `${API_BASE_URL}/merge-reports`,
                  {
                    method: "POST",
                    body: mergeFormData,
                  }
                );

                if (!mergeResponse.ok) {
                  const errorData = await mergeResponse.json();
                  throw new Error(
                    errorData.detail || "Failed to merge reports"
                  );
                }

                const mergedData = await mergeResponse.json();
                finalReports = mergedData.reports;
              }
            } catch (e) {
              console.error(
                "Failed to merge reports via API, falling back to client-side merge:",
                e
              );
              const existingReports = JSON.parse(existingReportsStr);
              if (Array.isArray(existingReports)) {
                finalReports = mergeReportsByFiscalYear(
                  existingReports,
                  reportData.reports
                );
              }
            }
          }
        }

        finalReports.sort((a: any, b: any) => {
          const yearA = parseInt(a.fiscal_year.split(" ")[0]);
          const yearB = parseInt(b.fiscal_year.split(" ")[0]);
          return yearB - yearA;
        });

        localStorage.setItem(
          "insight_viewer_reports",
          JSON.stringify(finalReports)
        );
        localStorage.setItem(
          "insight_viewer_last_update",
          new Date().toISOString()
        );

        // Show warnings if any
        if (
          reportData.parsing_warnings &&
          reportData.parsing_warnings.length > 0
        ) {
          setWarningMessage(
            `${t("importWarnings")}:\n\n${reportData.parsing_warnings.join(
              "\n"
            )}`
          );
        }

        setProgress(100);
        setJsonContent(""); // Clear input
        setIsProcessingPaste(false);
      } else {
        setPasteError(t("noReportDataInJson"));
        setIsProcessingPaste(false);
      }
    } catch (e: any) {
      console.error(e);
      setPasteError(e.message || t("parseError"));
      setIsProcessingPaste(false);
    }
  };

  const copyLlmPrompt = () => {
    const prompt = t("llmPromptTemplate");
    navigator.clipboard.writeText(prompt);
    setShowCopiedMessage(true);
    setTimeout(() => setShowCopiedMessage(false), 3000); // Hide after 3 seconds
  };

  const copyWarningMessage = () => {
    if (warningMessage) {
      navigator.clipboard.writeText(warningMessage);
      setShowCopiedMessage(true);
      setTimeout(() => setShowCopiedMessage(false), 3000);
    }
  };

  // Helper function to merge reports by fiscal year, combining different report types
  const mergeReportsByFiscalYear = (
    existingReports: any[],
    newReports: any[]
  ) => {
    // Create a map of existing reports by fiscal year
    const reportMap: { [key: string]: any } = {};

    // Add existing reports to the map
    existingReports.forEach((report: any) => {
      const fiscalYearKey = report.fiscal_year;
      if (!reportMap[fiscalYearKey]) {
        reportMap[fiscalYearKey] = { ...report };
      } else {
        // Merge data if fiscal year already exists
        if (
          report.data?.income_statement &&
          !reportMap[fiscalYearKey].data?.income_statement
        ) {
          reportMap[fiscalYearKey].data = {
            ...reportMap[fiscalYearKey].data,
            income_statement: report.data.income_statement,
          };
        }
        if (
          report.data?.balance_sheet &&
          !reportMap[fiscalYearKey].data?.balance_sheet
        ) {
          reportMap[fiscalYearKey].data = {
            ...reportMap[fiscalYearKey].data,
            balance_sheet: report.data.balance_sheet,
          };
        }
        if (
          report.data?.cash_flow_statement &&
          !reportMap[fiscalYearKey].data?.cash_flow_statement
        ) {
          reportMap[fiscalYearKey].data = {
            ...reportMap[fiscalYearKey].data,
            cash_flow_statement: report.data.cash_flow_statement,
          };
        }
      }
    });

    // Add new reports to the map, merging with existing ones if needed
    newReports.forEach((report: any) => {
      const fiscalYearKey = report.fiscal_year;
      if (!reportMap[fiscalYearKey]) {
        reportMap[fiscalYearKey] = { ...report };
      } else {
        // Merge the new report data with existing report data
        if (report.data?.income_statement) {
          reportMap[fiscalYearKey].data = {
            ...reportMap[fiscalYearKey].data,
            income_statement: report.data.income_statement,
          };
        }
        if (report.data?.balance_sheet) {
          reportMap[fiscalYearKey].data = {
            ...reportMap[fiscalYearKey].data,
            balance_sheet: report.data.balance_sheet,
          };
        }
        if (report.data?.cash_flow_statement) {
          reportMap[fiscalYearKey].data = {
            ...reportMap[fiscalYearKey].data,
            cash_flow_statement: report.data.cash_flow_statement,
          };
        }
      }
    });

    // Convert map back to array
    return Object.values(reportMap);
  };

  const processFiles = async () => {
    if (files.length === 0) return;

    setIsProcessingUpload(true);
    setUploadError(null);
    setWarningMessage(null);
    setProgress(10);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(`${API_BASE_URL}/bulk-upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || t("uploadError"));
      }

      const reportData = await response.json();
      setProgress(70);

      if (
        reportData.reports.length === 0 &&
        reportData.parsing_warnings.length > 0
      ) {
        setUploadError(t("noValidReportsExtracted"));
        setWarningMessage(
          `${t("importWarnings")}:\n\n${reportData.parsing_warnings.join("\n")}`
        );
        setIsProcessingUpload(false);
        return;
      }

      if (reportData.reports.length === 0) {
        setUploadError(t("checkFileFormat"));
        setIsProcessingUpload(false);
        return;
      }

      // Handle company name consistency
      const existingName = localStorage.getItem("insight_viewer_company_name");
      const newName = reportData.company_meta?.name;

      if (
        isAppendMode &&
        existingName &&
        newName &&
        existingName !== newName &&
        newName !== "Unknown"
      ) {
        setUploadError(
          t("companyNameMismatch")
            .replace("{existing}", existingName)
            .replace("{new}", newName)
        );
        setIsProcessingUpload(false);
        return;
      }

      if (
        newName &&
        newName !== "Unknown" &&
        (!isAppendMode || !existingName)
      ) {
        localStorage.setItem("insight_viewer_company_name", newName);
        window.dispatchEvent(new Event("companyNameUpdate"));
      }

      let finalReports = reportData.reports;

      if (isAppendMode) {
        const existingReportsStr = localStorage.getItem(
          "insight_viewer_reports"
        );
        if (existingReportsStr) {
          try {
            const existingReports = JSON.parse(existingReportsStr);
            if (Array.isArray(existingReports)) {
              // Use backend API to properly merge reports
              const existingReportData = {
                company_meta: {
                  name:
                    localStorage.getItem("insight_viewer_company_name") ||
                    "Unknown",
                  stock_code: null,
                  currency: "CNY",
                },
                reports: existingReports,
                parsing_warnings: [],
              };

              const mergeFormData = new FormData();
              mergeFormData.append(
                "existing_reports_json",
                JSON.stringify(existingReportData)
              );
              mergeFormData.append(
                "new_reports_json",
                JSON.stringify(reportData)
              );

              const mergeResponse = await fetch(
                `${API_BASE_URL}/merge-reports`,
                {
                  method: "POST",
                  body: mergeFormData,
                }
              );

              if (!mergeResponse.ok) {
                const errorData = await mergeResponse.json();
                throw new Error(errorData.detail || "Failed to merge reports");
              }

              const mergedData = await mergeResponse.json();
              finalReports = mergedData.reports;
            }
          } catch (e) {
            console.error(
              "Failed to merge reports via API, falling back to client-side merge:",
              e
            );
            const existingReports = JSON.parse(existingReportsStr);
            if (Array.isArray(existingReports)) {
              finalReports = mergeReportsByFiscalYear(
                existingReports,
                reportData.reports
              );
            }
          }
        }
      }

      finalReports.sort((a: any, b: any) => {
        const yearA = parseInt(a.fiscal_year.split(" ")[0]);
        const yearB = parseInt(b.fiscal_year.split(" ")[0]);
        return yearB - yearA;
      });

      localStorage.setItem(
        "insight_viewer_reports",
        JSON.stringify(finalReports)
      );
      localStorage.setItem(
        "insight_viewer_last_update",
        new Date().toISOString()
      );

      if (
        reportData.parsing_warnings &&
        reportData.parsing_warnings.length > 0
      ) {
        setWarningMessage(
          `${t("importWarnings")}:\n\n${reportData.parsing_warnings.join("\n")}`
        );
      }

      setProgress(100);
      setFiles([]); // Clear processed files
      setIsProcessingUpload(false);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || t("uploadError"));
      setIsProcessingUpload(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("importTitle")}</h1>
        <p className="text-gray-500">{t("dataPrivacy")}</p>
      </div>

      <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-emerald-900 flex items-center">
          <Info className="w-5 h-5 mr-2 text-emerald-600" />
          {t("howToImport")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-emerald-800">
          <div>
            <h3 className="font-bold mb-2">{t("howToImportStep1")}</h3>
            <p className="mb-2 text-emerald-700/80">
              {t("howToImportStep1Desc")}
            </p>
            <ul className="list-disc list-inside space-y-1 text-emerald-700">
              <li>{t("howToImportStep1Bullet1")}</li>
              <li>{t("howToImportStep1Bullet2")}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">{t("howToImportStep2")}</h3>
            <p className="mb-2 text-emerald-700/80">
              {t("howToImportStep2Desc")}
            </p>
            <ul className="list-disc list-inside space-y-1 text-emerald-700">
              <li>
                {t("howToImportStep2Bullet1").replace(
                  "{copyLlmPrompt}",
                  t("copyLlmPrompt")
                )}
              </li>
              <li>{t("howToImportStep2Bullet2")}</li>
              <li>{t("howToImportStep2Bullet3")}</li>
              <li>{t("howToImportStep2Bullet4")}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">{t("howToImportStep3")}</h3>
            <p className="mb-2 text-emerald-700/80">
              {t("howToImportStep3Desc")}
            </p>
            <ul className="list-disc list-inside space-y-1 text-emerald-700">
              <li>{t("howToImportStep3Bullet1")}</li>
              <li>{t("howToImportStep3Bullet2")}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <span className="w-8 h-8 rounded-full bg-emerald-100 text-primary flex items-center justify-center mr-3 text-sm">
            1
          </span>
          {t("searchAShare")}
        </h3>
        {searchError && (
          <div className="text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-md">
            <AlertCircle className="w-4 h-4 mr-2" />
            {searchError}
          </div>
        )}
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Code (e.g. 600519)"
            className="flex-[2] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={stockSymbol}
            onChange={(e) => setStockSymbol(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchStockData()}
          />
          <input
            type="number"
            placeholder="Start"
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={startYear}
            onChange={(e) => setStartYear(e.target.value)}
          />
          <span className="self-center text-gray-400">-</span>
          <input
            type="number"
            placeholder="End"
            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={endYear}
            onChange={(e) => setEndYear(e.target.value)}
          />
          <button
            onClick={fetchStockData}
            disabled={isFetchingStock || !stockSymbol}
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-900 transition-colors disabled:bg-gray-400 whitespace-nowrap flex items-center"
          >
            {isFetchingStock ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {isFetchingStock ? t("processing") : t("fetchData")}
          </button>
        </div>
        <p className="text-xs text-gray-400">{t("tushareNote")}</p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-gray-50 px-2 text-gray-500">OR</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-primary flex items-center justify-center mr-3 text-sm">
              2
            </span>
            {t("pasteJson")}
          </h3>
          <button
            onClick={copyLlmPrompt}
            className="text-xs text-primary hover:text-emerald-800 font-medium underline"
          >
            {t("copyLlmPrompt")}
          </button>
        </div>
        {pasteError && (
          <div className="text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-md">
            <AlertCircle className="w-4 h-4 mr-2" />
            {pasteError}
          </div>
        )}
        <textarea
          className="w-full h-32 p-4 border border-gray-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder='{"company_meta": {...}, "reports": [...] }'
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
        />
        <div className="flex justify-end items-center space-x-4">
          <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isAppendMode}
              onChange={(e) => setIsAppendMode(e.target.checked)}
              className="rounded text-primary focus:ring-primary"
            />
            <span>{t("addToExisting")}</span>
          </label>
          <button
            onClick={handleJsonPaste}
            disabled={!jsonContent.trim() || isProcessingPaste}
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-900 transition-colors disabled:bg-gray-400 flex items-center"
          >
            {isProcessingPaste ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {isProcessingPaste ? t("processing") : t("loadProcessJson")}
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-gray-50 px-2 text-gray-500">OR</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center">
          <span className="w-8 h-8 rounded-full bg-emerald-100 text-primary flex items-center justify-center mr-3 text-sm">
            3
          </span>
          {t("dragDropTitle")}
        </h3>

        {uploadError && (
          <div className="text-sm text-red-600 flex items-center bg-red-50 p-2 rounded-md">
            <AlertCircle className="w-4 h-4 mr-2" />
            {uploadError}
          </div>
        )}

        <div
          className={clsx(
            "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer bg-gray-50/50 min-h-[200px]",
            isDragging
              ? "border-primary bg-emerald-50/30"
              : "border-gray-200 hover:border-primary"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud
            className={clsx(
              "w-12 h-12 mb-4",
              isDragging ? "text-primary" : "text-gray-400"
            )}
          />
          <p className="text-sm text-gray-500 mb-2 text-center">
            {t("dragDropDesc")}
          </p>

          <div className="flex space-x-3 text-xs mb-4 text-center">
            <span className="text-gray-400">Templates:</span>
            <a
              href="/templates/公司名称_利润表.xlsx"
              download
              className="text-primary hover:underline"
            >
              Income Statement
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/templates/公司名称_资产负债表.xlsx"
              download
              className="text-primary hover:underline"
            >
              Balance Sheet
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/templates/公司名称_现金流量表.xlsx"
              download
              className="text-primary hover:underline"
            >
              Cash Flow
            </a>
          </div>

          <label className="bg-primary text-white px-6 py-2 rounded-lg font-medium cursor-pointer hover:bg-emerald-900 transition-colors z-10 relative">
            {t("browseFiles")}
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv,.json"
            />
          </label>
        </div>
      </div>

      {warningMessage && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-yellow-800 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
              {t("importWarnings")}
            </h3>
            <button
              onClick={copyWarningMessage}
              className="text-xs text-yellow-700 hover:text-yellow-900 font-medium underline"
            >
              {t("copyWarnings")}
            </button>
          </div>
          <div className="relative">
            <textarea
              readOnly
              className="w-full h-32 p-4 border border-yellow-200 rounded-lg font-mono text-xs bg-yellow-50/50 text-yellow-800 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 resize-none"
              value={warningMessage}
            />
          </div>
          <p className="text-xs text-yellow-600">{t("warningDetails")}</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-800">
            {t("selectedFiles")} ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileIcon className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                {!isProcessingUpload && (
                  <button
                    onClick={() => removeFile(idx)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    {t("remove")}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            {isProcessingUpload ? (
              <div className="flex-1 mr-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-primary font-medium">
                    {t("processing")}
                  </span>
                  <span className="text-gray-500">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="flex-1"></div>
            )}

            <div className="flex items-center ml-4">
              <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer mr-4">
                <input
                  type="checkbox"
                  checked={isAppendMode}
                  onChange={(e) => setIsAppendMode(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>{t("addToExisting")}</span>
              </label>
              <button
                onClick={processFiles}
                disabled={isProcessingUpload}
                className={clsx(
                  "px-6 py-2 rounded-lg font-medium text-white transition-colors flex items-center",
                  isProcessingUpload
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-emerald-900"
                )}
              >
                {isProcessingUpload && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isProcessingUpload ? t("parsing") : t("startProcessing")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copied to Clipboard Message */}
      <div
        className={clsx(
          "fixed bottom-4 left-4 px-4 py-2 bg-gray-800 text-white rounded-md shadow-lg transition-all duration-300 z-50",
          showCopiedMessage
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        {t("copiedToClipboard")}
      </div>
    </div>
  );
}
