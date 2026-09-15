import { DocSection } from "@/components/design-docs/DocSection";
import { Rules } from "@/components/design-docs/Rules";

export function CompositionDoc() {
  return (
    <DocSection
      page
      id="composition"
      title="Composition"
      spec="§3"
      lede="How a screen is put together: what appears once, in what order, and what is left out."
    >
      <Rules
        title="Per screen"
        items={[
          "One framed surface. One primary button. One dominant number.",
          "Control rows: filters as dropdowns on the left, a single bare sort icon on the right. Never a third box.",
          "Colour appears only in chips, the clay accent, and (once per row) the urgency stripe.",
        ]}
      />
      <Rules
        title="Order"
        items={[
          "Vertical order follows importance, not convention: the answer first, the detail below.",
          "The dashboard opens with a greeting and a briefing, not a title.",
          "The pricing block ends with the profit. The last line is the verdict.",
        ]}
      />
      <Rules
        title="Empty states"
        items={[
          "A section with nothing to say does not render. No all-clear bands, no zeros as heroes.",
          "Exception: a metric cell that must hold its grid position shows a quiet italic state (all on target) instead of 0.",
        ]}
      />
      <Rules
        title="Progressive disclosure"
        items={[
          "Fixed costs, market benchmark and the materials library are opt-in layers. They never block the core flow.",
          "When unconfigured they show a quiet nudge, never an error.",
        ]}
      />
    </DocSection>
  );
}
