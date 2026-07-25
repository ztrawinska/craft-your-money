/**
 * Products overview — matches docs/design/craft-ym-overview-r3.html.
 *
 * Server Component. Reads the shared product list; everything that carries
 * meaning — the chip, the urgency stripe, the sort order, the counts — is
 * derived from the status model, so the list can't contradict itself or the
 * other screens.
 */
import { ArrowUpDown } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Chip } from "@/components/Chip";
import { Dropdown } from "@/components/Dropdown";
import { ListRow } from "@/components/ListRow";
import { TintedBand } from "@/components/TintedBand";
import { statusInputFor, type Product } from "@/lib/products";
import { getSettings, listProducts } from "@/lib/store";
import { compareByStatus, statusChip, stripeTone } from "@/lib/status";

function metaPrice(p: Product): string {
  if (p.finalPrice !== null) return `£${p.finalPrice.toFixed(2)}`;
  return p.workflow === "draft" ? "in progress" : "no price set";
}

export default function ProductsOverview() {
  const products = listProducts();
  const settings = getSettings();
  const sorted = [...products].sort((a, b) =>
    compareByStatus(statusInputFor(a, settings), statusInputFor(b, settings)),
  );

  const activeCount = products.filter((p) => p.workflow === "active").length;
  const draftCount = products.length - activeCount;
  const count = `${activeCount} active · ${draftCount} draft${draftCount === 1 ? "" : "s"}`;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto w-full max-w-[430px] flex-1">
        {/* header */}
        <div className="flex items-baseline justify-between px-6 pb-3.5 pt-[22px]">
          <h1 className="font-serif text-[26px] font-medium tracking-[-0.01em]">
            Products
          </h1>
          <span className="font-sans text-[11px] font-light text-ink/42">
            {count}
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
            const input = statusInputFor(p, settings);
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
    </div>
  );
}
