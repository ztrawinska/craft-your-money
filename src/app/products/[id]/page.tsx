/**
 * Product Detail — static build matching docs/design/craft-ym-detail-r3.html.
 *
 * This is a Server Component with hardcoded data: no state, no calculations,
 * no database. It exists to prove the components and the layout against the
 * mockup before any behaviour goes in. The [id] segment is ignored for now.
 *
 * Order follows the design system §3 / PRD §11: identity → costs → reconciling
 * summary → the ONE framed surface (pricing) → market benchmark → save bar.
 * No bottom nav on this screen.
 */
import { AssistantSlot } from "@/components/AssistantSlot";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { FramedSurface } from "@/components/FramedSurface";
import { ListRow } from "@/components/ListRow";
import { Price } from "@/components/Price";
import { SectionLabel } from "@/components/SectionLabel";
import {
  profitabilityFromMargin,
  profitTone,
  statusChip,
} from "@/lib/status";

// Sample product. The money below is still hardcoded (static screen), but the
// VERDICT is now derived: the chip label, the chip tone, and the profit colour
// all come from these few numbers, so they can never tell different stories.
const sample = { workflow: "draft" as const, hasPrice: true, marginPct: 0.52 };
const verdict = statusChip(sample);
const profit = profitTone(profitabilityFromMargin(sample.marginPct));

