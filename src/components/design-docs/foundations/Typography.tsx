import { DocSection } from "@/components/design-docs/DocSection";
import { familyClass, leaves, tokens, type TypeToken } from "@/components/design-docs/tokens";
import { sampleFor } from "@/components/design-docs/foundations/shared";

export function TypographyDoc() {
  const type = leaves<TypeToken>(tokens.type);
  return (
    <DocSection page
      id="type"
      title="Typography"
      spec="§1.4"
      lede="Twenty-two presets on eleven sizes. Lora for names, prices, numbers and the editorial sentences; IBM Plex Sans for UI text. Every line box is a multiple of 4px, so text stacks on the spacing rhythm. One class each: text-label-sm, text-figure-lg — plus font-serif or font-sans."
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
                <p className="text-label-strong text-ink">{name} <span className="font-mono text-label-sm text-ink/62">text-{name}</span></p>
                <p className="mt-1 font-mono text-label-sm text-ink/62 tabular-nums">
                  {v.fontSize}/{v.lineHeight} · {fam === "font-serif" ? "Lora" : "Plex"} · {v.fontWeight}
                  {v.letterSpacing ? ` · ${v.letterSpacing}` : ""}
                  {v.textCase ? " · caps" : ""}
                </p>
                {t.$description && (
                  <p className="mt-1 text-body-sm text-ink/70">
                    {t.$description}
                  </p>
                )}
              </div>
              <p
                className={`${fam} min-w-0 truncate text-ink tabular-nums`}
                style={{
                  fontSize: v.fontSize,
                  fontWeight: v.fontWeight,
                  lineHeight: v.lineHeight,
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
  );
}
