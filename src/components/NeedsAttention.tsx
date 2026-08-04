/**
 * NeedsAttention — the dashboard's attention list, kept short (PRD §11).
 *
 * The home should peek the problem that matters, not grow a full ledger. So it
 * shows the most-urgent item(s) inline and tucks the rest behind a "N more"
 * row that opens the shared bottom-sheet Drawer. With one item there is no
 * overflow, so no sheet ever appears — the single-item case stays inline for
 * free.
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

/** How many items to peek inline before the rest go into the sheet. Bump to 2
 *  to show two before collapsing; 1 keeps the home to a single hero problem. */
const INLINE_MAX = 1;

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

  const inline = items.slice(0, INLINE_MAX);
  const overflow = items.slice(INLINE_MAX);

  return (
    <>
      <div className="mt-8 px-6">
        <SectionLabel>Needs attention</SectionLabel>
      </div>
      <div className="divide-y divide-ink/7 border-t border-ink/7">
        {inline.map((item) => (
          <AttentionRow key={item.id} item={item} />
        ))}
      </div>

      {overflow.length > 0 && (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between border-t border-ink/7 px-6 py-[13px] text-left font-sans text-[12.5px] font-medium text-clay-deep"
            >
              {overflow.length} more {overflow.length === 1 ? "needs" : "need"} attention
              <ChevronRight size={15} strokeWidth={2} />
            </button>
          </DrawerTrigger>
          <DrawerContent className="pb-4">
            <DrawerTitle className="px-6 pb-1 pt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/42">
              Needs attention
            </DrawerTitle>
            <div className="divide-y divide-ink/7">
              {overflow.map((item) => (
                <AttentionRow key={item.id} item={item} />
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
