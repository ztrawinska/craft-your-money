/**
 * SectionLabel — the quiet caps label that organises a screen (design §2.5),
 * with an optional right-aligned total on the same baseline.
 *
 * Small size + wide tracking is the system's structural voice: it recedes
 * while still labelling. The total is passed in (usually a <Price>), so this
 * component never has to know about money formatting.
 */
import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  total?: ReactNode;
};

export function SectionLabel({ children, total }: SectionLabelProps) {
  return (
    <div className="mb-1 flex items-baseline justify-between">
      <span className="font-sans text-caps uppercase text-ink/62">
        {children}
      </span>
      {total}
    </div>
  );
}
