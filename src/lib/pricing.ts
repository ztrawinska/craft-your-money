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
import { formatMoney, GBP_CUR, type Cur } from "@/lib/currency";

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

/** The options a price is evaluated against, once the direct cost is known. */
export type PriceOptions = {
  finalPrice: number | null;
  targetMarginPct: number;
  vatRatePct: number | null;
  businessCostShare: number | null;
};

/**
 * The core, given a direct cost. Split out so the interactive pricing panel can
 * recompute on every keystroke from a fixed direct cost without re-summing the
 * (unchanged) cost lines.
 */
export function computePricingFromDirect(
  directCost: number,
  o: PriceOptions,
): Pricing {
  // Fixed costs are optional. When set, margin/profit evaluate against full cost.
  const fullCost = o.businessCostShare == null ? null : directCost + o.businessCostShare;
  const relevantCost = fullCost ?? directCost;

  // final_price is GROSS; margin and profit run on NET.
  const net =
    o.finalPrice == null
      ? null
      : o.vatRatePct
        ? o.finalPrice / (1 + o.vatRatePct / 100)
        : o.finalPrice;

  const profit = net == null ? null : net - relevantCost;
  const marginPct = net == null || net <= 0 ? null : (profit as number) / net;

  // The suggestion targets the margin on the SAME cost the margin is measured
  // against — full cost when business costs are configured, else direct cost —
  // so accepting it actually hits the target (never lands below it).
  const calculatedBeforeVat =
    relevantCost <= 0 ? null : relevantCost / (1 - o.targetMarginPct / 100);
  const calculatedPrice =
    calculatedBeforeVat == null
      ? null
      : o.vatRatePct
        ? calculatedBeforeVat * (1 + o.vatRatePct / 100)
        : calculatedBeforeVat;

  return { directCost, fullCost, net, profit, marginPct, calculatedBeforeVat, calculatedPrice };
}

export function computePricing(c: CostInputs): Pricing {
  const directCost = sum(c.materials) + sum(c.labour) + sum(c.other);
  return computePricingFromDirect(directCost, {
    finalPrice: c.finalPrice,
    targetMarginPct: c.targetMarginPct,
    vatRatePct: c.vatRatePct,
    businessCostShare: c.businessCostShare,
  });
}

/**
 * The inverse of profit (§6, "reach the price by the profit"): the gross price
 * at which the profit lands exactly on `targetProfit`. Profit is net minus cost,
 * so net = cost + profit; then VAT goes back on top. Mirrors the forward
 * computation so the two can never disagree.
 */
export function grossForTargetProfit(
  targetProfit: number,
  relevantCost: number,
  vatRatePct: number | null,
): number {
  const net = relevantCost + targetProfit;
  return vatRatePct != null ? net * (1 + vatRatePct / 100) : net;
}

/**
 * Price warnings (PRD §6) — one calm, plain-language helper, or none. Ordered by
 * severity: a real loss first, then break-even, then below the margin target.
 * These are helpers, never alarms — the wording never says "error" or "invalid".
 */
export type PriceWarning = {
  text: string;
  severity: "loss" | "below-target" | "note";
};

export function priceWarning(
  p: Pricing,
  o: { finalPrice: number; targetMarginPct: number; vatRatePct: number | null; cur?: Cur },
): PriceWarning | null {
  if (p.net == null || p.profit == null) return null;
  const EPS = 0.005;
  const cur = o.cur ?? GBP_CUR;
  const relevantCost = p.fullCost ?? p.directCost;

  if (p.profit < -EPS) {
    const loss = formatMoney(-p.profit, cur);
    const grossProfit = o.finalPrice - relevantCost;
    // Profitable before VAT, a loss after it (the sneakiest case).
    if (o.vatRatePct && grossProfit >= -EPS) {
      return {
        text: `This is profitable before VAT — but a loss after. You lose ${loss} on each piece.`,
        severity: "loss",
      };
    }
    // Covers direct cost, but fixed costs tip it into a loss.
    if (p.fullCost != null && o.finalPrice >= p.directCost) {
      return {
        text: `This looks profitable before overhead — but fixed costs make it a ${loss} loss per piece.`,
        severity: "loss",
      };
    }
    return {
      text: `Your price is below your costs. You'd lose ${loss} on every sale.`,
      severity: "loss",
    };
  }

  if (Math.abs(p.profit) <= EPS) {
    return { text: "You're breaking even — no profit on this product.", severity: "note" };
  }

  if (o.targetMarginPct === 0) {
    return {
      text: "A 0% margin target means no profit. Is this intentional?",
      severity: "note",
    };
  }

  // The 0.001 tolerance keeps the recommended price (rounded to 2dp) from
  // flashing this warning when it lands essentially on target.
  if (p.marginPct != null && p.marginPct < o.targetMarginPct / 100 - 0.001) {
    return {
      text: `Your price covers costs but is below your ${o.targetMarginPct}% margin target.`,
      severity: "below-target",
    };
  }

  return null;
}
