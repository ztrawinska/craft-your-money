/**
 * Sample data shared by the component docs. Chips and stripes come from the
 * status model, so the specimens can't show a label the app wouldn't.
 */
import { Chip } from "@/components/Chip";
import { Price } from "@/components/Price";
import { statusChip, type ChipTone, type ProductStatusInput } from "@/lib/status";

/** A product's chip, straight from the status model (never hand-typed). */
export function chipFor(input: ProductStatusInput) {
  return statusChip(input);
}

/** The overview row's right slot: price leads, the chip is its caption. */
export function ProductSlot({ price, input }: { price: number | null; input: ProductStatusInput }) {
  const chip = chipFor(input);
  return (
    <div className="flex flex-col items-end gap-1.5">
      {price !== null && (
        <span className="font-serif text-[16px] font-medium leading-none tabular-nums text-ink">
          <Price value={price} variant="inline" />
        </span>
      )}
      <Chip tone={chip.tone} size={price !== null ? "sm" : "default"}>
        {chip.label}
      </Chip>
    </div>
  );
}

export const ACTIVE = (marginPct: number): ProductStatusInput => ({
  workflow: "active",
  hasPrice: true,
  marginPct,
});

export const TONES: { tone: ChipTone; label: string }[] = [
  { tone: "positive", label: "Healthy · 64%" },
  { tone: "caution", label: "Caution · 22%" },
  { tone: "critical", label: "Risky · 8%" },
  { tone: "neutral", label: "No price" },
  { tone: "inactive", label: "Draft" },
];
