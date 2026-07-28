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

import { Chip } from "@/components/Chip";
import { FramedSurface } from "@/components/FramedSurface";
import { Price } from "@/components/Price";
import { PriceCheck } from "@/components/PriceCheck";
import { computePricingFromDirect, priceWarning } from "@/lib/pricing";
import { profitTone, profitabilityFromMargin, statusChip } from "@/lib/status";

type PricingPanelProps = {
  workflow: "draft" | "active";
  directCost: number;
  targetMarginPct: number;
  vatRatePct: number | null;
  businessCostShare: number | null;
  priceText: string;
  onPriceChange: (value: string) => void;
  onReset: () => void;
  onUseSuggested: () => void;
};

const resetLinkClass =
  "font-sans text-[10.5px] font-normal text-clay-deep underline decoration-clay-deep/40 underline-offset-2";

export function PricingPanel({
  workflow,
  directCost,
  targetMarginPct,
  vatRatePct,
  businessCostShare,
  priceText,
  onPriceChange,
  onReset,
  onUseSuggested,
}: PricingPanelProps) {
  const options = { targetMarginPct, vatRatePct, businessCostShare };

  // The calculated suggestion depends only on cost + target, not the price.
  const suggestion = computePricingFromDirect(directCost, { finalPrice: null, ...options });
  const calculatedPrice = suggestion.calculatedPrice;

  const parsed = priceText.trim() === "" ? NaN : Number(priceText.replace(",", "."));
  const finalPrice = Number.isFinite(parsed) ? parsed : null;

  const pricing = computePricingFromDirect(directCost, { finalPrice, ...options });
  const chip = statusChip({ workflow, hasPrice: finalPrice != null, marginPct: pricing.marginPct });
  const tone = pricing.marginPct != null ? profitTone(profitabilityFromMargin(pricing.marginPct)) : null;
  const warning = finalPrice != null ? priceWarning(pricing, { finalPrice, targetMarginPct, vatRatePct }) : null;

  // Everything the Price Check needs — only when there's a price to review.
  const reviewCtx =
    finalPrice != null && pricing.net != null && pricing.profit != null && pricing.marginPct != null
      ? {
          finalPrice,
          net: pricing.net,
          profit: pricing.profit,
          marginPct: pricing.marginPct,
          directCost: pricing.directCost,
          fullCost: pricing.fullCost,
          calculatedPrice,
          targetMarginPct,
          vatRatePct,
        }
      : null;

  const diverged =
    finalPrice != null &&
    calculatedPrice != null &&
    Math.abs(finalPrice - calculatedPrice) > 0.005;
  const isLoss = pricing.profit != null && pricing.profit < -0.005;

  return (
    <FramedSurface className="mx-6 mt-[26px] px-6 pb-5 pt-[22px]">
      {/* calculated price — the suggestion */}
      <div className="mb-[18px] flex items-center justify-between gap-2.5 border-b border-ink/7 pb-[18px]">
        <div>
          <p className="text-[12.5px] text-clay-deep">Calculated price</p>
          {suggestion.calculatedBeforeVat != null && (
            <p className="mt-0.5 text-[11px] font-light text-ink/42">
              £{suggestion.calculatedBeforeVat.toFixed(2)} before VAT · {targetMarginPct}%
              target
            </p>
          )}
        </div>
        {calculatedPrice != null ? (
          <Price value={calculatedPrice} variant="calc" />
        ) : (
          <span className="text-[12px] font-light text-ink/42">Add costs first</span>
        )}
      </div>

      {/* your price — the editable decision */}
      <div className="mb-2 flex items-baseline justify-between text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ink/55">
        <span>Your price</span>
        {diverged ? (
          <button type="button" onClick={onReset} className={resetLinkClass}>
            Reset to £{calculatedPrice!.toFixed(2)}
          </button>
        ) : finalPrice == null && calculatedPrice != null ? (
          <button type="button" onClick={onUseSuggested} className={resetLinkClass}>
            Use £{calculatedPrice.toFixed(2)}
          </button>
        ) : null}
      </div>

      <div className="mb-3 inline-flex items-baseline border-b-2 border-clay pb-[5px]">
        <span className="mr-[2px] font-serif text-[22px] text-ink/42">£</span>
        <input
          inputMode="decimal"
          aria-label="Your price"
          placeholder="0.00"
          value={priceText}
          onChange={(e) => onPriceChange(e.target.value)}
          className="bg-transparent font-serif text-[44px] font-medium leading-none tracking-[-0.02em] tabular-nums text-ink caret-clay-deep outline-none placeholder:text-ink/25"
          style={{ width: `${Math.max(priceText.length, 4) + 0.5}ch` }}
        />
      </div>

      {/* VAT — what you keep, reserved wording for VAT only */}
      {pricing.net != null && vatRatePct != null && (
        <p className="mb-4 text-[13px] font-light text-ink/55">
          You keep{" "}
          <strong className="font-medium text-ink tabular-nums">
            £{pricing.net.toFixed(2)}
          </strong>{" "}
          after {vatRatePct}% VAT.
        </p>
      )}

      {/* a calm helper, if the price needs one — plain ink, never an alarm */}
      {warning && (
        <p className="mb-4 text-[12.5px] font-light leading-[1.5] text-ink/70">
          {warning.text}
        </p>
      )}

      {/* profit / loss — the last word. A loss never uses the word "profit". */}
      {pricing.profit != null ? (
        <div className="border-t border-ink/7 pt-[18px]">
          <p className="mb-2 text-[12px] text-ink/55">
            {isLoss ? "You lose on each piece" : "Profit per piece, after all costs"}
          </p>
          <div className="flex items-center justify-between gap-2.5">
            <Price value={Math.abs(pricing.profit)} variant="profit" tone={tone ?? undefined} />
            <Chip tone={chip.tone}>{chip.label}</Chip>
          </div>
        </div>
      ) : (
        <p className="border-t border-ink/7 pt-[18px] text-[12px] text-ink/55">
          Set a price to see your profit and margin.
        </p>
      )}

      <PriceCheck ctx={reviewCtx} />
    </FramedSurface>
  );
}
