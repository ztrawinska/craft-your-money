"use client";

import { AssistantSlot } from "@/components/AssistantSlot";
import { IrisSheet } from "@/components/IrisSheet";

/**
 * The real IrisSheet with a sample Price Check body: verdict in ink, numbered
 * findings with iris numerals, preview-only scenarios, iris follow-up chips,
 * and the provenance footer. Iris marks who is speaking, never the answer.
 */
export function IrisSheetDemo() {
  return (
    <IrisSheet
      label="Price check"
      trigger={<AssistantSlot centered>Check this price</AssistantSlot>}
    >
      <p className="font-serif text-value text-ink">
        £42.60 is a sound price for this band. It clears your target with room to spare.
      </p>
      <ol className="mt-3">
        {[
          "Your margin is 52% against a 30% target, so there is no pressure to move.",
          "Materials are 71% of the cost. A silver price rise would show up here first.",
          "Labour is 20 minutes at £15/hr. That rate is on the low side for finished work.",
        ].map((f, i) => (
          <li key={i} className={`flex gap-2 py-3 ${i > 0 ? "border-t border-iris/15" : ""}`}>
            <span className="font-serif text-value-sm tabular-nums text-iris-deep">{i + 1}</span>
            <span className="font-sans text-body text-ink/80">{f}</span>
          </li>
        ))}
      </ol>
      <div className="mt-2 flex flex-wrap gap-2">
        {["at £38.00 → 46%", "at £48.00 → 57%"].map((s) => (
          <span
            key={s}
            className="rounded-chip border border-ink/14 px-3 py-1 font-sans text-label-sm tabular-nums text-ink/70"
          >
            {s}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Compare to market", "What if silver goes up?", "Is my labour rate fair?"].map((t) => (
          <button
            key={t}
            type="button"
            className="rounded-chip bg-iris/[0.09] px-3 py-2 font-sans text-label-sm-bold text-iris-deep"
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-4 border-t border-iris/15 pt-3 font-sans text-body-sm text-ink/62">
        <p>
          <span className="font-medium text-ink/70">Used</span>: your costs, your price, your target
          margin.
        </p>
        <p>
          <span className="font-medium text-ink/70">Assumed</span>: silver at today&rsquo;s price.
        </p>
        <p>
          <span className="font-medium text-ink/70">Can&rsquo;t know</span>: what similar bands
          sell for near you.
        </p>
      </div>
    </IrisSheet>
  );
}
