import { DocSection } from "@/components/design-docs/DocSection";
import { leaves, tokens } from "@/components/design-docs/tokens";

export function LinesDoc() {
  const lines = leaves<{ width: string; style: string; color: string }>(tokens.line);
  return (
    <DocSection page
      id="lines"
      title="Lines"
      spec="§1.7"
      lede="Hairlines and rules instead of elevation. Widths 1 to 3px; colour is ink at an opacity, or clay."
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
  );
}
