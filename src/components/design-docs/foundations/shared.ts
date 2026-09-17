/**
 * Helpers shared by the foundation docs: the specimen sentence per type role,
 * and the ink ladder in display order.
 */
import { leaves, tokens } from "@/components/design-docs/tokens";

/** A sentence each type specimen is set in: numbers for the serif, chrome for the sans. */
export function sampleFor(name: string, family: "font-serif" | "font-sans"): string {
  if (family === "font-serif") {
    if (name.startsWith("figure")) return name === "figure-xs" ? "9" : "£163.59";
    if (name === "title") return "Harmonia collar";
    if (name.startsWith("value")) return "£190.00";
    return "14ct gold wire";
  }
  if (name.startsWith("caps")) return "What this costs to make";
  if (name === "chip") return "Healthy · 38%";
  if (name.startsWith("button")) return name === "button" ? "Save and activate" : "Save draft";
  if (name === "link") return "Reprice";
  if (name === "label-strong") return "Check this price";
  if (name === "label") return "Materials";
  if (name === "nav") return "Products";
  if (name === "body-lg") return "Most of your range earns well. Two pieces are priced under target.";
  if (name === "body") return "Your price covers costs but is below your 40% margin target.";
  return "5g × £38.00/g · 90 min at £22/hr";
}

// Sorted by opacity, darkest first. (JS orders integer-like keys ascending on
// its own, which would put ink/14 before ink/70 and ink/07 last.)
export const inkSteps: [string, number][] = [
  ["ink", 1],
  ...leaves<number>(tokens.opacity.ink)
    .map(([k, t]): [string, number] => [`ink/${k}`, t.$value])
    .sort((a, b) => b[1] - a[1]),
];

export const TOKEN_SOURCES = ["src/app/globals.css", "design/tokens.json", "src/lib/tokens.test.ts"];
