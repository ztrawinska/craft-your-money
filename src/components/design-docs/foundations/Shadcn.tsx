import { DocSection } from "@/components/design-docs/DocSection";
import { Rules } from "@/components/design-docs/Rules";
import { leaves, tokens } from "@/components/design-docs/tokens";

export function ShadcnDoc() {
  return (
    <DocSection page
      id="shadcn"
      title="shadcn bridge"
      source="src/app/globals.css"
      lede="shadcn/ui components read semantic variables (--primary, --border …). These map onto the palette, so shadcn primitives render on-brand by default. Opacity tokens are baked to the nearest solid."
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse font-sans text-label">
          <thead>
            <tr className="text-left text-caps uppercase text-ink/62">
              <th className="border-b border-ink/14 py-2 pr-4 font-semibold">shadcn variable</th>
              <th className="border-b border-ink/14 py-2 pr-4 font-semibold">Value</th>
              <th className="border-b border-ink/14 py-2 font-semibold">Which is</th>
            </tr>
          </thead>
          <tbody>
            {leaves<string>(tokens.shadcn).map(([name, t]) => (
              <tr key={name}>
                <td className="border-b border-ink/7 py-2 pr-4 font-mono text-label-sm text-ink">
                  --{name}
                </td>
                <td className="border-b border-ink/7 py-2 pr-4">
                  <span className="inline-flex items-center gap-2 font-mono text-label-sm text-ink/70 tabular-nums">
                    <span
                      aria-hidden
                      className="inline-block h-4 w-4 rounded-stamp border border-ink/14"
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
  );
}
