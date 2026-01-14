import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { FlagResult } from "@/lib/flagsEngine";
import { cn } from "@/lib/utils";

interface SignalCardProps {
  flag: FlagResult;
}

export function SignalCard({ flag }: SignalCardProps) {
  const { t } = useLanguage();

  const isRed = flag.type === "Red";
  const isGreen = flag.type === "Green";
  // Fallback for Info or other types
  const isInfo = !isRed && !isGreen;

  return (
    <div
      className={cn(
        "bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden",
        isRed ? "border-gray-100" : isGreen ? "border-gray-100" : "border-gray-200 bg-gray-50 opacity-75"
      )}
    >
      {/* Side Color Bar */}
      {isRed && <div className="absolute top-0 left-0 w-1 h-full bg-rose-400"></div>}
      {isGreen && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>}

      {/* Category Badge */}
      <div className="flex justify-between items-start mb-3">
        {isRed && (
          <span className="inline-block px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded uppercase tracking-wide">
            {t(flag.category)}
          </span>
        )}
        {isGreen && (
          <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded uppercase tracking-wide">
            {t(flag.category)}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className={cn("font-semibold mb-2", isInfo ? "text-gray-700" : "text-gray-900 text-lg")}>
        {t(flag.name)}
      </h3>

      {/* Value/Logic Box */}
      {!isInfo && (
        <div className="mb-4">
          <span className="text-gray-400 uppercase text-[10px] font-bold block mb-1">
            {isRed ? t('triggerCondition') : t('targetCriteria')}
          </span>
          <div
            className={cn(
              "p-3 rounded-lg border",
              isRed ? "bg-rose-50/50 border-rose-100" : "bg-emerald-50/50 border-emerald-100"
            )}
          >
            <div
              className={cn(
                "text-sm font-bold",
                isRed ? "text-rose-700" : "text-emerald-700"
              )}
            >
              {flag.value}
            </div>
            <div
              className={cn(
                "text-[10px] mt-1 font-medium italic",
                isRed ? "text-rose-500" : "text-emerald-500"
              )}
            >
              {t('logic')}: {flag.logic}
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <p className={cn("text-sm mb-2", isInfo ? "text-gray-500 italic" : "text-gray-600 leading-relaxed")}>
        {t(flag.description)}
      </p>

      {/* Info extra */}
      {isInfo && (
        <div className="text-xs text-gray-400 font-mono bg-gray-100 p-2 rounded">
          {t('check')}: {flag.threshold}
        </div>
      )}
    </div>
  );
}
