/**
 * Tests for the market benchmark math (§11).
 */
import { test, expect } from "vitest";
import { marketRead, type BenchmarkPrice } from "./benchmark";

const prices: BenchmarkPrice[] = [
  { label: "Etsy shop A", price: 38 },
  { label: "", price: 55 },
  { label: "market stall", price: 46 },
];

test("no read without prices or without a set price", () => {
  expect(marketRead(42, [])).toBeNull();
  expect(marketRead(null, prices)).toBeNull();
});

test("range and median over the entered prices", () => {
  const r = marketRead(42, prices)!;
  expect(r.min).toBe(38);
  expect(r.max).toBe(55);
  expect(r.median).toBe(46); // odd count → middle value
  expect(r.count).toBe(3);
});

test("median averages the middle two on an even count", () => {
  const r = marketRead(50, [...prices, { label: "", price: 60 }])!; // 38,46,55,60
  expect(r.median).toBe((46 + 55) / 2);
});

test("position: below the cheapest, within the range, above the dearest", () => {
  expect(marketRead(30, prices)!.position).toBe("below");
  expect(marketRead(46, prices)!.position).toBe("within");
  expect(marketRead(38, prices)!.position).toBe("within"); // == min is within
  expect(marketRead(55, prices)!.position).toBe("within"); // == max is within
  expect(marketRead(70, prices)!.position).toBe("above");
});

test("zero/blank prices are ignored", () => {
  const r = marketRead(42, [{ label: "", price: 0 }, { label: "", price: 40 }])!;
  expect(r.count).toBe(1);
  expect(r.min).toBe(40);
});
