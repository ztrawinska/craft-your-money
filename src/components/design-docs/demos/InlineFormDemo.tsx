"use client";

import { useState } from "react";
import { EditShell, FieldLabel, FormFooter, MoneyInput, num } from "@/components/inline-form";
import { Input } from "@/components/ui/input";
import { ListRow } from "@/components/ListRow";

/**
 * A row editing in place, live: the whole cycle the three editors share —
 * open, type, watch the figure settle, ask to delete, change your mind.
 * Save is gated until the row is valid; nothing here opens a modal.
 */
export function InlineFormDemo() {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("Sterling silver sheet");
  const [qty, setQty] = useState("5");
  const [cost, setCost] = useState("0.94");
  const [confirming, setConfirming] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const lineCost = name.trim() !== "" && qty !== "" && cost !== "" ? num(qty) * num(cost) : null;
  const valid = lineCost != null && lineCost > 0;

  if (!open) {
    return (
      <div className="flex flex-col gap-3">
        <button type="button" onClick={() => setOpen(true)} className="w-full text-left">
          <ListRow label={name} meta={`${qty}g × £${cost}/g`} value="£4.70" />
        </button>
        <p className="font-sans text-body-sm text-ink/62">
          {note ?? "The row at rest. Tap it to edit in place."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <EditShell>
        <label className="block">
          <FieldLabel>Material</FieldLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sterling silver sheet"
            className="font-sans"
          />
        </label>
        <div className="mt-3 flex gap-2">
          <label className="w-[80px]">
            <FieldLabel>Qty</FieldLabel>
            <Input
              inputMode="decimal"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="font-serif tabular-nums"
            />
          </label>
          <label className="flex-1">
            <FieldLabel>Cost / unit</FieldLabel>
            <MoneyInput value={cost} onChange={setCost} />
          </label>
        </div>
        <FormFooter
          lineCost={lineCost}
          valid={valid}
          isNew={false}
          confirmingDelete={confirming}
          deleteCopy="Remove this material? The library item stays — only this line goes."
          onSave={() => {
            setOpen(false);
            setNote("Saved. The row closes back into the list.");
          }}
          onCancel={() => {
            setOpen(false);
            setNote("Cancelled. Nothing changed.");
          }}
          onAskDelete={() => setConfirming(true)}
          onConfirmDelete={() => {
            setConfirming(false);
            setOpen(false);
            setNote("Deleted — inline, never in a modal.");
          }}
          onCancelDelete={() => setConfirming(false)}
        />
      </EditShell>
      <p className="font-sans text-body-sm text-ink/62">
        Clear the name to see Save go quiet. Delete asks first, in the card.
      </p>
    </div>
  );
}
