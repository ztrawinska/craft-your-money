/**
 * Tests for the pricing arithmetic (PRD §6). These lock the formulas so the
 * shared product data stays internally consistent across every screen.
 *
 * Run with: npm test
 */
import { test, expect } from "vitest";
import {
  computePricing,
  computePricingFromDirect,
  grossForTargetProfit,
  priceWarning,
} from "./pricing";

test("the flagship product's numbers are internally consistent (§6)", () => {
  const p = computePricing({
    materials: [2.48, 0.33],
    labour: [5.0, 3.75, 2.5],
    other: [],
    finalPrice: 42,
    targetMarginPct: 40,
    vatRatePct: 20,
    businessCostShare: 2.74,
  });
  expect(p.directCost).toBeCloseTo(14.06, 2);
  expect(p.fullCost).toBeCloseTo(16.8, 2);
  expect(p.net).toBeCloseTo(35, 2); // 42 / 1.2
  expect(p.profit).toBeCloseTo(18.2, 2); // 35 − 16.80
  expect(p.marginPct).toBeCloseTo(0.52, 2); // 18.20 / 35
  // The suggestion targets 40% on the FULL cost (£16.80), so it hits the target
  // once business costs are shared in — not the direct cost.
  expect(p.calculatedBeforeVat).toBeCloseTo(28.0, 2); // 16.80 / 0.6
  expect(p.calculatedPrice).toBeCloseTo(33.6, 2); // 28.00 × 1.2
});

test("accepting the calculated price lands exactly on target, no warning (§6)", () => {
  // direct £25.55 + business share £2.74 = £28.29 full cost, 40% target, 20% VAT
  const opts = { targetMarginPct: 40, vatRatePct: 20, businessCostShare: 2.74 };
  const suggestion = computePricingFromDirect(25.55, { finalPrice: null, ...opts });
  expect(suggestion.calculatedPrice).toBeCloseTo(56.58, 2); // 28.29 / 0.6 × 1.2

  const at = computePricingFromDirect(25.55, { finalPrice: suggestion.calculatedPrice!, ...opts });
  expect(at.marginPct).toBeCloseTo(0.4, 3); // exactly the target
  expect(priceWarning(at, { finalPrice: suggestion.calculatedPrice!, ...opts })).toBe(null);
});

test("back-solving a price from a target profit round-trips (§6)", () => {
  // flagship full cost £16.80, 20% VAT. Want £25 profit.
  const gross = grossForTargetProfit(25, 16.8, 20);
  expect(gross).toBeCloseTo(50.16, 2); // (16.80 + 25) × 1.2

  // feeding it back through the forward computation yields exactly £25 profit
  const p = computePricingFromDirect(14.06, {
    finalPrice: gross,
    targetMarginPct: 40,
    vatRatePct: 20,
    businessCostShare: 2.74,
  });
  expect(p.profit).toBeCloseTo(25, 2);
});

test("back-solving a target profit with VAT off adds nothing on top", () => {
  expect(grossForTargetProfit(25, 16.8, null)).toBeCloseTo(41.8, 2);
});

test("no final price yields no net, profit, or margin — but still a suggestion", () => {
  const p = computePricing({
    materials: [5],
    labour: [10],
    other: [],
    finalPrice: null,
    targetMarginPct: 40,
    vatRatePct: 20,
    businessCostShare: null,
  });
  expect(p.net).toBe(null);
  expect(p.profit).toBe(null);
  expect(p.marginPct).toBe(null);
  expect(p.calculatedPrice).not.toBe(null);
});

test("without fixed costs, margin runs on direct cost", () => {
  const p = computePricing({
    materials: [20],
    labour: [10],
    other: [],
    finalPrice: 60,
    targetMarginPct: 40,
    vatRatePct: null,
    businessCostShare: null,
  });
  expect(p.directCost).toBe(30);
  expect(p.fullCost).toBe(null);
  expect(p.net).toBe(60);
  expect(p.profit).toBe(30);
  expect(p.marginPct).toBeCloseTo(0.5, 2);
});

test("a price below cost is a real loss (negative margin)", () => {
  const p = computePricing({
    materials: [20],
    labour: [15],
    other: [],
    finalPrice: 38,
    targetMarginPct: 40,
    vatRatePct: 20,
    businessCostShare: null,
  });
  expect(p.profit! < 0).toBe(true);
  expect(p.marginPct! < 0).toBe(true);
});

// ── price warnings (§6) ───────────────────────────────────────────────────

test("warns of a real loss when the price is below cost", () => {
  const p = computePricingFromDirect(30, {
    finalPrice: 20,
    targetMarginPct: 40,
    vatRatePct: null,
    businessCostShare: null,
  });
  const w = priceWarning(p, { finalPrice: 20, targetMarginPct: 40, vatRatePct: null });
  expect(w?.severity).toBe("loss");
  expect(w?.text).toMatch(/below your costs/);
});

test("VAT can turn a gross profit into a net loss", () => {
  // final 38 gross, direct 34.23, 20% VAT → net 31.67 < cost
  const p = computePricingFromDirect(34.23, {
    finalPrice: 38,
    targetMarginPct: 40,
    vatRatePct: 20,
    businessCostShare: null,
  });
  const w = priceWarning(p, { finalPrice: 38, targetMarginPct: 40, vatRatePct: 20 });
  expect(w?.severity).toBe("loss");
  expect(w?.text).toMatch(/before VAT/);
});

test("fixed costs can turn a direct-cost profit into a loss", () => {
  // direct 30, final 33 (no VAT), business share 5 → full 35 > 33
  const p = computePricingFromDirect(30, {
    finalPrice: 33,
    targetMarginPct: 40,
    vatRatePct: null,
    businessCostShare: 5,
  });
  const w = priceWarning(p, { finalPrice: 33, targetMarginPct: 40, vatRatePct: null });
  expect(w?.severity).toBe("loss");
  expect(w?.text).toMatch(/overhead/);
});

test("profitable but below the margin target is a gentle caution", () => {
  const p = computePricingFromDirect(35.75, {
    finalPrice: 55,
    targetMarginPct: 40,
    vatRatePct: 20,
    businessCostShare: null,
  });
  const w = priceWarning(p, { finalPrice: 55, targetMarginPct: 40, vatRatePct: 20 });
  expect(w?.severity).toBe("below-target");
});

test("a healthy price above target has no warning", () => {
  const p = computePricingFromDirect(25.55, {
    finalPrice: 68,
    targetMarginPct: 40,
    vatRatePct: 20,
    businessCostShare: null,
  });
  expect(priceWarning(p, { finalPrice: 68, targetMarginPct: 40, vatRatePct: 20 })).toBe(null);
});
