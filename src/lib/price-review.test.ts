/**
 * Tests for the scripted Price Check review (§10).
 */
import { test, expect } from "vitest";
import { generateReview, marginAtPrice, reviewScenarios, type ReviewContext } from "./price-review";

// the flagship: £42 gross, 20% VAT, £16.80 full cost → 52% margin.
// Make cost £14.06 = £2.81 materials + £11.25 labour; labour dominates.
const flagship: ReviewContext = {
  symbol: "£",
  finalPrice: 42,
  net: 35,
  profit: 18.2,
  marginPct: 0.52,
  directCost: 14.06,
  fullCost: 16.8,
  calculatedPrice: 28.12,
  targetMarginPct: 40,
  vatRatePct: 20,
  costParts: [
    { label: "Materials", amount: 2.81 },
    { label: "Labour", amount: 11.25 },
    { label: "Other", amount: 0 },
  ],
  topLine: { label: "Shaping", amount: 5 },
  market: null,
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

test("the opening findings synthesise rather than restate the numbers", () => {
  const [composition, placement, sensitivity] = generateReview(flagship, null).findings;
  // labour is 80% of the make cost → "selling your time"
  expect(composition).toMatch(/selling your time/i);
  // £42 sits above the calculated £28.12 → a cushion
  expect(placement).toMatch(/above the £28\.12/);
  expect(placement).toMatch(/cushion/);
  // sensitivity names the single biggest line
  expect(sensitivity).toMatch(/Shaping is your single biggest cost/);
});

test("a loss reframes the placement finding to 'get the price up first'", () => {
  const [, placement] = generateReview({ ...flagship, profit: -3, marginPct: -0.05 }, null).findings;
  expect(placement).toMatch(/under what each piece costs/);
});

test("the market follow-up admits the limit when there are no entered prices", () => {
  expect(generateReview(flagship, "market").verdict).toMatch(/can't see|can.t know/i);
});

test("the market follow-up positions against entered prices when they exist", () => {
  const withMarket = {
    ...flagship,
    market: { min: 38, max: 52, median: 45, count: 3, position: "within" as const },
  };
  const review = generateReview(withMarket, "market");
  expect(review.verdict).toMatch(/3 prices you noted/);
  expect(review.verdict).toMatch(/inside the range/);
  // £42 vs median £45 → ~7% below
  expect(review.findings[0]).toMatch(/below the median of £45\.00/);
});

test("scenarios exclude the current price", () => {
  const prices = reviewScenarios(flagship).map((s) => s.price);
  expect(prices).not.toContain(42);
  expect(prices.length).toBeGreaterThan(0);
});
