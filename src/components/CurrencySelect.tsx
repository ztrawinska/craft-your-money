/**
 * CurrencySelect — pick the account currency by searching (§14). Type to filter
 * by code, name or symbol; pick to store the ISO code. Suggestions render in
 * flow beneath the field, matching the flat, no-floating-panels language (the
 * same pattern as the materials Combobox).
 */
"use client";

import { useId, useState } from "react";
import { Check } from "lucide-react";
import { fieldInput } from "@/components/inline-form";
import { CURRENCIES, currencyByCode } from "@/lib/currency";

export function CurrencySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const listId = useId();
  const selected = currencyByCode(value);

  const q = query.trim().toLowerCase();
  const matches = q
    ? CURRENCIES.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.symbol.toLowerCase().includes(q),
      )
    : CURRENCIES;

  return (
    <div className="w-[190px]">
      <input
        value={open ? query : selected ? `${selected.symbol}  ${selected.name}` : value}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        placeholder="Search currency"
        className={`${fieldInput} font-sans text-[13.5px]`}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
      />

      {open && matches.length > 0 && (
        <ul id={listId} className="mt-1 max-h-[220px] overflow-auto rounded-[5px] border border-ink/14">
          {matches.map((c) => (
            <li key={c.code}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-ink/5"
              >
                <span className="w-6 shrink-0 font-serif text-[15px] text-ink">{c.symbol}</span>
                <span className="min-w-0 flex-1 truncate font-sans text-[13px] text-ink">
                  {c.name}
                </span>
                <span className="shrink-0 font-sans text-[11px] text-ink/42">{c.code}</span>
                {c.code === value && (
                  <Check size={13} strokeWidth={2.2} className="shrink-0 text-clay-deep" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
