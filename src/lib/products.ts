/**
 * Product types and the pure, shared helpers over them. No data lives here —
 * the store (src/lib/store.ts, server-only) holds the products; this file is
 * safe to import from anywhere, client or server.
 *
 * Only inputs are ever stored (materials with quantity/unit/unit-cost, labour
 * with minutes/rate, price, target, VAT, fixed-cost share). Everything derived
 * — each line's cost, direct cost, the calculated suggestion, profit, margin —
 * is computed at read time (PRD §14: never store calculated values).
 */
import type { BenchmarkPrice } from "@/lib/benchmark";
import { formatMoney, GBP_CUR, type Cur } from "@/lib/currency";
import { computePricing, type Pricing } from "@/lib/pricing";
import { effectiveVatRate, type Settings } from "@/lib/settings";
import type { ProductStatusInput } from "@/lib/status";

export type ProductType = "Ring" | "Necklace" | "Earrings" | "Bracelet" | "Other";
export const PRODUCT_TYPES: ProductType[] = [
  "Ring",
  "Necklace",
  "Earrings",
  "Bracelet",
  "Other",
];

// A material is priced as quantity × unit cost (PRD §5). The unit may be a
// measure ("g", "cm") or empty for a plain count ("2 × £6.50").
export type MaterialLine = {
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  fromLibrary?: boolean;
};
// Labour is minutes at an hourly rate.
export type LabourLine = { step: string; minutes: number; rate: number };
// Other direct costs are flat per-unit amounts.
export type OtherLine = { label: string; cost: number };

export type Product = {
  id: string;
  name: string;
  type: ProductType;
  workflow: "draft" | "active";
  finalPrice: number | null; // gross
  archived?: boolean; // "I stopped making this" — kept, but out of the range
  // target margin, VAT and the business-cost share are account-level (§14): the
  // share is computed from the fixed-cost layer, not stored on the product.
  materials: MaterialLine[];
  labour: LabourLine[];
  otherCosts: OtherLine[];
  // A few competitor prices the maker has seen (§11) — optional, entered by
  // hand. Absent on older records; treat as empty.
  benchmark?: BenchmarkPrice[];
};

// ── line costs — the one definition of what a row costs ───────────────────

export const materialLineCost = (m: MaterialLine): number => m.quantity * m.unitCost;
export const labourLineCost = (l: LabourLine): number => (l.minutes / 60) * l.rate;

/** The quiet second line under a material name: "4g × £0.62/g", "2 × £6.50". */
export function materialDetail(m: MaterialLine, cur: Cur = GBP_CUR): string {
  const unit = m.unit.trim();
  const each = formatMoney(m.unitCost, cur);
  if (m.quantity === 1) {
    return unit ? `${each} / ${unit}` : each;
  }
  return unit ? `${m.quantity}${unit} × ${each}/${unit}` : `${m.quantity} × ${each}`;
}

export function labourDetail(l: LabourLine, cur: Cur = GBP_CUR): string {
  // The rate keeps its plain form (no forced decimals): "£15/hr", "15 zł/hr".
  const rate = cur.suffix ? `${l.rate} ${cur.symbol}` : `${cur.symbol}${l.rate}`;
  return `${l.minutes} min · ${rate}/hr`;
}

/** Total labour hours for a product — the input to bench-time cost allocation. */
export function productLabourHours(p: Product): number {
  return p.labour.reduce((sum, l) => sum + l.minutes, 0) / 60;
}

// ── lenses the screens read through ───────────────────────────────────────

export function pricingFor(
  p: Product,
  s: Settings,
  businessCostShare: number | null,
): Pricing {
  return computePricing({
    materials: p.materials.map(materialLineCost),
    labour: p.labour.map(labourLineCost),
    other: p.otherCosts.map((o) => o.cost),
    finalPrice: p.finalPrice,
    targetMarginPct: s.targetMarginPct,
    vatRatePct: effectiveVatRate(s),
    businessCostShare,
  });
}

/** A product as the status model sees it — margin is computed, not stored. */
export function statusInputFor(
  p: Product,
  s: Settings,
  businessCostShare: number | null,
): ProductStatusInput {
  return {
    workflow: p.workflow,
    hasPrice: p.finalPrice !== null,
    marginPct: pricingFor(p, s, businessCostShare).marginPct,
  };
}
