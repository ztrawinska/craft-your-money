/**
 * Price — the only way money should appear on screen.
 *
 * It guarantees the three things the design system (§2.2) asks of every
 * figure: the Lora serif, tabular numerals (so columns don't jitter), and
 * monochrome ink. Callers never restate those — they only choose a variant.
 *
 * The ONE colour exception is the `profit` variant: the profit figure takes
 * its chip's status tone, so the number and the chip beside it can never tell
 * two different stories. Every other figure stays ink.
 */
"use client";

import type { ReactNode } from "react";
import { useCurrency } from "@/components/CurrencyContext";
import { formatMoney } from "@/lib/currency";
import type { StatusTone } from "@/lib/status";

type PriceVariant =
  // Named in design system §2.2:
  | "primary" //  56px — the final "your price", with the clay underline
  | "hero" //     46px — dashboard profit (not on this screen yet)
  | "figure" //   24px — a total (direct cost)
  | "inline" //   15.5px — a value on a list row
  // Added here because the detail mockup uses money at sizes §2.2 doesn't name.
  // Flagged to Zuza — these should be confirmed or renamed:
  | "calc" //         17px — the calculated-price suggestion
  | "sectionTotal" // 13px — the total beside a section label
  | "summary" //      13.5px — a line in the cost summary
  | "profit"; //      34px — the profit; the one figure that carries status colour

// Same meaning→colour mapping the Chip uses, but as text colour (not a tint):
// the profit figure is allowed to be the one coloured number on the screen.
const toneText: Record<StatusTone, string> = {
  positive: "text-status-green",
  caution: "text-status-amber",
  critical: "text-status-red",
};

// The money guarantee, in one place. No caller can forget it.
const base = "font-serif tabular-nums";

const variantClass: Record<Exclude<PriceVariant, "primary" | "hero">, string> = {
  figure: "text-[24px] font-medium text-ink leading-none",
  inline: "text-[15.5px] text-ink",
  calc: "text-[17px] text-ink/70",
  sectionTotal: "text-[13px] text-ink/62",
  summary: "text-[13.5px] text-ink/70",
  profit: "text-[34px] font-medium leading-none",
};

type PriceProps = {
  value: number;
  variant?: PriceVariant;
  /** Only meaningful for the `profit` variant. */
  tone?: StatusTone;
};

export function Price({ value, variant = "inline", tone }: PriceProps): ReactNode {
  const cur = useCurrency();
  // The final price splits so the eye lands on the whole number, with the
  // currency smaller and lifted — before it, or after it for suffix currencies.
  if (variant === "primary") {
    const [whole, dec] = value.toFixed(2).split(".");
    const sym = (
      <span
        className={`${cur.suffix ? "ml-1" : "mr-nudge"} -translate-y-[15px] text-[22px] text-ink/62`}
      >
        {cur.symbol}
      </span>
    );
    return (
      <span className={`${base} inline-flex items-baseline border-b-2 border-clay pb-1`}>
        {!cur.suffix && sym}
        <span className="text-[56px] font-medium leading-[0.86] tracking-[-0.025em]">
          {whole}
        </span>
        <span className="ml-nudge -translate-y-[15px] text-[25px] text-ink/70">.{dec}</span>
        {cur.suffix && sym}
      </span>
    );
  }

  // The dashboard hero is a single calm figure — currency smaller, but the
  // number whole (no decimal split). Fully monochrome; it needs no anchor.
  if (variant === "hero") {
    const sym = (
      <span
        className={`text-[29px] text-ink/62 ${cur.suffix ? "ml-1" : ""}`}
        style={{ verticalAlign: "1px" }}
      >
        {cur.symbol}
      </span>
    );
    return (
      <span
        className={`${base} text-[46px] font-medium leading-[0.96] tracking-[-0.02em] text-ink`}
      >
        {!cur.suffix && sym}
        {value.toFixed(2)}
        {cur.suffix && sym}
      </span>
    );
  }

  const color = variant === "profit" && tone ? toneText[tone] : "";
  return (
    <span className={`${base} ${variantClass[variant]} ${color}`}>{formatMoney(value, cur)}</span>
  );
}
