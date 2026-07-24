/**
 * ProductEditor — the interactive Product Detail (PRD §5, §12).
 *
 * This client component owns every editable piece of the screen: the material
 * lines and the user's price. Holding them together is what lets a cost edit
 * cascade — change a material, the direct cost moves, the calculated suggestion
 * moves, and (while still synced) the price follows it. That auto-sync is the
 * §6 behaviour that only comes alive once costs are editable.
 *
 * This slice makes MATERIALS editable inline (§2.12); labour and other costs
 * are read-only for now (same pattern, next).
 */
"use client";

import { useState } from "react";
import { ArrowLeft, ChevronDown, Ellipsis, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { ListRow } from "@/components/ListRow";
import { Price } from "@/components/Price";
import { PricingPanel } from "@/components/PricingPanel";
import { SectionLabel } from "@/components/SectionLabel";
import { computePricingFromDirect } from "@/lib/pricing";
import {
  labourDetail,
  labourLineCost,
  materialDetail,
  materialLineCost,
  type MaterialLine,
  type Product,
} from "@/lib/products";

const addIcon = <Plus size={14} strokeWidth={2} />;

const fieldInput =
  "w-full rounded-[5px] border border-ink/14 bg-page px-3 py-2.5 text-[16px] text-ink outline-none focus:border-clay focus:ring-[3px] focus:ring-clay/12";

// ── a material as it's being edited (all strings until saved) ─────────────

type MatDraft = { name: string; quantity: string; unit: string; unitCost: string };
const BLANK: MatDraft = { name: "", quantity: "", unit: "", unitCost: "" };

function draftFrom(m: MaterialLine): MatDraft {
  return { name: m.name, quantity: String(m.quantity), unit: m.unit, unitCost: m.unitCost.toFixed(2) };
}

type EditState = { index: number | "new"; draft: MatDraft; confirmingDelete: boolean };

// ── the inline edit form (§2.12) ──────────────────────────────────────────

function MaterialForm({
  draft,
  isNew,
  lineCost,
  valid,
  confirmingDelete,
  onPatch,
  onSave,
  onCancel,
  onAskDelete,
  onConfirmDelete,
  onCancelDelete,
}: {
  draft: MatDraft;
  isNew: boolean;
  lineCost: number | null;
  valid: boolean;
  confirmingDelete: boolean;
  onPatch: (patch: Partial<MatDraft>) => void;
  onSave: () => void;
  onCancel: () => void;
  onAskDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  return (
    // the 3px clay left stripe marks edit mode; content below shifts down
    <div className="my-2 border-l-[3px] border-clay py-3 pl-4 pr-1">
      <label className="block">
        <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.13em] text-ink/42">
          Material
        </span>
        <input
          autoFocus
          value={draft.name}
          onChange={(e) => onPatch({ name: e.target.value })}
          placeholder="e.g. Sterling silver sheet"
          className={`${fieldInput} font-sans`}
        />
      </label>

      <div className="mt-3 flex gap-2">
        <label className="w-[64px]">
          <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.13em] text-ink/42">
            Qty
          </span>
          <input
            inputMode="decimal"
            value={draft.quantity}
            onChange={(e) => onPatch({ quantity: e.target.value })}
            placeholder="0"
            className={`${fieldInput} font-serif tabular-nums`}
          />
        </label>
        <label className="w-[64px]">
          <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.13em] text-ink/42">
            Unit
          </span>
          <input
            value={draft.unit}
            onChange={(e) => onPatch({ unit: e.target.value })}
            placeholder="g"
            className={`${fieldInput} font-sans`}
          />
        </label>
        <label className="flex-1">
          <span className="mb-1 block text-[9px] font-semibold uppercase tracking-[0.13em] text-ink/42">
            Cost / unit
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-serif text-[15px] text-ink/42">
              £
            </span>
            <input
              inputMode="decimal"
              value={draft.unitCost}
              onChange={(e) => onPatch({ unitCost: e.target.value })}
              placeholder="0.00"
              className={`${fieldInput} pl-6 font-serif tabular-nums`}
            />
          </div>
        </label>
      </div>

      {/* live line cost, on a dashed rule */}
      <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-ink/14 pt-2.5">
        <span className="text-[11px] font-light text-ink/55">Line cost</span>
        <span className="font-serif text-[15px] tabular-nums text-ink">
          {lineCost != null ? `£${lineCost.toFixed(2)}` : "—"}
        </span>
      </div>

      {confirmingDelete ? (
        <div className="mt-3">
          <p className="mb-2 text-[12px] font-light leading-[1.5] text-ink/70">
            Remove this material? The library item stays — only this line goes.
          </p>
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
            <button
              type="button"
              onClick={onAskDelete}
              className="ml-auto text-[13px] text-status-red"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── the editor ────────────────────────────────────────────────────────────

export function ProductEditor({ product }: { product: Product }) {
  const [materials, setMaterials] = useState<MaterialLine[]>(product.materials);
  const [edit, setEdit] = useState<EditState | null>(null);

  const options = {
    targetMarginPct: product.targetMarginPct,
    vatRatePct: product.vatRatePct,
    businessCostShare: product.businessCostShare,
  };

  const labourTotal = product.labour.reduce((s, l) => s + labourLineCost(l), 0);
  const otherTotal = product.otherCosts.reduce((s, o) => s + o.cost, 0);
  const materialsTotal = materials.reduce((s, m) => s + materialLineCost(m), 0);
  const directCost = materialsTotal + labourTotal + otherTotal;

  const summary = computePricingFromDirect(directCost, { finalPrice: null, ...options });
  const calculatedPrice = summary.calculatedPrice;

  // A draft with no saved price is still being built → auto-sync to the
  // suggestion. Anything else loads decoupled (a stored decision, or a
  // deliberate No price).
  const initialSynced = product.workflow === "draft" && product.finalPrice == null;
  const [decoupled, setDecoupled] = useState(!initialSynced);
  const [manualPrice, setManualPrice] = useState(() =>
    product.finalPrice != null ? product.finalPrice.toFixed(2) : "",
  );

  // Derived, not stored: while synced the price simply IS the suggestion, so it
  // follows cost edits with no effect. Once decoupled it's the user's own text.
  const priceText = decoupled ? manualPrice : (calculatedPrice?.toFixed(2) ?? "");

  // draft parse + validation (no error states while typing — Save just gates)
  const draft = edit?.draft;
  const draftQty = draft ? Number(draft.quantity.replace(",", ".")) : NaN;
  const draftCost = draft ? Number(draft.unitCost.replace(",", ".")) : NaN;
  const draftLineCost =
    Number.isFinite(draftQty) && Number.isFinite(draftCost) ? draftQty * draftCost : null;
  const draftValid =
    !!draft &&
    draft.name.trim() !== "" &&
    Number.isFinite(draftQty) &&
    draftQty > 0 &&
    Number.isFinite(draftCost) &&
    draftCost > 0;

  function saveEdit() {
    if (!edit || !draftValid || !draft) return;
    const next: MaterialLine = {
      name: draft.name.trim(),
      quantity: draftQty,
      unit: draft.unit.trim(),
      unitCost: draftCost,
    };
    setMaterials((prev) =>
      edit.index === "new"
        ? [...prev, next]
        : prev.map((m, i) => (i === edit.index ? { ...m, ...next } : m)),
    );
    setEdit(null);
  }

  function confirmDelete() {
    if (edit && edit.index !== "new") {
      setMaterials((prev) => prev.filter((_, i) => i !== edit.index));
    }
    setEdit(null);
  }

  const formProps = (isNew: boolean) => ({
    draft: edit!.draft,
    isNew,
    lineCost: draftLineCost,
    valid: draftValid,
    confirmingDelete: edit!.confirmingDelete,
    onPatch: (patch: Partial<MatDraft>) =>
      setEdit((e) => (e ? { ...e, draft: { ...e.draft, ...patch } } : e)),
    onSave: saveEdit,
    onCancel: () => setEdit(null),
    onAskDelete: () => setEdit((e) => (e ? { ...e, confirmingDelete: true } : e)),
    onConfirmDelete: confirmDelete,
    onCancelDelete: () => setEdit((e) => (e ? { ...e, confirmingDelete: false } : e)),
  });

  const addingNew = edit?.index === "new";

  return (
    <main className="mx-auto w-full max-w-[430px] pb-24">
      {/* ── header: back · workflow stamp · more ── */}
      <div className="flex items-center justify-between px-6 pt-5">
        <Link href="/products" aria-label="Back" className="-ml-1.5 text-ink/55">
          <ArrowLeft size={18} strokeWidth={2} />
        </Link>
        {product.workflow === "draft" ? (
          <span className="rounded-[2px] border border-ink/30 px-[11px] pb-[3px] pt-1 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-ink/55">
            Draft
          </span>
        ) : (
          <span />
        )}
        <button type="button" aria-label="More" className="text-ink/42">
          <Ellipsis size={18} />
        </button>
      </div>

      {/* ── identity ── */}
      <div className="px-6 pb-2 pt-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-deep">
          {product.type}
        </p>
        <h1 className="max-w-[300px] font-serif text-[27px] font-medium leading-[1.16] tracking-[-0.01em]">
          {product.name}
        </h1>
      </div>

      {/* ── ledger ── */}
      <div className="px-6">
        {/* materials — editable */}
        <section className="pb-1.5 pt-[22px]">
          <SectionLabel
            total={
              materials.length > 0 ? (
                <Price value={materialsTotal} variant="sectionTotal" />
              ) : undefined
            }
          >
            Materials
          </SectionLabel>
          {materials.map((m, i) =>
            edit && edit.index === i ? (
              <MaterialForm key={`edit-${i}`} {...formProps(false)} />
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => setEdit({ index: i, draft: draftFrom(m), confirmingDelete: false })}
                className="block w-full text-left"
              >
                <ListRow
                  label={m.name}
                  library={m.fromLibrary}
                  meta={materialDetail(m)}
                  value={<Price value={materialLineCost(m)} variant="inline" />}
                />
              </button>
            ),
          )}
          {addingNew && <MaterialForm {...formProps(true)} />}
          {!addingNew && (
            <Button
              variant="link"
              iconLeading={addIcon}
              onClick={() => setEdit({ index: "new", draft: BLANK, confirmingDelete: false })}
              className="pt-3 text-[13px] font-medium"
            >
              Add material
            </Button>
          )}
        </section>

        {/* labour — read-only for now */}
        <section className="border-t border-ink/7 pb-1.5 pt-[22px]">
          <SectionLabel
            total={
              product.labour.length > 0 ? (
                <Price value={labourTotal} variant="sectionTotal" />
              ) : undefined
            }
          >
            Labour
          </SectionLabel>
          {product.labour.map((l) => (
            <ListRow
              key={l.step}
              label={l.step}
              meta={labourDetail(l)}
              value={<Price value={labourLineCost(l)} variant="inline" />}
            />
          ))}
        </section>

        {/* other costs — read-only for now */}
        {product.otherCosts.length > 0 && (
          <section className="border-t border-ink/7 pb-1.5 pt-[22px]">
            <SectionLabel total={<Price value={otherTotal} variant="sectionTotal" />}>
              Other costs
            </SectionLabel>
            {product.otherCosts.map((o) => (
              <ListRow key={o.label} label={o.label} value={<Price value={o.cost} variant="inline" />} />
            ))}
          </section>
        )}

        {/* reconciling summary — live */}
        <div className="mt-[22px] border-t border-ink/14 pb-1 pt-5">
          {materials.length > 0 && (
            <div className="flex items-baseline justify-between py-[3px] text-[13px] text-ink/55">
              <span>Materials</span>
              <Price value={materialsTotal} variant="summary" />
            </div>
          )}
          {product.labour.length > 0 && (
            <div className="flex items-baseline justify-between py-[3px] text-[13px] text-ink/55">
              <span>Labour</span>
              <Price value={labourTotal} variant="summary" />
            </div>
          )}
          <div className="mt-[10px] flex items-baseline justify-between border-t border-ink/7 pt-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">
              Direct cost
            </span>
            <Price value={directCost} variant="figure" />
          </div>
          {product.businessCostShare !== null && (
            <div className="mt-[11px] border-t border-dashed border-ink/14 pt-[10px]">
              <div className="flex items-baseline justify-between py-[3px] text-[12px] text-ink/55">
                <span className="font-light italic">Share of business costs</span>
                <Price value={product.businessCostShare} variant="summary" />
              </div>
              <div className="flex items-baseline justify-between py-[3px] text-[12px]">
                <span className="font-medium text-ink/70">Full cost</span>
                <Price value={directCost + product.businessCostShare} variant="inline" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── the ONE framed surface: the interactive pricing block ── */}
      <PricingPanel
        workflow={product.workflow}
        directCost={directCost}
        targetMarginPct={product.targetMarginPct}
        vatRatePct={product.vatRatePct}
        businessCostShare={product.businessCostShare}
        priceText={priceText}
        onPriceChange={(v) => {
          setManualPrice(v);
          setDecoupled(true); // first manual edit decouples, permanently
        }}
        onReset={() => {
          if (calculatedPrice != null) setManualPrice(calculatedPrice.toFixed(2));
          // reset does NOT re-enable auto-sync (decoupled stays true)
        }}
        onUseSuggested={() => setDecoupled(false)}
      />

      {/* ── market benchmark: collapsed by default ── */}
      <div className="px-6 pt-5">
        <div className="flex items-center justify-between border-b border-t border-ink/7 py-[15px]">
          <span className="text-[13.5px] font-medium text-ink/55">Market benchmark</span>
          <ChevronDown size={14} className="text-ink/30" />
        </div>
      </div>

      {/* ── save bar ── */}
      <div className="mt-[22px] border-t border-ink/7 bg-page px-6 pb-5 pt-[14px] shadow-[0_-6px_18px_-12px_rgba(30,25,22,0.12)]">
        <p className="mb-[11px] flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-ink/42 before:h-[5px] before:w-[5px] before:rounded-full before:bg-clay before:content-['']">
          Unsaved changes
        </p>
        <div className="mb-2">
          <Button variant="primary">Save and activate</Button>
        </div>
        <Button variant="ghost">Save draft</Button>
      </div>
    </main>
  );
}
