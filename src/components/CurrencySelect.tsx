/**
 * CurrencySelect — pick the account currency by searching (§14). Type to filter
 * by code, name or symbol; pick to store the ISO code.
 *
 * The results float in a shadcn Popover anchored under the field, instead of
 * pushing the settings rows down in flow — so the page no longer jumps as the
 * list opens. The popover is anchored (not a trigger) and does NOT steal focus,
 * so typing stays in the field; picking works because items block the input's
 * blur until the click lands.
 */
"use client";

import { useId, useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CURRENCIES, currencyByCode } from "@/lib/currency";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";

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
  const showList = open && matches.length > 0;

  return (
    <div className="w-[190px]">
      <Popover open={showList} onOpenChange={(next) => !next && setOpen(false)}>
        <PopoverAnchor asChild>
          <Input
            value={open ? query : selected ? `${selected.symbol}  ${selected.name}` : value}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setOpen(true);
              setQuery("");
            }}
            onBlur={() => setOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            placeholder="Search currency"
            className="font-sans text-label"
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
          />
        </PopoverAnchor>

        <PopoverContent
          id={listId}
          align="start"
          sideOffset={5}
          // Keep focus in the anchored input, and disable Radix's own dismiss:
          // the input IS "outside" the content, so typing would otherwise close
          // the popover. We drive open/close ourselves (focus / blur / Escape /
          // item click) instead.
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onFocusOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="max-h-[220px] w-[var(--radix-popover-trigger-width)] overflow-auto rounded-button border border-ink/14 bg-page p-0 shadow-[0_8px_24px_-8px_rgba(30,25,22,0.18)]"
        >
          <ul>
            {matches.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-ink/5"
                >
                  <span className="w-6 shrink-0 font-serif text-value text-ink">{c.symbol}</span>
                  <span className="min-w-0 flex-1 truncate font-sans text-label text-ink">
                    {c.name}
                  </span>
                  <span className="shrink-0 font-sans text-label-sm text-ink/62">{c.code}</span>
                  {c.code === value && (
                    <Check size={13} strokeWidth={2.2} className="shrink-0 text-clay-deep" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}
