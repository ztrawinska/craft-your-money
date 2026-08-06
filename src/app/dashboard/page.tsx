/**
 * Dashboard — matches docs/design/dash-vnext-actions.html (State 1).
 *
 * Opens like a message (PRD §11): date + greeting, a warm briefing, then the
 * one hero figure (average profit per piece, monochrome). Every number and
 * every attention row is DERIVED from the shared product list, so the dashboard
 * can't disagree with the overview or a product's own detail.
 *
 * Two behaviours are real logic: the attention section only renders when there
 * is something to do, and "Below target" falls back to a quiet italic "all on
 * target" instead of a proud 0.
 */
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { AskIrisTeaser } from "@/components/AskIrisTeaser";
import { BottomNav } from "@/components/BottomNav";
import { HeroProfit } from "@/components/HeroProfit";
import { NeedsAttention, type AttentionItem } from "@/components/NeedsAttention";
import { currencyCur, formatMoney } from "@/lib/currency";
import { fixedCostPerUnit } from "@/lib/fixed-costs";
import { pricingFor, productLabourHours, statusInputFor, type Product } from "@/lib/products";
import { getFixedCostConfig, getFixedCosts, getSettings, listProducts } from "@/lib/store";
import { statusChip } from "@/lib/status";

const HEALTHY_MIN = 0.3; // "below your 30% target"
const RISKY_MAX = 0.15;

const greeting = { date: "Tuesday, 21 July", text: "Good afternoon, Zuza", initial: "Z" };

