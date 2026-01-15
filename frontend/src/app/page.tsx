"use client";

import Link from "next/link";
import {
  UploadCloud,
  ArrowRight,
  Calculator,
  TrendingUp,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 max-w-6xl mx-auto py-12">
      {/* Hero Section */}
      <div className="space-y-6 animate-enter">
        <h1 className="text-4xl md:text-5xl font-serif font-medium text-primary tracking-tight">
          {t('welcomeTitle')}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
          {t('welcomeDesc')}
        </p>

        <div className="pt-4">
          <Link
            href="/import"
            className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary rounded-lg overflow-hidden transition-all hover:bg-primary/90 hover:scale-[1.02] shadow-md hover:shadow-lg active:scale-95"
          >
            {t('heroCta')}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Bento Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left animate-enter delay-200">
        {/* Large Card - Data Ingestion & Normalization */}
        <div className="md:col-span-2 glass-card p-8 rounded-2xl relative overflow-hidden group hover:border-emerald-200 transition-colors duration-300">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors" />
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 text-primary border border-gray-100">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {t('featureImportTitle')}
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {t('featureImportDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Small Card - Ratio Calculation */}
        <div className="md:col-span-1 glass-card p-8 rounded-2xl hover:border-emerald-200 transition-colors duration-300 flex flex-col relative overflow-hidden">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 text-primary border border-gray-100">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('featureRatiosTitle')}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {t('featureRatiosDesc')}
          </p>
        </div>

        {/* Medium Card - Benchmarking */}
        <div className="md:col-span-1 glass-card p-8 rounded-2xl hover:border-emerald-200 transition-colors duration-300 flex flex-col relative overflow-hidden">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 text-primary border border-gray-100">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('featureBenchmarkingTitle')}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {t('featureBenchmarkingDesc')}
          </p>
        </div>

        {/* Medium Card - Risk Scanning */}
        <div className="md:col-span-1 glass-card p-8 rounded-2xl hover:border-emerald-200 transition-colors duration-300 flex flex-col relative overflow-hidden">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 text-primary border border-gray-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('featureFlagsTitle')}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {t('featureFlagsDesc')}
          </p>
        </div>

        {/* Medium Card - AI Insights */}
        <div className="md:col-span-1 glass-card p-8 rounded-2xl relative overflow-hidden group hover:border-emerald-200 transition-colors duration-300">
          <div className="absolute bottom-0 right-0 -mb-8 -mr-8 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors" />
          <div className="relative z-10 h-full flex flex-col">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6 text-primary border border-gray-100">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('featureInsightsTitle')}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t('featureInsightsDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
