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
 *
 * With an `href` a Button renders as a link (a verb-link that navigates, like
 * "Reprice ›") instead of a <button> — same look, right semantics.
 */
import type { ReactNode } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "ghost" | "link";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "block w-full text-center rounded-button px-4 py-3 min-h-tap text-[14.5px] font-semibold bg-clay-deep text-on-clay shadow-[0_1px_2px_rgba(138,90,82,0.3)]",
  ghost:
    "block w-full text-center rounded-button px-4 py-3 min-h-tap text-[14.5px] font-medium border border-ink/14 text-ink/62",
  link: "inline-flex items-center gap-2 text-clay-deep",
};

type ButtonProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  /** Leading icon — for actions that happen in place ("+ Add material"). */
  iconLeading?: ReactNode;
  /** Trailing icon — a chevron promises navigation ("Reprice ›"). */
  iconTrailing?: ReactNode;
  /** When set, the button navigates: renders as a link, not a <button>. */
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  /** Use "submit" inside a form; ignored when href is set. */
  type?: "button" | "submit";
  className?: string;
};

export function Button({
  variant = "link",
  children,
  iconLeading,
  iconTrailing,
  href,
  onClick,
  disabled,
  type = "button",
  className = "",
}: ButtonProps) {
  const cls = `font-sans ${variantClass[variant]} ${className}`;
  const inner = (
    <>
      {iconLeading && <span>{iconLeading}</span>}
      {children}
      {iconTrailing && <span>{iconTrailing}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  );
}
