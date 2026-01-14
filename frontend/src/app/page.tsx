"use client";

import Link from "next/link";
import {
  UploadCloud,
  ArrowRight,
  Activity,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="space-y-6 animate-enter">
        <h1 className="text-5xl md:text-6xl font-serif font-medium text-primary tracking-tight">
          Let's make sense of <br />{" "}
          <span className="italic text-accent">your numbers.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
          Your financial story, told with clarity and precision. <br />
          Drop your data, and we'll handle the rest.
        </p>

        <div className="pt-4">
          <Link
            href="/import"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-primary rounded-full overflow-hidden transition-all hover:bg-primary/90 hover:scale-105 shadow-lg hover:shadow-xl active:scale-95"
          >
            Start Analysis{" "}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Bento Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full text-left animate-enter delay-200">
        {/* Large Card - Upload */}
        <div className="md:col-span-2 md:row-span-2 glass-card p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-primary">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif text-primary mb-2">
                Drop your data here.
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Simply upload your Excel or CSV files. We'll parse, clean, and
                structure everything for you automatically.
              </p>
            </div>
            <div className="mt-8">
              <span className="text-sm font-medium text-accent uppercase tracking-wider">
                Step 1
              </span>
            </div>
          </div>
        </div>

        {/* Tall Card - Insights */}
        <div className="md:col-span-1 md:row-span-2 glass-card p-8 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
          <div className="relative z-10 h-full flex flex-col">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-accent">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif text-primary mb-2">
              The Big Picture
            </h3>
            <p className="text-gray-600 text-sm mb-4 flex-grow">
              Get instant AI-powered insights. Understand what the numbers
              actually mean for your business health.
            </p>
            <div className="mt-auto">
              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-2/3 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Small Card - Ratios */}
        <div className="md:col-span-1 glass-card p-6 rounded-3xl hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-center">
          <Activity className="w-8 h-8 text-primary mb-3" />
          <h3 className="text-lg font-serif text-primary">Smart Ratios</h3>
          <p className="text-sm text-gray-500">
            Automated calculation of key financial metrics.
          </p>
        </div>

        {/* Small Card - Health Check */}
        <div className="md:col-span-1 glass-card p-6 rounded-3xl hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-center">
          <ShieldCheck className="w-8 h-8 text-signal-green mb-3" />
          <h3 className="text-lg font-serif text-primary">Health Check</h3>
          <p className="text-sm text-gray-500">
            Spot red flags before they become problems.
          </p>
        </div>
      </div>
    </div>
  );
}
