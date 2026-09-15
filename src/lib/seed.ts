/**
 * Seed data — the sample products the store starts from on first run. Once the
 * store's file (or Redis key) exists, this is no longer read; it's just the
 * initial contents.
 *
 * A deliberately authored collection, not random filler: one Greek-myth
 * metalwork line named for goddesses whose story fits the object — the three
 * Graces for a trio of bands, the hearth-fire goddess for a forged cuff, the
 * goddess of oaths for a signet that seals. The pieces use real precious
 * materials (9ct/14ct gold, vermeil, sapphire, opal, aquamarine, pearls) at
 * believable prices, so the range reads like a working studio: an ~£58 average
 * profit per piece across a healthy catalogue.
 *
 * Prices are still chosen so the range shows one intentional example of every
 * state the app can display — most pieces Healthy, one Caution (Thalassa), and
 * exactly one piece deliberately under-priced into Risky (Thetis — thin, not
 * underwater) so the dashboard's "needs attention" / "below target" / reprice
 * story has something real to catch. Prices are GROSS (the sample account has
 * VAT on at 20%); margin and profit run on the net figure.
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

/** The materials library the store starts from — a real goldsmith's shelf:
 *  precious metals, a handful of stones and pearls, and findings. Covers every
 *  material the pieces reference, plus a few extras so the picker looks lived-in. */
export const seedMaterials: LibraryMaterial[] = [
  // precious metals
  { id: "m-gold-18ct-sheet", name: "18ct gold sheet", unit: "g", unitCost: 48, stock: null },
  { id: "m-gold-14ct-wire", name: "14ct gold wire", unit: "g", unitCost: 38, stock: null },
  { id: "m-gold-9ct-sheet", name: "9ct gold sheet", unit: "g", unitCost: 26, stock: null },
  { id: "m-gold-9ct-wire", name: "9ct gold wire", unit: "g", unitCost: 26, stock: null },
  { id: "m-goldfill-wire", name: "Gold-fill wire", unit: "g", unitCost: 1.2, stock: 60 },
  { id: "m-vermeil-chain", name: "Gold vermeil chain", unit: "cm", unitCost: 0.55, stock: null },
  { id: "m-silver-sheet", name: "Sterling silver sheet", unit: "g", unitCost: 0.62, stock: 120 },
  { id: "m-silver-wire", name: "Silver wire", unit: "g", unitCost: 0.72, stock: null },
  { id: "m-bezel-wire", name: "Fine silver bezel wire", unit: "g", unitCost: 0.85, stock: 25 },
  { id: "m-solder-wire", name: "Solder wire", unit: "g", unitCost: 1.1, stock: 40 },
  { id: "m-silver-chain", name: "Silver curb chain", unit: "cm", unitCost: 0.18, stock: null },
  { id: "m-copper-sheet", name: "Copper sheet", unit: "g", unitCost: 0.09, stock: 200 },
  // stones & pearls
  { id: "m-sapphire", name: "Sapphire (3mm)", unit: "", unitCost: 38, stock: 6 },
  { id: "m-opal", name: "Opal cabochon", unit: "", unitCost: 28, stock: 4 },
  { id: "m-aquamarine", name: "Aquamarine (faceted)", unit: "", unitCost: 22, stock: null },
  { id: "m-topaz", name: "London blue topaz", unit: "", unitCost: 16, stock: 10 },
  { id: "m-moonstone", name: "Rainbow moonstone", unit: "", unitCost: 9, stock: 12 },
  { id: "m-baroque-pearl", name: "Baroque pearl (large)", unit: "", unitCost: 14, stock: 8 },
  { id: "m-pearls", name: "Freshwater pearls", unit: "", unitCost: 6.5, stock: 20 },
  // findings
  { id: "m-gold-posts", name: "9ct gold ear posts", unit: "pair", unitCost: 9, stock: null },
  { id: "m-goldfill-wires", name: "Gold-fill ear wires", unit: "pair", unitCost: 3.8, stock: null },
  { id: "m-silver-ear-wires", name: "Silver ear wires", unit: "pair", unitCost: 2.75, stock: null },
];

