/**
 * CostsEditor — the business-costs screen (/costs, PRD §6, §11).
 *
 * Costs → total → how to spread them (two RadioCards) → the per-piece result on
 * a real product. Zero volume blocks the result with a quiet notice (ink, not
 * an alarm — our warning treatment). Never says "overhead".
 *
 * Fixed-cost rows persist on Save (their own action); the allocation config
 * persists on change. Local state gives instant feedback and a live result.
 */
"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useCurrency } from "@/components/CurrencyContext";
import { formatMoney } from "@/lib/currency";
import { Button } from "@/components/Button";
import { ListRow } from "@/components/ListRow";
import { Price } from "@/components/Price";
import { RadioCards } from "@/components/RadioCards";
import { SectionLabel } from "@/components/SectionLabel";
import { TintedBand } from "@/components/TintedBand";
import { Input } from "@/components/ui/input";
import {
  EditShell,
  FieldLabel,
  FormFooter,
  MoneyInput,  num,
} from "@/components/inline-form";
import {
  deleteFixedCostAction,
  saveFixedCostAction,
  saveFixedCostConfigAction,
} from "@/app/costs/actions";
import {
  fixedCostPerUnit,
  monthlyEquivalent,
  totalMonthlyFixed,
  type AllocationMethod,
  type FixedCost,
  type FixedCostConfig,
  type FixedCostPeriod,
} from "@/lib/fixed-costs";

const addIcon = <Plus size={14} strokeWidth={2} />;

type Draft = { label: string; amount: string; period: FixedCostPeriod; monthsActive: string };
const BLANK: Draft = { label: "", amount: "", period: "monthly", monthsActive: "12" };
const draftFrom = (c: FixedCost): Draft => ({
  label: c.label,
  amount: c.amount.toFixed(2),
  period: c.period,
  monthsActive: String(c.monthsActive),
});

const METHODS = [
  {
    value: "per-unit",
    title: "Spread evenly",
    description: "Every piece carries the same share, based on how many you make a month.",
  },
  {
    value: "bench-time",
    title: "By bench time",
    description: "Pieces that take longer carry more, based on your monthly bench hours.",
  },
];

