/**
 * AskIrisTeaser — the dashboard's "Talk to your pricing coach" entry point (§2.9).
 *
 * The open-ended coach isn't built yet, so this is an honest teaser: tapping the
 * slot opens the same iris sheet as every other AI interaction, showing what it
 * will become (the north star — chat through prices, manage products) and
 * admitting it isn't here yet. When the feature lands it replaces this body in
 * the same spot — the entry point never moves.
 */
"use client";

import { AssistantSlot } from "@/components/AssistantSlot";
import { IrisSheet } from "@/components/IrisSheet";

export function AskIrisTeaser({ className = "" }: { className?: string }) {
  // The slot is w-full, so it sizes from a padded wrapper (like NeedsAttention)
  // — never its own side margins, which would fight w-full and overflow.
  return (
    <div className={className}>
      <IrisSheet
        label="Pricing coach"
        trigger={<AssistantSlot>Talk to your pricing coach</AssistantSlot>}
      >
      <p className="font-serif text-[16px] leading-[1.4] text-ink">
        Chat with your pricing coach — talk through your prices and manage your products, all from
        one place.
      </p>
      <p className="mt-3 font-sans text-[13px] font-light leading-[1.55] text-ink/60">
        That&rsquo;s where we&rsquo;re taking this. It isn&rsquo;t ready yet — you&rsquo;ll find it in
        this same spot when it is.
      </p>
        <span className="mt-4 inline-flex rounded-full bg-iris/[0.09] px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-iris-deep">
          Coming soon
        </span>
      </IrisSheet>
    </div>
  );
}
