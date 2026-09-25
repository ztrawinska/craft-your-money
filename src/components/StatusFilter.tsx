/**
 * StatusFilter — the overview's status filter (§2.4). Ghost-button trigger that
 * opens a bottom sheet of options (not a floating popover, §2.11) that navigate
 * to ?status=…. "Archived" is one option beside the rest — no new screen.
 *
 * Built on the shared shadcn Drawer (vaul) primitive — same bottom-sheet look,
 * now with focus-trap, Escape and scroll-lock for free. The "Show" label is the
 * drawer's accessible title.
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { productsHref } from "@/lib/products-query";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Dropdown } from "@/components/Dropdown";

const OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "healthy", label: "Healthy" },
  { value: "caution", label: "Caution" },
  { value: "risky", label: "Risky" },
  { value: "no-price", label: "No price" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
  // The actionable group the dashboard links to — Risky + Caution together.
  { value: "below-target", label: "Below target" },
];

export function StatusFilter({ current, type }: { current: string; type: string }) {
  const [open, setOpen] = useState(false);
  const label = OPTIONS.find((o) => o.value === current)?.label ?? "All statuses";
  const filtered = current !== "all";
  const href = (v: string) => productsHref({ status: v, type });

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Dropdown filtered={filtered}>{label}</Dropdown>
      </DrawerTrigger>
      <DrawerContent className="pb-4">
        <DrawerTitle className="px-5 pb-1 pt-1 font-sans text-caps uppercase text-ink/62">
          Show
        </DrawerTitle>
        {OPTIONS.map((o) => (
          <Link
            key={o.value}
            href={href(o.value)}
            onClick={() => setOpen(false)}
            className={`block px-5 py-3 font-sans text-label ${
              o.value === current ? "font-semibold text-clay-deep" : "text-ink"
            }`}
          >
            {o.label}
          </Link>
        ))}
      </DrawerContent>
    </Drawer>
  );
}
