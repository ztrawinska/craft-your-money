/**
 * Guards the shared product data: after restructuring materials/labour into
 * quantity×unit-cost and minutes×rate, the derived numbers must be unchanged.
 */
import { test, expect } from "vitest";
import { labourLineCost, materialLineCost, pricingFor } from "./products";
import { seedProducts } from "./seed";

const seed = (id: string) => seedProducts.find((p) => p.id === id)!;

test("line-cost helpers price a row correctly", () => {
  expect(materialLineCost({ name: "x", quantity: 4, unit: "g", unitCost: 0.62 })).toBeCloseTo(2.48, 2);
  expect(labourLineCost({ step: "x", minutes: 20, rate: 15 })).toBeCloseTo(5, 2);
});

test("the flagship still reduces to its known figures", () => {
  const p = pricingFor(seed("hammered-band"));
  expect(p.directCost).toBeCloseTo(14.06, 2);
  expect(p.fullCost).toBeCloseTo(16.8, 2);
  expect(p.profit).toBeCloseTo(18.2, 2);
  expect(p.marginPct).toBeCloseTo(0.52, 2);
});

test("stacking set is still a real loss", () => {
  expect(pricingFor(seed("stacking-set")).profit! < 0).toBe(true);
});
