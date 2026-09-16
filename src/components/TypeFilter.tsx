/**
 * TypeFilter — the overview's category filter (§2.4). Ghost-button trigger that
 * opens a bottom sheet of the product types actually in use (not a floating
 * popover, §2.11) and navigates to ?type=…, preserving the current status.
 *
 * Built on the shared shadcn Drawer (vaul) primitive — same bottom-sheet look,
 * now with focus-trap, Escape and scroll-lock for free. The "Type" label is the
 * drawer's accessible title.
 */
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { productsHref } from "@/lib/products-query";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export function TypeFilter({
  current,
  status,
  types,
}: {
  current: string;
  status: string;
  types: string[];
}) {
  const [open, setOpen] = useState(false);
  const filtered = current !== "all";
  const label = filtered ? current : "All types";
  const options = ["all", ...types];

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className={`inline-flex items-center gap-2 whitespace-nowrap rounded-[7px] border bg-transparent px-3 py-2 font-sans text-[12.5px] font-medium ${
            filtered
              ? "border-clay-deep/45 bg-clay/7 text-clay-deep"
              : "border-ink/14 text-ink/62"
          }`}
        >
          {label}
          <ChevronDown
            size={14}
            strokeWidth={2}
            className={filtered ? "text-clay-deep" : "text-ink/62"}
          />
        </button>
      </DrawerTrigger>
      <DrawerContent className="pb-4">
        <DrawerTitle className="px-5 pb-1 pt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/62">
          Type
        </DrawerTitle>
        {options.map((t) => (
          <Link
            key={t}
            href={productsHref({ status, type: t })}
            onClick={() => setOpen(false)}
            className={`block px-5 py-3 font-sans text-[14.5px] ${
              t === current ? "font-semibold text-clay-deep" : "text-ink"
            }`}
          >
            {t === "all" ? "All types" : t}
          </Link>
        ))}
      </DrawerContent>
    </Drawer>
  );
}
