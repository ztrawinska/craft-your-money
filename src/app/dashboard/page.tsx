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
import { ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import { AssistantSlot } from "@/components/AssistantSlot";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { ListRow } from "@/components/ListRow";
import { Price } from "@/components/Price";
import { SectionLabel } from "@/components/SectionLabel";
import { fixedCostPerUnit } from "@/lib/fixed-costs";
import { pricingFor, productLabourHours, statusInputFor, type Product } from "@/lib/products";
import { getFixedCostConfig, getFixedCosts, getSettings, listProducts } from "@/lib/store";
import { statusChip } from "@/lib/status";

const HEALTHY_MIN = 0.3; // "below your 30% target"
const RISKY_MAX = 0.15;

const greeting = { date: "Tuesday, 21 July", text: "Good afternoon, Zuza", initial: "Z" };

export default function Dashboard() {
  // Everything below is derived from the stored product list, at request time.
  // Archived products are kept but never counted (product-actions spec).
  const products = listProducts().filter((p) => !p.archived);
  const settings = getSettings();
  const fixedCosts = getFixedCosts();
  const config = getFixedCostConfig();
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

  const weakest = [...activePriced].sort(
    (a, b) => (pricingFor(a, settings, shareOf(a)).marginPct ?? 0) - (pricingFor(b, settings, shareOf(b)).marginPct ?? 0),
  )[0];

  // Attention: active risky first, then active no-price. Drafts never appear.
  const risky = active.filter((p) => {
    const m = pricingFor(p, settings, shareOf(p)).marginPct;
    return m !== null && m < RISKY_MAX;
  });
  const noPrice = active.filter((p) => p.finalPrice === null);
  const attention = [
    ...risky.map((p) => {
      const profit = pricingFor(p, settings, shareOf(p)).profit ?? 0;
      return {
        p,
        stripe: "risky" as const,
        note:
          profit < 0
            ? `losing £${Math.abs(profit).toFixed(2)} / sale`
            : `only £${profit.toFixed(2)} / sale`,
        action: "Reprice",
      };
    }),
    ...noPrice.map((p) => ({
      p,
      stripe: "neutral" as const,
      note: "active without one",
      action: "Set price",
    })),
  ].slice(0, 3);

  const resume = products.find((p) => p.workflow === "draft" && p.finalPrice === null);

  return (
    <div className="flex min-h-screen flex-col">
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

        {/* briefing — assembled from real numbers, in plain language */}
        <div className="px-6 pb-[26px] pt-4">
          <p className="font-sans text-[15px] font-light leading-[1.7] text-ink/70">
            Your pricing is mostly healthy — most of your range earns well. But{" "}
            <strong className="font-medium text-ink">{weakest?.name}</strong> is
            quietly losing money on every sale. Worth two minutes today.
          </p>
        </div>

        {/* hero — average profit per piece, monochrome, always true */}
        <div className="px-6 pb-1">
          <p className="mb-[9px] font-sans text-[9.5px] font-semibold uppercase tracking-[0.14em] text-ink/42">
            Avg profit / piece
          </p>
          <Price value={avgProfit} variant="hero" />
          <p className="mt-[9px] font-sans text-[12px] font-light leading-[1.5] text-ink/55">
            across your {pricedDone} priced products, after all costs
          </p>
        </div>

        {/* supporting metrics */}
        <div className="mx-6 mt-5 grid grid-cols-2 gap-1 border-t border-ink/7 pt-4">
          <div>
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
          <div className="border-l border-ink/7 pl-4">
            <p className="mb-1.5 font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/42">
              Below target
            </p>
            {belowTarget > 0 ? (
              <Link
                href="/products"
                className="inline-flex items-center font-serif text-[20px] font-medium tabular-nums text-ink"
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

        {/* needs attention — only rendered when there is something to do */}
        {attention.length > 0 && (
          <>
            <div className="mt-8 px-6">
              <SectionLabel>Needs attention</SectionLabel>
            </div>
            <div className="divide-y divide-ink/7 border-t border-ink/7">
              {attention.map(({ p, stripe, note, action }) => {
                const chip = statusChip(statusInputFor(p, settings, shareOf(p)));
                return (
                  <ListRow
                    key={p.id}
                    emphasis="product"
                    stripe={stripe}
                    label={p.name}
                    meta={
                      <span className="inline-flex items-center gap-1.5">
                        <Chip size="sm" tone={chip.tone}>
                          {chip.label}
                        </Chip>
                        <span>{note}</span>
                      </span>
                    }
                    value={
                      <Button
                        variant="link"
                        href={`/products/${p.id}`}
                        className="text-[13.5px] font-semibold"
                        iconTrailing={<ChevronRight size={15} strokeWidth={2} />}
                      >
                        {action}
                      </Button>
                    }
                  />
                );
              })}
            </div>
          </>
        )}

        {/* resume draft */}
        {resume && (
          <Link
            href={`/products/${resume.id}`}
            className="mx-6 mt-8 flex items-center justify-between rounded-[8px] border border-dashed border-ink/14 px-[18px] py-4"
          >
            <div>
              <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.13em] text-ink/42">
                Continue where you left off
              </p>
              <p className="mt-1 font-serif text-[14px] font-medium">{resume.name}</p>
              <p className="mt-0.5 font-sans text-[10.5px] font-light italic text-ink/42">
                Draft · edited 2 days ago
              </p>
            </div>
            <ArrowRight size={16} className="text-clay-deep" />
          </Link>
        )}

        {/* assistant entry point — nothing generates until it genuinely does */}
        <AssistantSlot className="mx-6 mb-6 mt-8">Ask about your prices</AssistantSlot>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
