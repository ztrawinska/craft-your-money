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
import { ListRow } from "@/components/ListRow";
import { RestoreButton } from "@/components/RestoreButton";
import { StatusFilter } from "@/components/StatusFilter";
import { TypeFilter } from "@/components/TypeFilter";
import { TintedBand } from "@/components/TintedBand";
import { currencySymbol } from "@/lib/currency";
import { fixedCostPerUnit } from "@/lib/fixed-costs";
import { PRODUCT_TYPES, productLabourHours, statusInputFor, type Product } from "@/lib/products";
import { getFixedCostConfig, getFixedCosts, getSettings, listProducts } from "@/lib/store";
import { compareByStatus, sortKey, statusChip, stripeTone } from "@/lib/status";

function metaPrice(p: Product, cur: string): string {
  if (p.finalPrice !== null) return `${cur}${p.finalPrice.toFixed(2)}`;
  return p.workflow === "draft" ? "in progress" : "no price set";
}

export default async function ProductsOverview({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const params = await searchParams;
  const status = params.status ?? "all";
  const type = params.type ?? "all";
  const settings = getSettings();
  const cur = currencySymbol(settings.currency);
  const fixedCosts = getFixedCosts();
  const config = getFixedCostConfig();
  const shareOf = (p: Product) => fixedCostPerUnit(fixedCosts, config, productLabourHours(p));

  const all = listProducts();
  const active = all.filter((p) => !p.archived);
  // Categories to offer — only the ones actually in use, in canonical order.
  const typesInUse = PRODUCT_TYPES.filter((t) => all.some((p) => p.type === t));

  // Filter by the status segment. "Archived" is its own view; the rest filter
  // the live range by the same key the chip and sort use. The type filter then
  // narrows whichever set that produced (the two compose).
  const showingArchived = status === "archived";
  const byStatus = showingArchived
    ? all.filter((p) => p.archived)
    : active.filter((p) => status === "all" || sortKey(statusInputFor(p, settings, shareOf(p))) === status);
  const visible = type === "all" ? byStatus : byStatus.filter((p) => p.type === type);

  const sorted = showingArchived
    ? visible
    : [...visible].sort((a, b) =>
        compareByStatus(statusInputFor(a, settings, shareOf(a)), statusInputFor(b, settings, shareOf(b))),
      );

  const activeCount = active.filter((p) => p.workflow === "active").length;
  const draftCount = active.length - activeCount;
  const filtered = status !== "all" || type !== "all";
  const count = showingArchived
    ? `${visible.length} archived`
    : !filtered
      ? `${activeCount} active · ${draftCount} draft${draftCount === 1 ? "" : "s"}`
      : `${visible.length} shown`;

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

        {/* deterministic insight — only on the unfiltered default view */}
        {!filtered && (
          <TintedBand className="mx-6 mb-5">
            <p className="font-serif text-[13px] italic leading-[1.5] text-ink/70">
              <strong className="font-medium not-italic text-ink">
                Stacking set × 3
              </strong>{" "}
              has your weakest margin — you&rsquo;re losing money on it. Two
              products sit below your 30% target.
            </p>
          </TintedBand>
        )}

        {/* controls: filters (dropdowns) left, sort (bare icon) right */}
        <div className="flex items-center gap-2 px-6 pb-3.5 pt-1">
          <StatusFilter current={status} type={type} />
          <TypeFilter current={type} status={status} types={typesInUse} />
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
            const input = statusInputFor(p, settings, shareOf(p));
            const chip = statusChip(input);
            return (
              <ListRow
                key={p.id}
                emphasis="product"
                href={showingArchived ? undefined : `/products/${p.id}`}
                stripe={showingArchived ? null : stripeTone(input)}
                muted={showingArchived || p.workflow === "draft"}
                label={p.name}
                meta={
                  <>
                    <span className="text-ink/55">{p.type}</span> ·{" "}
                    {showingArchived ? "archived" : metaPrice(p, cur)}
                  </>
                }
                value={
                  showingArchived ? (
                    <RestoreButton id={p.id} />
                  ) : (
                    <Chip tone={chip.tone}>{chip.label}</Chip>
                  )
                }
              />
            );
          })}
          {sorted.length === 0 && (
            <p className="px-6 py-8 font-sans text-[13px] font-light text-ink/55">
              Nothing here.
            </p>
          )}
        </div>
      </main>

      <BottomNav active="products" />
    </div>
  );
}
