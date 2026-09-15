import { DocSection } from "@/components/design-docs/DocSection";
import { GroupLabel, Rules } from "@/components/design-docs/Rules";
import { TokenSwatch } from "@/components/design-docs/TokenSwatch";
import { leaves, tokens } from "@/components/design-docs/tokens";
import { TOKEN_SOURCES } from "@/components/design-docs/foundations/shared";

export function ColourDoc() {
  const colours = leaves<string>(tokens.color);
  const status = leaves<string>(tokens.color.status);
  return (
    <DocSection page
      id="colour"
      title="Colour"
      spec="§1.2"
      source={TOKEN_SOURCES}
      lede="Eleven colours: page, card, ink, two clays, two irises, and three status colours used only in chips."
    >
      <GroupLabel>Surfaces, ink and the accent</GroupLabel>
      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {colours.map(([name, t]) => (
          <TokenSwatch
            key={name}
            name={name}
            value={t.$value}
            utility={`bg-${name} · text-${name}`}
            cssVar={`--color-${name}`}
            description={t.$description}
          />
        ))}
      </div>
      <GroupLabel>Status · chips only</GroupLabel>
      <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {status.map(([name, t]) => (
          <TokenSwatch
            key={name}
            name={`status-${name}`}
            value={t.$value}
            utility={`bg-status-${name}/15 · text-status-${name}`}
            cssVar={`--color-status-${name}`}
            description={t.$description}
          />
        ))}
      </div>
      <Rules
        items={[
          "Numbers are ink. Costs, prices, totals: all monochrome. Colour is for chips and the clay accent.",
          "Clay is the accent for actions and focus; clay-deep for anything you can tap.",
          "Iris only when a model is genuinely involved. It never shares an element with clay, and never touches a status colour.",
        ]}
      />
    </DocSection>
  );
}
