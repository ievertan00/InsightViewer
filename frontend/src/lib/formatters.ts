/**
 * Utility functions for formatting numerical and financial data.
 */

/**
 * Formats large numerical values according to specific rules:
 * - Values < 1,000,000: Standard formatting with commas and 2 decimal places.
 * - Values >= 1,000,000: Divide by 1,000,000 and append 'M'.
 *   (e.g., 1,500,000 -> 1.50M, 1,200,000,000 -> 1,200.00M)
 */
export const formatLargeNumber = (val: number): string => {
  const absVal = Math.abs(val);
  const sign = val < 0 ? "-" : "";

  if (absVal >= 1000000) {
    const millions = absVal / 1000000;
    return `${sign}${millions.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}M`;
  }

  return `${sign}${absVal.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Formats percentages.
 */
export const formatPercent = (val: number): string => {
  return `${(val * 100).toFixed(2)}%`;
};

/**
 * Formats standard numbers with 2 decimal places.
 */
export const formatNumber = (val: number): string => {
  return val.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formats days.
 */
export const formatDays = (val: number): string => {
  return `${val.toFixed(0)} days`;
};
