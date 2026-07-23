/**
 * The status model — the one place the spec's status rules live in code.
 *
 * PRD §8 and design-system §8 describe three things that must never drift
 * apart: the user-facing label, the chip tone (colour-meaning), and the margin
 * threshold that decides the status. This file is that mapping, made explicit
 * and executable so no screen has to remember it or hardcode "Would be Healthy
 * · 52%" by hand.
 *
 * It is pure: no React, no imports. That's deliberate — the tone vocabulary is
 * a shared domain concept, so it is defined HERE and the Chip and Price
 * components import it, not the other way round. It also means these rules can
 * be unit-tested as plain functions (see status.test.ts).
 */

// ── the tone vocabulary (named by meaning, never colour) ──────────────────

/** Every chip tone. `neutral` carries no health judgement. */
export type ChipTone = "positive" | "caution" | "critical" | "neutral";

/** The three tones that are allowed to colour a *number* (the profit figure). */
export type StatusTone = Exclude<ChipTone, "neutral">;

// ── the status model ──────────────────────────────────────────────────────

/** Profitability of an active, priced product (PRD §8). */
export type Profitability = "healthy" | "caution" | "risky" | "no-price";

/** Whether a product is saved-but-partial or part of the live collection. */
export type WorkflowStatus = "draft" | "active";

/** Margins are fractions (0.52 = 52%). Thresholds are user-adjustable later. */
export type Thresholds = { healthyMin: number; cautionMin: number };
export const DEFAULT_THRESHOLDS: Thresholds = { healthyMin: 0.3, cautionMin: 0.15 };

/**
 * The explicit label ↔ tone table §8 demands. Adding a status here forces you
 * to give it both a label and a tone — they can't fall out of sync.
 */
export const PROFITABILITY_META: Record<
  Profitability,
  { label: string; tone: ChipTone }
> = {
  healthy: { label: "Healthy", tone: "positive" },
  caution: { label: "Caution", tone: "caution" },
  risky: { label: "Risky", tone: "critical" },
  "no-price": { label: "No price", tone: "neutral" },
};

/** Margin → status. `no-price` is decided upstream, by the absence of a price. */
export function profitabilityFromMargin(
  marginPct: number,
  t: Thresholds = DEFAULT_THRESHOLDS,
): Exclude<Profitability, "no-price"> {
  if (marginPct >= t.healthyMin) return "healthy";
  if (marginPct >= t.cautionMin) return "caution";
  return "risky"; // includes negative margins
}

/** The profit figure takes its chip's tone — but only the three health tones
 *  ever colour a number. `no-price` has no profit figure to colour. */
export function profitTone(status: Profitability): StatusTone | null {
  const { tone } = PROFITABILITY_META[status];
  return tone === "neutral" ? null : tone;
}

// ── the chip a product renders ────────────────────────────────────────────

export type ProductStatusInput = {
  workflow: WorkflowStatus;
  hasPrice: boolean;
  marginPct: number | null; // null when there is no price
  thresholds?: Thresholds;
};

function formatPct(marginPct: number): string {
  return `${Math.round(marginPct * 100)}%`;
}

/**
 * The single source for a product's status chip — label and tone together.
 * Covers every case in the §2.1 chip table:
 *   active + priced → "Healthy · 64%"      (tone from margin)
 *   active + none   → "No price"           (neutral — a missing input)
 *   draft  + priced → "Would be Healthy …" ("Would be" carries the draft-ness)
 *   draft  + none   → "Draft"
 */
export function statusChip(
  input: ProductStatusInput,
): { label: string; tone: ChipTone } {
  const { workflow, hasPrice, marginPct, thresholds } = input;

  const priced = hasPrice && marginPct !== null;

  if (workflow === "draft") {
    if (priced) {
      const status = profitabilityFromMargin(marginPct, thresholds);
      const { label, tone } = PROFITABILITY_META[status];
      return { label: `Would be ${label} · ${formatPct(marginPct)}`, tone };
    }
    return { label: "Draft", tone: "neutral" };
  }

  // active
  if (!priced) return { ...PROFITABILITY_META["no-price"] };
  const status = profitabilityFromMargin(marginPct, thresholds);
  const { label, tone } = PROFITABILITY_META[status];
  return { label: `${label} · ${formatPct(marginPct)}`, tone };
}

// ── overview sort: problems first (§8) ────────────────────────────────────

export type SortKey = Profitability | "draft";

/** Risky → Caution → Healthy → No price → Draft. */
export const OVERVIEW_SORT_ORDER: readonly SortKey[] = [
  "risky",
  "caution",
  "healthy",
  "no-price",
  "draft",
];

export function sortKey(input: ProductStatusInput): SortKey {
  if (input.workflow === "draft") return "draft";
  if (!input.hasPrice || input.marginPct === null) return "no-price";
  return profitabilityFromMargin(input.marginPct, input.thresholds);
}

/** Comparator for the products overview — pass straight to `Array.sort`. */
export function compareByStatus(
  a: ProductStatusInput,
  b: ProductStatusInput,
): number {
  return (
    OVERVIEW_SORT_ORDER.indexOf(sortKey(a)) -
    OVERVIEW_SORT_ORDER.indexOf(sortKey(b))
  );
}
