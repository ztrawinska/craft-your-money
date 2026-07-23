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
import type { ReactNode } from "react";
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

const CURRENCY = "£";

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
  sectionTotal: "text-[13px] text-ink/55",
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
  // Big prices split so the eye lands on the pounds: whole number large,
  // decimals and currency smaller and lifted to the top.
  if (variant === "primary" || variant === "hero") {
    const [whole, dec] = value.toFixed(2).split(".");
    const isHero = variant === "hero";
    return (
      <span
        className={`${base} inline-flex items-baseline ${
          isHero ? "" : "border-b-2 border-clay pb-[5px]"
        }`}
      >
        <span
          className={`mr-[2px] -translate-y-[15px] text-ink/42 ${
            isHero ? "text-[29px]" : "text-[22px]"
          }`}
        >
          {CURRENCY}
        </span>
        <span
          className={`font-medium tracking-[-0.025em] ${
            isHero ? "text-[46px] leading-none" : "text-[56px] leading-[0.86]"
          }`}
        >
          {whole}
        </span>
        <span className="ml-[2px] -translate-y-[15px] text-[25px] text-ink/70">
          .{dec}
        </span>
      </span>
    );
  }

  const color = variant === "profit" && tone ? toneText[tone] : "";
  return (
    <span className={`${base} ${variantClass[variant]} ${color}`}>
      {CURRENCY}
      {value.toFixed(2)}
    </span>
  );
}