export default function ProductDetail() {
  return (
    <main className="mx-auto w-full max-w-[430px] pb-24">
      {/* ── header: back · workflow stamp · more ── */}
      <div className="flex items-center justify-between px-6 pt-5">
        <span className="-ml-1.5 text-[17px] text-ink/55">←</span>
        <span className="rounded-[2px] border border-ink/30 px-[11px] pb-[3px] pt-1 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-ink/55">
          Draft
        </span>
        <span className="text-[16px] tracking-[2px] text-ink/42">⋯</span>
      </div>

      {/* ── identity ── */}
      <div className="px-6 pb-2 pt-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-deep">
          Ring
        </p>
        <h1 className="max-w-[300px] font-serif text-[27px] font-medium leading-[1.16] tracking-[-0.01em]">
          Hammered silver stacking band
        </h1>
      </div>

      {/* ── ledger: flat, hairline-separated cost sections ── */}
      <div className="px-6">
        {/* materials */}
        <section className="pb-1.5 pt-[22px]">
          <SectionLabel total={<Price value={2.81} variant="sectionTotal" />}>
            Materials
          </SectionLabel>
          <ListRow
            label="Sterling silver sheet"
            library
            meta="4g × £0.62/g"
            value={<Price value={2.48} variant="inline" />}
          />
          <ListRow
            label="Solder wire"
            library
            meta="0.3g × £1.10/g"
            value={<Price value={0.33} variant="inline" />}
          />
          <Button variant="link" iconLeading="+" className="pt-3 text-[13px] font-medium">
            Add material
          </Button>
        </section>

        {/* labour */}
        <section className="border-t border-ink/7 pb-1.5 pt-[22px]">
          <SectionLabel total={<Price value={11.25} variant="sectionTotal" />}>
            Labour
          </SectionLabel>
          <ListRow
            label="Sawing & shaping"
            meta="20 min · £15/hr"
            value={<Price value={5.0} variant="inline" />}
          />
          <ListRow
            label="Soldering"
            meta="15 min · £15/hr"
            value={<Price value={3.75} variant="inline" />}
          />
          <ListRow
            label="Polishing"
            meta="10 min · £15/hr"
            value={<Price value={2.5} variant="inline" />}
          />
          <Button variant="link" iconLeading="+" className="pt-3 text-[13px] font-medium">
            Add step
          </Button>
        </section>

        {/* other costs */}
        <section className="border-t border-ink/7 pb-1.5 pt-[22px]">
          <SectionLabel>Other costs</SectionLabel>
          <Button variant="link" iconLeading="+" className="pt-3 text-[13px] font-medium">
            Add cost{" "}
            <span className="text-[11.5px] font-light italic text-ink/42">
              box, casting, outsourced finishing…
            </span>
          </Button>
        </section>

        {/* reconciling summary — typeset straight on the page, no card */}
        <div className="mt-[22px] border-t border-ink/14 pb-1 pt-5">
          <div className="flex items-baseline justify-between py-[3px] text-[13px] text-ink/55">
            <span>Materials</span>
            <Price value={2.81} variant="summary" />
          </div>
          <div className="flex items-baseline justify-between py-[3px] text-[13px] text-ink/55">
            <span>Labour</span>
            <Price value={11.25} variant="summary" />
          </div>
          <div className="mt-[10px] flex items-baseline justify-between border-t border-ink/7 pt-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">
              Direct cost
            </span>
            <Price value={14.06} variant="figure" />
          </div>
          {/* business-cost lines — dashed, secondary (only shown when configured) */}
          <div className="mt-[11px] border-t border-dashed border-ink/14 pt-[10px]">
            <div className="flex items-baseline justify-between py-[3px] text-[12px] text-ink/55">
              <span className="font-light italic">Share of business costs</span>
              <Price value={2.74} variant="summary" />
            </div>
            <div className="flex items-baseline justify-between py-[3px] text-[12px]">
              <span className="font-medium text-ink/70">Full cost</span>
              <Price value={16.8} variant="inline" />
            </div>
          </div>
        </div>
      </div>

      {/* ── the ONE framed surface: the pricing block ── */}
      <FramedSurface className="mx-6 mt-[26px] px-6 pb-5 pt-[22px]">
        {/* calculated price — the suggestion */}
        <div className="mb-[18px] flex items-center justify-between gap-2.5 border-b border-ink/7 pb-[18px]">
          <div>
            <p className="text-[12.5px] text-clay-deep">Calculated price</p>
            <p className="mt-0.5 text-[11px] font-light text-ink/42">
              £23.43 before VAT · 40% target
            </p>
          </div>
          <Price value={28.12} variant="calc" />
        </div>

        {/* your price — the decision */}
        <div className="mb-2 flex items-baseline justify-between text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ink/55">
          <span>Your price</span>
          <Button
            variant="link"
            className="text-[10.5px] font-normal normal-case tracking-normal underline decoration-clay-deep/40 underline-offset-2"
          >
            Reset to £28.12
          </Button>
        </div>
        <div className="mb-3">
          <Price value={42.0} variant="primary" />
        </div>

        {/* VAT: the one money figure the mockup keeps in Plex, not Lora —
            it's inline inside a sentence. Flagged to Zuza. */}
        <p className="mb-5 text-[13px] font-light text-ink/55">
          You keep{" "}
          <strong className="font-medium text-ink tabular-nums">£35.00</strong>{" "}
          after 20% VAT.
        </p>

        {/* profit — the last word of the block */}
        <div className="border-t border-ink/7 pt-[18px]">
          <p className="mb-2 text-[12px] text-ink/55">
            Profit per piece, after all costs
          </p>
          <div className="flex items-center justify-between gap-2.5">
            <Price value={18.2} variant="profit" tone={profit ?? undefined} />
            <Chip tone={verdict.tone}>{verdict.label}</Chip>
          </div>
        </div>

        {/* Assistant slot (design system §2.9) — the only place iris appears.
            Static placeholder for now; behaviour comes later. */}
        <AssistantSlot centered className="mt-5">
          Check this price
        </AssistantSlot>
      </FramedSurface>

      {/* ── market benchmark: collapsed by default ── */}
      <div className="px-6 pt-5">
        <div className="flex items-center justify-between border-b border-t border-ink/7 py-[15px]">
          <span className="text-[13.5px] font-medium text-ink/55">
            Market benchmark
          </span>
          <span className="text-[12px] text-ink/30">▾</span>
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
