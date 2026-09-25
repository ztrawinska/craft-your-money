/**
 * inline-form — the shared building blocks for editing a row in place (§2.12).
 *
 * Extracted from ProductEditor so the materials library and the business-costs
 * screen edit rows with exactly the same feel: a clay left-stripe marks edit
 * mode, a live figure sits on a dashed rule, Save is gated until valid, and
 * delete confirms inline. Presentational only — the owning client component
 * holds the draft state and passes handlers in.
 */
"use client";

import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { useCurrency } from "@/components/CurrencyContext";
import { formatMoney } from "@/lib/currency";
import { handleCentsInput, pinCaretRight } from "@/lib/money-input";

/** Parse a user-typed number, accepting a comma decimal. */
export const num = (s: string) => Number(s.replace(",", "."));

/** The edit state for one row: which index (or a new row), its draft, and
 *  whether the delete confirm is showing. */
export type EditState<D> = { index: number | "new"; draft: D; confirmingDelete: boolean };

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1 block text-caps-tight uppercase text-ink/62">
      {children}
    </span>
  );
}

export function MoneyInput({
  value,
  onChange,
  placeholder = "0.00",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const cur = useCurrency();
  return (
    <div className="relative">
      <span
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 font-serif text-value text-ink/62 ${
          cur.suffix ? "right-3" : "left-3"
        }`}
      >
        {cur.symbol}
      </span>
      <Input
        inputMode="numeric"
        value={value}
        onChange={(e) => handleCentsInput(e, onChange)}
        onFocus={pinCaretRight}
        onSelect={pinCaretRight}
        placeholder={placeholder}
        // Align the number toward the currency so the caret sits right beside
        // it (matching "your price"): right for a suffix symbol (zł 12.00 →
        // caret between number and zł), left for a prefix (£12.00).
        className={`font-serif tabular-nums ${cur.suffix ? "pr-10 text-right" : "pl-6"}`}
      />
    </div>
  );
}

/** The footer for an inline form: a live figure on a dashed rule, then either
 *  Save/Cancel/Delete or the inline delete confirm. */
export function FormFooter({
  lineCost,
  costLabel = "Line cost",
  valid,
  isNew,
  confirmingDelete,
  deleteCopy,
  onSave,
  onCancel,
  onAskDelete,
  onConfirmDelete,
  onCancelDelete,
}: {
  lineCost: number | null;
  costLabel?: string;
  valid: boolean;
  isNew: boolean;
  confirmingDelete: boolean;
  deleteCopy: string;
  onSave: () => void;
  onCancel: () => void;
  onAskDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  const cur = useCurrency();
  return (
    <>
      <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-ink/14 pt-3">
        <span className="text-body-sm text-ink/62">{costLabel}</span>
        <span className="font-serif text-value tabular-nums text-ink">
          {lineCost != null ? formatMoney(lineCost, cur) : "—"}
        </span>
      </div>

      {confirmingDelete ? (
        <div className="mt-3">
          <p className="mb-2 text-body-sm text-ink/70">{deleteCopy}</p>
          <div className="flex items-center gap-5">
            <button type="button" onClick={onCancelDelete} className="text-label text-ink/62">
              Keep it
            </button>
            <button
              type="button"
              onClick={onConfirmDelete}
              className="text-label-bold text-status-red"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-4">
          <button
            type="button"
            onClick={onSave}
            disabled={!valid}
            className={`rounded-button px-4 py-2 text-label-bold ${
              valid ? "bg-clay-deep text-on-clay" : "bg-ink/10 text-ink/30"
            }`}
          >
            Save
          </button>
          <button type="button" onClick={onCancel} className="text-label text-ink/62">
            Cancel
          </button>
          {!isNew && (
            <button type="button" onClick={onAskDelete} className="ml-auto text-label text-status-red">
              Delete
            </button>
          )}
        </div>
      )}
    </>
  );
}

/** Edit mode is marked by a 3px clay left stripe and a faint ink tint (rounded
 *  on the right, like the assistant inset in §2.9); content below shifts down. */
export function EditShell({ children }: { children: ReactNode }) {
  // Edit mode is signalled by containment alone: a rounded, faintly-tinted card
  // that lifts the row off the page, plus the input's own focus ring. No accent
  // stripe — it was purely decorative here (the benchmark norm — Airwallex,
  // Bevel, Walmart — is a contained card, no stripe). The clay/iris stripes
  // elsewhere stay because they carry meaning (the one framed surface; "AI is
  // here"); this one didn't.
  return (
    <div className="my-2 rounded-band bg-ink/[0.05] px-4 py-3">{children}</div>
  );
}
