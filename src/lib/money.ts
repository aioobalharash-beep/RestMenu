// OMR is subdivided into 1000 baisa. Oman conventionally shows 3 decimal places.

const BAISA_PER_OMR = 1000;

/** Format a baisa amount as an OMR string, e.g. 4500 -> "4.500". */
export function formatOmr(priceBaisa: number): string {
  const omr = priceBaisa / BAISA_PER_OMR;
  return omr.toLocaleString("en-OM", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

/** Split into whole + fractional parts for typographic treatment of the price. */
export function splitOmr(priceBaisa: number): { whole: string; fraction: string } {
  const [whole, fraction = "000"] = formatOmr(priceBaisa).split(".");
  return { whole, fraction };
}

/** Parse a user-typed OMR string (e.g. "4.5", "4.500", "4") into baisa. */
export function parseOmrToBaisa(input: string): number {
  const cleaned = input.replace(/[^0-9.]/g, "").trim();
  if (!cleaned) return 0;
  const value = Number.parseFloat(cleaned);
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.round(value * BAISA_PER_OMR);
}

/** For prefilling an admin input from stored baisa. */
export function baisaToOmrInput(priceBaisa: number): string {
  return (priceBaisa / BAISA_PER_OMR).toFixed(3);
}
