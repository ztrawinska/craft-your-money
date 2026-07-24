/**
 * PricingPanel — the interactive pricing block (PRD §6, the decision).
 *
 * This is the app's first Client Component: it holds the one piece of state
 * that drives everything downstream — the user's price — and recomputes profit,
 * margin, status and the warning live as they type.
 *
 * The three-state sync (§6):
 *   1. A new product pre-fills nothing; a stored price loads decoupled.
 *   2. The first keystroke decouples the price from the suggestion, for good.
 *   3. "Reset to calculated" is one-time and does NOT re-enable auto-sync.
 * (Auto-sync's live follow only bites once cost entry exists — the next slice —
 * but the decoupling is modelled correctly now.)
 */
"use client";

import { useState } from "react";
import { AssistantSlot } from "@/components/AssistantSlot";
import { Chip } from "@/components/Chip";
import { FramedSurface } from "@/components/FramedSurface";
import { Price } from "@/components/Price";
import { computePricingFromDirect, priceWarning } from "@/lib/pricing";
import { profitTone, profitabilityFromMargin, statusChip } from "@/lib/status";

type PricingPanelProps = {
  workflow: "draft" | "active";
  directCost: number;
  targetMarginPct: number;
  vatRatePct: number | null;
  businessCostShare: number | null;
  initialFinalPrice: number | null;
};

const resetLinkClass =
  "font-sans text-[10.5px] font-normal text-clay-deep underline decoration-clay-deep/40 underline-offset-2";

export function PricingPanel({
  workflow,
  directCost,
  targetMarginPct,
  vatRatePct,
  businessCostShare,
  initialFinalPrice,
}: PricingPanelProps) {
  const options = { targetMarginPct, vatRatePct, businessCostShare };

  // The calculated suggestion depends only on cost + target, not the price.
  const suggestion = computePricingFromDirect(directCost, { finalPrice: null, ...options });
  const calculatedPrice = suggestion.calculatedPrice;

  const [priceText, setPriceText] = useState(() =>
    initialFinalPrice != null ? initialFinalPrice.toFixed(2) : "",
  );
  // A stored price loads decoupled; a fresh one starts synced to the suggestion.
  const [, setDecoupled] = useState(initialFinalPrice != null);

  const parsed = priceText.trim() === "" ? NaN : Number(priceText.replace(",", "."));
  const finalPrice = Number.isFinite(parsed) ? parsed : null;

  const pricing = computePricingFromDirect(directCost, { finalPrice, ...options });
  const chip = statusChip({ workflow, hasPrice: finalPrice != null, marginPct: pricing.marginPct });
  const tone = pricing.marginPct != null ? profitTone(profitabilityFromMargin(pricing.marginPct)) : null;
  const warning = finalPrice != null ? priceWarning(pricing, { finalPrice, targetMarginPct, vatRatePct }) : null;

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
          <button
            type="button"
            onClick={() => calculatedPrice != null && setPriceText(calculatedPrice.toFixed(2))}
            className={resetLinkClass}
          >
            Reset to £{calculatedPrice!.toFixed(2)}
          </button>
        ) : finalPrice == null && calculatedPrice != null ? (
          <button
            type="button"
            onClick={() => {
              setPriceText(calculatedPrice.toFixed(2));
              setDecoupled(false); // using the suggestion keeps it synced
            }}
            className={resetLinkClass}
          >
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
          onChange={(e) => {
            setPriceText(e.target.value);
            setDecoupled(true); // first manual edit decouples, permanently
          }}
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

      <AssistantSlot centered className="mt-5">
        Check this price
      </AssistantSlot>
    </FramedSurface>
  );
}
