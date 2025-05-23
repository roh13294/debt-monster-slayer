
/**
 * Formats a number as a display value with HP suffix
 */
export const formatValue = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount) + " HP";
};

/**
 * Formats a number as currency (DemonCoins)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Formats a percentage value
 */
export const formatPercent = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value / 100);
};

/**
 * Safely extracts a numeric value from a string or returns the number
 */
export const extractNumericValue = (value: string | number): number => {
  if (typeof value === 'number') return value;
  const match = value.match(/[\d,.]+/);
  return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
};
