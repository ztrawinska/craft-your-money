/**
 * ProductEditor — the interactive Product Detail (PRD §5, §12).
 *
 * This client component owns every editable piece of the screen: the material
 * and labour lines and the user's price. Holding them together is what lets a
 * cost edit cascade — change a cost, the direct cost moves, the calculated
 * suggestion moves, and (while still synced) the price follows it.
 *
 * Materials and labour are both editable inline (§2.12); "other costs" is the
 * same pattern and stays read-only for now.
 */
"use client";

import { useState, useTransition } from "react";
import { Archive, ChevronLeft, Copy, Ellipsis, Plus, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  archiveProductAction,
  deleteProductAction,
  duplicateProductAction,
  restoreProductAction,
  saveProductAction,
} from "@/app/products/actions";
import { ActionSheet, type SheetAction } from "@/components/ActionSheet";
import { BenchmarkSection } from "@/components/BenchmarkSection";
import { Button } from "@/components/Button";
import { useCurrency } from "@/components/CurrencyContext";
import { Combobox } from "@/components/Combobox";
import { Input } from "@/components/ui/input";
import {
  EditShell,
  FieldLabel,
  FormFooter,
  MoneyInput,  num,
  type EditState,
} from "@/components/inline-form";
import { ListRow } from "@/components/ListRow";
import { Price } from "@/components/Price";
import { PricingPanel } from "@/components/PricingPanel";
import { SectionLabel } from "@/components/SectionLabel";
import { computePricingFromDirect } from "@/lib/pricing";
import {
  fixedCostPerUnit,
  type FixedCost,
  type FixedCostConfig,
} from "@/lib/fixed-costs";
import { materialUnitLabel, type LibraryMaterial } from "@/lib/materials";
import { marketRead, type BenchmarkPrice } from "@/lib/benchmark";
import { effectiveVatRate, type Settings } from "@/lib/settings";
import {
  labourDetail,
  labourLineCost,
  materialDetail,
  materialLineCost,
  type LabourLine,
  type MaterialLine,
  type OtherLine,
  type Product,
} from "@/lib/products";

const addIcon = <Plus size={14} strokeWidth={2} />;

// ── drafts (all strings until saved) ──────────────────────────────────────

type MatDraft = {
  name: string;
  quantity: string;
  unit: string;
  unitCost: string;
  fromLibrary: boolean;
};
type LabDraft = { step: string; minutes: string; rate: string };
type OtherDraft = { label: string; amount: string };

const BLANK_MAT: MatDraft = { name: "", quantity: "", unit: "", unitCost: "", fromLibrary: false };
const BLANK_OTHER: OtherDraft = { label: "", amount: "" };
// A new labour step defaults to the account's bench rate (PRD §14).
const blankLab = (benchRate: number): LabDraft => ({ step: "", minutes: "", rate: String(benchRate) });

const draftFromMat = (m: MaterialLine): MatDraft => ({
  name: m.name,
  quantity: String(m.quantity),
  unit: m.unit,
  unitCost: m.unitCost.toFixed(2),
  fromLibrary: !!m.fromLibrary,
});
const draftFromLab = (l: LabourLine): LabDraft => ({
  step: l.step,
  minutes: String(l.minutes),
  rate: String(l.rate),
});
const draftFromOther = (o: OtherLine): OtherDraft => ({
  label: o.label,
  amount: o.cost.toFixed(2),
});

