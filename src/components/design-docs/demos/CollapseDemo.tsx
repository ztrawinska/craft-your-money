"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Collapse } from "@/components/Collapse";
import { Price } from "@/components/Price";

/** The reveal toggle (§2.14) driving a Collapse: optional depth, not structure. */
export function CollapseDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 border-b border-dotted border-clay/50 pb-px font-sans text-meta text-clay-deep"
      >
        how this is figured
        <ChevronDown
          size={13}
          strokeWidth={2}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <Collapse open={open}>
        <ul className="mt-3 divide-y divide-ink/7 font-sans text-label">
          {[
            ["Selene hammered band", 18.2],
            ["Thalia stacking set", -2.06],
            ["Hera signet", 22.4],
          ].map(([name, profit]) => (
            <li key={String(name)} className="flex items-baseline justify-between py-2">
              <span className="text-ink/70">{name}</span>
              <Price value={Number(profit)} variant="inline" />
            </li>
          ))}
          <li className="flex items-baseline justify-between py-2 font-medium">
            <span className="text-ink">Average, per piece</span>
            <Price value={12.85} variant="inline" />
          </li>
        </ul>
      </Collapse>
    </div>
  );
}
