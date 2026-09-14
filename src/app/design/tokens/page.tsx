/**
 * /design/tokens: the foundations, rendered from design/tokens.json. Nothing
 * on this page is typed by hand: the swatches are painted from the JSON, the
 * type specimens are set from it, and a test keeps the JSON equal to the CSS.
 * So if a value looks wrong here, it is wrong in the app too.
 */
import { DocSection } from "@/components/design-docs/DocSection";
import { GroupLabel, Rules } from "@/components/design-docs/Rules";
import { TokenSwatch } from "@/components/design-docs/TokenSwatch";
import { familyClass, leaves, tokens, type TypeToken } from "@/components/design-docs/tokens";

const SOURCES = ["src/app/globals.css", "design/tokens.json", "src/lib/tokens.test.ts"];

/** A sentence each specimen is set in: numbers for the serif, chrome for the sans. */
function sampleFor(name: string, family: "font-serif" | "font-sans"): string {
  if (family === "font-serif") {
    if (name.includes("price") || name.includes("figure") || name.includes("profit")) return "£42.60";
    if (name === "metric") return "52%";
    if (name === "calc" || name.includes("total") || name.includes("value")) return "£14.06";
    return "Selene hammered band";
  }
  if (name.includes("label") || name.includes("stamp")) return "What this costs to make";
  if (name === "chip") return "Healthy · 64%";
  if (name === "button") return "Save and activate";
  if (name === "verb-link") return "Reprice";
  if (name === "dropdown") return "All statuses";
  if (name === "briefing") return "Most of your range earns well. Two pieces are priced under target.";
  return "4g × £0.62/g · 20 min at £15/hr";
}

// Sorted by opacity, darkest first. (JS orders integer-like keys ascending on
// its own, which would put ink/14 before ink/70 and ink/07 last.)
const inkSteps: [string, number][] = [
  ["ink", 1],
  ...leaves<number>(tokens.opacity.ink)
    .map(([k, t]): [string, number] => [`ink/${k}`, t.$value])
    .sort((a, b) => b[1] - a[1]),
];

