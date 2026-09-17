/**
 * BenchmarkSection — the collapsed "market benchmark" disclosure on the product
 * detail (PRD §11). Its toggle is the same optional-reveal control as the
 * dashboard's "how this is figured": an inline dotted-clay chevron, not a grey
 * section header — both are "tap to see the numbers behind this", so they share
 * one visual (and clay is the accent for links/actions, §2).
 *
 * Deliberately light: a few prices you've seen for similar pieces, entered by
 * hand. It shows the range, the median and where you sit — but the real payoff
 * is in Price Check, whose "Compare to market" answer turns from "I can't see
 * the market" into a real positioning read once you've noted a price or two.
 *
 * Data lives on the product (owned by ProductEditor), so it saves with the rest.
 */
"use client";

import { useState } from "react";
import { ChevronDown, Plus, X } from "lucide-react";
import { Button } from "@/components/Button";
import { Collapse } from "@/components/Collapse";
import { useCurrency } from "@/components/CurrencyContext";
import { formatMoney } from "@/lib/currency";
import { FieldLabel, MoneyInput, num } from "@/components/inline-form";
import { Input } from "@/components/ui/input";
import type { BenchmarkPrice, MarketRead } from "@/lib/benchmark";

const positionPhrase: Record<MarketRead["position"], string> = {
  below: "you're below the range",
  within: "you're within the range",
  above: "you're above the range",
};

export function BenchmarkSection({
  benchmark,
  onChange,
  market,
}: {
  benchmark: BenchmarkPrice[];
  onChange: (next: BenchmarkPrice[]) => void;
  market: MarketRead | null;
}) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");
  const cur = useCurrency();

  const parsed = num(price);
  const valid = Number.isFinite(parsed) && parsed > 0;

  const add = () => {
    if (!valid) return;
    onChange([...benchmark, { label: label.trim(), price: parsed }]);
    setLabel("");
    setPrice("");
  };
  const remove = (i: number) => onChange(benchmark.filter((_, idx) => idx !== i));

  return (
    <div className="px-6 pt-5">
      {/* the same optional-reveal toggle as the dashboard's "how this is figured"
          (§2 — links/actions are clay): an inline dotted-clay chevron, not a
          grey section header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 border-b border-dotted border-clay/50 pb-px font-sans text-meta text-clay-deep"
      >
        market benchmark
        {benchmark.length > 0 && (
          <span className="font-light text-clay-deep/55"> · {benchmark.length}</span>
        )}
        <ChevronDown
          size={13}
          strokeWidth={2}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <Collapse open={open}>
        <div className="pb-1 pt-4">
          <p className="font-sans text-body-sm text-ink/62">
            A few prices you&rsquo;ve seen for similar pieces — three is plenty.
          </p>

          {benchmark.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {benchmark.map((b, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-chip border border-ink/14 py-1 pl-3 pr-2 font-serif text-value-sm tabular-nums text-ink"
                >
                  {formatMoney(b.price, cur)}
                  {b.label && (
                    <span className="font-sans text-body-sm not-italic text-ink/62">
                      {b.label}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label={`Remove ${b.label || formatMoney(b.price, cur)}`}
                    className="text-ink/30 hover:text-ink/62"
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* light add row: price required, where optional */}
          <div className="mt-3 flex items-end gap-2">
            <label className="w-[100px]">
              <FieldLabel>Price</FieldLabel>
              <MoneyInput value={price} onChange={setPrice} />
            </label>
            <label className="flex-1">
              <FieldLabel>Where (optional)</FieldLabel>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Etsy"
                onKeyDown={(e) => e.key === "Enter" && add()}
                className="font-sans"
              />
            </label>
          </div>
          <Button
            variant="link"
            iconLeading={<Plus size={14} strokeWidth={2} />}
            onClick={add}
            disabled={!valid}
            className="pt-3 text-label-strong"
          >
            Add price
          </Button>

          {market && (
            <p className="mt-3 border-t border-ink/7 pt-3 font-sans text-body-sm text-ink/62">
              {market.count} price{market.count === 1 ? "" : "s"} ·{" "}
              <span className="tabular-nums">
                {market.min === market.max
                  ? formatMoney(market.min, cur)
                  : `${formatMoney(market.min, cur)}–${formatMoney(market.max, cur)}`}
                , median {formatMoney(market.median, cur)}
              </span>{" "}
              — <span className="text-ink/70">{positionPhrase[market.position]}</span>.
            </p>
          )}
        </div>
      </Collapse>
    </div>
  );
}
