/**
 * SettingsForm — the account settings screen (PRD §11). One place to set the
 * things every product's numbers depend on. The helper copy states each ripple
 * rule, so a change is never a surprise.
 *
 * Flat: sections are hairline-separated, no framed surfaces. Thresholds are
 * read-only in MVP.
 */
"use client";

import { useState, useTransition } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { CurrencySelect } from "@/components/CurrencySelect";
import { SectionLabel } from "@/components/SectionLabel";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { num } from "@/components/inline-form";
import { saveSettingsAction } from "@/app/settings/actions";
import { currencyCur, DEFAULT_CURRENCY } from "@/lib/currency";
import type { Settings } from "@/lib/settings";

function Row({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="font-sans text-label text-ink">{label}</p>
        {help && <p className="mt-1 font-sans text-body-sm text-ink/62">{help}</p>}
      </div>
      <div className="flex shrink-0 items-center">{children}</div>
    </div>
  );
}

// a compact right-aligned number field with a suffix (%, / hr, …)
function NumberField({
  value,
  onChange,
  suffix,
  prefix,
  width = "w-[64px]",
}: {
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  prefix?: string;
  width?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      {prefix && <span className="font-serif text-value text-ink/62">{prefix}</span>}
      <Input
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${width} text-right font-serif tabular-nums`}
      />
      {suffix && <span className="font-sans text-meta text-ink/62">{suffix}</span>}
    </span>
  );
}

export function SettingsForm({ initial }: { initial: Settings }) {
  const [benchRate, setBenchRate] = useState(String(initial.benchRate));
  const [targetMargin, setTargetMargin] = useState(String(initial.targetMarginPct));
  const [currency, setCurrency] = useState(initial.currency);
  const [vatEnabled, setVatEnabled] = useState(initial.vatEnabled);
  const [vatRate, setVatRate] = useState(String(initial.vatRatePct));

  const [isSaving, startSaving] = useTransition();
  const cur = currencyCur(currency);

  const save = () =>
    startSaving(async () => {
      await saveSettingsAction({
        benchRate: num(benchRate) || 0,
        targetMarginPct: num(targetMargin) || 0,
        currency: currency.trim() || DEFAULT_CURRENCY,
        vatEnabled,
        vatRatePct: num(vatRate) || 0,
      });
    });

  return (
    <main className="mx-auto w-full max-w-[430px]">
      {/* header */}
      <div className="flex items-center px-6 pt-5">
        <Link
          href="/dashboard"
          aria-label="Back"
          className="-ml-3 flex size-tap items-center justify-center text-ink/62"
        >
          <ChevronLeft size={22} strokeWidth={2} />
        </Link>
      </div>
      <div className="px-6 pb-2 pt-5">
        <h1 className="font-serif text-title">Settings</h1>
      </div>

      <div className="px-6">
        {/* pricing */}
        <section className="border-t border-ink/7 pt-6">
          <SectionLabel>Pricing</SectionLabel>
          <div className="divide-y divide-ink/7">
            <Row label="Bench rate" help="The default rate for a new labour step. Existing steps keep their own rate.">
              <NumberField
                value={benchRate}
                onChange={setBenchRate}
                prefix={cur.suffix ? undefined : cur.symbol}
                suffix={cur.suffix ? `${cur.symbol} / hr` : "/ hr"}
              />
            </Row>
            <Row
              label="Target margin"
              help="What the calculated price aims for. Changing it re-suggests prices and moves auto-synced ones — never a price you set by hand."
            >
              <NumberField value={targetMargin} onChange={setTargetMargin} suffix="%" />
            </Row>
          </div>
        </section>

        {/* money */}
        <section className="mt-6 border-t border-ink/7 pt-6">
          <SectionLabel>Money</SectionLabel>
          <div className="divide-y divide-ink/7">
            <Row label="Currency" help="The symbol shown on every figure. No conversion — it only changes the symbol.">
              <CurrencySelect value={currency} onChange={setCurrency} />
            </Row>
            <Row label="I'm VAT registered" help="Your price is the gross tag price; margins run on the net.">
              <Switch checked={vatEnabled} onCheckedChange={setVatEnabled} aria-label="I'm VAT registered" />
            </Row>
            {vatEnabled && (
              <Row label="VAT rate" help="Changing VAT recalculates every margin and status. Prices never move.">
                <NumberField value={vatRate} onChange={setVatRate} suffix="%" />
              </Row>
            )}
          </div>
        </section>

        {/* thresholds — read-only in MVP */}
        <section className="mt-6 border-t border-ink/7 pt-6">
          <SectionLabel>Health thresholds</SectionLabel>
          <div className="divide-y divide-ink/7">
            <Row label="Healthy">
              <span className="font-serif text-value tabular-nums text-ink/62">margin ≥ 30%</span>
            </Row>
            <Row label="Caution">
              <span className="font-serif text-value tabular-nums text-ink/62">15% – 30%</span>
            </Row>
            <Row label="Risky">
              <span className="font-serif text-value tabular-nums text-ink/62">below 15%</span>
            </Row>
          </div>
          <p className="mt-3 font-sans text-body-sm italic text-ink/62">
            Fixed for now — adjustable in a later version.
          </p>
        </section>
      </div>

      {/* save bar */}
      <div className="mt-8 border-t border-ink/7 bg-page px-6 pb-5 pt-4 shadow-[0_-6px_18px_-12px_rgba(30,25,22,0.12)]">
        <Button variant="primary" onClick={save} disabled={isSaving}>
          {isSaving ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </main>
  );
}
