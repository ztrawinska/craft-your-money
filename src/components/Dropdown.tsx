/**
 * Dropdown — a filter/select control (design system §2.4).
 *
 * It is NOT a new control level: it's the ghost button plus a chevron. Two
 * rules keep it from drifting into something louder:
 * - Background stays transparent — a white fill would invent a new surface on
 *   a flat page.
 * - Radius is `rounded-button` (8px), never the 100px of a chip — that
 *   geometry means "status".
 *
 * `filtered` is the has-a-value state: the label and border turn clay.
 *
 * It forwards its ref and props, so it drops straight into
 * `<DrawerTrigger asChild>` — which is how `StatusFilter` and `TypeFilter`
 * use it. The menu is always a bottom sheet (§2.11), never a floating popover.
 */
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type DropdownProps = {
  children: ReactNode;
  filtered?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Dropdown = forwardRef<HTMLButtonElement, DropdownProps>(
  function Dropdown({ children, filtered = false, className = "", ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={`inline-flex items-center gap-2 whitespace-nowrap rounded-button border bg-transparent px-3 py-2 font-sans text-label-strong ${
          filtered
            ? "border-clay-deep/45 bg-clay/7 text-clay-deep"
            : "border-ink/14 text-ink/62"
        } ${className}`}
        {...rest}
      >
        {children}
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={filtered ? "text-clay-deep" : "text-ink/62"}
        />
      </button>
    );
  },
);