// The two inline forms. Rendered identically whether editing a row or adding a
// new one — the only difference is the footer that's passed in.
function MaterialFields({
  draft,
  onPatch,
  footer,
  library,
}: {
  draft: MatDraft;
  onPatch: (p: Partial<MatDraft>) => void;
  footer: React.ReactNode;
  library: LibraryMaterial[];
}) {
  const cur = useCurrency();
  return (
    <EditShell>
      <label className="block">
        <FieldLabel>Material</FieldLabel>
        {/* type to autofill from the library; picking one fills the unit cost */}
        <Combobox
          autoFocus
          value={draft.name}
          placeholder="e.g. Sterling silver sheet"
          options={library.map((m) => ({
            id: m.id,
            label: m.name,
            hint: materialUnitLabel(m, cur),
          }))}
          onType={(t) => onPatch({ name: t, fromLibrary: false })}
          onUseAsNew={() => onPatch({ fromLibrary: false })}
          onPick={(o) => {
            const m = library.find((x) => x.id === o.id);
            if (m) {
              onPatch({ name: m.name, unit: m.unit, unitCost: m.unitCost.toFixed(2), fromLibrary: true });
            }
          }}
        />
      </label>
      <div className="mt-3 flex gap-2">
        <label className="w-[64px]">
          <FieldLabel>Qty</FieldLabel>
          <Input
            inputMode="decimal"
            value={draft.quantity}
            onChange={(e) => onPatch({ quantity: e.target.value })}
            placeholder="0"
            className="font-serif tabular-nums"
          />
        </label>
        <label className="w-[64px]">
          <FieldLabel>Unit</FieldLabel>
          <Input
            value={draft.unit}
            onChange={(e) => onPatch({ unit: e.target.value })}
            placeholder="g"
            className="font-sans"
          />
        </label>
        <label className="flex-1">
          <FieldLabel>Cost / unit</FieldLabel>
          <MoneyInput value={draft.unitCost} onChange={(v) => onPatch({ unitCost: v })} />
        </label>
      </div>
      {footer}
    </EditShell>
  );
}

function LabourFields({
  draft,
  onPatch,
  footer,
  ratePlaceholder,
}: {
  draft: LabDraft;
  onPatch: (p: Partial<LabDraft>) => void;
  footer: React.ReactNode;
  ratePlaceholder: string;
}) {
  return (
    <EditShell>
      <label className="block">
        <FieldLabel>Step</FieldLabel>
        <Input
          autoFocus
          value={draft.step}
          onChange={(e) => onPatch({ step: e.target.value })}
          placeholder="e.g. Soldering"
          className="font-sans"
        />
      </label>
      <div className="mt-3 flex gap-2">
        <label className="w-[96px]">
          <FieldLabel>Minutes</FieldLabel>
          <Input
            inputMode="numeric"
            value={draft.minutes}
            onChange={(e) => onPatch({ minutes: e.target.value })}
            placeholder="0"
            className="font-serif tabular-nums"
          />
        </label>
        <label className="flex-1">
          <FieldLabel>Rate / hour</FieldLabel>
          <MoneyInput
            value={draft.rate}
            onChange={(v) => onPatch({ rate: v })}
            placeholder={ratePlaceholder}
          />
        </label>
      </div>
      {footer}
    </EditShell>
  );
}

function OtherFields({
  draft,
  onPatch,
  footer,
}: {
  draft: OtherDraft;
  onPatch: (p: Partial<OtherDraft>) => void;
  footer: React.ReactNode;
}) {
  return (
    <EditShell>
      <label className="block">
        <FieldLabel>Cost</FieldLabel>
        <Input
          autoFocus
          value={draft.label}
          onChange={(e) => onPatch({ label: e.target.value })}
          placeholder="e.g. Gift box, hallmarking"
          className="font-sans"
        />
      </label>
      <div className="mt-3">
        <label className="block w-[120px]">
          <FieldLabel>Amount</FieldLabel>
          <MoneyInput value={draft.amount} onChange={(v) => onPatch({ amount: v })} />
        </label>
      </div>
      {footer}
    </EditShell>
  );
}

// ── the editor ────────────────────────────────────────────────────────────

