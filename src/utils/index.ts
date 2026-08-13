/** Shared helpers — date formatting, validators. Used across all role screens. */
export function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatCurrency(amount: number, currency = "INR"): string {
  const symbol = currency === "INR" ? "₹" : "$";
  return `${symbol}${Number(amount || 0).toLocaleString("en-IN")}`;
}

export const isValidAmount = (val: number, min = 1, max = 1_000_000): boolean =>
  Number.isFinite(val) && val >= min && val <= max;

export const isValidOtp = (val: string): boolean => /^\d{6}$/.test(val);