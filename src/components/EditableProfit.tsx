/**
 * EditableProfit — the profit figure, but you can type into it (§6, the other
 * way to reach a price).
 *
 * Normally it just shows your profit. Type a target and the price is back-solved
 * from it: net = cost + target, then gross with VAT on top. Because profit is
 * exactly net minus cost, the profit then equals what you typed. The price stays
 * the one stored value — this is simply the maker's other language for it
 * ("what I want to keep" instead of "what I charge").
 *
 * A dashed underline (vs the price's solid clay one) marks it as the secondary,
 * still-editable figure.
 */
"use client";

import { useState } from "react";
import { useCurrency } from "@/components/CurrencyContext";
import { handleCentsInput, pinCaretRight } from "@/lib/money-input";
import { grossForTargetProfit } from "@/lib/pricing";
import type { StatusTone } from "@/lib/status";

const toneText: Record<StatusTone, string> = {
  positive: "text-status-green",
  caution: "text-status-amber",
  critical: "text-status-red",
};

export function EditableProfit({
  profit,
  tone,
  relevantCost,
  vatRatePct,
  onPriceChange,
}: {
  profit: number | null;
  tone?: StatusTone;
  relevantCost: number;
  vatRatePct: number | null;
  onPriceChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const cur = useCurrency();
  const color = tone ? toneText[tone] : "text-ink";

  // Not editing → the live profit (positive; a loss is shown by the label, per
  // the design rule). Editing → the raw text being typed.
  const shown = draft ?? (profit == null ? "" : Math.abs(profit).toFixed(2));

  return (
    <label
      className={`inline-flex cursor-text items-baseline border-b border-dashed border-ink/25 pb-nudge font-serif text-[34px] font-medium leading-none tabular-nums ${color}`}
    >
      {!cur.suffix && <span className="mr-px">{cur.symbol}</span>}
      {/* input hugs its text via an invisible sizer, so a suffix symbol sits close */}
      <span className="relative inline-block">
        <span aria-hidden className="invisible block whitespace-pre pr-nudge">
          {shown || "0.00"}
        </span>
        <input
          inputMode="numeric"
          aria-label="Set the profit you want per piece"
          value={shown}
          placeholder="0.00"
          onFocus={(e) => {
            setDraft(profit != null && profit > 0.005 ? profit.toFixed(2) : "");
            // focusing via the label (e.g. tapping "zł") doesn't place a caret,
            // and the draft swap re-renders — so pin to the right next frame
            const el = e.currentTarget;
            requestAnimationFrame(() => {
              const end = el.value.length;
              el.setSelectionRange(end, end);
            });
          }}
          onChange={(e) =>
            handleCentsInput(e, (next) => {
              setDraft(next);
              if (next === "") return;
              const target = Number(next);
              if (Number.isFinite(target))
                onPriceChange(grossForTargetProfit(target, relevantCost, vatRatePct).toFixed(2));
            })
          }
          onSelect={pinCaretRight}
          onBlur={() => setDraft(null)}
          className={`absolute inset-0 w-full bg-transparent caret-clay-deep outline-none placeholder:text-ink/25 ${color}`}
        />
      </span>
      {cur.suffix && <span className="ml-nudge">{cur.symbol}</span>}
    </label>
  );
}
