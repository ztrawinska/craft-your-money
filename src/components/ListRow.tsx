/**
 * ListRow — the workhorse two-line row (design system §2.6).
 *
 *   [stripe]  Primary label                          [right slot]
 *             Meta line (the quiet second voice)
 *
 * Two real uses shape it, so it takes an `emphasis`:
 * - "line"    — a cost line on Product Detail: label in Plex, no stripe, static.
 * - "product" — a product on the overview: name in Lora, an urgency stripe, and
 *               the whole row is a link to the detail screen.
 *
 * Muting (draft, archived): we dim the *content* — the name and meta recede —
 * but never the right slot. Dimming the whole row would make a live action look
 * disabled (§2.6 anti-pattern). On the overview the slot is a chip, which stays
 * full-strength so the status reads clearly.
 */
import type { ReactNode } from "react";
import Link from "next/link";
import { Diamond } from "lucide-react";

/**
 * The left-stripe tones. The three coloured ones are the overview's urgency
 * scale; `neutral` (ink-30) is the dashboard attention list's mark for a
 * No-price row — there every row is already an attention item, so "no stripe"
 * would read as "nothing here".
 */
type Stripe = "risky" | "caution" | "healthy" | "neutral" | null;

type ListRowProps = {
  label: string;
  meta?: ReactNode;
  /** Right-hand slot: a price, a chip, a verb-link. */
  value?: ReactNode;
  /** Marks a value pulled from the materials library (deterministic, not AI). */
  library?: boolean;
  emphasis?: "line" | "product";
  stripe?: Stripe;
  muted?: boolean;
  /** When set, the whole row becomes a link (overview rows open the detail). */
  href?: string;
};

// The stripe is an inset, rounded bar (not a full-bleed left border) — it sits
// in the page gutter and reads as a marker on the row, not a rule stuck to the
// screen edge. Tones match the overview's urgency scale.
const stripeBg: Record<Exclude<Stripe, null>, string> = {
  risky: "bg-status-red", // full — the loudest
  caution: "bg-status-amber/55",
  healthy: "bg-status-green/38", // quietest — it's fine, just noting
  neutral: "bg-ink/30", // a missing input, not a health judgement
};

export function ListRow({
  label,
  meta,
  value,
  library,
  emphasis = "line",
  stripe = null,
  muted = false,
  href,
}: ListRowProps) {
  const isProduct = emphasis === "product";

  const labelClass = isProduct
    ? `font-serif text-[16px] leading-[1.2] ${
        muted ? "font-normal text-ink/55" : "font-medium text-ink"
      }`
    : "font-sans text-[15px] text-ink";

  const rowClass = [
    "flex justify-between gap-3",
    isProduct
      ? "relative min-h-[64px] items-center py-[13px] pl-6 pr-6"
      : "items-baseline py-3",
  ].join(" ");

  const stripeBar =
    isProduct && stripe ? (
      <span
        aria-hidden
        className={`absolute bottom-[14px] left-3 top-[14px] w-[3px] rounded-full ${stripeBg[stripe]}`}
      />
    ) : null;

  const content = (
    <>
      {stripeBar}
      <div className="min-w-0">
        <span className={labelClass}>
          {label}
          {library && (
            <Diamond
              size={8}
              className="ml-1 inline-block -translate-y-px fill-ink/30 text-ink/30"
            />
          )}
        </span>
        {meta && (
          <p
            className={`mt-[3px] font-sans text-[12px] ${
              muted ? "text-ink/40" : "text-ink/55"
            }`}
          >
            {meta}
          </p>
        )}
      </div>
      {value && <div className="flex-shrink-0">{value}</div>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={rowClass}>
        {content}
      </Link>
    );
  }
  return <div className={rowClass}>{content}</div>;
}
