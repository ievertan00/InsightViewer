import Link from "next/link";
import { UploadCloud, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">Welcome to Insight Viewer</h1>
      <p className="text-xl text-gray-600 max-w-2xl">
        Turn dense Chinese financial filings into readable, comparable, and actionable structures.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl w-full text-left">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-primary mb-2">1. Upload</h3>
          <p className="text-gray-500">Normalize financial data from various sources into a structured format.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-primary mb-2">2. Analyze</h3>
          <p className="text-gray-500">View computed ratios, signals, and visualize key trends.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-primary mb-2">3. Interpret</h3>
          <p className="text-gray-500">Get AI-assisted insights and export comprehensive reports.</p>
        </div>
      </div>

      <Link 
        href="/upload" 
        className="mt-8 px-8 py-3 bg-primary text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-900 transition-colors flex items-center"
      >
        Start Analysis <ArrowRight className="ml-2 w-5 h-5" />
      </Link>
    </div>
  );
}