function CostFields({
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
        <FieldLabel>Cost</FieldLabel>
        <Input
          autoFocus
          value={draft.label}
          onChange={(e) => onPatch({ label: e.target.value })}
          placeholder="e.g. Studio rent"
          className="font-sans"
        />
      </label>
      <div className="mt-3 flex items-end gap-2">
        <label className="w-[120px]">
          <FieldLabel>Amount</FieldLabel>
          <MoneyInput value={draft.amount} onChange={(v) => onPatch({ amount: v })} />
        </label>
        <div className="flex gap-2 pb-0">
          {(["monthly", "seasonal"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPatch({ period: p })}
              className={`rounded-chip border px-3 py-2 font-sans text-[12px] capitalize ${
                draft.period === p
                  ? "border-clay-deep bg-clay-deep text-on-clay"
                  : "border-ink/14 text-ink/62"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      {draft.period === "seasonal" && (
        <label className="mt-3 block w-[140px]">
          <FieldLabel>Months a year</FieldLabel>
          <Input
            inputMode="numeric"
            value={draft.monthsActive}
            onChange={(e) => onPatch({ monthsActive: e.target.value })}
            placeholder="4"
            className="font-serif tabular-nums"
          />
        </label>
      )}
      {footer}
    </EditShell>
  );
}

export function CostsEditor({
  initialCosts,
  initialConfig,
  sample,
}: {
  initialCosts: FixedCost[];
  initialConfig: FixedCostConfig;
  sample: { name: string; labourHours: number } | null;
}) {
  const cur = useCurrency();
  const [costs, setCosts] = useState<FixedCost[]>(initialCosts);
  const [edit, setEdit] = useState<{
    index: number | "new";
    draft: Draft;
    confirmingDelete: boolean;
  } | null>(null);
  const [method, setMethod] = useState<AllocationMethod>(initialConfig.method);
  const [volume, setVolume] = useState(initialConfig.volume == null ? "" : String(initialConfig.volume));
  const [, startSaving] = useTransition();

  // ── cost row draft ──
  const d = edit?.draft;
  const dAmount = d ? num(d.amount) : NaN;
  const dMonths = d ? num(d.monthsActive) : NaN;
  const dLine =
    d && Number.isFinite(dAmount)
      ? monthlyEquivalent({
          id: "",
          label: "",
          amount: dAmount,
          period: d.period,
          monthsActive: Number.isFinite(dMonths) ? dMonths : 0,
        })
      : null;
  const valid =
    !!d &&
    d.label.trim() !== "" &&
    dAmount > 0 &&
    (d.period === "monthly" || (dMonths >= 1 && dMonths <= 12));

  function saveRow() {
    if (!edit || !valid || !d) return;
    const id = edit.index === "new" ? `fc-${crypto.randomUUID()}` : costs[edit.index].id;
    const next: FixedCost = {
      id,
      label: d.label.trim(),
      amount: dAmount,
      period: d.period,
      monthsActive: d.period === "seasonal" ? dMonths : 12,
    };
    setCosts((prev) =>
      edit.index === "new" ? [...prev, next] : prev.map((c, i) => (i === edit.index ? next : c)),
    );
    setEdit(null);
    startSaving(async () => {
      await saveFixedCostAction(next);
    });
  }

  function removeRow() {
    if (!edit || edit.index === "new") {
      setEdit(null);
      return;
    }
    const id = costs[edit.index].id;
    setCosts((prev) => prev.filter((_, i) => i !== edit.index));
    setEdit(null);
    startSaving(async () => {
      await deleteFixedCostAction(id);
    });
  }

  function saveConfig(nextMethod: AllocationMethod, nextVolume: string) {
    const v = nextVolume.trim() === "" ? null : num(nextVolume);
    startSaving(async () => {
      await saveFixedCostConfigAction({ method: nextMethod, volume: v });
    });
  }

  const patch = (p: Partial<Draft>) =>
    setEdit((e) => (e ? { ...e, draft: { ...e.draft, ...p } } : e));
  const footer = (isNew: boolean) => (
    <FormFooter
      lineCost={dLine}
      costLabel="Per month"
      valid={valid}
      isNew={isNew}
      confirmingDelete={!!edit?.confirmingDelete}
      deleteCopy="Remove this business cost?"
      onSave={saveRow}
      onCancel={() => setEdit(null)}
      onAskDelete={() => setEdit((e) => (e ? { ...e, confirmingDelete: true } : e))}
      onConfirmDelete={removeRow}
      onCancelDelete={() => setEdit((e) => (e ? { ...e, confirmingDelete: false } : e))}
    />
  );
  const addingNew = edit?.index === "new";

  // ── live result ──
  const total = totalMonthlyFixed(costs);
  const parsedVolume = volume.trim() === "" ? null : num(volume);
  const config: FixedCostConfig = { method, volume: parsedVolume };
  const share = fixedCostPerUnit(costs, config, sample?.labourHours ?? 0);
  const volumeLabel = method === "per-unit" ? "pieces / month" : "bench hours / month";

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-[430px] flex-1">
        <div className="px-6 pb-1 pt-section">
          <h1 className="font-serif text-[26px] font-medium tracking-[-0.01em]">Business costs</h1>
          <p className="mt-1 font-sans text-[12px] font-light text-ink/62">
            Rent, tools, insurance — the costs of being open, shared across what you make.
          </p>
        </div>

        {/* the costs */}
        <div className="mt-5 px-6">
          <SectionLabel total={<Price value={total} variant="sectionTotal" />}>
            Monthly costs
          </SectionLabel>
        </div>
        <div className="divide-y divide-ink/7">
          {costs.map((c, i) =>
            edit && edit.index === i ? (
              <div key={`edit-${c.id}`} className="px-6">
                <CostFields draft={edit.draft} onPatch={patch} footer={footer(false)} />
              </div>
            ) : (
              <button
                key={c.id}
                type="button"
                onClick={() => setEdit({ index: i, draft: draftFrom(c), confirmingDelete: false })}
                className="block w-full px-6 text-left"
              >
                <ListRow
                  label={c.label}
                  meta={
                    c.period === "seasonal"
                      ? `${formatMoney(c.amount, cur)} · ${c.monthsActive} months a year`
                      : `${formatMoney(c.amount, cur)} / month`
                  }
                  value={<Price value={monthlyEquivalent(c)} variant="inline" />}
                />
              </button>
            ),
          )}
        </div>
        <div className="px-6">
          {addingNew ? (
            <CostFields draft={edit!.draft} onPatch={patch} footer={footer(true)} />
          ) : (
            <Button
              variant="link"
              iconLeading={addIcon}
              onClick={() => setEdit({ index: "new", draft: BLANK, confirmingDelete: false })}
              className="pt-3 text-[13px] font-medium"
            >
              Add cost
            </Button>
          )}
        </div>

        {/* allocation */}
        <div className="mt-8 px-6">
          <SectionLabel>How to spread them</SectionLabel>
          <div className="mt-1">
            <RadioCards
              name="allocation"
              options={METHODS}
              value={method}
              onChange={(v) => {
                const m = v as AllocationMethod;
                setMethod(m);
                saveConfig(m, volume);
              }}
            />
          </div>
          <label className="mt-4 flex items-center justify-between gap-4">
            <span className="font-sans text-[15px] text-ink">
              {method === "per-unit" ? "Pieces you make" : "Your bench hours"}
            </span>
            <span className="inline-flex items-center gap-2">
              <Input
                inputMode="decimal"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                onBlur={() => saveConfig(method, volume)}
                placeholder="0"
                className="w-[72px] text-right font-serif tabular-nums"
              />
              <span className="font-sans text-[12px] text-ink/62">{volumeLabel}</span>
            </span>
          </label>
        </div>

        {/* result */}
        <div className="mt-6 px-6 pb-8">
          {total <= 0 ? (
            <TintedBand>
              <p className="font-sans text-[13px] font-light leading-[1.6] text-ink/70">
                Add your monthly costs above to spread them across your pieces.
              </p>
            </TintedBand>
          ) : share == null ? (
            <TintedBand>
              <p className="font-sans text-[13px] font-light leading-[1.6] text-ink/70">
                Set your monthly {method === "per-unit" ? "piece count" : "bench hours"} to see the
                per-piece share.
              </p>
            </TintedBand>
          ) : (
            <div className="rounded-band border border-clay/34 bg-card px-5 py-4">
              <p className="font-sans text-[12px] font-light text-ink/62">
                {method === "per-unit"
                  ? "Every piece carries"
                  : sample
                    ? `${sample.name} (${sample.labourHours.toFixed(1)}h) carries`
                    : "This piece carries"}
              </p>
              <p className="mt-1 font-serif text-[28px] font-medium tabular-nums text-ink">
                {formatMoney(share, cur)}
              </p>
              <p className="mt-1 font-sans text-[12px] font-light text-ink/62">
                of business costs, added on top of its direct cost.
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNav active="costs" />
    </div>
  );
}
