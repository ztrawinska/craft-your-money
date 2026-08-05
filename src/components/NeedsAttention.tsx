/**
 * NeedsAttention — the dashboard's attention entry point (PRD §11).
 *
 * YNAB-style split: the home shows only a compact count + "Review" CTA, and the
 * authoritative FULL list lives in the sheet it opens. The single most-urgent
 * product isn't peeked here — it's named and linked in the briefing above — so
 * nothing is shown twice. The count stays honest (1 product / 2 products) and
 * the sheet always holds every item, however many.
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
import { SectionLabel } from "@/components/SectionLabel";
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
        <span className="inline-flex items-center gap-1.5">
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
    <>
      <div className="mt-8 px-6">
        <SectionLabel>Needs attention</SectionLabel>
      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between border-t border-ink/7 px-6 py-[15px] text-left"
          >
            <span className="font-sans text-[14px] text-ink/70">
              <strong className="font-semibold text-ink">{n}</strong>{" "}
              {n === 1 ? "product" : "products"}
            </span>
            <span className="inline-flex items-center gap-1 font-sans text-[13px] font-semibold text-clay-deep">
              Review
              <ChevronRight size={15} strokeWidth={2} />
            </span>
          </button>
        </DrawerTrigger>
        <DrawerContent className="pb-4">
          <DrawerTitle className="px-6 pb-1 pt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/42">
            Needs attention
          </DrawerTitle>
          <div className="divide-y divide-ink/7">
            {items.map((item) => (
              <AttentionRow key={item.id} item={item} />
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
