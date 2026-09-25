/**
 * PriceCheck — the assistant's review of your price (PRD §10, §2.9).
 *
 * The entry point is the glint "Check this price" slot in the pricing block.
 * Tapping it opens the shared iris **sheet** (IrisSheet) — no longer an inset
 * inside the framed surface, so there is no iris left-rule or wash here; the
 * sheet's header carries the glint and label instead.
 *
 * Iris still marks WHO is speaking, never the answer. In the body it touches
 * only the finding numerals and the follow-up chips. The verdict, the scenarios
 * and everything about the price stay ink.
 *
 * The verdict + findings come from the live Claude API (reviewPriceAction), with
 * a scripted fallback when there's no key or the call fails. Scenarios and
 * provenance stay deterministic and client-side. Bounded: verdict → three
 * findings → two preview-only scenarios → three follow-ups, then it stops.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { AssistantSlot } from "@/components/AssistantSlot";
import { useCurrency } from "@/components/CurrencyContext";
import { IrisSheet } from "@/components/IrisSheet";
import { formatMoney } from "@/lib/currency";
import { reviewPriceAction } from "@/app/products/review-price-action";
import {
  REVIEW_TOPICS,
  reviewProvenance,
  reviewScenarios,
  type Review,
  type ReviewContext,
  type ReviewTopic,
} from "@/lib/price-review";

export function PriceCheck({ ctx }: { ctx: ReviewContext | null }) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<ReviewTopic | null>(null);
  const [visited, setVisited] = useState<ReviewTopic[]>([]);
  const [review, setReview] = useState<Review | null>(null);
  const [source, setSource] = useState<"live" | "scripted" | null>(null);
  const [loading, setLoading] = useState(false);
  const cur = useCurrency();

  // Read the latest ctx without making it an effect dependency — the review is
  // a snapshot taken when you open (or ask a follow-up), not a live recompute.
  // Updated in an effect (never during render), before the fetch effect below.
  const ctxRef = useRef(ctx);
  useEffect(() => {
    ctxRef.current = ctx;
  });

  useEffect(() => {
    if (!open || !ctxRef.current) return;
    let cancelled = false;
    setLoading(true);
    reviewPriceAction(ctxRef.current, topic)
      .then((r) => {
        if (cancelled) return;
        setReview({ verdict: r.verdict, findings: r.findings });
        setSource(r.source);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, topic]);

  // No price yet → nothing to review; the slot is present but inert.
  if (ctx == null) {
    return (
      <AssistantSlot centered disabled>
        Check this price
      </AssistantSlot>
    );
  }

  const scenarios = reviewScenarios(ctx);
  const provenance = reviewProvenance(ctx);
  const followups = REVIEW_TOPICS.filter((t) => !visited.includes(t.id));
  const busy = loading || review == null;

  const reset = () => {
    setOpen(false);
    setTopic(null);
    setVisited([]);
    setReview(null);
    setSource(null);
  };

  return (
    <IrisSheet
      label="Price check"
      busy={busy}
      open={open}
      onOpenChange={(o) => (o ? setOpen(true) : reset())}
      trigger={
        <AssistantSlot centered>
          Check this price
        </AssistantSlot>
      }
    >
      {busy ? (
        <p className="py-2 font-sans text-body text-ink/62">Reading your numbers…</p>
      ) : (
        <>
          {/* verdict — the answer, in ink (never iris) */}
          <p className="font-serif text-prose text-ink">{review!.verdict}</p>

          {/* findings — iris numerals, iris-tinted hairlines between */}
          <ol className="mt-3">
            {review!.findings.map((f, i) => (
              <li key={i} className={`flex gap-2 py-3 ${i > 0 ? "border-t border-iris/15" : ""}`}>
                <span className="font-serif text-value-sm tabular-nums text-iris-deep">{i + 1}</span>
                <span className="font-sans text-body text-ink/80">{f}</span>
              </li>
            ))}
          </ol>

          {/* scenarios — preview only, monochrome; tapping never applies them */}
          {topic == null && scenarios.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {scenarios.map((s) => (
                <span
                  key={s.price}
                  className="rounded-chip border border-ink/14 px-3 py-1 font-sans text-label-sm tabular-nums text-ink/70"
                >
                  at {formatMoney(s.price, cur)} → {Math.round(s.marginPct * 100)}%
                </span>
              ))}
            </div>
          )}

          {/* follow-ups — iris chips, bounded (~three, then it stops) */}
          {followups.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {followups.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTopic(t.id);
                    setVisited((v) => [...v, t.id]);
                  }}
                  className="rounded-chip bg-iris/[0.09] px-3 py-2 font-sans text-label-sm-bold text-iris-deep"
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {/* provenance — Used / Assumed / Can't know, and who wrote it */}
          <div className="mt-4 border-t border-iris/15 pt-3 font-sans text-body-sm text-ink/62">
            <p>
              <span className="font-medium text-ink/70">Used</span> — {provenance.used.join(", ")}.
            </p>
            <p>
              <span className="font-medium text-ink/70">Assumed</span> — {provenance.assumed.join(", ")}.
            </p>
            <p>
              <span className="font-medium text-ink/70">Can&rsquo;t know</span> —{" "}
              {provenance.cantKnow.join(", ")}.
            </p>
            {source === "live" && (
              <p className="text-ink/62">
                <span className="font-medium text-iris-deep">Written</span> — by Claude, just now.
              </p>
            )}
          </div>
        </>
      )}
    </IrisSheet>
  );
}
