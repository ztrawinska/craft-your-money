/**
 * Dashboard — static build matching docs/design/dash-vnext-actions.html (State 1).
 *
 * Opens like a message, not a screen title (PRD §11): date + greeting, then a
 * warm briefing, then the one hero figure (average profit per piece, fully
 * monochrome). "Needs attention" rows each END IN AN ACTION — a clay verb-link
 * — so the row answers "what do I do", not just "what's wrong".
 *
 * Two behaviours are real logic, not just this render:
 * - The attention section only exists when there is something to do. Empty = gone.
 * - "Below target" shows a quiet italic "all on target" instead of a proud 0.
 */
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { AssistantSlot } from "@/components/AssistantSlot";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { ListRow } from "@/components/ListRow";
import { Price } from "@/components/Price";
import { SectionLabel } from "@/components/SectionLabel";
import { statusChip, type ProductStatusInput } from "@/lib/status";

type AttentionItem = {
  id: string;
  name: string;
  status: ProductStatusInput;
  stripe: "risky" | "neutral";
  note: string; // the plain consequence, in the quiet voice
  action: string; // the verb-link
};

// Static sample — the "something to do" day.
const greeting = { date: "Tuesday, 21 July", text: "Good afternoon, Zuza", initial: "Z" };
const avgProfit = 18.4;
const priced = { done: 12, total: 14 };
const belowTarget = 3;

const attention: AttentionItem[] = [
  {
    id: "stacking-set",
    name: "Stacking set × 3",
    status: { workflow: "active", hasPrice: true, marginPct: 0.08 },
    stripe: "risky",
    note: "losing £2.06 / sale",
    action: "Reprice",
  },
  {
    id: "copper-cuff",
    name: "Forged copper cuff",
    status: { workflow: "active", hasPrice: false, marginPct: null },
    stripe: "neutral",
    note: "active without one",
    action: "Set price",
  },
];

const resume = { id: "new-ring", name: "New ring concept", meta: "Draft · edited 2 days ago" };

export default function Dashboard() {
  return (
    <>
      <main className="mx-auto w-full max-w-[430px] pb-[104px]">
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
          <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-clay-deep font-serif text-[15px] text-[#FDFBF9]">
            {greeting.initial}
          </div>
        </div>

        {/* briefing — assembled from real numbers, in plain language */}
        <div className="px-6 pb-[26px] pt-4">
          <p className="font-sans text-[15px] font-light leading-[1.7] text-ink/70">
            Your pricing is holding healthy — most of your range earns well. But{" "}
            <strong className="font-medium text-ink">Stacking set ×3</strong> is
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
            across your {priced.done} priced products, after all costs
          </p>
        </div>

        {/* supporting metrics */}
        <div className="mx-6 mt-5 grid grid-cols-2 gap-1 border-t border-ink/7 pt-4">
          <div>
            <p className="mb-1.5 font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-ink/42">
              Priced
            </p>
            <p className="font-serif text-[20px] font-medium tabular-nums">
              {priced.done}
              <span className="font-sans text-[10.5px] font-light text-ink/42">
                {" "}
                / {priced.total}
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
              {attention.map((item) => {
                const chip = statusChip(item.status);
                return (
                  <ListRow
                    key={item.id}
                    emphasis="product"
                    stripe={item.stripe}
                    label={item.name}
                    meta={
                      <span className="inline-flex items-center gap-1.5">
                        <Chip size="sm" tone={chip.tone}>
                          {chip.label}
                        </Chip>
                        <span>{item.note}</span>
                      </span>
                    }
                    value={
                      <Button
                        variant="link"
                        href={`/products/${item.id}`}
                        className="text-[13.5px] font-semibold"
                        iconTrailing={<ChevronRight size={15} strokeWidth={2} />}
                      >
                        {item.action}
                      </Button>
                    }
                  />
                );
              })}
            </div>
          </>
        )}

        {/* resume draft */}
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
              {resume.meta}
            </p>
          </div>
          <span className="text-[14px] text-clay-deep">→</span>
        </Link>

        {/* assistant entry point — nothing generates until it genuinely does */}
        <AssistantSlot className="mx-6 mt-8">Ask about your prices</AssistantSlot>
      </main>

      <BottomNav active="home" />
    </>
  );
}
