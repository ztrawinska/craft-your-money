/**
 * Price Check — the LIVE review (PRD §10). Same shape as the scripted
 * generateReview, but written by Claude from the real numbers. Server-only:
 * it holds the API key and the SDK, and is imported lazily by the Server Action
 * so it never reaches the client bundle.
 *
 * The scripted version in price-review.ts remains the fallback (no key / error).
 */
import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  REVIEW_TOPICS,
  type Review,
  type ReviewContext,
  type ReviewTopic,
} from "./price-review";

// Haiku is the cheapest tier ($1/$5 per MTok) and handles this bounded review
// comfortably. One place to change it — swap up to "claude-opus-5" for the
// premium tier if a check ever needs deeper reasoning.
const MODEL = "claude-haiku-4-5";

const SYSTEM = `You are the assistant inside "Craft Your Money", a pricing app for handmade jewellery makers. You review one product's price. You never set or recommend a specific number — you help the maker see what their price means and decide for themselves.

Voice: calm, plain, encouraging. No finance jargon — say "what it costs to make", "what you keep", "your profit". A warning is a quiet helper, never an alarm.

You are given the real numbers. Ground every sentence in them — but say something they don't already show on the screen: what the maker is really selling (the cost that dominates), where the price sits versus the one the costs imply, and where the risk is (what a rise in the biggest cost would do). Don't just restate the margin and the profit; those are already visible. Be honest about what you cannot know: you can't see the live market or what buyers will actually pay.

Return a one-sentence verdict and exactly three short findings, each grounded in the numbers.`;

// Structured output. JSON-schema array item constraints aren't supported, so we
// ask for three findings in the prompt and trim to three in code.
const SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    verdict: { type: "string" },
    findings: { type: "array", items: { type: "string" } },
  },
  required: ["verdict", "findings"],
};

const money = (v: number) => `£${v.toFixed(2)}`;
const pct = (m: number) => `${Math.round(m * 100)}%`;

function buildPrompt(ctx: ReviewContext, topic: ReviewTopic | null): string {
  const facts = [
    `Your price (what the buyer pays): ${money(ctx.finalPrice)}`,
    ctx.vatRatePct
      ? `After ${ctx.vatRatePct}% VAT you keep: ${money(ctx.net)}`
      : `No VAT — you keep the full ${money(ctx.finalPrice)}`,
    `What it costs to make (materials + labour + other): ${money(ctx.directCost)}`,
    ctx.fullCost != null
      ? `Cost once business costs are shared in: ${money(ctx.fullCost)}`
      : `No business-cost layer is configured`,
    `Your profit per piece, after every cost: ${money(ctx.profit)}`,
    `Your margin: ${pct(ctx.marginPct)}`,
    `The margin you're aiming for: ${ctx.targetMarginPct}%`,
    ctx.calculatedPrice != null
      ? `The price the app calculates from your costs and target: ${money(ctx.calculatedPrice)}`
      : `No calculated suggestion`,
    ctx.costParts.filter((p) => p.amount > 0).length > 0
      ? `Make-cost split: ${ctx.costParts
          .filter((p) => p.amount > 0)
          .map((p) => `${p.label} ${money(p.amount)}`)
          .join(", ")}`
      : `No cost lines yet`,
    ctx.topLine ? `Single biggest cost line: ${ctx.topLine.label} at ${money(ctx.topLine.amount)}` : null,
    ctx.market
      ? `Competitor prices the maker noted: ${ctx.market.count}, running ${money(ctx.market.min)}–${money(
          ctx.market.max,
        )}, median ${money(ctx.market.median)}; this price sits ${ctx.market.position} them`
      : `No competitor prices entered — you cannot see the market`,
  ]
    .filter(Boolean)
    .join("\n");

  const question = topic ? REVIEW_TOPICS.find((t) => t.id === topic)?.label : null;

  return [
    "Review this product's price.",
    "",
    facts,
    "",
    question
      ? `The maker is asking specifically: "${question}" — answer that in the verdict and findings.`
      : "Give your opening read on whether this price works.",
    "",
    "Respond with a one-sentence verdict and exactly three findings, each a short plain sentence grounded in the numbers above.",
  ].join("\n");
}

export async function liveReview(ctx: ReviewContext, topic: ReviewTopic | null): Promise<Review> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: SYSTEM,
    // Structured output — verdict + findings as validated JSON. (No `effort`
    // here: Haiku 4.5 rejects it. If you swap MODEL up to an Opus tier, you can
    // add `effort: "low"` alongside `format` to keep it fast and cheap.)
    output_config: {
      format: { type: "json_schema", schema: SCHEMA },
    },
    messages: [{ role: "user", content: buildPrompt(ctx, topic) }],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";
  const parsed = JSON.parse(text) as { verdict?: string; findings?: string[] };

  const findings = (parsed.findings ?? [])
    .map((f) => f.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (!parsed.verdict || findings.length === 0) {
    throw new Error("Live review returned an empty result");
  }
  return { verdict: parsed.verdict.trim(), findings };
}
