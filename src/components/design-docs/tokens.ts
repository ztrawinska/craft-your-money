/**
 * Typed access to design/tokens.json for the library pages. The JSON is the
 * DTCG export of globals.css (guarded by lib/tokens.test.ts), so reading it
 * here means the tokens page can never show a value the CSS doesn't have.
 */
import tokens from "../../../design/tokens.json";

export { tokens };

export type Leaf<V = unknown> = { $value: V; $description?: string };

/** The leaf tokens of a group, in file order, skipping the $-metadata keys. */
export function leaves<V = unknown>(group: object): [string, Leaf<V>][] {
  return Object.entries(group).filter(
    (e): e is [string, Leaf<V>] =>
      !e[0].startsWith("$") && typeof e[1] === "object" && e[1] !== null && "$value" in e[1],
  );
}

export type TypeToken = {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight?: string;
  letterSpacing?: string;
  textCase?: "uppercase";
};

/** `{font.family.serif}` → the Tailwind class the app uses for that family. */
export function familyClass(alias: string): "font-serif" | "font-sans" {
  return alias.includes("serif") && !alias.includes("sans") ? "font-serif" : "font-sans";
}
