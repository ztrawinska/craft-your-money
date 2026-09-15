/**
 * Combobox — a text input that suggests saved items as you type (the materials
 * library autofill, §12). Pick a saved item to fill the row; "+ Use as new" is
 * always the last option, so the library never traps you.
 *
 * The suggestions float in a shadcn Popover anchored under the input, instead
 * of pushing content down in flow — so the surrounding UI no longer jumps as
 * the list opens and closes. The popover is anchored (not a trigger) and does
 * NOT steal focus, so you keep typing in the field; picking still works because
 * items block the input's blur (onMouseDown) until the click lands. vaul-style
 * collision handling flips it above the field near the viewport edge.
 */
"use client";

import { useId, useState } from "react";
import { Diamond, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";

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

const listSurface =
  "w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-[7px] border border-ink/14 bg-page p-0 shadow-[0_8px_24px_-8px_rgba(30,25,22,0.18)]";

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
  // Show every match — a newly-saved material is appended to the library, so
  // any hard cap here (there used to be a `.slice(0, 6)`) would silently drop
  // it once the library grew past the cap. The list scrolls instead (below).
  const matches = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  // "+ Use as new" appears once there's something to name; it's always last.
  const showUseAsNew = value.trim() !== "";
  const showList = open && (matches.length > 0 || showUseAsNew);

  return (
    <Popover open={showList} onOpenChange={(next) => !next && setOpen(false)}>
      <PopoverAnchor asChild>
        <Input
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => onType(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder={placeholder}
          className="font-sans"
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
        className={listSurface}
      >
        <ul className="max-h-[264px] overflow-y-auto">
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
                  <span className="shrink-0 font-serif text-[12px] tabular-nums text-ink/62">
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
      </PopoverContent>
    </Popover>
  );
}
