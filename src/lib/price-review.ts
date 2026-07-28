/**
 * Price Check — the assistant's scripted review (PRD §10). It reviews, it never
 * sets the price. This is the deterministic fallback, assembled from the real
 * numbers; a live Claude API would return the same shape in its place.
 *
 * Bounded by design: a verdict, three findings, two preview-only scenarios, a
 * provenance footer, and a fixed set of follow-up topics (so it can't wander).
 *
 * Pure — safe to import anywhere, and testable.
 */
export type ReviewContext = {
  finalPrice: number;
  net: number;
  profit: number;
  marginPct: number;
  directCost: number;
  fullCost: number | null;
  calculatedPrice: number | null;
  targetMarginPct: number;
  vatRatePct: number | null;
};

export type Scenario = { price: number; marginPct: number };
export type Provenance = { used: string[]; assumed: string[]; cantKnow: string[] };
export type Review = { verdict: string; findings: string[] };

export type ReviewTopic = "margin" | "market" | "costs";
export const REVIEW_TOPICS: { id: ReviewTopic; label: string }[] = [
  { id: "margin", label: "Why this margin?" },
  { id: "market", label: "Compare to market" },
  { id: "costs", label: "If my costs rise?" },
];

const money = (v: number) => `£${v.toFixed(2)}`;
const pct = (m: number) => `${Math.round(m * 100)}%`;
const relevantCost = (ctx: ReviewContext) => ctx.fullCost ?? ctx.directCost;

/** The margin this price would earn if it were `price` instead. */
export function marginAtPrice(ctx: ReviewContext, price: number): number {
  const net = ctx.vatRatePct ? price / (1 + ctx.vatRatePct / 100) : price;
  return net > 0 ? (net - relevantCost(ctx)) / net : 0;
}

/** Two other prices and what they'd mean — shown, never applied. */
export function reviewScenarios(ctx: ReviewContext): Scenario[] {
  const lower = Math.max(Math.round(ctx.directCost), Math.round(ctx.calculatedPrice ?? ctx.finalPrice * 0.9));
  const higher = Math.round(ctx.finalPrice * 1.15);
  const current = Math.round(ctx.finalPrice);
  return [lower, higher]
    .filter((p, i, arr) => p !== current && arr.indexOf(p) === i)
    .map((price) => ({ price, marginPct: marginAtPrice(ctx, price) }));
}

/** Used / Assumed / Can't know — the review closes by admitting its limits. */
export function reviewProvenance(ctx: ReviewContext): Provenance {
  return {
    used: [
      "Your materials & labour",
      "The price you set",
      ctx.vatRatePct ? `Your ${ctx.vatRatePct}% VAT` : "No VAT",
    ],
    assumed: [`Your ${ctx.targetMarginPct}% margin target is the goal`],
    cantKnow: ["What buyers will actually pay", "Your competitors' prices"],
  };
}

export function generateReview(ctx: ReviewContext, topic: ReviewTopic | null): Review {
  const relevant = relevantCost(ctx);
  const overTarget = ctx.marginPct >= ctx.targetMarginPct / 100;

  if (topic === "margin") {
    return {
      verdict: "Your margin is what's left after every cost — measured on the price before VAT.",
      findings: [
        `On ${money(ctx.finalPrice)}, VAT leaves ${money(ctx.net)} net.`,
        `Take off ${money(relevant)} of cost and ${money(ctx.profit)} is yours — ${pct(ctx.marginPct)}.`,
        `Your target is ${ctx.targetMarginPct}%, so you're ${overTarget ? "above" : "below"} it.`,
      ],
    };
  }
  if (topic === "market") {
    return {
      verdict: "I can't see what the market charges — that's the one thing I can't know.",
      findings: [
        "Add a few competitor prices in Market benchmark and I can compare.",
        "Handmade often earns a premium; only you know your buyers.",
        "A price above cost and target is a sound floor to negotiate up from.",
      ],
    };
  }
  if (topic === "costs") {
    const worse: ReviewContext = {
      ...ctx,
      directCost: ctx.directCost * 1.1,
      fullCost: ctx.fullCost == null ? null : ctx.fullCost * 1.1,
    };
    const m = marginAtPrice(worse, ctx.finalPrice);
    return {
      verdict: `If your costs rose 10%, this price would earn about ${pct(m)}.`,
      findings: [
        `Cost per piece would climb from ${money(relevant)} to ${money(relevant * 1.1)}.`,
        `At ${money(ctx.finalPrice)}, margin would slip from ${pct(ctx.marginPct)} to ${pct(m)}.`,
        m < ctx.targetMarginPct / 100
          ? "That would drop you under target — worth pricing in a buffer."
          : "You'd still clear your target — a healthy cushion.",
      ],
    };
  }

  // the opening review
  const verdict =
    ctx.profit < 0
      ? "This price loses money — it's below what the piece costs you."
      : overTarget
        ? "This price is strong — comfortably above your target."
        : ctx.marginPct >= 0.3
          ? "This price is healthy, though a little under your target."
          : ctx.marginPct >= 0.15
            ? "This price is thin — worth a second look."
            : "This price is risky — barely above cost.";

  return {
    verdict,
    findings: [
      `At ${money(ctx.finalPrice)}, your margin is ${pct(ctx.marginPct)} — ${overTarget ? "above" : "below"} your ${ctx.targetMarginPct}% target.`,
      ctx.fullCost != null
        ? `It costs ${money(ctx.directCost)} to make, ${money(ctx.fullCost)} once business costs are shared in.`
        : `It costs ${money(ctx.directCost)} to make.`,
      ctx.vatRatePct
        ? `After ${ctx.vatRatePct}% VAT you keep ${money(ctx.net)}, leaving ${money(ctx.profit)} profit.`
        : `You keep ${money(ctx.net)}, leaving ${money(ctx.profit)} profit.`,
    ],
  };
}
