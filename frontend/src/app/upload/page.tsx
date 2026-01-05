"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, File as FileIcon, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import clsx from "clsx";
// FinancialDataPoint is no longer used here as we receive the StandardizedReport structure

export default function UploadPage() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(f => 
          f.name.endsWith('.xlsx') || f.name.endsWith('.xls') || f.name.endsWith('.csv')
      );
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    setProgress(10); 

    try {
        let allReports: any[] = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Create FormData to send file to Backend
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("http://localhost:8000/api/v1/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `Failed to parse ${file.name}`);
            }

            const reportData = await response.json();
            // In the new schema, reportData is a StandardizedReport object
            // We want to accumulate the 'reports' array (list of years)
            if (reportData.reports) {
                allReports = [...allReports, ...reportData.reports];
            }
            
            setProgress(10 + Math.round(((i + 1) / files.length) * 80));
        }

        if (allReports.length === 0) {
            setError("No valid data could be extracted. Please check the file format.");
            setIsProcessing(false);
            return;
        }

        // Save standardized reports to LocalStorage (or context later)
        // Sort by year desc across all uploaded files
        allReports.sort((a, b) => parseInt(b.fiscal_year) - parseInt(a.fiscal_year));

        localStorage.setItem("insight_viewer_reports", JSON.stringify(allReports));
        localStorage.setItem("insight_viewer_last_update", new Date().toISOString());

        setProgress(100);
        
        setTimeout(() => {
            router.push("/visualize"); // Redirect to visualize or data view
        }, 800);

    } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred while communicating with the backend.");
        setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Financial Reports</h1>
        <p className="text-gray-500">Supported formats: Excel (.xlsx, .xls). Upload Balance Sheet, Income Statement, and Cash Flow.</p>
      </div>

      <div
        className={clsx(
          "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-colors cursor-pointer bg-white min-h-[300px]",
          isDragging ? "border-primary bg-blue-50" : "border-gray-300 hover:border-primary"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud className={clsx("w-16 h-16 mb-4", isDragging ? "text-primary" : "text-gray-400")} />
        <p className="text-lg font-medium text-gray-700">
          Drag & Drop files here
        </p>
        <p className="text-sm text-gray-500 mt-2 mb-6">or</p>
        <label className="bg-primary text-white px-6 py-2 rounded-lg font-medium cursor-pointer hover:bg-blue-900 transition-colors">
          Browse Files
          <input type="file" className="hidden" multiple onChange={handleFileChange} accept=".xlsx,.xls,.csv" />
        </label>
      </div>

      {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
          </div>
      )}

      {files.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-800">Selected Files ({files.length})</h3>
          <div className="space-y-2">
            {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <FileIcon className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    {!isProcessing && (
                        <button onClick={() => removeFile(idx)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                    )}
                </div>
            ))}
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
             {isProcessing ? (
                 <div className="flex-1 mr-4">
                     <div className="flex justify-between text-sm mb-1">
                        <span className="text-primary font-medium">Processing...</span>
                        <span className="text-gray-500">{progress}%</span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                     </div>
                 </div>
             ) : (
                <div className="flex-1"></div>
             )}

             <button 
               onClick={processFiles}
               disabled={isProcessing}
               className={clsx(
                   "px-6 py-2 rounded-lg font-medium text-white transition-colors flex items-center ml-4",
                   isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-blue-900"
               )}
             >
               {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
               {isProcessing ? "Parsing..." : "Start Processing"}
             </button>
          </div>
        </div>
      )}
    </div>
  );
}