// The dashboard is derived entirely from the mutable store, so it must render
// fresh on every request rather than being prerendered from build-time data.
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  // Everything below is derived from the stored product list, at request time.
  // Archived products are kept but never counted (product-actions spec).
  const products = (await listProducts()).filter((p) => !p.archived);
  const settings = await getSettings();
  const cur = currencyCur(settings.currency);
  const fixedCosts = await getFixedCosts();
  const config = await getFixedCostConfig();
  const shareOf = (p: Product) => fixedCostPerUnit(fixedCosts, config, productLabourHours(p));

  const active = products.filter((p) => p.workflow === "active");
  const activePriced = active.filter((p) => p.finalPrice !== null);

  const pricedDone = activePriced.length;
  const activeTotal = active.length;
  const avgProfit =
    pricedDone > 0
      ? activePriced.reduce((s, p) => s + (pricingFor(p, settings, shareOf(p)).profit ?? 0), 0) / pricedDone
      : 0;
  const belowTarget = activePriced.filter((p) => {
    const m = pricingFor(p, settings, shareOf(p)).marginPct;
    return m !== null && m < HEALTHY_MIN;
  }).length;

  // What the average is made of — each priced product's profit, worst first —
  // so the hero can unfold "how this is figured" without any new data.
  const contributions = activePriced
    .map((p) => ({ name: p.name, profit: pricingFor(p, settings, shareOf(p)).profit ?? 0 }))
    .sort((a, b) => a.profit - b.profit);

  const weakest = [...activePriced].sort(
    (a, b) => (pricingFor(a, settings, shareOf(a)).marginPct ?? 0) - (pricingFor(b, settings, shareOf(b)).marginPct ?? 0),
  )[0];

  // Attention: active risky (worst margin first), then active no-price. Drafts
  // never appear. Built as plain data with the chip precomputed, so the
  // client-side NeedsAttention (which owns the sheet) needs no store access.
  // No cap here — the home peeks the worst and the sheet holds the rest.
  const risky = active
    .filter((p) => {
      const m = pricingFor(p, settings, shareOf(p)).marginPct;
      return m !== null && m < RISKY_MAX;
    })
    .sort(
      (a, b) =>
        (pricingFor(a, settings, shareOf(a)).marginPct ?? 0) -
        (pricingFor(b, settings, shareOf(b)).marginPct ?? 0),
    );
  const noPrice = active.filter((p) => p.finalPrice === null);
  const attentionItems: AttentionItem[] = [
    ...risky.map((p) => {
      const profit = pricingFor(p, settings, shareOf(p)).profit ?? 0;
      const chip = statusChip(statusInputFor(p, settings, shareOf(p)));
      return {
        id: p.id,
        name: p.name,
        stripe: "risky" as const,
        note:
          profit < 0
            ? `losing ${formatMoney(Math.abs(profit), cur)} / sale`
            : `only ${formatMoney(profit, cur)} / sale`,
        action: "Reprice",
        chipTone: chip.tone,
        chipLabel: chip.label,
      };
    }),
    ...noPrice.map((p) => {
      const chip = statusChip(statusInputFor(p, settings, shareOf(p)));
      return {
        id: p.id,
        name: p.name,
        stripe: "neutral" as const,
        note: "active, no price yet",
        action: "Set price",
        chipTone: chip.tone,
        chipLabel: chip.label,
      };
    }),
  ];

  const resume = products.find((p) => p.workflow === "draft" && p.finalPrice === null);

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-[430px] flex-1">
        {/* header: date + greeting, avatar (Settings lives behind it) */}
        <div className="flex items-start justify-between px-6 pb-1.5 pt-[26px]">
          <div>
            <p className="mb-[5px] font-sans text-[11px] tracking-[0.02em] text-ink/42">
              {greeting.date}
            </p>
            <h1 className="font-serif text-[27px] font-medium leading-[1.1] tracking-[-0.01em]">
              {greeting.text}
            </h1>
          </div>
          <Link
            href="/settings"
            aria-label="Settings"
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-clay-deep font-serif text-[15px] text-[#FDFBF9]"
          >
            {greeting.initial}
          </Link>
        </div>

        {/* briefing — assembled from real numbers, in plain language. Serif so
            it reads like a message (PRD §11), but kept short and quiet: one line
            of calm context, the single product that actually needs a decision
            (named + linked), and a nudge. No reassurance filler. */}
        <div className="px-6 pb-5 pt-3">
          <p className="font-serif text-[15px] leading-[1.55] text-ink/72">
            Most of your range earns well — but{" "}
            {weakest ? (
              // The one product that matters is the tap target here — the
              // attention CTA below is just a count, so this is where the worst
              // item is named and reached (YNAB pattern).
              <Link
                href={`/products/${weakest.id}`}
                className="font-medium text-ink underline decoration-clay/40 decoration-1 underline-offset-[3px]"
              >
                {weakest.name}
              </Link>
            ) : (
              <strong className="font-medium text-ink">this piece</strong>
            )}{" "}
            is quietly losing money on every sale. Worth two minutes today.
          </p>
        </div>

        {/* hero — average profit per piece: count-up + "how this is figured" */}
        <HeroProfit value={avgProfit} count={pricedDone} contributions={contributions} />

        {/* supporting metrics — centred to match the redesign */}
        <div className="mx-6 mt-5 grid grid-cols-2 border-t border-ink/7 pt-4">
          <div className="text-center">
            <p className="mb-1.5 font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/42">
              Priced
            </p>
            <p className="font-serif text-[20px] font-medium tabular-nums">
              {pricedDone}
              <span className="font-sans text-[10.5px] font-light text-ink/42">
                {" "}
                / {activeTotal}
              </span>
            </p>
          </div>
          <div className="border-l border-ink/7 text-center">
            <p className="mb-1.5 font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/42">
              Below target
            </p>
            {belowTarget > 0 ? (
              <Link
                href="/products"
                className="inline-flex items-center justify-center font-serif text-[20px] font-medium tabular-nums text-ink"
              >
                {belowTarget}
                <ChevronRight size={14} strokeWidth={2} className="ml-0.5 text-clay-deep" />
              </Link>
            ) : (
              // A metric cell must hold its grid position, so it switches to a
              // quiet italic state rather than showing a proud "0".
              <p className="font-serif text-[14px] italic text-ink/55">all on target</p>
            )}
          </div>
        </div>

        {/* needs attention — peek the worst; the rest live in a sheet */}
        <NeedsAttention items={attentionItems} />

        {/* resume draft */}
        {resume && (
          <Link
            href={`/products/${resume.id}`}
            className="mx-6 mt-3 flex items-center justify-between rounded-[8px] border border-dashed border-ink/14 px-[18px] py-4"
          >
            <div>
              <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.13em] text-ink/42">
                Continue where you left off
              </p>
              <p className="mt-1 font-serif text-[16px] font-medium leading-[1.2]">{resume.name}</p>
              <p className="mt-[3px] font-sans text-[12px] text-ink/55">
                Draft · edited 2 days ago
              </p>
            </div>
            <ChevronRight size={16} className="text-clay-deep" />
          </Link>
        )}

        {/* assistant entry point — opens the iris sheet (a teaser until the
            open-ended Q&A genuinely generates) */}
        <AskIrisTeaser className="px-6 mb-6 mt-3" />
      </main>

      <BottomNav active="home" />
    </div>
  );
}
