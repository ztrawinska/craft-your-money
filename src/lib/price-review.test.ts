/**
 * Tests for the scripted Price Check review (§10).
 */
import { test, expect } from "vitest";
import { generateReview, marginAtPrice, reviewScenarios, type ReviewContext } from "./price-review";

// the flagship: £42 gross, 20% VAT, £16.80 full cost → 52% margin
const flagship: ReviewContext = {
  finalPrice: 42,
  net: 35,
  profit: 18.2,
  marginPct: 0.52,
  directCost: 14.06,
  fullCost: 16.8,
  calculatedPrice: 28.12,
  targetMarginPct: 40,
  vatRatePct: 20,
};

test("margin at another price is computed on the net", () => {
  // at £50: net 41.67, minus 16.80 = 24.87 → 60%
  expect(marginAtPrice(flagship, 50)).toBeCloseTo(0.597, 2);
});

test("the opening verdict reflects the margin band", () => {
  expect(generateReview(flagship, null).verdict).toMatch(/strong/); // 52% > 40% target
  expect(generateReview({ ...flagship, marginPct: 0.08, profit: -1 }, null).verdict).toMatch(/loses money/);
  expect(generateReview({ ...flagship, marginPct: 0.2 }, null).verdict).toMatch(/thin/);
});

test("the opening review has exactly three findings", () => {
  expect(generateReview(flagship, null).findings).toHaveLength(3);
});

test("the market follow-up admits the limit it can't know", () => {
  expect(generateReview(flagship, "market").verdict).toMatch(/can't see|can.t know/i);
});

test("scenarios exclude the current price", () => {
  const prices = reviewScenarios(flagship).map((s) => s.price);
  expect(prices).not.toContain(42);
  expect(prices.length).toBeGreaterThan(0);
});
