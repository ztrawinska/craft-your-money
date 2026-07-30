/**
 * MaterialsEditor — the materials library screen (/materials, PRD §11/§14).
 *
 * Inline edit like everywhere else (§2.12), with an optional stock layer that
 * reads "no stock tracked" when untracked. Delete is safe: products keep their
 * own cost copies, so removing a library material never changes a product.
 *
 * Each row persists on Save (its own Server Action); local state gives instant
 * feedback.
 */
"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/Button";
import { useCurrency } from "@/components/CurrencyContext";
import { ListRow } from "@/components/ListRow";
import { SectionLabel } from "@/components/SectionLabel";
import {
  EditShell,
  FieldLabel,
  FormFooter,
  MoneyInput,
  fieldInput,
  num,
  type EditState,
} from "@/components/inline-form";
import { saveMaterialAction, deleteMaterialAction } from "@/app/materials/actions";
import {
  materialStockLabel,
  materialUnitLabel,
  type LibraryMaterial,
} from "@/lib/materials";

const addIcon = <Plus size={14} strokeWidth={2} />;

type Draft = { name: string; unit: string; unitCost: string; stock: string };
const BLANK: Draft = { name: "", unit: "", unitCost: "", stock: "" };
const draftFrom = (m: LibraryMaterial): Draft => ({
  name: m.name,
  unit: m.unit,
  unitCost: m.unitCost.toFixed(2),
  stock: m.stock == null ? "" : String(m.stock),
});

function MaterialFields({
  draft,
  onPatch,
  footer,
}: {
  draft: Draft;
  onPatch: (p: Partial<Draft>) => void;
  footer: React.ReactNode;
}) {
  return (
    <EditShell>
      <label className="block">
        <FieldLabel>Name</FieldLabel>
        <input
          autoFocus
          value={draft.name}
          onChange={(e) => onPatch({ name: e.target.value })}
          placeholder="e.g. Sterling silver sheet"
          className={`${fieldInput} font-sans`}
        />
      </label>
      <div className="mt-3 flex gap-2">
        <label className="w-[72px]">
          <FieldLabel>Unit</FieldLabel>
          <input
            value={draft.unit}
            onChange={(e) => onPatch({ unit: e.target.value })}
            placeholder="g"
            className={`${fieldInput} font-sans`}
          />
        </label>
        <label className="flex-1">
          <FieldLabel>Cost / unit</FieldLabel>
          <MoneyInput value={draft.unitCost} onChange={(v) => onPatch({ unitCost: v })} />
        </label>
      </div>
      <label className="mt-3 block w-[140px]">
        <FieldLabel>Stock (optional)</FieldLabel>
        <input
          inputMode="decimal"
          value={draft.stock}
          onChange={(e) => onPatch({ stock: e.target.value })}
          placeholder="not tracked"
          className={`${fieldInput} font-serif tabular-nums`}
        />
      </label>
      {footer}
    </EditShell>
  );
}

export function MaterialsEditor({ initial }: { initial: LibraryMaterial[] }) {
  const cur = useCurrency();
  const [materials, setMaterials] = useState<LibraryMaterial[]>(initial);
  const [edit, setEdit] = useState<EditState<Draft> | null>(null);
  const [, startSaving] = useTransition();

  const d = edit?.draft;
  const dCost = d ? num(d.unitCost) : NaN;
  const dStock = d && d.stock.trim() !== "" ? num(d.stock) : null;
  const valid =
    !!d &&
    d.name.trim() !== "" &&
    dCost > 0 &&
    (dStock === null || (Number.isFinite(dStock) && dStock >= 0));

  const open = (index: number | "new", draft: Draft) =>
    setEdit({ index, draft, confirmingDelete: false });

  function save() {
    if (!edit || !valid || !d) return;
    const id = edit.index === "new" ? `m-${crypto.randomUUID()}` : materials[edit.index].id;
    const next: LibraryMaterial = {
      id,
      name: d.name.trim(),
      unit: d.unit.trim(),
      unitCost: dCost,
      stock: dStock,
    };
    setMaterials((prev) =>
      edit.index === "new" ? [...prev, next] : prev.map((m, i) => (i === edit.index ? next : m)),
    );
    setEdit(null);
    startSaving(async () => {
      await saveMaterialAction(next);
    });
  }

  function remove() {
    if (!edit || edit.index === "new") {
      setEdit(null);
      return;
    }
    const id = materials[edit.index].id;
    setMaterials((prev) => prev.filter((_, i) => i !== edit.index));
    setEdit(null);
    startSaving(async () => {
      await deleteMaterialAction(id);
    });
  }

  const footer = (isNew: boolean) => (
    <FormFooter
      lineCost={Number.isFinite(dCost) ? dCost : null}
      costLabel="Unit cost"
      valid={valid}
      isNew={isNew}
      confirmingDelete={!!edit?.confirmingDelete}
      deleteCopy="Remove this from your library? Products that use it keep their own copy — only the library entry goes."
      onSave={save}
      onCancel={() => setEdit(null)}
      onAskDelete={() => setEdit((e) => (e ? { ...e, confirmingDelete: true } : e))}
      onConfirmDelete={remove}
      onCancelDelete={() => setEdit((e) => (e ? { ...e, confirmingDelete: false } : e))}
    />
  );
  const patch = (p: Partial<Draft>) =>
    setEdit((e) => (e ? { ...e, draft: { ...e.draft, ...p } } : e));
  const addingNew = edit?.index === "new";

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-[430px] flex-1">
        <div className="flex items-baseline justify-between px-6 pb-3.5 pt-[22px]">
          <h1 className="font-serif text-[26px] font-medium tracking-[-0.01em]">Materials</h1>
          <span className="font-sans text-[11px] font-light text-ink/42">
            {materials.length} saved
          </span>
        </div>

        {/* one gutter for the whole section — rows align to it like the product
            calculator's material/cost lines (no stripe, no extra padding) */}
        <div className="px-6">
          <SectionLabel>Your library</SectionLabel>
          {materials.map((m, i) =>
            edit && edit.index === i ? (
              <MaterialFields
                key={`edit-${m.id}`}
                draft={edit.draft}
                onPatch={patch}
                footer={footer(false)}
              />
            ) : (
              <button
                key={m.id}
                type="button"
                onClick={() => open(i, draftFrom(m))}
                className="block w-full text-left"
              >
                <ListRow
                  label={m.name}
                  meta={
                    m.stock == null ? (
                      <span className="text-ink/30">{materialStockLabel(m)}</span>
                    ) : (
                      materialStockLabel(m)
                    )
                  }
                  value={
                    <span className="font-serif text-[15.5px] tabular-nums text-ink">
                      {materialUnitLabel(m, cur)}
                    </span>
                  }
                />
              </button>
            ),
          )}
          {addingNew ? (
            <MaterialFields draft={edit!.draft} onPatch={patch} footer={footer(true)} />
          ) : (
            <Button
              variant="link"
              iconLeading={addIcon}
              onClick={() => open("new", BLANK)}
              className="pt-3 text-[13px] font-medium"
            >
              Add material
            </Button>
          )}
        </div>
      </main>

      <BottomNav active="materials" />
    </div>
  );
}
