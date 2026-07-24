/**
 * Guards the shared product data: after restructuring materials/labour into
 * quantity×unit-cost and minutes×rate, the derived numbers must be unchanged.
 */
import { test, expect } from "vitest";
import { getProduct, labourLineCost, materialLineCost, pricingFor } from "./products";

test("line-cost helpers price a row correctly", () => {
  expect(materialLineCost({ name: "x", quantity: 4, unit: "g", unitCost: 0.62 })).toBeCloseTo(2.48, 2);
  expect(labourLineCost({ step: "x", minutes: 20, rate: 15 })).toBeCloseTo(5, 2);
});

test("the flagship still reduces to its known figures", () => {
  const p = pricingFor(getProduct("hammered-band")!);
  expect(p.directCost).toBeCloseTo(14.06, 2);
  expect(p.fullCost).toBeCloseTo(16.8, 2);
  expect(p.profit).toBeCloseTo(18.2, 2);
  expect(p.marginPct).toBeCloseTo(0.52, 2);
});

test("stacking set is still a real loss", () => {
  expect(pricingFor(getProduct("stacking-set")!).profit! < 0).toBe(true);
});
