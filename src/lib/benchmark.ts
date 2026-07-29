/**
 * Market benchmark (PRD §11, market position §162). A few competitor prices the
 * maker has seen for comparable pieces — entered by hand, never scraped. Pure
 * math over them: the range, the median, and where this price sits.
 *
 * Belongs to a product. Optional — with no prices there is simply no read.
 */
export type BenchmarkPrice = { label: string; price: number };
export type MarketPosition = "below" | "within" | "above";
export type MarketRead = {
  min: number;
  max: number;
  median: number;
  count: number;
  position: MarketPosition;
};

/**
 * The market read for `finalPrice` against the entered prices, or null when
 * there's nothing to compare (no prices, or no price set yet).
 * Position (§166–168): below the cheapest → "below"; above the dearest →
 * "above"; anywhere in between (inclusive) → "within".
 */
export function marketRead(finalPrice: number | null, prices: BenchmarkPrice[]): MarketRead | null {
  const values = prices
    .map((p) => p.price)
    .filter((v) => Number.isFinite(v) && v > 0)
    .sort((a, b) => a - b);
  if (finalPrice == null || values.length === 0) return null;

  const min = values[0];
  const max = values[values.length - 1];
  const mid = Math.floor(values.length / 2);
  const median = values.length % 2 === 1 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
  const position: MarketPosition =
    finalPrice < min ? "below" : finalPrice > max ? "above" : "within";

  return { min, max, median, count: values.length, position };
}
