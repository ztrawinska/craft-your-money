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
import { useCurrency } from "@/components/CurrencyContext";

/** Shared text-input styling. 16px prevents iOS auto-zoom (§2.12). */
export const fieldInput =
  "w-full rounded-[5px] border border-ink/14 bg-page px-3 py-2.5 text-[16px] text-ink outline-none focus:border-clay focus:ring-[3px] focus:ring-clay/12";

/** Parse a user-typed number, accepting a comma decimal. */
export const num = (s: string) => Number(s.replace(",", "."));

/** The edit state for one row: which index (or a new row), its draft, and
 *  whether the delete confirm is showing. */
export type EditState<D> = { index: number | "new"; draft: D; confirmingDelete: boolean };

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.13em] text-ink/42">
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
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-serif text-[15px] text-ink/42">
        {cur}
      </span>
      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${fieldInput} pl-6 font-serif tabular-nums`}
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
      <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-ink/14 pt-2.5">
        <span className="text-[11px] font-light text-ink/55">{costLabel}</span>
        <span className="font-serif text-[15px] tabular-nums text-ink">
          {lineCost != null ? `${cur}${lineCost.toFixed(2)}` : "—"}
        </span>
      </div>

      {confirmingDelete ? (
        <div className="mt-3">
          <p className="mb-2 text-[12px] font-light leading-[1.5] text-ink/70">{deleteCopy}</p>
          <div className="flex items-center gap-5">
            <button type="button" onClick={onCancelDelete} className="text-[13px] text-ink/55">
              Keep it
            </button>
            <button
              type="button"
              onClick={onConfirmDelete}
              className="text-[13px] font-semibold text-status-red"
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
            className={`rounded-[7px] px-4 py-2 text-[13px] font-semibold ${
              valid ? "bg-clay-deep text-[#FDFBF9]" : "bg-ink/10 text-ink/30"
            }`}
          >
            Save
          </button>
          <button type="button" onClick={onCancel} className="text-[13px] text-ink/55">
            Cancel
          </button>
          {!isNew && (
            <button type="button" onClick={onAskDelete} className="ml-auto text-[13px] text-status-red">
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
  return (
    <div className="my-2 rounded-r-[6px] border-l-[3px] border-clay bg-ink/[0.035] px-4 py-3">
      {children}
    </div>
  );
}
