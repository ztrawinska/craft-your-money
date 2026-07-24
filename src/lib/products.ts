/**
 * The one source of product data. Dashboard, overview and detail all read from
 * here, so a product's identity, price and status are the same everywhere —
 * no more each screen inventing its own numbers.
 *
 * Only inputs are stored (materials with quantity/unit/unit-cost, labour with
 * minutes/rate, price, target, VAT, fixed-cost share). Everything derived —
 * each line's cost, direct cost, the calculated suggestion, profit, margin — is
 * computed at read time (PRD §14: never store calculated values). The line-cost
 * helpers below are the single definition of "what a row costs".
 */
import { computePricing, type Pricing } from "@/lib/pricing";
import type { ProductStatusInput } from "@/lib/status";

export type ProductType = "Ring" | "Necklace" | "Earrings" | "Bracelet" | "Other";

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
  targetMarginPct: number;
  vatRatePct: number | null;
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

export const products: Product[] = [
  {
    id: "stacking-set",
    name: "Stacking set × 3",
    type: "Ring",
    workflow: "active",
    finalPrice: 38,
    targetMarginPct: 40,
    vatRatePct: 20,
    businessCostShare: null,
    materials: [
      { name: "Sterling silver sheet", quantity: 14, unit: "g", unitCost: 0.62, fromLibrary: true },
      { name: "Solder wire", quantity: 0.5, unit: "g", unitCost: 1.1, fromLibrary: true },
    ],
    labour: [
      { step: "Sawing & shaping", minutes: 50, rate: 15 },
      { step: "Soldering ×3 bands", minutes: 35, rate: 15 },
      { step: "Polishing", minutes: 15, rate: 15 },
    ],
    otherCosts: [],
  },
  {
    id: "pearl-drop",
    name: "Pearl drop earrings",
    type: "Earrings",
    workflow: "active",
    finalPrice: 55,
    targetMarginPct: 40,
    vatRatePct: 20,
    businessCostShare: null,
    materials: [
      { name: "Freshwater pearls", quantity: 2, unit: "", unitCost: 6.5, fromLibrary: true },
      { name: "Silver ear wires", quantity: 1, unit: "pair", unitCost: 2.75, fromLibrary: true },
    ],
    labour: [
      { step: "Wire wrapping", minutes: 40, rate: 15 },
      { step: "Assembly & finishing", minutes: 40, rate: 15 },
    ],
    otherCosts: [],
  },
  {
    id: "twisted-pendant",
    name: "Twisted wire pendant",
    type: "Necklace",
    workflow: "active",
    finalPrice: 68,
    targetMarginPct: 40,
    vatRatePct: 20,
    businessCostShare: null,
    materials: [
      { name: "Silver wire", quantity: 10, unit: "g", unitCost: 0.72, fromLibrary: true },
      { name: "Chain", quantity: 45, unit: "cm", unitCost: 0.18 },
    ],
    labour: [
      { step: "Twisting & forming", minutes: 30, rate: 15 },
      { step: "Finishing", minutes: 11, rate: 15 },
    ],
    otherCosts: [],
  },
  {
    id: "copper-cuff",
    name: "Forged copper cuff",
    type: "Bracelet",
    workflow: "active",
    finalPrice: null,
    targetMarginPct: 40,
    vatRatePct: 20,
    businessCostShare: null,
    materials: [{ name: "Copper sheet", quantity: 20, unit: "g", unitCost: 0.09 }],
    labour: [
      { step: "Forging", minutes: 35, rate: 15 },
      { step: "Finishing", minutes: 15, rate: 15 },
    ],
    otherCosts: [],
  },
  {
    // The flagship: a draft with the fixed-cost layer configured, so the detail
    // shows the dashed business-cost / full-cost lines.
    id: "hammered-band",
    name: "Hammered silver stacking band",
    type: "Ring",
    workflow: "draft",
    finalPrice: 42,
    targetMarginPct: 40,
    vatRatePct: 20,
    businessCostShare: 2.74,
    materials: [
      { name: "Sterling silver sheet", quantity: 4, unit: "g", unitCost: 0.62, fromLibrary: true },
      { name: "Solder wire", quantity: 0.3, unit: "g", unitCost: 1.1, fromLibrary: true },
    ],
    labour: [
      { step: "Sawing & shaping", minutes: 20, rate: 15 },
      { step: "Soldering", minutes: 15, rate: 15 },
      { step: "Polishing", minutes: 10, rate: 15 },
    ],
    otherCosts: [],
  },
  {
    id: "new-ring",
    name: "New ring concept",
    type: "Ring",
    workflow: "draft",
    finalPrice: null,
    targetMarginPct: 40,
    vatRatePct: 20,
    businessCostShare: null,
    materials: [{ name: "Silver wire", quantity: 6, unit: "g", unitCost: 0.72, fromLibrary: true }],
    labour: [],
    otherCosts: [],
  },
];

// ── lenses the screens read through ───────────────────────────────────────

export function pricingFor(p: Product): Pricing {
  return computePricing({
    materials: p.materials.map(materialLineCost),
    labour: p.labour.map(labourLineCost),
    other: p.otherCosts.map((o) => o.cost),
    finalPrice: p.finalPrice,
    targetMarginPct: p.targetMarginPct,
    vatRatePct: p.vatRatePct,
    businessCostShare: p.businessCostShare,
  });
}

/** A product as the status model sees it — margin is computed, not stored. */
export function statusInputFor(p: Product): ProductStatusInput {
  return {
    workflow: p.workflow,
    hasPrice: p.finalPrice !== null,
    marginPct: pricingFor(p).marginPct,
  };
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
