/**
 * Guards design/tokens.json against src/app/globals.css.
 *
 * globals.css is the source of truth for tokens; tokens.json is an export of
 * it (for the live library at /design and for Figma variables). Two files can
 * drift, so this test turns "keep them in sync" from a convention into a
 * failing test (design system §6): every colour in the CSS @theme must exist
 * in the JSON with the same value, and vice versa; the shadcn bridge in :root
 * must match the JSON's shadcn group; the shared radius must agree.
 *
 * Run with: npm test
 */
import { readFileSync } from "node:fs";
import { test, expect } from "vitest";
import tokens from "../../design/tokens.json";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

// ── read the CSS ──────────────────────────────────────────────────────────

/** The body of the first `<selector> { … }` block whose header matches. */
function block(header: RegExp): string {
  const m = css.match(new RegExp(header.source + "\\s*\\{([^}]*)\\}"));
  if (!m) throw new Error(`No ${header} block in globals.css`);
  return m[1];
}

/** `--name: #hex;` declarations in a block, as name → HEX (upper-case). */
function hexVars(body: string, prefix = ""): Map<string, string> {
  const out = new Map<string, string>();
  const re = new RegExp(`--${prefix}([a-z0-9-]+)\\s*:\\s*(#[0-9a-fA-F]{6})\\b`, "g");
  for (const m of body.matchAll(re)) out.set(m[1], m[2].toUpperCase());
  return out;
}

const themeColors = hexVars(block(/@theme inline/), "color-");
const rootVars = hexVars(block(/:root/));

/**
 * `--spacing-<name>: 24px;` and `--spacing-<name>: var(--spacing-<other>);`
 * declarations in the @theme block. The scale is three tiers (§1.5): steps
 * carry a px value, sizes and roles alias another key. Returns name →
 * { px, alias } with the alias chain resolved to px.
 */
function spacingVars(body: string): Map<string, { px: string; alias?: string }> {
  const raw = new Map<string, string>();
  for (const m of body.matchAll(/--spacing-([a-z0-9-]+)\s*:\s*([^;]+);/g)) raw.set(m[1], m[2].trim());
  const resolve = (name: string, depth = 0): string => {
    const v = raw.get(name);
    if (!v) throw new Error(`--spacing-${name} is not defined in @theme`);
    if (depth > 5) throw new Error(`--spacing-${name}: alias loop`);
    const ref = v.match(/^var\(--spacing-([a-z0-9-]+)\)$/);
    return ref ? resolve(ref[1], depth + 1) : v;
  };
  const out = new Map<string, { px: string; alias?: string }>();
  for (const [name, v] of raw) {
    const ref = v.match(/^var\(--spacing-([a-z0-9-]+)\)$/);
    out.set(name, { px: resolve(name), alias: ref?.[1] });
  }
  return out;
}
const themeSpacing = spacingVars(block(/@theme inline/));

// ── read the JSON ─────────────────────────────────────────────────────────

type Group = Record<string, unknown>;

/** Flatten a DTCG group to "a-b-c" → $value, skipping the $-metadata keys. */
function flatten(group: Group, path: string[] = []): Map<string, unknown> {
  const out = new Map<string, unknown>();
  for (const [key, node] of Object.entries(group)) {
    if (key.startsWith("$")) continue;
    const next = [...path, key];
    if (node && typeof node === "object" && "$value" in (node as Group)) {
      out.set(next.join("-"), (node as Group).$value);
    } else if (node && typeof node === "object") {
      for (const [k, v] of flatten(node as Group, next)) out.set(k, v);
    }
  }
  return out;
}

const upper = (m: Map<string, unknown>) =>
  new Map([...m].map(([k, v]) => [k, String(v).toUpperCase()]));

const jsonColors = upper(flatten(tokens.color as Group));
const jsonShadcn = upper(flatten(tokens.shadcn as Group));
const jsonSpace = flatten(tokens.space as Group);

// ── the guards ────────────────────────────────────────────────────────────

