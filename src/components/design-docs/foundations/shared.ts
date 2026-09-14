/**
 * Helpers shared by the foundation docs: the specimen sentence per type role,
 * and the ink ladder in display order.
 */
import { leaves, tokens } from "@/components/design-docs/tokens";

/** A sentence each type specimen is set in: numbers for the serif, chrome for the sans. */
export function sampleFor(name: string, family: "font-serif" | "font-sans"): string {
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
export const inkSteps: [string, number][] = [
  ["ink", 1],
  ...leaves<number>(tokens.opacity.ink)
    .map(([k, t]): [string, number] => [`ink/${k}`, t.$value])
    .sort((a, b) => b[1] - a[1]),
];

export const TOKEN_SOURCES = ["src/app/globals.css", "design/tokens.json", "src/lib/tokens.test.ts"];
