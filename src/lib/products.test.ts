/**
 * Guards the shared product data: after restructuring materials/labour into
 * quantity×unit-cost and minutes×rate, the derived numbers must be unchanged —
 * and the authored sample range must keep telling its story (see the header
 * of `seed.ts`): one example of every state the app can display.
 */
import { test, expect } from "vitest";
import { labourLineCost, materialLineCost, pricingFor } from "./products";
import { seedFixedCostConfig, seedFixedCosts, seedProducts } from "./seed";
import { DEFAULT_SETTINGS } from "./settings";
import { DEFAULT_THRESHOLDS, profitabilityFromMargin, type Profitability } from "./status";

const seed = (id: string) => {
  const p = seedProducts.find((p) => p.id === id);
  if (!p) throw new Error(`no seed product "${id}" — ids: ${seedProducts.map((p) => p.id).join(", ")}`);
  return p;
};

/** The seed's own business-cost layer: £274/month over 100 pieces → £2.74 each. */
const SHARE = seedFixedCosts.reduce((sum, c) => sum + c.amount, 0) / (seedFixedCostConfig.volume ?? NaN);

test("line-cost helpers price a row correctly", () => {
  expect(materialLineCost({ name: "x", quantity: 4, unit: "g", unitCost: 0.62 })).toBeCloseTo(2.48, 2);
  expect(labourLineCost({ step: "x", minutes: 20, rate: 15 })).toBeCloseTo(5, 2);
});

test("the seed's fixed-cost layer is the £2.74 share the comments promise", () => {
  expect(SHARE).toBeCloseTo(2.74, 2);
});

test("the flagship still reduces to its known figures (with the £2.74 share)", () => {
  // Harmonia collar: £520 gross, VAT on at 20% → £433.33 net.
  const p = pricingFor(seed("harmonia-collar"), DEFAULT_SETTINGS, SHARE);
  expect(p.directCost).toBeCloseTo(267.0, 2);
  expect(p.fullCost).toBeCloseTo(269.74, 2);
  expect(p.profit).toBeCloseTo(163.59, 2);
  expect(p.marginPct).toBeCloseTo(0.3775, 3);
});

test("Thetis is the one Risky piece — thin, not underwater", () => {
  const p = pricingFor(seed("thetis-pearl-drops"), DEFAULT_SETTINGS, SHARE);
  expect(p.profit).toBeGreaterThan(0);
  expect(p.marginPct).toBeLessThan(DEFAULT_THRESHOLDS.cautionMin);
});

test("the range shows one example of every state, as authored", () => {
  const active: Record<Profitability, string[]> = { healthy: [], caution: [], risky: [], "no-price": [] };
  const drafts: string[] = [];
  for (const p of seedProducts) {
    if (p.workflow === "draft") {
      drafts.push(p.id);
      continue;
    }
    const { marginPct } = pricingFor(p, DEFAULT_SETTINGS, SHARE);
    active[marginPct === null ? "no-price" : profitabilityFromMargin(marginPct)].push(p.id);
  }
  expect(active.caution).toEqual(["thalassa-wave-pendant"]);
  expect(active.risky).toEqual(["thetis-pearl-drops"]);
  expect(active["no-price"]).toEqual(["hestia-forged-cuff"]);
  expect(active.healthy.length).toBeGreaterThanOrEqual(6); // "most pieces Healthy"
  expect(drafts).toEqual(["metis-hammered-band", "themis-signet"]); // one priced, one not
});
