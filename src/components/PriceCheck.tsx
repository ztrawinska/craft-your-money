/**
 * PriceCheck — the assistant's review, inside the pricing block (PRD §10, §2.9).
 *
 * Closed, it's just the glint "Check this price" button. Open, it becomes an
 * INSET within the same framed surface — never a floating card — marked by a
 * 2px iris left-rule and a faint iris wash.
 *
 * Iris marks WHO is speaking, never the answer. So it touches only the glint,
 * the "Price check" label, the finding numerals and the follow-up chips. The
 * verdict, the scenarios and everything about the price stay ink.
 *
 * The verdict + findings come from the live Claude API (reviewPriceAction),
 * with a scripted fallback when there's no key or the call fails. Scenarios and
 * provenance stay deterministic and client-side. Bounded: verdict → three
 * findings → two preview-only scenarios → three follow-ups, then it stops.
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { AssistantSlot } from "@/components/AssistantSlot";
import { useCurrency } from "@/components/CurrencyContext";
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

const GLINT_PATH = "M12 3 Q13.6 9.4 21 12 Q13.6 14.6 12 21 Q10.4 14.6 3 12 Q10.4 9.4 12 3 Z";

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

  // No price yet → nothing to review.
  if (ctx == null) {
    return (
      <AssistantSlot centered className="mt-5">
        Check this price
      </AssistantSlot>
    );
  }
  if (!open) {
    return (
      <AssistantSlot centered className="mt-5" onClick={() => setOpen(true)}>
        Check this price
      </AssistantSlot>
    );
  }

  const scenarios = reviewScenarios(ctx);
  const provenance = reviewProvenance(ctx);
  const followups = REVIEW_TOPICS.filter((t) => !visited.includes(t.id));
  const busy = loading || review == null;

  const close = () => {
    setOpen(false);
    setTopic(null);
    setVisited([]);
    setReview(null);
    setSource(null);
  };

  return (
    <div className="mt-5 rounded-r-[6px] border-l-2 border-iris bg-iris/[0.055] py-4 pl-4 pr-4">
      {/* header — glint + label (iris: who's speaking) + dismiss */}
      <div className="mb-3 flex items-center gap-2">
        <svg
          viewBox="0 0 24 24"
          className={`h-[15px] w-[15px] shrink-0 fill-iris ${busy ? "animate-pulse" : ""}`}
        >
          <path d={GLINT_PATH} />
        </svg>
        <span className="flex-1 font-sans text-[13.5px] font-medium text-iris-deep">Price check</span>
        <button type="button" onClick={close} aria-label="Dismiss" className="text-ink/42">
          <X size={16} />
        </button>
      </div>

      {busy ? (
        <p className="py-2 font-sans text-[13px] font-light text-ink/55">Reading your numbers…</p>
      ) : (
        <>
          {/* verdict — the answer, in ink (never iris) */}
          <p className="font-serif text-[16px] leading-[1.35] text-ink">{review!.verdict}</p>

          {/* findings — iris numerals, iris-tinted hairlines between */}
          <ol className="mt-3">
            {review!.findings.map((f, i) => (
              <li key={i} className={`flex gap-2.5 py-2.5 ${i > 0 ? "border-t border-iris/15" : ""}`}>
                <span className="font-serif text-[13px] tabular-nums text-iris-deep">{i + 1}</span>
                <span className="font-sans text-[13px] font-light leading-[1.5] text-ink/80">{f}</span>
              </li>
            ))}
          </ol>

          {/* scenarios — preview only, monochrome; tapping never applies them */}
          {topic == null && scenarios.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {scenarios.map((s) => (
                <span
                  key={s.price}
                  className="rounded-full border border-ink/14 px-3 py-1 font-sans text-[11.5px] tabular-nums text-ink/70"
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
                  className="rounded-full bg-iris/[0.09] px-3 py-1.5 font-sans text-[12px] font-medium text-iris-deep"
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {/* provenance — Used / Assumed / Can't know, and who wrote it */}
          <div className="mt-4 border-t border-iris/15 pt-3 font-sans text-[11px] font-light leading-[1.65] text-ink/55">
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
              <p className="text-ink/42">
                <span className="font-medium text-iris-deep">Written</span> — by Claude, just now.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
