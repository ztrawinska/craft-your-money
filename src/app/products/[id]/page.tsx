/**
 * Product Detail — matches docs/design/craft-ym-detail-r3.html.
 *
 * Data-driven: it looks the product up by the [id] route segment and reads the
 * SAME shared data the overview and dashboard use, so a product shows the same
 * identity, price and status wherever you meet it. The cost ledger and summary
 * are server-rendered; the pricing block is interactive (PricingPanel).
 *
 * Order (PRD §11): identity → costs → reconciling summary → the ONE framed
 * surface (pricing) → market benchmark → save bar. No bottom nav.
 */
import { ArrowLeft, ChevronDown, Ellipsis, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { ListRow } from "@/components/ListRow";
import { PricingPanel } from "@/components/PricingPanel";
import { Price } from "@/components/Price";
import { SectionLabel } from "@/components/SectionLabel";
import { getProduct, pricingFor } from "@/lib/products";

const addIcon = <Plus size={14} strokeWidth={2} />;

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const pr = pricingFor(product);

  const materialsTotal = product.materials.reduce((s, m) => s + m.cost, 0);
  const labourTotal = product.labour.reduce((s, l) => s + l.cost, 0);
  const otherTotal = product.otherCosts.reduce((s, o) => s + o.cost, 0);

  return (
    <main className="mx-auto w-full max-w-[430px] pb-24">
      {/* ── header: back · workflow stamp · more ── */}
      <div className="flex items-center justify-between px-6 pt-5">
        <Link href="/products" aria-label="Back" className="-ml-1.5 text-ink/55">
          <ArrowLeft size={18} strokeWidth={2} />
        </Link>
        {product.workflow === "draft" ? (
          <span className="rounded-[2px] border border-ink/30 px-[11px] pb-[3px] pt-1 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-ink/55">
            Draft
          </span>
        ) : (
          <span />
        )}
        <button type="button" aria-label="More" className="text-ink/42">
          <Ellipsis size={18} />
        </button>
      </div>

      {/* ── identity ── */}
      <div className="px-6 pb-2 pt-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-deep">
          {product.type}
        </p>
        <h1 className="max-w-[300px] font-serif text-[27px] font-medium leading-[1.16] tracking-[-0.01em]">
          {product.name}
        </h1>
      </div>

      {/* ── ledger: flat, hairline-separated cost sections ── */}
      <div className="px-6">
        {/* materials */}
        <section className="pb-1.5 pt-[22px]">
          <SectionLabel
            total={
              product.materials.length > 0 ? (
                <Price value={materialsTotal} variant="sectionTotal" />
              ) : undefined
            }
          >
            Materials
          </SectionLabel>
          {product.materials.map((m) => (
            <ListRow
              key={m.name}
              label={m.name}
              library={m.fromLibrary}
              meta={m.detail}
              value={<Price value={m.cost} variant="inline" />}
            />
          ))}
          <Button variant="link" iconLeading={addIcon} className="pt-3 text-[13px] font-medium">
            Add material
          </Button>
        </section>

        {/* labour */}
        <section className="border-t border-ink/7 pb-1.5 pt-[22px]">
          <SectionLabel
            total={
              product.labour.length > 0 ? (
                <Price value={labourTotal} variant="sectionTotal" />
              ) : undefined
            }
          >
            Labour
          </SectionLabel>
          {product.labour.map((l) => (
            <ListRow
              key={l.step}
              label={l.step}
              meta={l.detail}
              value={<Price value={l.cost} variant="inline" />}
            />
          ))}
          <Button variant="link" iconLeading={addIcon} className="pt-3 text-[13px] font-medium">
            Add step
          </Button>
        </section>

        {/* other costs */}
        <section className="border-t border-ink/7 pb-1.5 pt-[22px]">
          <SectionLabel
            total={
              product.otherCosts.length > 0 ? (
                <Price value={otherTotal} variant="sectionTotal" />
              ) : undefined
            }
          >
            Other costs
          </SectionLabel>
          {product.otherCosts.map((o) => (
            <ListRow key={o.label} label={o.label} value={<Price value={o.cost} variant="inline" />} />
          ))}
          <Button variant="link" iconLeading={addIcon} className="pt-3 text-[13px] font-medium">
            Add cost{" "}
            <span className="text-[11.5px] font-light italic text-ink/42">
              box, casting, outsourced finishing…
            </span>
          </Button>
        </section>

        {/* reconciling summary — typeset straight on the page, no card */}
        <div className="mt-[22px] border-t border-ink/14 pb-1 pt-5">
          {product.materials.length > 0 && (
            <div className="flex items-baseline justify-between py-[3px] text-[13px] text-ink/55">
              <span>Materials</span>
              <Price value={materialsTotal} variant="summary" />
            </div>
          )}
          {product.labour.length > 0 && (
            <div className="flex items-baseline justify-between py-[3px] text-[13px] text-ink/55">
              <span>Labour</span>
              <Price value={labourTotal} variant="summary" />
            </div>
          )}
          <div className="mt-[10px] flex items-baseline justify-between border-t border-ink/7 pt-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/55">
              Direct cost
            </span>
            <Price value={pr.directCost} variant="figure" />
          </div>
          {/* business-cost lines — only when the fixed-cost layer is configured */}
          {pr.fullCost !== null && product.businessCostShare !== null && (
            <div className="mt-[11px] border-t border-dashed border-ink/14 pt-[10px]">
              <div className="flex items-baseline justify-between py-[3px] text-[12px] text-ink/55">
                <span className="font-light italic">Share of business costs</span>
                <Price value={product.businessCostShare} variant="summary" />
              </div>
              <div className="flex items-baseline justify-between py-[3px] text-[12px]">
                <span className="font-medium text-ink/70">Full cost</span>
                <Price value={pr.fullCost} variant="inline" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── the ONE framed surface: the interactive pricing block ── */}
      <PricingPanel
        workflow={product.workflow}
        directCost={pr.directCost}
        targetMarginPct={product.targetMarginPct}
        vatRatePct={product.vatRatePct}
        businessCostShare={product.businessCostShare}
        initialFinalPrice={product.finalPrice}
      />

      {/* ── market benchmark: collapsed by default ── */}
      <div className="px-6 pt-5">
        <div className="flex items-center justify-between border-b border-t border-ink/7 py-[15px]">
          <span className="text-[13.5px] font-medium text-ink/55">Market benchmark</span>
          <ChevronDown size={14} className="text-ink/30" />
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
