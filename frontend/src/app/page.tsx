"use client";

import Link from "next/link";
import { UploadCloud, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
      <h1 className="text-4xl font-bold text-gray-900">{t('welcomeTitle')}</h1>
      <p className="text-xl text-gray-600 max-w-2xl">
        {t('welcomeDesc')}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl w-full text-left">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-primary mb-2">{t('step1Title')}</h3>
          <p className="text-gray-500">{t('step1Desc')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-primary mb-2">{t('step2Title')}</h3>
          <p className="text-gray-500">{t('step2Desc')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-primary mb-2">{t('step3Title')}</h3>
          <p className="text-gray-500">{t('step3Desc')}</p>
        </div>
      </div>

          <Link
            href="/import"
            className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary rounded-full overflow-hidden transition-all hover:bg-blue-900 shadow-lg hover:shadow-xl"
          >
        {t('startAnalysis')} <ArrowRight className="ml-2 w-5 h-5" />
      </Link>
    </div>
  );
}