export default function TokensPage() {
  const colours = leaves<string>(tokens.color);
  const status = leaves<string>(tokens.color.status);
  const type = leaves<TypeToken>(tokens.type);
  const lines = leaves<{ width: string; style: string; color: string }>(tokens.line);

  return (
    <>
      <p className="mb-2 max-w-[62ch] font-serif text-[19px] leading-[1.5] text-ink">
        Eleven colours, one ink at seven opacities, two type families, eight radii.
      </p>
      <p className="mb-8 max-w-[62ch] font-sans text-[13.5px] font-light leading-[1.6] text-ink/70">
        Every value on this page is read from{" "}
        <code className="font-mono text-[12px] text-ink">design/tokens.json</code>, which a test
        keeps equal to the CSS. Tailwind utilities are how the code says them; the CSS variables
        are what shadcn and Figma see.
      </p>

      <DocSection
        id="colour"
        title="Colour"
        spec="§1.2"
        source={SOURCES}
        lede="One accent, one ink, one page. Status colours exist for chips and nothing else."
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

      <DocSection
        id="ink"
        title="The ink ladder"
        spec="§1.3"
        lede="Not a set of greys. The one ink colour at fixed opacities, so everything stays in one hue family."
      >
        <div className="flex flex-wrap gap-x-5 gap-y-5">
          {inkSteps.map(([name, o]) => {
            const t = leaves<number>(tokens.opacity.ink).find(([k]) => `ink/${k}` === name)?.[1];
            return (
              <div key={name} className="w-[128px] font-sans">
                <div className="h-12 w-full rounded-[6px] bg-ink" style={{ opacity: o }} />
                <p className="mt-2 font-serif text-[18px] text-ink" style={{ opacity: o }}>
                  Aa 1234
                </p>
                <p className="font-mono text-[11.5px] text-ink/55">
                  {name} · {Math.round(o * 100)}%
                </p>
                {t?.$description && (
                  <p className="mt-1 text-[11.5px] font-light leading-[1.45] text-ink/70">
                    {t.$description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        <Rules
          items={[
            <>
              Tinted bands use ink at {Math.round(tokens.opacity.tint.$value * 1000) / 10}%, and a
              chip&rsquo;s fill is its status colour at {tokens.opacity["chip-fill"].$value * 100}%.
              Backgrounds sit very close to the page.
            </>,
            "Written in Tailwind as text-ink/55, border-ink/14, bg-ink/7. There is nothing extra to define.",
          ]}
        />
      </DocSection>

      <DocSection
        id="type"
        title="Type scale"
        spec="§1.4"
        lede="Two families, strictly divided by role. If it's a number or a name, it's Lora. If it's chrome, it's IBM Plex Sans. Every figure is set with tabular numerals."
      >
        <div className="divide-y divide-ink/7">
          {type.map(([name, t]) => {
            const fam = familyClass(t.$value.fontFamily);
            const v = t.$value;
            return (
              <div
                key={name}
                className="grid gap-x-8 gap-y-2 py-4 md:grid-cols-[220px_minmax(0,1fr)]"
              >
                <div className="font-sans">
                  <p className="text-[13px] font-medium text-ink">{name}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-ink/55 tabular-nums">
                    {v.fontSize} · {fam === "font-serif" ? "Lora" : "Plex"} · {v.fontWeight}
                    {v.letterSpacing ? ` · ${v.letterSpacing}` : ""}
                    {v.textCase ? " · caps" : ""}
                  </p>
                  {t.$description && (
                    <p className="mt-1 text-[11.5px] font-light leading-[1.45] text-ink/70">
                      {t.$description}
                    </p>
                  )}
                </div>
                <p
                  className={`${fam} min-w-0 truncate text-ink tabular-nums`}
                  style={{
                    fontSize: v.fontSize,
                    fontWeight: v.fontWeight,
                    lineHeight: v.lineHeight ?? 1.2,
                    letterSpacing: v.letterSpacing,
                    textTransform: v.textCase,
                  }}
                >
                  {sampleFor(name, fam)}
                </p>
              </div>
            );
          })}
        </div>
      </DocSection>

      <DocSection
        id="spacing"
        title="Spacing"
        spec="§1.5"
        lede="Lists are compact; briefings breathe. The horizontal gutter is 24px on every screen; the vertical rhythm grows with the size of the thought."
      >
        <div className="space-y-3">
          {leaves<string>(tokens.space).map(([name, t]) => (
            <div key={name} className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-4 font-sans">
              <p className="text-[13px] font-medium text-ink">{name}</p>
              <div className="flex items-center gap-3">
                <div className="h-3 shrink-0 rounded-[2px] bg-clay/40" style={{ width: t.$value }} />
                <p className="font-mono text-[11.5px] text-ink/55 tabular-nums">{t.$value}</p>
                {t.$description && (
                  <p className="hidden text-[11.5px] font-light text-ink/70 sm:block">{t.$description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection
        id="radii"
        title="Radii"
        spec="§1.6"
        lede="Nothing is rounder than 11px except chips and sheets. Generous radii read as app cards, the thing this system avoids. In code each is an arbitrary Tailwind radius in px; the checker flags any value outside this set."
      >
        <div className="flex flex-wrap gap-6">
          {leaves<string>(tokens.radius).map(([name, t]) => (
            <div key={name} className="w-[112px] font-sans">
              <div
                className="h-14 w-full border border-ink/30 bg-ink/[0.035]"
                style={{ borderRadius: t.$value }}
              />
              <p className="mt-2 text-[13px] font-medium text-ink">{name}</p>
              <p className="font-mono text-[11.5px] text-ink/55 tabular-nums">{t.$value}</p>
              {t.$description && (
                <p className="mt-1 text-[11.5px] font-light leading-[1.45] text-ink/70">
                  {t.$description}
                </p>
              )}
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection
        id="lines"
        title="Lines"
        spec="§1.7"
        lede="Depth comes from lines, never from elevation. The 3px clay rule and the 2px clay nav tick are one device at two scales: this is where you are, this is where you decide."
      >
        <div className="space-y-5">
          {lines.map(([name, t]) => {
            const colour =
              t.$value.color.includes("clay-deep") ? "border-clay-deep"
              : t.$value.color.includes("clay") ? "border-clay"
              : t.$value.color.includes("red") ? "border-status-red"
              : t.$value.style === "dashed" || name === "divider" ? "border-ink/14"
              : "border-ink/7";
            return (
              <div key={name} className="grid gap-x-8 gap-y-1.5 font-sans md:grid-cols-[220px_minmax(0,1fr)]">
                <div>
                  <p className="text-[13px] font-medium text-ink">{name}</p>
                  <p className="font-mono text-[11px] text-ink/55">
                    {t.$value.width} {t.$value.style} · {t.$value.color.replace(/[{}]/g, "")}
                  </p>
                </div>
                <div>
                  <div
                    className={`w-full max-w-[360px] ${colour}`}
                    style={{ borderTopWidth: t.$value.width, borderTopStyle: t.$value.style as "solid" | "dashed" }}
                  />
                  {t.$description && (
                    <p className="mt-2 text-[11.5px] font-light leading-[1.45] text-ink/70">
                      {t.$description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DocSection>

      <DocSection
        id="shadcn"
        title="The shadcn bridge"
        source="src/app/globals.css"
        lede="shadcn/ui components read semantic variables (--primary, --border …). These are mapped onto the palette above, so any shadcn primitive lands on-brand before anyone touches it. Where the system uses an opacity, the nearest solid is baked here, because shadcn expects solids."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse font-sans text-[13px]">
            <thead>
              <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/42">
                <th className="border-b border-ink/14 py-2 pr-4 font-semibold">shadcn variable</th>
                <th className="border-b border-ink/14 py-2 pr-4 font-semibold">Value</th>
                <th className="border-b border-ink/14 py-2 font-semibold">Which is</th>
              </tr>
            </thead>
            <tbody>
              {leaves<string>(tokens.shadcn).map(([name, t]) => (
                <tr key={name}>
                  <td className="border-b border-ink/7 py-2 pr-4 font-mono text-[12px] text-ink">
                    --{name}
                  </td>
                  <td className="border-b border-ink/7 py-2 pr-4">
                    <span className="inline-flex items-center gap-2 font-mono text-[12px] text-ink/70 tabular-nums">
                      <span
                        aria-hidden
                        className="inline-block h-4 w-4 rounded-[2px] border border-ink/14"
                        style={{ backgroundColor: t.$value }}
                      />
                      {t.$value.toUpperCase()}
                    </span>
                  </td>
                  <td className="border-b border-ink/7 py-2 font-light text-ink/70">{t.$description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Rules
          items={[
            "No dark mode. The system is single-theme (paper) on purpose.",
            "No shadcn base layer. Its global border reset and body overrides are left out, so nothing already on screen shifts.",
            "Hand-skinned primitives (Switch, Input, Drawer) use the real ink/opacity utilities directly; the bridge is the fallback for anything not individually tuned.",
          ]}
        />
      </DocSection>
    </>
  );
}
