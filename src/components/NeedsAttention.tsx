/**
 * NeedsAttention — the dashboard's attention entry point (PRD §11).
 *
 * YNAB-style split: the home shows only a self-contained count + "Review" CTA,
 * and the authoritative FULL list lives in the sheet it opens. There's no
 * section header — the CTA carries its own label (like YNAB's "10 New
 * transactions · Review"), so it sits in the same rounded-card family as the
 * "Continue where you left off" draft and the "Ask about your prices" pill.
 *
 * The single most-urgent product isn't peeked here — it's named and linked in
 * the briefing above — so nothing is shown twice. The count stays honest
 * (1 product / 2 products) and the sheet always holds every item.
 *
 * Items arrive already computed and sorted by the server (risky worst-first,
 * then no-price), as plain data — this component only renders and toggles.
 */
"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { ListRow } from "@/components/ListRow";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import type { ChipTone } from "@/lib/status";

export type AttentionItem = {
  id: string;
  name: string;
  stripe: "risky" | "neutral";
  note: string;
  action: string;
  chipTone: ChipTone;
  chipLabel: string;
};

function AttentionRow({ item }: { item: AttentionItem }) {
  return (
    <ListRow
      emphasis="product"
      stripe={item.stripe}
      label={item.name}
      meta={
        <span className="inline-flex items-center gap-2">
          <Chip size="sm" tone={item.chipTone}>
            {item.chipLabel}
          </Chip>
          <span>{item.note}</span>
        </span>
      }
      value={
        <Button
          variant="link"
          href={`/products/${item.id}`}
          className="text-[13.5px] font-semibold"
          iconTrailing={<ChevronRight size={15} strokeWidth={2} />}
        >
          {item.action}
        </Button>
      }
    />
  );
}

export function NeedsAttention({ items }: { items: AttentionItem[] }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;

  const n = items.length;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <div className="mt-6 px-6">
        <DrawerTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 rounded-[8px] border border-ink/12 px-4 py-row text-left"
          >
            <span className="flex items-center gap-3">
              <span className="inline-grid h-[24px] min-w-[24px] place-items-center rounded-full bg-clay/12 px-1 font-sans text-[12.5px] font-semibold text-clay-deep">
                {n}
              </span>
              <span className="font-sans text-[14px] text-ink/75">Needs attention</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 font-sans text-[13px] font-semibold text-clay-deep">
              Review
              <ChevronRight size={15} strokeWidth={2} />
            </span>
          </button>
        </DrawerTrigger>
      </div>
      <DrawerContent className="pb-4">
        <DrawerTitle className="px-6 pb-1 pt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/62">
          Needs attention
        </DrawerTitle>
        <div>
          {items.map((item) => (
            <AttentionRow key={item.id} item={item} />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
