/**
 * PricingPanel — the interactive pricing block (PRD §6, the decision).
 *
 * Controlled: the parent (ProductEditor) owns the price text and the sync
 * state, because the price has to react to cost edits too (the calculated
 * suggestion moves when materials change). This component just renders the
 * block from the current price and reports edits back up.
 *
 * It recomputes profit, margin, status and the warning on every render from
 * the (live) direct cost and the current price — all via the tested pure
 * functions in pricing.ts / status.ts.
 */
"use client";

import { useEffect, useState } from "react";
import { Chip } from "@/components/Chip";
import { Collapse } from "@/components/Collapse";
import { useCurrency } from "@/components/CurrencyContext";
import { EditableProfit } from "@/components/EditableProfit";
import { FramedSurface } from "@/components/FramedSurface";
import { Price } from "@/components/Price";
import { PriceCheck } from "@/components/PriceCheck";
import type { MarketRead } from "@/lib/benchmark";
import { formatMoney } from "@/lib/currency";
import { handleCentsInput, pinCaretRight } from "@/lib/money-input";
import { computePricingFromDirect, priceWarning } from "@/lib/pricing";
import type { CostPart } from "@/lib/price-review";
import { profitTone, profitabilityFromMargin, statusChip } from "@/lib/status";

type PricingPanelProps = {
  workflow: "draft" | "active";
  directCost: number;
  targetMarginPct: number;
  vatRatePct: number | null;
  businessCostShare: number | null;
  // The make-cost split + biggest line, for the Price Check's findings.
  costParts: CostPart[];
  topLine: CostPart | null;
  // The market read against the maker's entered competitor prices (or null).
  market: MarketRead | null;
  priceText: string;
  onPriceChange: (value: string) => void;
  onReset: () => void;
  onUseSuggested: () => void;
};

const resetLinkClass =
  "font-sans text-meta  text-clay-deep underline decoration-clay-deep/40 underline-offset-2";

// The typed number must feel instant, but the *evaluation* it drives — status,
// margin, the guidance line, profit — shouldn't lurch on every keystroke (it
// flickers through meaningless in-between states and, on mobile, makes the
// whole block jump). So we let the number lead and the judgement settle a beat
// after you stop typing (YNAB's "commit on idle"). Cost edits still land at
// once — they're discrete saves, not per-keystroke — so only the price lags.
const SETTLE_MS = 400;
function useSettled<T>(value: T, delay = SETTLE_MS): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return settled;
}

// The currency glyph beside the editable price is a part of that figure, not
// a preset (§1.4): 22px beside figure-lg, as in Price.tsx.
const CURRENCY_PART = "text-[22px]"; // part: the currency glyph beside figure-lg

