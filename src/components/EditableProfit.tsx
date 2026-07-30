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
    <span
      className={`inline-flex items-baseline border-b border-dashed border-ink/25 pb-[2px] font-serif text-[34px] font-medium leading-none tabular-nums ${color}`}
    >
      <span className="mr-[1px]">{cur}</span>
      <input
        inputMode="decimal"
        aria-label="Set the profit you want per piece"
        value={shown}
        placeholder="0.00"
        onFocus={() => setDraft(profit != null && profit > 0.005 ? profit.toFixed(2) : "")}
        onChange={(e) => {
          const raw = e.target.value;
          setDraft(raw);
          const target = Number(raw.replace(",", "."));
          if (raw.trim() === "" || !Number.isFinite(target)) return;
          onPriceChange(grossForTargetProfit(target, relevantCost, vatRatePct).toFixed(2));
        }}
        onBlur={() => setDraft(null)}
        className={`bg-transparent caret-clay-deep outline-none placeholder:text-ink/25 ${color}`}
        style={{ width: `${Math.max(shown.length, 4) + 0.3}ch` }}
      />
    </span>
  );
}
