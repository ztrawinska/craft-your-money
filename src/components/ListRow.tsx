/**
 * ListRow — the workhorse two-line row (design system §2.6).
 *
 *   Primary label (Lora)                         [right slot]
 *   Meta line (the arithmetic, in a quiet voice)
 *
 * The label is a name, so it's Lora. The meta line carries the sum in plain
 * form ("4g × £0.62/g") so the row shows its working. The right slot is
 * whatever the screen needs there — a <Price> here, a <Chip> on the overview.
 *
 * The optional left stripe is a status scan-aid used on lists; it's off by
 * default because the detail screen's cost rows carry no urgency.
 */
import type { ReactNode } from "react";

type ListRowProps = {
  label: string;
  /** Marks a value pulled from the materials library (deterministic, not AI). */
  library?: boolean;
  /** The quiet second line — the arithmetic behind the value. */
  meta?: string;
  /** Right-hand slot: a price, a chip, a verb-link. */
  value?: ReactNode;
};

export function ListRow({ label, library, meta, value }: ListRowProps) {
  return (
    <div className="py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-sans text-[15px] text-ink">
          {label}
          {library && (
            <span
              className="ml-1 text-[8px] text-ink/30"
              style={{ verticalAlign: "2px" }}
            >
              ◆
            </span>
          )}
        </span>
        {value && <span className="flex-shrink-0">{value}</span>}
      </div>
      {meta && (
        <p className="mt-[3px] font-sans text-[12px] font-light text-ink/42">
          {meta}
        </p>
      )}
    </div>
  );
}
