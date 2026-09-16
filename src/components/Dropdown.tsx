/**
 * Dropdown — a filter/select control (design system §2.4).
 *
 * It is NOT a new control level: it's the ghost button plus a chevron. Two
 * rules keep it from drifting into something louder:
 * - Background stays transparent — a white fill would invent a new surface on
 *   a flat page.
 * - Radius is 7px, never the 100px of a chip — that geometry means "status".
 *
 * `filtered` is the has-a-value state: the label and border turn clay. (This is
 * a static trigger for now — the menu itself comes with behaviour later.)
 */
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type DropdownProps = {
  children: ReactNode;
  filtered?: boolean;
};

export function Dropdown({ children, filtered = false }: DropdownProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-[7px] border bg-transparent px-3 py-2 text-[12.5px] font-medium font-sans ${
        filtered
          ? "border-clay-deep/45 bg-clay/7 text-clay-deep"
          : "border-ink/14 text-ink/62"
      }`}
    >
      {children}
      <ChevronDown
        size={14}
        strokeWidth={2}
        className={filtered ? "text-clay-deep" : "text-ink/62"}
      />
    </button>
  );
}
