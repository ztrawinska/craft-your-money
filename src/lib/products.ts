/**
 * The one source of product data. Dashboard, overview and detail all read from
 * here, so a product's identity, price and status are the same everywhere —
 * no more each screen inventing its own numbers.
 *
 * Only inputs are stored (materials, labour, price, target, VAT, fixed-cost
 * share). Everything derived — direct cost, the calculated suggestion, profit,
 * margin — is computed by `computePricing` at read time (PRD §14: never store
 * calculated values). `pricingFor` and `statusInputFor` are the two lenses the
 * screens use.
 */
import { computePricing, type Pricing } from "@/lib/pricing";
import type { ProductStatusInput } from "@/lib/status";

export type ProductType = "Ring" | "Necklace" | "Earrings" | "Bracelet" | "Other";

export type MaterialLine = {
  name: string;
  detail: string; // the quiet arithmetic: "4g × £0.62/g"
  cost: number;
  fromLibrary?: boolean;
};
export type LabourLine = { step: string; detail: string; cost: number };
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
      { name: "Sterling silver sheet", detail: "14g × £0.62/g", cost: 8.68, fromLibrary: true },
      { name: "Solder wire", detail: "0.5g × £1.10/g", cost: 0.55, fromLibrary: true },
    ],
    labour: [
      { step: "Sawing & shaping", detail: "50 min · £15/hr", cost: 12.5 },
      { step: "Soldering ×3 bands", detail: "35 min · £15/hr", cost: 8.75 },
      { step: "Polishing", detail: "15 min · £15/hr", cost: 3.75 },
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
      { name: "Freshwater pearls", detail: "2 × £6.50", cost: 13.0, fromLibrary: true },
      { name: "Silver ear wires", detail: "pair", cost: 2.75, fromLibrary: true },
    ],
    labour: [
      { step: "Wire wrapping", detail: "40 min · £15/hr", cost: 10.0 },
      { step: "Assembly & finishing", detail: "40 min · £15/hr", cost: 10.0 },
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
      { name: "Silver wire", detail: "10g × £0.72/g", cost: 7.2, fromLibrary: true },
      { name: "Chain (45cm)", detail: "45cm × £0.18/cm", cost: 8.1 },
    ],
    labour: [
      { step: "Twisting & forming", detail: "30 min · £15/hr", cost: 7.5 },
      { step: "Finishing", detail: "11 min · £15/hr", cost: 2.75 },
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
    materials: [{ name: "Copper sheet", detail: "20g × £0.09/g", cost: 1.8 }],
    labour: [
      { step: "Forging", detail: "35 min · £15/hr", cost: 8.75 },
      { step: "Finishing", detail: "15 min · £15/hr", cost: 3.75 },
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
      { name: "Sterling silver sheet", detail: "4g × £0.62/g", cost: 2.48, fromLibrary: true },
      { name: "Solder wire", detail: "0.3g × £1.10/g", cost: 0.33, fromLibrary: true },
    ],
    labour: [
      { step: "Sawing & shaping", detail: "20 min · £15/hr", cost: 5.0 },
      { step: "Soldering", detail: "15 min · £15/hr", cost: 3.75 },
      { step: "Polishing", detail: "10 min · £15/hr", cost: 2.5 },
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
    materials: [{ name: "Silver wire", detail: "6g × £0.72/g", cost: 4.32, fromLibrary: true }],
    labour: [],
    otherCosts: [],
  },
];

// ── lenses the screens read through ───────────────────────────────────────

export function pricingFor(p: Product): Pricing {
  return computePricing({
    materials: p.materials.map((m) => m.cost),
    labour: p.labour.map((l) => l.cost),
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
