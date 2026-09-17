/**
 * Chip — the only way to show status in this design system.
 *
 * Status is never raw coloured text; it is always a pill. Callers choose a
 * meaning ("caution"), not a colour ("amber"), so the mapping from meaning to
 * colour lives here and stays consistent everywhere.
 */

import type { ChipTone } from "@/lib/status";

/*
 * Written out as whole class strings on purpose. Tailwind scans source files
 * for complete class names, so a constructed string like
 * `bg-status-${tone}/15` would never be generated into the stylesheet.
 */
const toneClasses: Record<ChipTone, string> = {
  positive: "bg-status-green/15 text-status-green",
  caution: "bg-status-amber/15 text-status-amber",
  critical: "bg-status-red/15 text-status-red",
  neutral: "bg-ink/10 text-ink/70",
  // outlined, not filled: a product outside the live range (Draft, Archived).
  inactive: "border border-ink/14 text-ink/62",
};

// Default is the standalone chip. `sm` is only for a chip sitting inline in
// dense text — e.g. inside a dashboard attention row's meta line.
const sizeClasses = {
  default: "px-3 py-1 text-[12px]",
  sm: "px-2 py-nudge text-[10.5px]",
} as const;

type ChipProps = {
  tone?: ChipTone;
  size?: keyof typeof sizeClasses;
  children: React.ReactNode;
};

export function Chip({ tone = "neutral", size = "default", children }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-chip font-semibold font-sans tabular-nums ${sizeClasses[size]} ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