test("the @theme spacing scale is closed, and its three tiers mirror tokens.json exactly", () => {
  // `--spacing: initial` switches off Tailwind's open multiplier, so p-2.5 and
  // p-7 no longer exist; every step in use must be declared.
  expect(block(/@theme inline/)).toMatch(/--spacing:\s*initial;/);

  // tokens.json says "tap-target"; the utility is the shorter `tap` (min-h-tap).
  const alias: Record<string, string> = { tap: "tap-target" };
  const toCss = (jsonName: string) => Object.entries(alias).find(([, j]) => j === jsonName)?.[0] ?? jsonName;

  // JSON leaves as leafName → { px (resolved), alias (leaf name of the {ref}) }.
  const raw = new Map<string, string>();
  for (const [k, v] of jsonSpace) raw.set(k.replace(/^(scale|size|role)-/, ""), String(v));
  const resolveJson = (name: string, depth = 0): string => {
    const v = raw.get(name);
    if (v === undefined) throw new Error(`tokens.json space has no leaf ${name}`);
    const ref = v.match(/^\{space\.(?:scale|size|role)\.([a-z0-9-]+)\}$/);
    return ref && depth < 5 ? resolveJson(ref[1], depth + 1) : v;
  };

  for (const [cssName, { px, alias: cssAlias }] of themeSpacing) {
    const jsonName = alias[cssName] ?? cssName;
    expect(raw.has(jsonName), `--spacing-${cssName} has no tokens.json space.* leaf`).toBe(true);
    expect(resolveJson(jsonName), cssName).toBe(px);
    // The relationship is mirrored, not just the number: a role that aliases a
    // size in CSS aliases the same size in JSON.
    const jsonAlias = raw.get(jsonName)!.match(/\{space\.[a-z]+\.([a-z0-9-]+)\}$/)?.[1];
    expect(jsonAlias, `${cssName} aliases ${cssAlias} in CSS`).toBe(cssAlias);
  }
  for (const jsonName of raw.keys()) {
    expect(themeSpacing.has(toCss(jsonName)), `tokens.json space leaf "${jsonName}" has no --spacing-* in @theme`).toBe(true);
  }
});

test("every @theme colour is in tokens.json, with the same value", () => {
  expect(new Map(themeColors)).toEqual(jsonColors);
});

test("the shadcn bridge (:root) matches the tokens.json shadcn group", () => {
  expect(new Map(rootVars)).toEqual(jsonShadcn);
});

test("the @theme radii are closed and mirror tokens.json radius exactly", () => {
  const theme = block(/@theme inline/);
  expect(theme).toMatch(/--radius-\*:\s*initial;/); // Tailwind's sm/md/lg/xl are gone
  const cssRadii = new Map<string, string>();
  for (const m of theme.matchAll(/--radius-([a-z0-9-]+)\s*:\s*([0-9.]+px)\b/g)) cssRadii.set(m[1], m[2]);
  const jsonRadii = new Map([...flatten(tokens.radius as Group)].map(([k, v]) => [k, String(v)]));
  expect(cssRadii).toEqual(jsonRadii);
  expect(css).not.toMatch(/--radius-(sm|md|lg|xl)\s*:/); // the shadcn bridge no longer redefines them
});

test("the @theme type presets are closed and mirror tokens.json type exactly", () => {
  const theme = block(/@theme inline/);
  expect(theme).toMatch(/--text-\*:\s*initial;/); // Tailwind's xs…9xl are gone
  // --text-<name>: 14px; --text-<name>--line-height: 20px; --text-<name>--font-weight: 400; --text-<name>--letter-spacing: 0.2em;
  const css = new Map<string, { fontSize: string; lineHeight?: string; fontWeight?: number; letterSpacing?: string }>();
  for (const m of theme.matchAll(/--text-([a-z0-9-]+?)(?:--(line-height|font-weight|letter-spacing))?\s*:\s*([^;]+);/g)) {
    const [, name, sub, raw] = m;
    const v = raw.trim();
    const cur = css.get(name) ?? { fontSize: "" };
    if (!sub) cur.fontSize = v;
    else if (sub === "line-height") cur.lineHeight = v;
    else if (sub === "font-weight") cur.fontWeight = Number(v);
    else cur.letterSpacing = v;
    css.set(name, cur);
  }
  const json = new Map<string, Record<string, unknown>>();
  for (const [k, v] of Object.entries(tokens.type as Group)) {
    if (k.startsWith("$")) continue;
    const { fontSize, lineHeight, fontWeight, letterSpacing } = (v as Group).$value as Record<string, unknown>;
    json.set(k, { fontSize, lineHeight, fontWeight, ...(letterSpacing ? { letterSpacing } : {}) });
  }
  expect([...css.keys()].sort()).toEqual([...json.keys()].sort());
  for (const [name, j] of json) expect(css.get(name), name).toEqual(j);
  // every line box sits on the 4pt grid (§1.4)
  for (const [name, c] of css) expect(Number.parseFloat(c.lineHeight ?? "0") % 4, `${name} line box`).toBe(0);
});

test("shadcn --radius is the button radius", () => {
  const rem = css.match(/--radius:\s*([\d.]+)rem/);
  expect(rem).not.toBeNull();
  expect(`${Number(rem![1]) * 16}px`).toBe(tokens.radius.button.$value);
});

test("every {alias} in tokens.json points at a token that exists", () => {
  const all = flatten(tokens as unknown as Group);
  const paths = new Set([...all.keys()].map((k) => k));
  const aliases = JSON.stringify(tokens).match(/\{[a-z0-9.-]+\}/g) ?? [];
  for (const a of aliases) {
    const key = a.slice(1, -1).split(".").join("-");
    expect(paths.has(key), `unresolved alias ${a}`).toBe(true);
  }
});