export function ProductEditor({
  product,
  settings,
  library,
  fixedCosts,
  fixedCostConfig,
}: {
  product: Product;
  settings: Settings;
  library: LibraryMaterial[];
  fixedCosts: FixedCost[];
  fixedCostConfig: FixedCostConfig;
}) {
  const [materials, setMaterials] = useState<MaterialLine[]>(product.materials);
  const [labour, setLabour] = useState<LabourLine[]>(product.labour);
  const [otherCosts, setOtherCosts] = useState<OtherLine[]>(product.otherCosts);
  const [benchmark, setBenchmark] = useState<BenchmarkPrice[]>(product.benchmark ?? []);
  const cur = useCurrency();
  const [editMat, setEditMat] = useState<EditState<MatDraft> | null>(null);
  const [editLab, setEditLab] = useState<EditState<LabDraft> | null>(null);
  const [editOther, setEditOther] = useState<EditState<OtherDraft> | null>(null);

  const otherTotal = otherCosts.reduce((s, o) => s + o.cost, 0);
  const materialsTotal = materials.reduce((s, m) => s + materialLineCost(m), 0);
  const labourTotal = labour.reduce((s, l) => s + labourLineCost(l), 0);
  const directCost = materialsTotal + labourTotal + otherTotal;

  // The make-cost split and the single biggest line — for the Price Check.
  const costParts = [
    { label: "Materials", amount: materialsTotal },
    { label: "Labour", amount: labourTotal },
    { label: "Other", amount: otherTotal },
  ];
  const allLines = [
    ...materials.map((m) => ({ label: m.name, amount: materialLineCost(m) })),
    ...labour.map((l) => ({ label: l.step, amount: labourLineCost(l) })),
    ...otherCosts.map((o) => ({ label: o.label, amount: o.cost })),
  ].filter((line) => line.amount > 0 && line.label.trim() !== "");
  const topLine = allLines.length > 0 ? allLines.reduce((a, b) => (b.amount > a.amount ? b : a)) : null;

  // The business-cost share is computed from the fixed-cost layer. Under
  // bench-time allocation it depends on labour hours, so it reacts live.
  const labourHours = labour.reduce((s, l) => s + l.minutes, 0) / 60;
  const businessCostShare = fixedCostPerUnit(fixedCosts, fixedCostConfig, labourHours);

  const options = {
    targetMarginPct: settings.targetMarginPct,
    vatRatePct: effectiveVatRate(settings),
    businessCostShare,
  };

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

  // ── material draft parse + validation (Save just gates; no error states) ──
  const md = editMat?.draft;
  const mQty = md ? num(md.quantity) : NaN;
  const mCost = md ? num(md.unitCost) : NaN;
  const mLine = Number.isFinite(mQty) && Number.isFinite(mCost) ? mQty * mCost : null;
  const mValid = !!md && md.name.trim() !== "" && mQty > 0 && mCost > 0;

  // ── labour draft parse + validation ──
  const ld = editLab?.draft;
  const lMin = ld ? num(ld.minutes) : NaN;
  const lRate = ld ? num(ld.rate) : NaN;
  const lLine = Number.isFinite(lMin) && Number.isFinite(lRate) ? (lMin / 60) * lRate : null;
  const lValid = !!ld && ld.step.trim() !== "" && lMin > 0 && lRate > 0;

  // ── other-cost draft parse + validation (a flat amount) ──
  const od = editOther?.draft;
  const oAmount = od ? num(od.amount) : NaN;
  const oLine = Number.isFinite(oAmount) ? oAmount : null;
  const oValid = !!od && od.label.trim() !== "" && oAmount > 0;

  // Only one row across all three sections is edited at a time.
  const openMat = (index: number | "new", draft: MatDraft) => {
    setEditLab(null);
    setEditOther(null);
    setEditMat({ index, draft, confirmingDelete: false });
  };
  const openLab = (index: number | "new", draft: LabDraft) => {
    setEditMat(null);
    setEditOther(null);
    setEditLab({ index, draft, confirmingDelete: false });
  };
  const openOther = (index: number | "new", draft: OtherDraft) => {
    setEditMat(null);
    setEditLab(null);
    setEditOther({ index, draft, confirmingDelete: false });
  };

  function saveMat() {
    if (!editMat || !mValid || !md) return;
    const next: MaterialLine = {
      name: md.name.trim(),
      quantity: mQty,
      unit: md.unit.trim(),
      unitCost: mCost,
      fromLibrary: md.fromLibrary || undefined,
    };
    setMaterials((prev) =>
      editMat.index === "new"
        ? [...prev, next]
        : prev.map((m, i) => (i === editMat.index ? { ...m, ...next } : m)),
    );
    setEditMat(null);
  }
  function saveLab() {
    if (!editLab || !lValid || !ld) return;
    const next: LabourLine = { step: ld.step.trim(), minutes: lMin, rate: lRate };
    setLabour((prev) =>
      editLab.index === "new"
        ? [...prev, next]
        : prev.map((l, i) => (i === editLab.index ? { ...l, ...next } : l)),
    );
    setEditLab(null);
  }
  function deleteMat() {
    if (editMat && editMat.index !== "new") {
      setMaterials((prev) => prev.filter((_, i) => i !== editMat.index));
    }
    setEditMat(null);
  }
  function saveOther() {
    if (!editOther || !oValid || !od) return;
    const next: OtherLine = { label: od.label.trim(), cost: oAmount };
    setOtherCosts((prev) =>
      editOther.index === "new"
        ? [...prev, next]
        : prev.map((o, i) => (i === editOther.index ? { ...o, ...next } : o)),
    );
    setEditOther(null);
  }
  function deleteLab() {
    if (editLab && editLab.index !== "new") {
      setLabour((prev) => prev.filter((_, i) => i !== editLab.index));
    }
    setEditLab(null);
  }
  function deleteOther() {
    if (editOther && editOther.index !== "new") {
      setOtherCosts((prev) => prev.filter((_, i) => i !== editOther.index));
    }
    setEditOther(null);
  }

  const matFooter = (isNew: boolean) => (
    <FormFooter
      lineCost={mLine}
      valid={mValid}
      isNew={isNew}
      confirmingDelete={!!editMat?.confirmingDelete}
      deleteCopy="Remove this material? The library item stays — only this line goes."
      onSave={saveMat}
      onCancel={() => setEditMat(null)}
      onAskDelete={() => setEditMat((e) => (e ? { ...e, confirmingDelete: true } : e))}
      onConfirmDelete={deleteMat}
      onCancelDelete={() => setEditMat((e) => (e ? { ...e, confirmingDelete: false } : e))}
    />
  );
  const labFooter = (isNew: boolean) => (
    <FormFooter
      lineCost={lLine}
      valid={lValid}
      isNew={isNew}
      confirmingDelete={!!editLab?.confirmingDelete}
      deleteCopy="Remove this step? It's only taken off this product."
      onSave={saveLab}
      onCancel={() => setEditLab(null)}
      onAskDelete={() => setEditLab((e) => (e ? { ...e, confirmingDelete: true } : e))}
      onConfirmDelete={deleteLab}
      onCancelDelete={() => setEditLab((e) => (e ? { ...e, confirmingDelete: false } : e))}
    />
  );

  const otherFooter = (isNew: boolean) => (
    <FormFooter
      lineCost={oLine}
      valid={oValid}
      isNew={isNew}
      confirmingDelete={!!editOther?.confirmingDelete}
      deleteCopy="Remove this cost? It's only taken off this product."
      onSave={saveOther}
      onCancel={() => setEditOther(null)}
      onAskDelete={() => setEditOther((e) => (e ? { ...e, confirmingDelete: true } : e))}
      onConfirmDelete={deleteOther}
      onCancelDelete={() => setEditOther((e) => (e ? { ...e, confirmingDelete: false } : e))}
    />
  );

  const patchMat = (p: Partial<MatDraft>) =>
    setEditMat((e) => (e ? { ...e, draft: { ...e.draft, ...p } } : e));
  const patchLab = (p: Partial<LabDraft>) =>
    setEditLab((e) => (e ? { ...e, draft: { ...e.draft, ...p } } : e));
  const patchOther = (p: Partial<OtherDraft>) =>
    setEditOther((e) => (e ? { ...e, draft: { ...e.draft, ...p } } : e));

  const addingMat = editMat?.index === "new";
  const addingLab = editLab?.index === "new";
  const addingOther = editOther?.index === "new";

  // ── saving (persists through a Server Action, then returns to the overview) ─
  const [isSaving, startSaving] = useTransition();
  const parsedFinal = num(priceText);
  const finalPrice = priceText.trim() !== "" && Number.isFinite(parsedFinal) ? parsedFinal : null;

  // The market read against the entered competitor prices — for the benchmark
  // section's summary and for the Price Check.
  const market = marketRead(finalPrice, benchmark);

  const save = (workflow: "draft" | "active") =>
    startSaving(async () => {
      await saveProductAction({
        ...product,
        workflow,
        finalPrice,
        materials,
        labour,
        otherCosts,
        benchmark,
      });
    });

  // ── the ⋯ menu (duplicate / archive / delete) ──
  const [sheetOpen, setSheetOpen] = useState(false);
  const run = (action: () => Promise<void>) => startSaving(() => action());

  const menuActions: SheetAction[] = [
    {
      id: "duplicate",
      label: "Duplicate",
      sublabel: "Full copy, saved as a new draft",
      icon: <Copy size={18} />,
      onSelect: () => run(() => duplicateProductAction(product.id)),
    },
    product.archived
      ? {
          id: "restore",
          label: "Restore",
          sublabel: "Bring it back to your range",
          icon: <RotateCcw size={18} />,
          onSelect: () => run(() => restoreProductAction(product.id)),
        }
      : {
          id: "archive",
          label: "Archive",
          sublabel: "Stop making it — keeps the record",
          icon: <Archive size={18} />,
          onSelect: () => run(() => archiveProductAction(product.id)),
        },
    {
      id: "delete",
      label: "Delete",
      sublabel: "Remove permanently",
      icon: <Trash2 size={18} />,
      danger: true,
      onSelect: () => run(() => deleteProductAction(product.id)),
      confirm: {
        title: "Delete this product?",
        body: (
          <>
            <strong className="font-medium text-ink">{product.name}</strong> and all its costs
            will be removed permanently. This can&rsquo;t be undone.
            <br />
            <br />
            If you&rsquo;ve just stopped making it,{" "}
            <strong className="font-medium text-ink">archive</strong> keeps the record instead.
          </>
        ),
        confirmLabel: "Delete",
      },
    },
  ];

  return (
    <main className="mx-auto w-full max-w-[430px]">
      {/* ── header: back · workflow stamp · more ── */}
      <div className="flex items-center justify-between px-6 pt-5">
        <Link
          href="/products"
          aria-label="Back"
          className="-ml-3 flex size-tap items-center justify-center text-ink/62"
        >
          <ChevronLeft size={22} strokeWidth={2} />
        </Link>
        {product.archived ? (
          <span className="rounded-stamp border border-ink/30 px-3 pb-1 pt-1 text-caps uppercase text-ink/62">
            Archived
          </span>
        ) : product.workflow === "draft" ? (
          <span className="rounded-stamp border border-ink/30 px-3 pb-1 pt-1 text-caps uppercase text-ink/62">
            Draft
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          aria-label="More actions"
          onClick={() => setSheetOpen(true)}
          className="text-ink/62"
        >
          <Ellipsis size={18} />
        </button>
      </div>

      <ActionSheet open={sheetOpen} onClose={() => setSheetOpen(false)} actions={menuActions} />

      {/* ── identity ── */}
      <div className="px-6 pb-2 pt-5">
        <p className="mb-2 text-caps uppercase text-clay-deep">
          {product.type}
        </p>
        <h1 className="max-w-[300px] font-serif text-title">
          {product.name}
        </h1>
      </div>

      {/* ── ledger ── */}
      <div className="px-6">
        {/* materials — editable */}
        <section className="pb-2 pt-section">
          <SectionLabel
            total={materials.length > 0 ? <Price value={materialsTotal} variant="sectionTotal" /> : undefined}
          >
            Materials
          </SectionLabel>
          {materials.map((m, i) =>
            editMat && editMat.index === i ? (
              <MaterialFields
                key={`m-edit-${i}`}
                draft={editMat.draft}
                onPatch={patchMat}
                footer={matFooter(false)}
                library={library}
              />
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => openMat(i, draftFromMat(m))}
                className="block w-full text-left"
              >
                <ListRow
                  label={m.name}
                  library={m.fromLibrary}
                  meta={materialDetail(m, cur)}
                  value={<Price value={materialLineCost(m)} variant="inline" />}
                />
              </button>
            ),
          )}
          {addingMat && (
            <MaterialFields
              draft={editMat!.draft}
              onPatch={patchMat}
              footer={matFooter(true)}
              library={library}
            />
          )}
          {!addingMat && (
            <Button
              variant="link"
              iconLeading={addIcon}
              onClick={() => openMat("new", BLANK_MAT)}
              className="pt-3 text-label-strong"
            >
              Add material
            </Button>
          )}
        </section>

        {/* labour — editable */}
        <section className="border-t border-ink/7 pb-2 pt-section">
          <SectionLabel
            total={labour.length > 0 ? <Price value={labourTotal} variant="sectionTotal" /> : undefined}
          >
            Labour
          </SectionLabel>
          {labour.map((l, i) =>
            editLab && editLab.index === i ? (
              <LabourFields
                key={`l-edit-${i}`}
                draft={editLab.draft}
                onPatch={patchLab}
                footer={labFooter(false)}
                ratePlaceholder={String(settings.benchRate)}
              />
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => openLab(i, draftFromLab(l))}
                className="block w-full text-left"
              >
                <ListRow
                  label={l.step}
                  meta={labourDetail(l, cur)}
                  value={<Price value={labourLineCost(l)} variant="inline" />}
                />
              </button>
            ),
          )}
          {addingLab && (
            <LabourFields
              draft={editLab!.draft}
              onPatch={patchLab}
              footer={labFooter(true)}
              ratePlaceholder={String(settings.benchRate)}
            />
          )}
          {!addingLab && (
            <Button
              variant="link"
              iconLeading={addIcon}
              onClick={() => openLab("new", blankLab(settings.benchRate))}
              className="pt-3 text-label-strong"
            >
              Add step
            </Button>
          )}
        </section>

        {/* other costs — read-only for now */}
        {/* other costs — editable */}
        <section className="border-t border-ink/7 pb-2 pt-section">
          <SectionLabel
            total={otherCosts.length > 0 ? <Price value={otherTotal} variant="sectionTotal" /> : undefined}
          >
            Other costs
          </SectionLabel>
          {otherCosts.map((o, i) =>
            editOther && editOther.index === i ? (
              <OtherFields
                key={`o-edit-${i}`}
                draft={editOther.draft}
                onPatch={patchOther}
                footer={otherFooter(false)}
              />
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => openOther(i, draftFromOther(o))}
                className="block w-full text-left"
              >
                <ListRow label={o.label} value={<Price value={o.cost} variant="inline" />} />
              </button>
            ),
          )}
          {addingOther && (
            <OtherFields draft={editOther!.draft} onPatch={patchOther} footer={otherFooter(true)} />
          )}
          {!addingOther && (
            <Button
              variant="link"
              iconLeading={addIcon}
              onClick={() => openOther("new", BLANK_OTHER)}
              className="pt-3 text-label-strong"
            >
              Add cost{" "}
              <span className="text-body-sm italic text-ink/62">
                box, casting, outsourced finishing…
              </span>
            </Button>
          )}
        </section>

        {/* reconciling summary — live */}
        <div className="mt-section border-t border-ink/14 pb-1 pt-5">
          {materials.length > 0 && (
            <div className="flex items-baseline justify-between py-1 text-label text-ink/62">
              <span>Materials</span>
              <Price value={materialsTotal} variant="summary" />
            </div>
          )}
          {labour.length > 0 && (
            <div className="flex items-baseline justify-between py-1 text-label text-ink/62">
              <span>Labour</span>
              <Price value={labourTotal} variant="summary" />
            </div>
          )}
          {otherCosts.length > 0 && (
            <div className="flex items-baseline justify-between py-1 text-label text-ink/62">
              <span>Other costs</span>
              <Price value={otherTotal} variant="summary" />
            </div>
          )}
          <div className="mt-3 flex items-baseline justify-between border-t border-ink/7 pt-3">
            <span className="text-caps uppercase text-ink/62">
              Direct cost
            </span>
            <Price value={directCost} variant="figure" />
          </div>
          {businessCostShare !== null && (
            <div className="mt-3 border-t border-dashed border-ink/14 pt-3">
              <div className="flex items-baseline justify-between py-1 text-label-sm text-ink/62">
                <span className="font-light italic">Share of business costs</span>
                <Price value={businessCostShare} variant="summary" />
              </div>
              <div className="flex items-baseline justify-between py-1 text-label-sm">
                <span className="font-medium text-ink/70">Full cost</span>
                <Price value={directCost + businessCostShare} variant="inline" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── the ONE framed surface: the interactive pricing block ── */}
      <PricingPanel
        workflow={product.workflow}
        directCost={directCost}
        targetMarginPct={settings.targetMarginPct}
        vatRatePct={effectiveVatRate(settings)}
        businessCostShare={businessCostShare}
        costParts={costParts}
        topLine={topLine}
        market={market}
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

      {/* ── market benchmark: light, collapsed by default (§11) ── */}
      <BenchmarkSection benchmark={benchmark} onChange={setBenchmark} market={market} />

      {/* ── save bar ── */}
      <div className="mt-section border-t border-ink/7 bg-page px-6 pb-5 pt-4 shadow-[0_-6px_18px_-12px_rgba(30,25,22,0.12)]">
        <p className="mb-3 flex items-center gap-2 text-caps-tight uppercase text-ink/62 before:h-[5px] before:w-[5px] before:rounded-full before:bg-clay before:content-['']">
          Unsaved changes
        </p>
        <div className="mb-2">
          <Button variant="primary" onClick={() => save("active")} disabled={isSaving}>
            {isSaving ? "Saving…" : "Save and activate"}
          </Button>
        </div>
        <Button variant="ghost" onClick={() => save("draft")} disabled={isSaving}>
          Save draft
        </Button>
      </div>
    </main>
  );
}
