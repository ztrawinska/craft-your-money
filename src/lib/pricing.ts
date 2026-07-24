/**
 * Pricing computations (PRD §6) — pure functions over a product's cost inputs.
 *
 * These are the display-side derivations only: direct cost, the calculated-price
 * suggestion, VAT-net, profit and margin. All are runtime-derived and never
 * persisted (§14) — the store keeps inputs, these produce what a screen shows.
 *
 * The subtle *stateful* parts of §6 — the final-price sync/reset behaviour and
 * the VAT/loss warnings — are interactive and come later. What's here is the
 * arithmetic, kept honest by tests so the screens can share one truth.
 */
export type CostInputs = {
  materials: number[];
  labour: number[];
  other: number[];
  /** Gross — the price on the tag / listing. */
  finalPrice: number | null;
  targetMarginPct: number; // e.g. 40
  vatRatePct: number | null; // e.g. 20; null = VAT off
  /** Fixed-cost allocation per unit, when the fixed-cost layer is configured. */
  businessCostShare: number | null;
};

export type Pricing = {
  directCost: number;
  fullCost: number | null;
  net: number | null;
  profit: number | null;
  marginPct: number | null;
  calculatedBeforeVat: number | null;
  calculatedPrice: number | null;
};

const sum = (ns: number[]) => ns.reduce((a, b) => a + b, 0);

export function computePricing(c: CostInputs): Pricing {
  const directCost = sum(c.materials) + sum(c.labour) + sum(c.other);

  // Fixed costs are optional. When set, margin/profit evaluate against full cost.
  const fullCost = c.businessCostShare == null ? null : directCost + c.businessCostShare;
  const relevantCost = fullCost ?? directCost;

  // final_price is GROSS; margin and profit run on NET.
  const net =
    c.finalPrice == null
      ? null
      : c.vatRatePct
        ? c.finalPrice / (1 + c.vatRatePct / 100)
        : c.finalPrice;

  const profit = net == null ? null : net - relevantCost;
  const marginPct = net == null || net <= 0 ? null : (profit as number) / net;

  // The suggestion is ALWAYS from direct cost, never full cost (§6).
  const calculatedBeforeVat =
    directCost <= 0 ? null : directCost / (1 - c.targetMarginPct / 100);
  const calculatedPrice =
    calculatedBeforeVat == null
      ? null
      : c.vatRatePct
        ? calculatedBeforeVat * (1 + c.vatRatePct / 100)
        : calculatedBeforeVat;

  return {
    directCost,
    fullCost,
    net,
    profit,
    marginPct,
    calculatedBeforeVat,
    calculatedPrice,
  };
}
