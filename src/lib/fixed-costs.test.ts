/**
 * Tests for the fixed-cost math (PRD §6).
 */
import { test, expect } from "vitest";
import {
  fixedCostPerUnit,
  monthlyEquivalent,
  totalMonthlyFixed,
  type FixedCost,
} from "./fixed-costs";

const monthly = (amount: number): FixedCost => ({
  id: "x",
  label: "x",
  amount,
  period: "monthly",
  monthsActive: 12,
});

test("a seasonal cost is spread over the year", () => {
  expect(monthlyEquivalent(monthly(120))).toBe(120);
  expect(
    monthlyEquivalent({ id: "s", label: "s", amount: 600, period: "seasonal", monthsActive: 4 }),
  ).toBeCloseTo(200, 2); // 600 × 4/12
});

test("per-unit spreads the monthly total evenly", () => {
  const costs = [monthly(220), monthly(54)]; // £274 / month
  const share = fixedCostPerUnit(costs, { method: "per-unit", volume: 100 }, 0.5);
  expect(share).toBeCloseTo(2.74, 2); // 274 / 100, labour hours ignored
});

test("bench-time weights by the piece's labour hours", () => {
  const costs = [monthly(400)];
  // 400 total, 80 labour-hours/month, a piece taking 2h → (2/80)×400 = 10
  expect(fixedCostPerUnit(costs, { method: "bench-time", volume: 80 }, 2)).toBeCloseTo(10, 2);
  // a shorter piece carries less
  expect(fixedCostPerUnit(costs, { method: "bench-time", volume: 80 }, 0.5)).toBeCloseTo(2.5, 2);
});

test("no costs or zero volume blocks the share (null)", () => {
  expect(totalMonthlyFixed([])).toBe(0);
  expect(fixedCostPerUnit([], { method: "per-unit", volume: 100 }, 1)).toBe(null);
  expect(fixedCostPerUnit([monthly(274)], { method: "per-unit", volume: 0 }, 1)).toBe(null);
  expect(fixedCostPerUnit([monthly(274)], { method: "per-unit", volume: null }, 1)).toBe(null);
});
