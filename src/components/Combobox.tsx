/**
 * Combobox — a text input that suggests saved items as you type (the materials
 * library autofill, §12). Pick a saved item to fill the row; "+ Use as new" is
 * always the last option, so the library never traps you.
 *
 * The suggestions render IN FLOW, directly under the input (content below
 * shifts down) — not a floating popover. That keeps the flat, no-floating-panels
 * language and matches how inline edit already expands in place.
 */
"use client";

import { useId, useState } from "react";
import { Diamond, Plus } from "lucide-react";
import { fieldInput } from "@/components/inline-form";

export type ComboOption = { id: string; label: string; hint?: string };

type ComboboxProps = {
  value: string;
  options: ComboOption[];
  onType: (text: string) => void;
  onPick: (option: ComboOption) => void;
  onUseAsNew: () => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export function Combobox({
  value,
  options,
  onType,
  onPick,
  onUseAsNew,
  placeholder,
  autoFocus,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  const q = value.trim().toLowerCase();
  const matches = (q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options).slice(0, 6);
  // "+ Use as new" appears once there's something to name; it's always last.
  const showUseAsNew = value.trim() !== "";
  const showList = open && (matches.length > 0 || showUseAsNew);

  return (
    <div>
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onType(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        placeholder={placeholder}
        className={`${fieldInput} font-sans`}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
      />

      {showList && (
        <ul id={listId} className="mt-1 overflow-hidden rounded-[5px] border border-ink/14">
          {matches.map((o) => (
            <li key={o.id}>
              <button
                type="button"
                // keep focus so onBlur doesn't close the list before the click
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onPick(o);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-ink/5"
              >
                <span className="flex items-center gap-2 font-sans text-[14px] text-ink">
                  <Diamond size={8} className="shrink-0 fill-ink/30 text-ink/30" />
                  {o.label}
                </span>
                {o.hint && (
                  <span className="shrink-0 font-serif text-[12px] tabular-nums text-ink/42">
                    {o.hint}
                  </span>
                )}
              </button>
            </li>
          ))}
          {showUseAsNew && (
            <li className={matches.length > 0 ? "border-t border-ink/7" : ""}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onUseAsNew();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-1.5 px-3 py-2.5 text-left font-sans text-[13px] font-medium text-clay-deep hover:bg-ink/5"
              >
                <Plus size={14} strokeWidth={2} />
                Use as new
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
