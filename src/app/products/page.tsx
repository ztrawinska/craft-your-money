/**
 * Products overview — static build matching docs/design/craft-ym-overview-r3.html.
 *
 * Server Component, hardcoded sample data. The screen's job (PRD §11): let a
 * maker spot the weakest margin without opening each product. Everything that
 * carries meaning — the chip, the urgency stripe, the sort order — is derived
 * from the status model, so the list can't contradict itself.
 */
import { ArrowUpDown } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Chip } from "@/components/Chip";
import { Dropdown } from "@/components/Dropdown";
import { ListRow } from "@/components/ListRow";
import { TintedBand } from "@/components/TintedBand";
import {
  compareByStatus,
  statusChip,
  stripeTone,
  type ProductStatusInput,
} from "@/lib/status";

type Product = {
  id: string;
  name: string;
  type: string;
  price: number | null;
  workflow: "draft" | "active";
  marginPct: number | null;
};

// Deliberately unsorted — compareByStatus puts them in urgency order below,
// so the sort is real code running, not a pre-arranged list.
const products: Product[] = [
  { id: "hammered-band", name: "Hammered band", type: "Ring", price: 42, workflow: "active", marginPct: 0.64 },
  { id: "pearl-drop", name: "Pearl drop earrings", type: "Earrings", price: 55, workflow: "active", marginPct: 0.22 },
  { id: "stacking-set", name: "Stacking set × 3", type: "Ring", price: 38, workflow: "active", marginPct: 0.08 },
  { id: "twisted-pendant", name: "Twisted wire pendant", type: "Necklace", price: 68, workflow: "active", marginPct: 0.55 },
  { id: "copper-cuff", name: "Forged copper cuff", type: "Bracelet", price: null, workflow: "active", marginPct: null },
  { id: "new-ring", name: "New ring concept", type: "Ring", price: null, workflow: "draft", marginPct: null },
];

/** A product's shape as the status model sees it. */
function toStatusInput(p: Product): ProductStatusInput {
  return { workflow: p.workflow, hasPrice: p.price !== null, marginPct: p.marginPct };
}

function metaPrice(p: Product): string {
  if (p.price !== null) return `£${p.price.toFixed(2)}`;
  return p.workflow === "draft" ? "in progress" : "no price set";
}

export default function ProductsOverview() {
  const sorted = [...products].sort((a, b) =>
    compareByStatus(toStatusInput(a), toStatusInput(b)),
  );

  return (
    <>
      <main className="mx-auto w-full max-w-[430px] pb-[84px]">
        {/* header */}
        <div className="flex items-baseline justify-between px-6 pb-3.5 pt-[22px]">
          <h1 className="font-serif text-[26px] font-medium tracking-[-0.01em]">
            Products
          </h1>
          <span className="font-sans text-[11px] font-light text-ink/42">
            5 active · 1 draft
          </span>
        </div>

        {/* deterministic insight — no AI, no iris */}
        <TintedBand className="mx-6 mb-5">
          <p className="font-serif text-[13px] italic leading-[1.5] text-ink/70">
            <strong className="font-medium not-italic text-ink">
              Stacking set × 3
            </strong>{" "}
            has your weakest margin — you&rsquo;re losing money on it. Two
            products sit below your 30% target.
          </p>
        </TintedBand>

        {/* controls: filters (dropdowns) left, sort (bare icon) right */}
        <div className="flex items-center gap-2 px-6 pb-3.5">
          <Dropdown>All statuses</Dropdown>
          <Dropdown>All types</Dropdown>
          <button
            type="button"
            aria-label="Sort"
            className="ml-auto flex h-[38px] w-[38px] items-center justify-center"
          >
            <ArrowUpDown size={18} strokeWidth={1.7} className="text-ink/55" />
          </button>
        </div>

        {/* the list — hairline-separated rows, problems first */}
        <div className="divide-y divide-ink/7">
          {sorted.map((p) => {
            const input = toStatusInput(p);
            const chip = statusChip(input);
            return (
              <ListRow
                key={p.id}
                emphasis="product"
                href={`/products/${p.id}`}
                stripe={stripeTone(input)}
                muted={p.workflow === "draft"}
                label={p.name}
                meta={
                  <>
                    <span className="text-ink/55">{p.type}</span> · {metaPrice(p)}
                  </>
                }
                value={<Chip tone={chip.tone}>{chip.label}</Chip>}
              />
            );
          })}
        </div>
      </main>

      <BottomNav active="products" />
    </>
  );
}