export function PricingPanel({
  workflow,
  directCost,
  targetMarginPct,
  vatRatePct,
  businessCostShare,
  costParts,
  topLine,
  market,
  priceText,
  onPriceChange,
  onReset,
  onUseSuggested,
}: PricingPanelProps) {
  const cur = useCurrency();
  const options = { targetMarginPct, vatRatePct, businessCostShare };

  // The calculated suggestion depends only on cost + target, not the price.
  const suggestion = computePricingFromDirect(directCost, { finalPrice: null, ...options });
  const calculatedPrice = suggestion.calculatedPrice;

  // The input shows `priceText` live; everything derived reads the settled copy.
  const settledPriceText = useSettled(priceText);
  const parsed = settledPriceText.trim() === "" ? NaN : Number(settledPriceText.replace(",", "."));
  const finalPrice = Number.isFinite(parsed) ? parsed : null;

  const pricing = computePricingFromDirect(directCost, { finalPrice, ...options });
  const chip = statusChip({ workflow, hasPrice: finalPrice != null, marginPct: pricing.marginPct });
  const tone = pricing.marginPct != null ? profitTone(profitabilityFromMargin(pricing.marginPct)) : null;
  const warning =
    finalPrice != null
      ? priceWarning(pricing, { finalPrice, targetMarginPct, vatRatePct, cur })
      : null;
  // Retained through the collapse so the line can fade out in place instead
  // of vanishing the instant `warning` goes null — see PRD §18 "Pricing
  // panel — collapse motion". Adjusted during render (the React-sanctioned
  // "store information from previous renders" pattern), not in an effect.
  const [warningText, setWarningText] = useState<string | null>(null);
  if (warning && warning.text !== warningText) setWarningText(warning.text);

  // Everything the Price Check needs — only when there's a price to review.
  const reviewCtx =
    finalPrice != null && pricing.net != null && pricing.profit != null && pricing.marginPct != null
      ? {
          symbol: cur.symbol,
          suffix: cur.suffix,
          finalPrice,
          net: pricing.net,
          profit: pricing.profit,
          marginPct: pricing.marginPct,
          directCost: pricing.directCost,
          fullCost: pricing.fullCost,
          calculatedPrice,
          targetMarginPct,
          vatRatePct,
          costParts,
          topLine,
          market,
        }
      : null;

  const diverged =
    finalPrice != null &&
    calculatedPrice != null &&
    Math.abs(finalPrice - calculatedPrice) > 0.005;
  const isLoss = pricing.profit != null && pricing.profit < -0.005;

  return (
    <FramedSurface className="mx-6 mt-section px-6 pb-5 pt-section">
      {/* calculated price — the suggestion */}
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-ink/7 pb-4">
        <div>
          <p className="text-meta text-clay-deep">Calculated price</p>
          {suggestion.calculatedBeforeVat != null && (
            <p className="mt-1 text-body-sm text-ink/62">
              {formatMoney(suggestion.calculatedBeforeVat, cur)} before VAT · {targetMarginPct}%
              target
            </p>
          )}
        </div>
        {calculatedPrice != null ? (
          <Price value={calculatedPrice} variant="calc" />
        ) : (
          <span className="text-body-sm text-ink/62">Add costs first</span>
        )}
      </div>

      {/* your price — the editable decision */}
      <div className="mb-2 flex items-baseline justify-between text-caps uppercase text-ink/62">
        <span>Your price</span>
        {diverged ? (
          <button type="button" onClick={onReset} className={resetLinkClass}>
            Reset to {formatMoney(calculatedPrice!, cur)}
          </button>
        ) : finalPrice == null && calculatedPrice != null ? (
          <button type="button" onClick={onUseSuggested} className={resetLinkClass}>
            Use {formatMoney(calculatedPrice, cur)}
          </button>
        ) : null}
      </div>

      {/* the whole row is the tap target (label focuses the input from anywhere,
          including the currency and the empty space); the number+symbol stay
          hugged left under the clay rule */}
      <label className="mb-3 flex w-full cursor-text items-baseline">
        <span className="inline-flex items-baseline border-b-2 border-clay pb-1">
          {!cur.suffix && <span className={`mr-nudge font-serif ${CURRENCY_PART} text-ink/62`}>{cur.symbol}</span>}
          {/* the input hugs its text: an invisible sizer sets the exact width
              (so a suffix symbol sits right after the number, not after slack) */}
          <span className="relative inline-block font-serif text-figure-lg tabular-nums">
            <span aria-hidden className="invisible block whitespace-pre pr-nudge">
              {priceText || "0.00"}
            </span>
            <input
              inputMode="numeric"
              aria-label="Your price"
              placeholder="0.00"
              value={priceText}
              onChange={(e) => handleCentsInput(e, onPriceChange)}
              onFocus={pinCaretRight}
              onSelect={pinCaretRight}
              className="absolute inset-0 w-full bg-transparent text-ink caret-clay-deep outline-none placeholder:text-ink/25"
            />
          </span>
          {cur.suffix && <span className={`ml-nudge font-serif ${CURRENCY_PART} text-ink/62`}>{cur.symbol}</span>}
        </span>
      </label>

      {/* VAT — what you keep, reserved wording for VAT only */}
      {pricing.net != null && vatRatePct != null && (
        <p className="mb-4 text-body text-ink/62">
          You keep{" "}
          <strong className="font-medium text-ink tabular-nums">
            {formatMoney(pricing.net, cur)}
          </strong>{" "}
          after {vatRatePct}% VAT.
        </p>
      )}

      {/* a calm helper, if the price needs one — plain ink, never an alarm.
          Collapse fades it in/out in sync with the row's height, so
          growing and shrinking read as the same motion. */}
      <Collapse open={!!warning}>
        <p className="mb-4 text-body-sm text-ink/70">
          {warningText}
        </p>
      </Collapse>

      {/* profit / loss — the last word, and editable: type a target and the
          price back-solves. A loss never uses the word "profit". */}
      <div className="border-t border-ink/7 pt-4">
        <p className="mb-2 text-meta text-ink/62">
          {pricing.profit == null
            ? "Or set what you want to make per piece"
            : isLoss
              ? "You lose on each piece"
              : "Profit per piece, after all costs"}
        </p>
        <div className="flex items-center justify-between gap-3">
          <EditableProfit
            profit={pricing.profit}
            tone={tone ?? undefined}
            relevantCost={pricing.fullCost ?? pricing.directCost}
            vatRatePct={vatRatePct}
            onPriceChange={onPriceChange}
          />
          {pricing.profit != null && (
            <span key={`${chip.tone}-${chip.label}`} className="inline-flex animate-[settle_200ms_ease-out]">
              <Chip tone={chip.tone}>{chip.label}</Chip>
            </span>
          )}
        </div>
      </div>

      <PriceCheck ctx={reviewCtx} />
    </FramedSurface>
  );
}