export const seedProducts: Product[] = [
  {
    // Healthy — a trio of solid 9ct gold bands, named for the three Graces
    // (beauty, adornment). The range's reliable everyday earner.
    id: "charites-stacking-trio",
    name: "Charites stacking trio",
    type: "Ring",
    workflow: "active",
    finalPrice: 240,
    materials: [
      { name: "9ct gold wire", quantity: 3, unit: "g", unitCost: 26, fromLibrary: true },
      { name: "Solder wire", quantity: 0.5, unit: "g", unitCost: 1.1, fromLibrary: true },
    ],
    labour: [
      { step: "Sawing & sizing ×3", minutes: 55, rate: 20 },
      { step: "Soldering & joining", minutes: 20, rate: 20 },
      { step: "Hammer-finish & polish", minutes: 15, rate: 20 },
    ],
    otherCosts: [],
  },
  {
    // Risky but real — the one piece deliberately under-priced. Large baroque
    // pearls and slow hand-wrapping, sold at £88, so it still clears ~£7 a pair
    // but on a ~9% margin, far below the 40% target (which wants ~£133). It
    // earns — just not enough. This is the dashboard's named problem and the
    // reprice-on-camera hero: bump it to ~£135 and the chip turns Healthy.
    id: "thetis-pearl-drops",
    name: "Thetis pearl drops",
    type: "Earrings",
    workflow: "active",
    finalPrice: 88,
    materials: [
      { name: "Baroque pearl (large)", quantity: 2, unit: "", unitCost: 14, fromLibrary: true },
      { name: "Gold-fill wire", quantity: 1.5, unit: "g", unitCost: 1.2, fromLibrary: true },
      { name: "Gold-fill ear wires", quantity: 1, unit: "pair", unitCost: 3.8, fromLibrary: true },
    ],
    labour: [
      { step: "Wire wrapping", minutes: 50, rate: 20 },
      { step: "Assembly & finishing", minutes: 40, rate: 20 },
    ],
    otherCosts: [],
  },
  {
    // Caution — earns, but sits under the healthy line. An aquamarine set in a
    // cast silver wave on a fine chain.
    id: "thalassa-wave-pendant",
    name: "Thalassa wave pendant",
    type: "Necklace",
    workflow: "active",
    finalPrice: 92,
    materials: [
      { name: "Aquamarine (faceted)", quantity: 1, unit: "", unitCost: 22, fromLibrary: true },
      { name: "Silver wire", quantity: 8, unit: "g", unitCost: 0.72, fromLibrary: true },
      { name: "Silver curb chain", quantity: 45, unit: "cm", unitCost: 0.18, fromLibrary: true },
    ],
    labour: [
      { step: "Forming the wave", minutes: 45, rate: 18 },
      { step: "Setting & finishing", minutes: 25, rate: 18 },
    ],
    otherCosts: [],
  },
  {
    // Healthy — rainbow moonstone bezel-set on a silver band.
    id: "selene-moonstone-ring",
    name: "Selene moonstone ring",
    type: "Ring",
    workflow: "active",
    finalPrice: 88,
    materials: [
      { name: "Rainbow moonstone", quantity: 1, unit: "", unitCost: 9, fromLibrary: true },
      { name: "Sterling silver sheet", quantity: 6, unit: "g", unitCost: 0.62, fromLibrary: true },
      { name: "Fine silver bezel wire", quantity: 2, unit: "g", unitCost: 0.85, fromLibrary: true },
    ],
    labour: [
      { step: "Bezel & band", minutes: 45, rate: 18 },
      { step: "Setting & polish", minutes: 30, rate: 18 },
    ],
    otherCosts: [],
  },
  {
    // Healthy, high value — a pair of sapphire studs in 9ct gold.
    id: "nyx-sapphire-studs",
    name: "Nyx sapphire studs",
    type: "Earrings",
    workflow: "active",
    finalPrice: 280,
    materials: [
      { name: "Sapphire (3mm)", quantity: 2, unit: "", unitCost: 38, fromLibrary: true },
      { name: "9ct gold ear posts", quantity: 1, unit: "pair", unitCost: 9, fromLibrary: true },
      { name: "9ct gold wire", quantity: 1, unit: "g", unitCost: 26, fromLibrary: true },
    ],
    labour: [
      { step: "Making settings", minutes: 35, rate: 22 },
      { step: "Setting stones & finish", minutes: 25, rate: 22 },
    ],
    otherCosts: [],
  },
  {
    // Healthy — an opal on a gold vermeil chain, named for the goddess of the
    // starry night.
    id: "astraea-opal-necklace",
    name: "Astraea opal necklace",
    type: "Necklace",
    workflow: "active",
    finalPrice: 165,
    materials: [
      { name: "Opal cabochon", quantity: 1, unit: "", unitCost: 28, fromLibrary: true },
      { name: "Gold vermeil chain", quantity: 42, unit: "cm", unitCost: 0.55, fromLibrary: true },
      { name: "Fine silver bezel wire", quantity: 2, unit: "g", unitCost: 0.85, fromLibrary: true },
    ],
    labour: [
      { step: "Bezel setting", minutes: 45, rate: 20 },
      { step: "Assembly & finishing", minutes: 35, rate: 20 },
    ],
    otherCosts: [],
  },
  {
    // The flagship — a woven 14ct gold statement collar, named for Harmonia
    // (whose necklace is the most famous in myth). The range's highest earner.
    id: "harmonia-collar",
    name: "Harmonia collar",
    type: "Necklace",
    workflow: "active",
    finalPrice: 520,
    materials: [
      { name: "14ct gold wire", quantity: 5, unit: "g", unitCost: 38, fromLibrary: true },
      { name: "Gold vermeil chain", quantity: 40, unit: "cm", unitCost: 0.55, fromLibrary: true },
    ],
    labour: [
      { step: "Linking & forming", minutes: 90, rate: 22 },
      { step: "Clasp & finishing", minutes: 60, rate: 22 },
    ],
    otherCosts: [],
  },
  {
    // Healthy — a wide silver cuff studded with freshwater pearls.
    id: "amphitrite-pearl-cuff",
    name: "Amphitrite pearl cuff",
    type: "Bracelet",
    workflow: "active",
    finalPrice: 145,
    materials: [
      { name: "Freshwater pearls", quantity: 5, unit: "", unitCost: 6.5, fromLibrary: true },
      { name: "Sterling silver sheet", quantity: 15, unit: "g", unitCost: 0.62, fromLibrary: true },
    ],
    labour: [
      { step: "Forming the cuff", minutes: 50, rate: 18 },
      { step: "Setting pearls & finish", minutes: 40, rate: 18 },
    ],
    otherCosts: [],
  },
  {
    // Healthy, accessible — London blue topaz drops on gold-fill, the everyday
    // entry price in the range.
    id: "maia-topaz-drops",
    name: "Maia topaz drops",
    type: "Earrings",
    workflow: "active",
    finalPrice: 110,
    materials: [
      { name: "London blue topaz", quantity: 2, unit: "", unitCost: 16, fromLibrary: true },
      { name: "Gold-fill ear wires", quantity: 1, unit: "pair", unitCost: 3.8, fromLibrary: true },
      { name: "Gold-fill wire", quantity: 2, unit: "g", unitCost: 1.2, fromLibrary: true },
    ],
    labour: [
      { step: "Wrapping & setting", minutes: 30, rate: 18 },
      { step: "Assembly & finish", minutes: 20, rate: 18 },
    ],
    otherCosts: [],
  },
  {
    // Active, no price yet — a heavy silver cuff with fused gold accents,
    // costed but never priced. Shows the "No price" state on the overview and
    // the "set a price" nudge on the dashboard. Named for the hearth-fire.
    id: "hestia-forged-cuff",
    name: "Hestia forged cuff",
    type: "Bracelet",
    workflow: "active",
    finalPrice: null,
    materials: [
      { name: "Sterling silver sheet", quantity: 25, unit: "g", unitCost: 0.62, fromLibrary: true },
      { name: "14ct gold wire", quantity: 2, unit: "g", unitCost: 38, fromLibrary: true },
    ],
    labour: [
      { step: "Forging & forming", minutes: 45, rate: 20 },
      { step: "Gold accents & finish", minutes: 25, rate: 20 },
    ],
    otherCosts: [],
  },
  {
    // The flagship draft: priced, with the fixed-cost layer AND market
    // benchmarks, so the detail shows the dashed business-cost / full-cost lines
    // and the "how you compare" drawer. A hand-hammered 9ct gold band, named for
    // the goddess of craft.
    id: "metis-hammered-band",
    name: "Metis hammered band",
    type: "Ring",
    workflow: "draft",
    finalPrice: 220,
    materials: [
      { name: "9ct gold sheet", quantity: 4, unit: "g", unitCost: 26, fromLibrary: true },
      { name: "Solder wire", quantity: 0.3, unit: "g", unitCost: 1.1, fromLibrary: true },
    ],
    labour: [
      { step: "Sawing & shaping", minutes: 20, rate: 20 },
      { step: "Soldering", minutes: 15, rate: 20 },
      { step: "Hammer texture & polish", minutes: 15, rate: 20 },
    ],
    otherCosts: [],
    benchmark: [
      { label: "Etsy — hammered gold band", price: 185 },
      { label: "Local goldsmith", price: 230 },
      { label: "Instagram shop", price: 270 },
    ],
  },
  {
    // Draft with no price — the one the dashboard surfaces as "continue where
    // you left off". A carved 9ct gold signet, named for the goddess of oaths:
    // named and costed, not yet priced.
    id: "themis-signet",
    name: "Themis signet",
    type: "Ring",
    workflow: "draft",
    finalPrice: null,
    materials: [{ name: "9ct gold sheet", quantity: 8, unit: "g", unitCost: 26, fromLibrary: true }],
    labour: [{ step: "Carving the seal face", minutes: 40, rate: 22 }],
    otherCosts: [],
  },
  {
    // Archived — an earlier copper line she's stopped making. Kept as a record,
    // out of the default overview and metrics. Named for the dawn.
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
