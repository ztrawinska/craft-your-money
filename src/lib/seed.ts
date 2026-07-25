/**
 * Seed data — the sample products the store starts from on first run. Once the
 * store's file exists, this is no longer read; it's just the initial contents.
 */
import type { Product } from "@/lib/products";

export const seedProducts: Product[] = [
  {
    id: "stacking-set",
    name: "Stacking set × 3",
    type: "Ring",
    workflow: "active",
    finalPrice: 38,
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
    businessCostShare: null,
    materials: [{ name: "Silver wire", quantity: 6, unit: "g", unitCost: 0.72, fromLibrary: true }],
    labour: [],
    otherCosts: [],
  },
];
