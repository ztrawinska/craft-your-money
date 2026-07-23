/**
 * Tests for the status model. These lock the spec's numbers (PRD §8) as
 * executable rules — if a threshold or a label ever drifts, a test fails.
 *
 * Run with: npm test
 */
import { test, expect } from "vitest";
import {
  profitabilityFromMargin,
  profitTone,
  statusChip,
  sortKey,
  compareByStatus,
  DEFAULT_THRESHOLDS,
} from "./status";

test("margin maps to status at the §8 thresholds", () => {
  expect(profitabilityFromMargin(0.64)).toBe("healthy");
  expect(profitabilityFromMargin(0.3)).toBe("healthy"); // ≥30% is healthy
  expect(profitabilityFromMargin(0.2999)).toBe("caution");
  expect(profitabilityFromMargin(0.15)).toBe("caution"); // ≥15% is caution
  expect(profitabilityFromMargin(0.1499)).toBe("risky");
  expect(profitabilityFromMargin(-0.1)).toBe("risky"); // negatives are risky
});

test("thresholds are adjustable", () => {
  const strict = { healthyMin: 0.5, cautionMin: 0.25 };
  expect(profitabilityFromMargin(0.4, strict)).toBe("caution");
  expect(profitabilityFromMargin(0.4, DEFAULT_THRESHOLDS)).toBe("healthy");
});

test("active products render a status chip with margin", () => {
  const base = { workflow: "active" as const };
  expect(statusChip({ ...base, hasPrice: true, marginPct: 0.64 })).toEqual({
    label: "Healthy · 64%",
    tone: "positive",
  });
  expect(statusChip({ ...base, hasPrice: true, marginPct: 0.22 })).toEqual({
    label: "Caution · 22%",
    tone: "caution",
  });
  expect(statusChip({ ...base, hasPrice: true, marginPct: 0.08 })).toEqual({
    label: "Risky · 8%",
    tone: "critical",
  });
});

test("active with no price is neutral, not a health judgement", () => {
  expect(
    statusChip({ workflow: "active", hasPrice: false, marginPct: null }),
  ).toEqual({ label: "No price", tone: "neutral" });
});

test("a priced draft previews the verdict with 'Would be'", () => {
  expect(
    statusChip({ workflow: "draft", hasPrice: true, marginPct: 0.52 }),
  ).toEqual({ label: "Would be Healthy · 52%", tone: "positive" });
});

test("a draft with no price is just 'Draft'", () => {
  expect(
    statusChip({ workflow: "draft", hasPrice: false, marginPct: null }),
  ).toEqual({ label: "Draft", tone: "neutral" });
});

test("profit is coloured only for the three health tones", () => {
  expect(profitTone("healthy")).toBe("positive");
  expect(profitTone("caution")).toBe("caution");
  expect(profitTone("risky")).toBe("critical");
  expect(profitTone("no-price")).toBe(null);
});

test("overview sorts problems first, drafts last", () => {
  const products = [
    { workflow: "draft" as const, hasPrice: false, marginPct: null },
    { workflow: "active" as const, hasPrice: true, marginPct: 0.64 }, // healthy
    { workflow: "active" as const, hasPrice: false, marginPct: null }, // no price
    { workflow: "active" as const, hasPrice: true, marginPct: 0.08 }, // risky
    { workflow: "active" as const, hasPrice: true, marginPct: 0.22 }, // caution
  ];
  const order = [...products].sort(compareByStatus).map(sortKey);
  expect(order).toEqual(["risky", "caution", "healthy", "no-price", "draft"]);
});
