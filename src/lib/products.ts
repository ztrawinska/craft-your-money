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
  // target margin and VAT are account settings, not product fields (§14).
  businessCostShare: number | null; // fixed-cost allocation, if configured
  materials: MaterialLine[];
  labour: LabourLine[];
  otherCosts: OtherLine[];
};

// ── line costs — the one definition of what a row costs ───────────────────

export const materialLineCost = (m: MaterialLine): number => m.quantity * m.unitCost;
export const labourLineCost = (l: LabourLine): number => (l.minutes / 60) * l.rate;

/** The quiet second line under a material name: "4g × £0.62/g", "2 × £6.50". */
export function materialDetail(m: MaterialLine): string {
  const unit = m.unit.trim();
  if (m.quantity === 1) {
    return unit ? `£${m.unitCost.toFixed(2)} / ${unit}` : `£${m.unitCost.toFixed(2)}`;
  }
  return unit
    ? `${m.quantity}${unit} × £${m.unitCost.toFixed(2)}/${unit}`
    : `${m.quantity} × £${m.unitCost.toFixed(2)}`;
}

export function labourDetail(l: LabourLine): string {
  return `${l.minutes} min · £${l.rate}/hr`;
}

// ── lenses the screens read through ───────────────────────────────────────

export function pricingFor(p: Product, s: Settings): Pricing {
  return computePricing({
    materials: p.materials.map(materialLineCost),
    labour: p.labour.map(labourLineCost),
    other: p.otherCosts.map((o) => o.cost),
    finalPrice: p.finalPrice,
    targetMarginPct: s.targetMarginPct,
    vatRatePct: effectiveVatRate(s),
    businessCostShare: p.businessCostShare,
  });
}

/** A product as the status model sees it — margin is computed, not stored. */
export function statusInputFor(p: Product, s: Settings): ProductStatusInput {
  return {
    workflow: p.workflow,
    hasPrice: p.finalPrice !== null,
    marginPct: pricingFor(p, s).marginPct,
  };
}
