/**
 * Money entry, YNAB-style — a right-to-left cents accumulator.
 *
 * The field reads DIGITS ONLY. Every digit shifts the amount one place left and
 * the last two digits are always the pennies, so the decimal point and the two
 * decimals are painted on, never typed and never strandable:
 *
 *   "" → 5 → "0.05" → 5 → "0.55" → 5 → "5.55" → backspace → "0.55"
 *
 * This is why the keypad is `inputMode="numeric"` (no separator key to miss) and
 * why there's no comma-vs-dot ambiguity: you never type a separator at all. An
 * all-zero result reads as empty (= no price / placeholder), matching how a
 * blank price already means "No price".
 *
 * Pair `accumulateCents` (the reformat) with `handleCentsInput`, which also pins
 * the caret to the right after each keystroke so entry always builds from the
 * right, however the field was tapped.
 */
import type { ChangeEvent, SyntheticEvent } from "react";

/** Reformat whatever is in the field to a fixed two-decimal amount, reading only
 *  its digits. Empty / all-zero → "" (the placeholder shows through). */
export function accumulateCents(rawInput: string): string {
  const digits = rawInput.replace(/\D/g, "");
  if (digits === "") return "";
  const cents = parseInt(digits, 10);
  if (!cents) return "";
  return (cents / 100).toFixed(2);
}

/** Keep the caret pinned to the far right of a cents-accumulator field — so a
 *  tap anywhere in the number still lands the next digit on the right, and the
 *  caret always sits between the number and the currency. Attach to onFocus and
 *  onSelect. Guarded (only moves when off the end) so it never loops. */
export function pinCaretRight(e: SyntheticEvent<HTMLInputElement>): void {
  const el = e.currentTarget;
  const end = el.value.length;
  if (el.selectionStart !== end || el.selectionEnd !== end) {
    try {
      el.setSelectionRange(end, end);
    } catch {
      // a few input types reject setSelectionRange; harmless to skip
    }
  }
}

/** onChange for a cents-accumulator field: reformat, report the value up, then
 *  pin the caret to the end so the next digit lands on the right. */
export function handleCentsInput(
  e: ChangeEvent<HTMLInputElement>,
  onValue: (value: string) => void,
): void {
  const el = e.currentTarget;
  onValue(accumulateCents(el.value));
  requestAnimationFrame(() => {
    try {
      const end = el.value.length;
      el.setSelectionRange(end, end);
    } catch {
      // a few input types reject setSelectionRange; harmless to skip
    }
  });
}
