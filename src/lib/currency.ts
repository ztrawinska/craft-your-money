/**
 * Currency (§9, §14). The account picks one; it only ever changes the SYMBOL —
 * there is no conversion. We store the ISO code (so the picker can search by
 * name) and resolve the symbol from it.
 *
 * Pure and tiny — safe to import anywhere. The symbol is a prefix on every
 * figure (£12.00, €12.00, zł12.00); this MVP doesn't do per-currency suffixing.
 */
export type Currency = { code: string; name: string; symbol: string };

export const CURRENCIES: Currency[] = [
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "PLN", name: "Polish Złoty", symbol: "zł" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
  { code: "CAD", name: "Canadian Dollar", symbol: "$" },
  { code: "AUD", name: "Australian Dollar", symbol: "$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
];

export const DEFAULT_CURRENCY = "GBP";

const BY_CODE = new Map(CURRENCIES.map((c) => [c.code, c]));
const BY_SYMBOL = new Map(CURRENCIES.map((c) => [c.symbol, c]));

/**
 * The display symbol for a stored currency value. Accepts a code ("GBP"), and
 * degrades gracefully for a legacy raw symbol ("£") or anything unknown, so an
 * old settings file never breaks the display.
 */
export function currencySymbol(value: string): string {
  const byCode = BY_CODE.get(value);
  if (byCode) return byCode.symbol;
  if (BY_SYMBOL.has(value)) return value;
  return value || "£";
}

/** The full currency for a stored value, or undefined if it isn't a known code. */
export function currencyByCode(code: string): Currency | undefined {
  return BY_CODE.get(code);
}
