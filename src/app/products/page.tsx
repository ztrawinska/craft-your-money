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
import { currencyCur, formatMoney } from "@/lib/currency";
import { fixedCostPerUnit } from "@/lib/fixed-costs";
import { PRODUCT_TYPES, productLabourHours, statusInputFor, type Product } from "@/lib/products";
import { getFixedCostConfig, getFixedCosts, getSettings, listProducts } from "@/lib/store";
import { compareByStatus, sortKey, statusChip, stripeTone } from "@/lib/status";

export default async function ProductsOverview({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const params = await searchParams;
  const status = params.status ?? "all";
  const type = params.type ?? "all";
  const settings = await getSettings();
  const cur = currencyCur(settings.currency);
  const fixedCosts = await getFixedCosts();
  const config = await getFixedCostConfig();
  const shareOf = (p: Product) => fixedCostPerUnit(fixedCosts, config, productLabourHours(p));

  const all = await listProducts();
  const active = all.filter((p) => !p.archived);
  // Categories to offer — only the ones actually in use, in canonical order.
  const typesInUse = PRODUCT_TYPES.filter((t) => all.some((p) => p.type === t));

  // Filter by the status segment. "Archived" is its own view; the rest filter
  // the live range by the same key the chip and sort use. The type filter then
  // narrows whichever set that produced (the two compose).
  const showingArchived = status === "archived";
  // "Below target" is the dashboard's actionable group — every priced product
  // under the healthy margin, i.e. Risky OR Caution together (there's no single
  // status for it, so it's matched as the pair).
  const isBelowTarget = (p: Product) => {
    const key = sortKey(statusInputFor(p, settings, shareOf(p)));
    return key === "risky" || key === "caution";
  };
  const byStatus = showingArchived
    ? all.filter((p) => p.archived)
    : active.filter((p) => {
        if (status === "all") return true;
        if (status === "below-target") return isBelowTarget(p);
        return sortKey(statusInputFor(p, settings, shareOf(p))) === status;
      });
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
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-[430px] flex-1">
        {/* header */}
        <div className="flex items-baseline justify-between px-6 pb-3.5 pt-[22px]">
          <h1 className="font-serif text-[26px] font-medium tracking-[-0.01em]">
            Products
          </h1>
          <span className="font-sans text-[11px] font-light text-ink/62">
            {count}
          </span>
        </div>

        {/* controls: filters (dropdowns) left, sort (bare icon) right */}
        <div className="flex items-center gap-2 px-6 pb-3.5 pt-1">
          <StatusFilter current={status} type={type} />
          <TypeFilter current={type} status={status} types={typesInUse} />
          <button
            type="button"
            aria-label="Sort"
            className="ml-auto flex h-[38px] w-[38px] items-center justify-center"
          >
            <ArrowUpDown size={18} strokeWidth={1.7} className="text-ink/62" />
          </button>
        </div>

        {/* the list — no rules between rows; the inset stripe + row rhythm do
            the separating (problems first) */}
        <div>
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
                meta={showingArchived ? "archived" : p.type}
                value={
                  showingArchived ? (
                    <RestoreButton id={p.id} />
                  ) : (
                    // Price leads (quick lookup — shop, fairs, "how much is
                    // this?"); the status chip sits under it as the caption.
                    // Margin already lives inside the chip label, so it's not
                    // repeated. No-price rows drop the figure and show the chip
                    // alone at full size.
                    <div className="flex flex-col items-end gap-1.5">
                      {p.finalPrice !== null && (
                        <span className="font-serif text-[16px] font-medium leading-none tabular-nums text-ink">
                          {formatMoney(p.finalPrice, cur)}
                        </span>
                      )}
                      <Chip tone={chip.tone} size={p.finalPrice !== null ? "sm" : "default"}>
                        {chip.label}
                      </Chip>
                    </div>
                  )
                }
              />
            );
          })}
          {sorted.length === 0 && (
            <p className="px-6 py-8 font-sans text-[13px] font-light text-ink/62">
              Nothing here.
            </p>
          )}
        </div>
      </main>

      <BottomNav active="products" />
    </div>
  );
}
