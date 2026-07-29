/**
 * TypeFilter — the overview's category filter (§2.4). Ghost-button trigger that
 * opens a bottom sheet of the product types actually in use (not a floating
 * popover, §2.11) and navigates to ?type=…, preserving the current status.
 */
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { productsHref } from "@/lib/products-query";

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
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-[7px] whitespace-nowrap rounded-[7px] border bg-transparent px-3 py-2 font-sans text-[12.5px] font-medium ${
          filtered
            ? "border-clay-deep/45 bg-clay/7 text-clay-deep"
            : "border-ink/14 text-ink/55"
        }`}
      >
        {label}
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={filtered ? "text-clay-deep" : "text-ink/42"}
        />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/28"
          />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[430px] rounded-t-[14px] border-t border-ink/14 bg-page pb-4 pt-2 shadow-[0_-10px_30px_-12px_rgba(30,25,22,0.25)]">
            <div className="mx-auto mb-1.5 h-[3px] w-[34px] rounded-full bg-ink/14" />
            <p className="px-5 pb-1 pt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/42">
              Type
            </p>
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
          </div>
        </div>
      )}
    </>
  );
}
