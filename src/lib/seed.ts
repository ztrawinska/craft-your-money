/**
 * Seed data — the sample products the store starts from on first run. Once the
 * store's file (or Redis key) exists, this is no longer read; it's just the
 * initial contents.
 *
 * This is a deliberately authored collection, not random filler: one Greek-myth
 * metalwork line (silver, copper, freshwater pearls) named for goddesses whose
 * story fits the object — the three Graces for a trio of bands, the hearth-fire
 * goddess for a forged cuff, the goddess of oaths for a signet that seals. The
 * prices are chosen so each product lands on a specific profitability status, so
 * the range shows one intentional example of every state the app can display:
 *   Charites (Healthy) · Thetis (Risky, actually losing money) · Thalassa
 *   (Caution) · Hestia (active, no price) · Metis (rich draft w/ benchmark)
 *   · Themis (draft to resume) · Eos (archived).
 */
import type { FixedCost, FixedCostConfig } from "@/lib/fixed-costs";
import type { LibraryMaterial } from "@/lib/materials";
import type { Product } from "@/lib/products";

/** The business-cost layer the store starts from: £274/month spread across
 *  100 pieces → £2.74 per piece, applied to every product. */
export const seedFixedCosts: FixedCost[] = [
  { id: "fc-rent", label: "Studio rent", amount: 220, period: "monthly", monthsActive: 12 },
  { id: "fc-tools", label: "Insurance & tools", amount: 54, period: "monthly", monthsActive: 12 },
];
export const seedFixedCostConfig: FixedCostConfig = { method: "per-unit", volume: 100 };

/** The materials library the store starts from. Named, believable stock for a
 *  small silver/copper studio — covers every material the pieces reference,
 *  plus a few more so the picker looks like a real, lived-in library. */
export const seedMaterials: LibraryMaterial[] = [
  { id: "m-silver-sheet", name: "Sterling silver sheet", unit: "g", unitCost: 0.62, stock: 120 },
  { id: "m-solder-wire", name: "Solder wire", unit: "g", unitCost: 1.1, stock: 40 },
  { id: "m-silver-wire", name: "Silver wire", unit: "g", unitCost: 0.72, stock: null },
  { id: "m-bezel-wire", name: "Fine silver bezel wire", unit: "g", unitCost: 0.85, stock: 25 },
  { id: "m-silver-chain", name: "Silver curb chain", unit: "cm", unitCost: 0.18, stock: null },
  { id: "m-ear-wires", name: "Silver ear wires", unit: "pair", unitCost: 2.75, stock: null },
  { id: "m-pearls", name: "Freshwater pearls", unit: "", unitCost: 6.5, stock: 8 },
  { id: "m-keshi-pearls", name: "Keshi pearls", unit: "", unitCost: 4.2, stock: 12 },
  { id: "m-copper-sheet", name: "Copper sheet", unit: "g", unitCost: 0.09, stock: 200 },
];

export const seedProducts: Product[] = [
  {
    // Healthy — the range's reliable earner. Three thin bands worn together,
    // named for the three Graces (beauty, adornment).
    id: "charites-stacking-trio",
    name: "Charites stacking trio",
    type: "Ring",
    workflow: "active",
    // Prices are GROSS (sample account has VAT on at 20%); margin runs on net,
    // so £68 → net £56.67 → ~35% margin (Healthy).
    finalPrice: 68,
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
    // Risky AND losing money — the piece the dashboard briefing names. Pearls
    // are dear and the wrapping is slow, so at £24 it sells at a loss. This is
    // the on-camera repricing hero: bump it and watch the chip go Healthy.
    id: "thetis-pearl-drops",
    name: "Thetis pearl drops",
    type: "Earrings",
    workflow: "active",
    // £30 gross → net £25 against a ~£38.5 full cost: a real ~£13.5 loss per
    // sale (Risky). On camera, repricing to ~£68 lands it on Healthy.
    finalPrice: 30,
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
    // Caution — earns, but sits under the healthy line. A cast-wave pendant on
    // a fine curb chain.
    id: "thalassa-wave-pendant",
    name: "Thalassa wave pendant",
    type: "Necklace",
    workflow: "active",
    // £44 gross → net £36.67 against ~£28.3 full cost → ~23% margin (Caution).
    finalPrice: 44,
    materials: [
      { name: "Silver wire", quantity: 10, unit: "g", unitCost: 0.72, fromLibrary: true },
      { name: "Silver curb chain", quantity: 45, unit: "cm", unitCost: 0.18, fromLibrary: true },
    ],
    labour: [
      { step: "Twisting & forming", minutes: 30, rate: 15 },
      { step: "Finishing", minutes: 11, rate: 15 },
    ],
    otherCosts: [],
  },
  {
    // Active, no price yet — costed but never priced, so it shows the "No price"
    // state on the overview and the "set a price" nudge on the dashboard.
    id: "hestia-forged-cuff",
    name: "Hestia forged cuff",
    type: "Bracelet",
    workflow: "active",
    finalPrice: null,
    materials: [{ name: "Copper sheet", quantity: 20, unit: "g", unitCost: 0.09, fromLibrary: true }],
    labour: [
      { step: "Forging", minutes: 35, rate: 15 },
      { step: "Finishing", minutes: 15, rate: 15 },
    ],
    otherCosts: [],
  },
  {
    // The flagship draft: priced, with the fixed-cost layer AND market
    // benchmarks, so the detail shows the dashed business-cost / full-cost lines
    // and the "how you compare" drawer. This is the rich screen to linger on.
    id: "metis-hammered-band",
    name: "Metis hammered band",
    type: "Ring",
    workflow: "draft",
    finalPrice: 42,
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
    benchmark: [
      { label: "Etsy — similar band", price: 38 },
      { label: "Local maker", price: 45 },
      { label: "Instagram shop", price: 52 },
    ],
  },
  {
    // Draft with no price — the one the dashboard surfaces as "continue where
    // you left off". A genuine work-in-progress: named, one material in, not yet
    // costed out or priced.
    id: "themis-signet",
    name: "Themis signet",
    type: "Ring",
    workflow: "draft",
    finalPrice: null,
    materials: [
      { name: "Sterling silver sheet", quantity: 6, unit: "g", unitCost: 0.62, fromLibrary: true },
    ],
    labour: [{ step: "Sawing & shaping", minutes: 25, rate: 15 }],
    otherCosts: [],
  },
  {
    // Archived — kept as a record, out of the default overview and metrics.
    id: "eos-copper-hoops",
    name: "Eos copper hoops",
    type: "Earrings",
    workflow: "active",
    finalPrice: 32,
    archived: true,
    materials: [{ name: "Copper sheet", quantity: 8, unit: "g", unitCost: 0.09, fromLibrary: true }],
    labour: [{ step: "Forming & finishing", minutes: 30, rate: 15 }],
    otherCosts: [],
  },
];
