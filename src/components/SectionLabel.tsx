/**
 * SectionLabel — the quiet caps label that organises a screen (design §2.5),
 * with an optional right-aligned total on the same baseline.
 *
 * Small size + wide tracking is the system's structural voice: it recedes
 * while still labelling. The total is passed in (usually a <Price>), so this
 * component never has to know about money formatting.
 *
 * The 4px under the label is `pb-1`, not a margin (§1.5): it belongs to the
 * label the way a button's padding belongs to the button, and padding can
 * neither collapse into a sibling nor leak past the component. Page rhythm —
 * how far this section sits from the last one — stays with the page.
 */
import type { ReactNode } from "react";

type SectionLabelProps = {
  children: ReactNode;
  total?: ReactNode;
};

export function SectionLabel({ children, total }: SectionLabelProps) {
  return (
    <div className="flex items-baseline justify-between pb-1">
      <span className="font-sans text-caps uppercase text-ink/62">
        {children}
      </span>
      {total}
    </div>
  );
}
