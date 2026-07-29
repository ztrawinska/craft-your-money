/**
 * The Price Check review, as a Server Action (PRD §10).
 *
 * Live Claude API when ANTHROPIC_API_KEY is set; otherwise — or on any error —
 * the scripted review, so the feature always works offline. The client can't
 * tell the difference beyond the small "source" flag it uses for a subtle mark.
 *
 * The live module is imported LAZILY so the SDK never lands in the client
 * bundle (same reason the store is lazy-loaded elsewhere).
 */
"use server";

import {
  generateReview,
  type Review,
  type ReviewContext,
  type ReviewTopic,
} from "@/lib/price-review";

export type ReviewResult = Review & { source: "live" | "scripted" };

export async function reviewPriceAction(
  ctx: ReviewContext,
  topic: ReviewTopic | null,
): Promise<ReviewResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { ...generateReview(ctx, topic), source: "scripted" };
  }
  try {
    const { liveReview } = await import("@/lib/price-review-llm");
    return { ...(await liveReview(ctx, topic)), source: "live" };
  } catch (err) {
    console.error("[price-check] live review failed; using scripted fallback:", err);
    return { ...generateReview(ctx, topic), source: "scripted" };
  }
}
