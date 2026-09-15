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

// ── the guards ────────────────────────────────────────────────────────────

test("every @theme colour is in tokens.json, with the same value", () => {
  expect(new Map(themeColors)).toEqual(jsonColors);
});

test("the shadcn bridge (:root) matches the tokens.json shadcn group", () => {
  expect(new Map(rootVars)).toEqual(jsonShadcn);
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
