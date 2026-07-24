/**
 * Product Detail — matches docs/design/craft-ym-detail-r3.html.
 *
 * Now data-driven: it looks the product up by the [id] route segment and reads
 * the SAME shared data the overview and dashboard use, so a product shows the
 * same identity, price and status wherever you meet it. All the derived figures
 * (direct cost, calculated suggestion, profit, margin) come from computePricing.
 *
 * Still static — no state, no calculations happening on input, no database.
 * Order (PRD §11): identity → costs → reconciling summary → the ONE framed
 * surface (pricing) → market benchmark → save bar. No bottom nav.
 */
import { ArrowLeft, ChevronDown, Ellipsis, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AssistantSlot } from "@/components/AssistantSlot";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { FramedSurface } from "@/components/FramedSurface";
import { ListRow } from "@/components/ListRow";
import { Price } from "@/components/Price";
import { SectionLabel } from "@/components/SectionLabel";
import { getProduct, pricingFor, statusInputFor } from "@/lib/products";
import { profitTone, profitabilityFromMargin, statusChip } from "@/lib/status";

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
  const chip = statusChip(statusInputFor(product));
  const profit =
    pr.marginPct !== null ? profitTone(profitabilityFromMargin(pr.marginPct)) : null;

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

      {/* ── the ONE framed surface: the pricing block ── */}
      <FramedSurface className="mx-6 mt-[26px] px-6 pb-5 pt-[22px]">
        {/* calculated price — the suggestion */}
        <div className="mb-[18px] flex items-center justify-between gap-2.5 border-b border-ink/7 pb-[18px]">
          <div>
            <p className="text-[12.5px] text-clay-deep">Calculated price</p>
            {pr.calculatedBeforeVat !== null && (
              <p className="mt-0.5 text-[11px] font-light text-ink/42">
                £{pr.calculatedBeforeVat.toFixed(2)} before VAT · {product.targetMarginPct}%
                target
              </p>
            )}
          </div>
          {pr.calculatedPrice !== null ? (
            <Price value={pr.calculatedPrice} variant="calc" />
          ) : (
            <span className="text-[12px] font-light text-ink/42">Add costs first</span>
          )}
        </div>

        {/* your price — the decision */}
        <div className="mb-2 flex items-baseline justify-between text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ink/55">
          <span>Your price</span>
          {product.finalPrice !== null && pr.calculatedPrice !== null && (
            <Button
              variant="link"
              className="text-[10.5px] font-normal normal-case tracking-normal underline decoration-clay-deep/40 underline-offset-2"
            >
              Reset to £{pr.calculatedPrice.toFixed(2)}
            </Button>
          )}
        </div>
        {product.finalPrice !== null ? (
          <div className="mb-3">
            <Price value={product.finalPrice} variant="primary" />
          </div>
        ) : (
          <p className="mb-3 font-serif text-[24px] font-medium text-ink/30">Not set yet</p>
        )}

        {/* VAT + profit — only once there's a price to run them on */}
        {pr.net !== null && product.vatRatePct !== null && (
          <p className="mb-5 text-[13px] font-light text-ink/55">
            You keep{" "}
            <strong className="font-medium text-ink tabular-nums">
              £{pr.net.toFixed(2)}
            </strong>{" "}
            after {product.vatRatePct}% VAT.
          </p>
        )}

        {pr.profit !== null ? (
          <div className="border-t border-ink/7 pt-[18px]">
            <p className="mb-2 text-[12px] text-ink/55">Profit per piece, after all costs</p>
            <div className="flex items-center justify-between gap-2.5">
              <Price value={pr.profit} variant="profit" tone={profit ?? undefined} />
              <Chip tone={chip.tone}>{chip.label}</Chip>
            </div>
          </div>
        ) : (
          <p className="border-t border-ink/7 pt-[18px] text-[12px] text-ink/55">
            Set a price to see your profit and margin.
          </p>
        )}

        <AssistantSlot centered className="mt-5">
          Check this price
        </AssistantSlot>
      </FramedSurface>

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
