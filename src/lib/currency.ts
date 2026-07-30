/**
 * Currency (§9, §14). The account picks one; it only ever changes the SYMBOL —
 * there is no conversion. We store the ISO code (so the picker can search by
 * name) and resolve the symbol from it.
 *
 * Pure and tiny — safe to import anywhere. The symbol is a prefix on every
 * figure (£12.00, €12.00, zł12.00); this MVP doesn't do per-currency suffixing.
 */
// `suffix` currencies read after the number, with a space ("12.00 zł"); the
// rest prefix it ("£12.00").
export type Currency = { code: string; name: string; symbol: string; suffix?: boolean };

export const CURRENCIES: Currency[] = [
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "PLN", name: "Polish Złoty", symbol: "zł", suffix: true },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", suffix: true },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", suffix: true },
  { code: "DKK", name: "Danish Krone", symbol: "kr", suffix: true },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč", suffix: true },
  { code: "CAD", name: "Canadian Dollar", symbol: "$" },
  { code: "AUD", name: "Australian Dollar", symbol: "$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
];

/** The resolved symbol + placement for the account — the unit every money
 *  display needs. `formatMoney` and the layout components read it. */
export type Cur = { symbol: string; suffix: boolean };
export const GBP_CUR: Cur = { symbol: "£", suffix: false };

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

/** The symbol + placement for a stored currency value (code or legacy symbol). */
export function currencyCur(value: string): Cur {
  const c = BY_CODE.get(value);
  if (c) return { symbol: c.symbol, suffix: c.suffix ?? false };
  return { symbol: currencySymbol(value), suffix: false };
}

/** Format an amount in the account currency: "£12.00" or "12.00 zł". */
export function formatMoney(value: number, cur: Cur): string {
  const n = value.toFixed(2);
  return cur.suffix ? `${n} ${cur.symbol}` : `${cur.symbol}${n}`;
}
