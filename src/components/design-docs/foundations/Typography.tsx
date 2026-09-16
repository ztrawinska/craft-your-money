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
      lede="Lora for names, prices and numbers; IBM Plex Sans for UI text. All figures use tabular numerals."
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
                <p className="mt-1 font-mono text-[11px] text-ink/62 tabular-nums">
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
  );
}
