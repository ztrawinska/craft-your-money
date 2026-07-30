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
import type { MarketRead } from "@/lib/benchmark";

export type CostPart = { label: string; amount: number };

export type ReviewContext = {
  symbol: string; // the account currency symbol, so the review reads in it too
  finalPrice: number;
  net: number;
  profit: number;
  marginPct: number;
  directCost: number;
  fullCost: number | null;
  calculatedPrice: number | null;
  targetMarginPct: number;
  vatRatePct: number | null;
  // The make-cost split (Materials / Labour / Other) and the single largest
  // cost line — so the review can say something the numbers above don't already
  // show: what you're really selling, and where the risk sits.
  costParts: CostPart[];
  topLine: CostPart | null;
  // The market read against the maker's entered competitor prices (§11), or
  // null when they haven't noted any — then the review admits it can't see.
  market: MarketRead | null;
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

// Money is formatted in the account currency — each function binds it to ctx.
const fmt = (ctx: ReviewContext) => (v: number) => `${ctx.symbol}${v.toFixed(2)}`;
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
  const money = fmt(ctx);
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
    const m = ctx.market;
    if (m) {
      const range = m.min === m.max ? money(m.min) : `${money(m.min)}–${money(m.max)}`;
      const vsMedian = ((ctx.finalPrice - m.median) / m.median) * 100;
      const medianLine =
        Math.abs(vsMedian) < 3
          ? `right around the median of ${money(m.median)}`
          : `${Math.abs(Math.round(vsMedian))}% ${vsMedian > 0 ? "above" : "below"} the median of ${money(m.median)}`;
      const posLine =
        m.position === "above"
          ? `you're above all ${m.count} — the premium spot, which only holds if the piece looks it.`
          : m.position === "below"
            ? `you're under all ${m.count} — there's likely room to ask more.`
            : "you sit inside the range — a defensible place to be.";
      return {
        verdict: `Against the ${m.count} price${m.count === 1 ? "" : "s"} you noted (${range}), ${posLine}`,
        findings: [
          `At ${money(ctx.finalPrice)} you're ${medianLine}.`,
          "Handmade often earns a premium — sitting high can be right when the work shows it.",
          "These are the prices you entered, not the live market — I still can't see what buyers actually pay.",
        ],
      };
    }
    return {
      verdict: "I can't see what the market charges — that's the one thing I can't know.",
      findings: [
        "Add a few prices you've seen in Market benchmark below, and I'll position you against them.",
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

  // the opening review — the verdict names the band; the findings say things
  // the numbers above don't already show.
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

  return { verdict, findings: [composition(ctx), placement(ctx), sensitivity(ctx)] };
}

/** What you're really selling — the part that dominates the make cost. */
function composition(ctx: ReviewContext): string {
  const parts = ctx.costParts.filter((p) => p.amount > 0);
  if (ctx.directCost <= 0 || parts.length === 0) {
    return `This piece costs almost nothing to make — the price is nearly all margin.`;
  }
  const top = parts.reduce((a, b) => (b.amount > a.amount ? b : a));
  const share = top.amount / ctx.directCost;
  if (share < 0.55) {
    return `Your cost is split fairly evenly — no single part dominates, so there's no one lever to pull first.`;
  }
  if (top.label === "Labour") {
    return `Labour is ${pct(share)} of what it costs to make — you're mostly selling your time, so your hourly rate is what really sets this price.`;
  }
  if (top.label === "Materials") {
    return `Materials are ${pct(share)} of the make cost — this price leans more on what you pay for supplies than on your time.`;
  }
  return `${top.label} is ${pct(share)} of what it costs to make — that's where this price is really decided.`;
}

/** Where the price sits versus the one the costs and target imply. */
function placement(ctx: ReviewContext): string {
  const money = fmt(ctx);
  if (ctx.profit < 0) {
    return `You're ${money(-ctx.profit)} under what each piece costs — the price needs to come up before anything else matters.`;
  }
  if (ctx.calculatedPrice == null) {
    return `Each piece leaves you ${money(ctx.profit)} after every cost.`;
  }
  const diff = ctx.finalPrice - ctx.calculatedPrice;
  const rel = diff / ctx.calculatedPrice;
  if (diff > ctx.calculatedPrice * 0.02) {
    return `You've set ${money(ctx.finalPrice)} — ${money(diff)} (${pct(rel)}) above the ${money(ctx.calculatedPrice)} your costs and target imply. That cushion is why the margin's comfortable; it holds while buyers see the piece as worth it.`;
  }
  if (diff < -ctx.calculatedPrice * 0.02) {
    return `You've priced ${money(-diff)} below the ${money(ctx.calculatedPrice)} your costs and target imply — there's room to ask more and still hit your target.`;
  }
  return `You're sitting right on the price your costs and target imply — the margin comes straight from the target, with no extra cushion.`;
}

/** The risk — what a rise in the single biggest cost would do to the margin. */
function sensitivity(ctx: ReviewContext): string {
  const money = fmt(ctx);
  const line = ctx.topLine;
  if (line == null || line.amount <= 0 || ctx.net <= 0) {
    return ctx.vatRatePct
      ? `After ${ctx.vatRatePct}% VAT you keep ${money(ctx.net)}, leaving ${money(ctx.profit)} profit.`
      : `You keep ${money(ctx.net)}, leaving ${money(ctx.profit)} profit.`;
  }
  const newMargin = (ctx.net - (relevantCost(ctx) + line.amount * 0.1)) / ctx.net;
  const tail =
    newMargin < ctx.targetMarginPct / 100
      ? " — that'd tip you under target."
      : " — you could absorb it.";
  return `${line.label} is your single biggest cost at ${money(line.amount)}. If it rose 10%, your margin would move from ${pct(ctx.marginPct)} to ${pct(newMargin)}${tail}`;
}
