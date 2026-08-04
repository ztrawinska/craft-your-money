/**
 * HeroProfit — the dashboard's one figure, given a focal moment (PRD §11).
 *
 * Two on-brand additions over a plain number, both honest with the data we
 * already have:
 * - a count-up on load — the single bit of motion that makes a flat number feel
 *   arrived-at rather than printed (skipped under prefers-reduced-motion);
 * - "how this is figured" — the average is only as trustworthy as its parts, so
 *   this unfolds each priced product's profit and the average they make. It is
 *   the "where does this number come from" move, in plain figures.
 *
 * The figure is centred and sits over a soft clay glow — the one deliberate
 * focal moment on the screen (Zuza's call). It's light on paper, not a card or
 * a shadow, so the flat surface still holds; the glow is the only place any
 * gradient appears.
 */
"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "@/components/CurrencyContext";
import { Price } from "@/components/Price";
import { formatMoney } from "@/lib/currency";

export type Contribution = { name: string; profit: number };

export function HeroProfit({
  value,
  count,
  contributions,
}: {
  value: number;
  count: number;
  contributions: Contribution[];
}) {
  const cur = useCurrency();
  const [shown, setShown] = useState(0);
  const [open, setOpen] = useState(false);

  // Count up to the real figure once, easing out. Reduced-motion uses a zero
  // duration, so the very first frame lands on the value (no jump-in-effect).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduce ? 0 : 650;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = dur === 0 ? 1 : Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setShown(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const signed = (n: number) =>
    `${n < 0 ? "−" : "+"}${formatMoney(Math.abs(n), cur)}`;

  return (
    <div className="px-6 pb-1 text-center">
      <p className="mb-[9px] font-sans text-[9.5px] font-semibold uppercase tracking-[0.14em] text-ink/42">
        Avg profit / piece
      </p>
      <div className="relative mx-auto w-fit">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[40%] h-[170%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(160,113,106,0.5), rgba(160,113,106,0) 68%)",
            filter: "blur(9px)",
          }}
        />
        <div className="relative">
          <Price value={shown} variant="hero" />
        </div>
      </div>
      <p className="mt-[9px] font-sans text-[12px] font-light leading-[1.5] text-ink/55">
        across your {count} priced products, after all costs
      </p>

      {contributions.length > 0 && (
        <div className="mt-2.5">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="inline-flex items-center gap-1 font-sans text-[11.5px] font-medium text-clay-deep"
          >
            how this is figured
            <ChevronDown
              size={13}
              strokeWidth={2}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="mt-2.5 border-t border-ink/7 pt-1 text-left">
              {contributions.map((c) => (
                <div key={c.name} className="flex items-baseline justify-between gap-3 py-[5px]">
                  <span className="min-w-0 truncate font-sans text-[12.5px] text-ink/70">
                    {c.name}
                  </span>
                  <span className="shrink-0 font-serif text-[13px] tabular-nums text-ink">
                    {signed(c.profit)}
                  </span>
                </div>
              ))}
              <div className="mt-1 flex items-baseline justify-between border-t border-ink/7 pt-2">
                <span className="font-sans text-[11.5px] text-ink/55">
                  Average across {count}
                </span>
                <span className="font-serif text-[13px] font-medium tabular-nums text-ink">
                  {formatMoney(value, cur)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
