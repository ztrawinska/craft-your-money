/**
 * Button — three levels, named by role, never by colour (design system §2.3).
 *
 * - primary: the ONE main action per screen (Save and activate). Filled clay.
 * - ghost:   a secondary action beside a primary (Save draft). Outlined.
 * - link:    everything else — add-a-row, reset, inline verbs. No box at all,
 *            because a boxed button in a list would compete with the one
 *            framed surface.
 *
 * There is deliberately no fourth level. `link` carries no fixed size or
 * weight so it can sit inside text at whatever size its context needs; the
 * caller passes those via className.
 */
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "link";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "block w-full text-center rounded-[7px] px-4 py-[14px] text-[14.5px] font-semibold bg-clay-deep text-[#FDFBF9] shadow-[0_1px_2px_rgba(138,90,82,0.3)]",
  ghost:
    "block w-full text-center rounded-[7px] px-4 py-[14px] text-[14.5px] font-medium border border-ink/14 text-ink/55",
  link: "inline-flex items-baseline gap-[7px] text-clay-deep",
};

type ButtonProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  /** Leading icon — for actions that happen in place ("+ Add material"). */
  iconLeading?: ReactNode;
  /** Trailing icon — a chevron promises navigation ("Reprice ›"). */
  iconTrailing?: ReactNode;
  className?: string;
};

export function Button({
  variant = "link",
  children,
  iconLeading,
  iconTrailing,
  className = "",
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`font-sans ${variantClass[variant]} ${className}`}
    >
      {iconLeading && <span>{iconLeading}</span>}
      {children}
      {iconTrailing && <span>{iconTrailing}</span>}
    </button>
  );
}
