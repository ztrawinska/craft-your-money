/**
 * Account settings (PRD §14, §6). Target margin, VAT and the bench rate belong
 * to the account, not to each product — one place to change, ripples everywhere.
 *
 * Pure types + defaults, safe to import anywhere. The store reads/writes them;
 * the pricing lens (pricingFor) takes them as an argument.
 */
export type Settings = {
  benchRate: number; // £/hr — the default rate for a new labour step
  targetMarginPct: number; // the margin the calculated price aims for
  currency: string; // symbol only, no conversion (§9)
  vatEnabled: boolean;
  vatRatePct: number;
};

// The sample account: VAT is on at 20% (the seed data is priced gross with VAT).
// A genuinely fresh account would start VAT-off (§6) — that's a Settings choice.
export const DEFAULT_SETTINGS: Settings = {
  benchRate: 15,
  targetMarginPct: 40,
  currency: "£",
  vatEnabled: true,
  vatRatePct: 20,
};

/** The VAT rate to feed pricing: null when VAT is switched off. */
export function effectiveVatRate(s: Settings): number | null {
  return s.vatEnabled ? s.vatRatePct : null;
}
