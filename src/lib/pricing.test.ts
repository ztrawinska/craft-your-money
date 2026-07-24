/**
 * Tests for the pricing arithmetic (PRD §6). These lock the formulas so the
 * shared product data stays internally consistent across every screen.
 *
 * Run with: npm test
 */
import { test, expect } from "vitest";
import { computePricing } from "./pricing";

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
  expect(p.calculatedBeforeVat).toBeCloseTo(23.43, 2);
  expect(p.calculatedPrice).toBeCloseTo(28.12, 2); // 23.43 × 1.2
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
