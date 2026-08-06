/**
 * The product store — where the data actually lives. Server-only.
 *
 * It talks to ONE async key/value interface (`load`/`save`) with two backends,
 * chosen at import time by the environment:
 *
 * - **Redis (Upstash / Vercel KV)** in production — a writable, shared store.
 *   Serverless filesystems are read-only, so the old file store threw on every
 *   save once deployed. Redis is picked whenever its REST credentials are set.
 * - **A JSON file under .data/** for local development — zero setup, and it
 *   keeps local edits off the production data. Picked when there are no Redis
 *   credentials.
 *
 * Everything above the two helpers is backend-agnostic: each collection is one
 * JSON blob under a stable key (products / settings / materials / costs), read
 * whole and written whole — the same simple shape as before, now async because
 * a network store can't be synchronous. Swapping to a real relational schema
 * later still only touches this file.
 *
 * The "node:fs" import keeps this server-only by construction: a client bundle
 * that tried to include it would fail to build.
 */
import fs from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";
import { seedFixedCostConfig, seedFixedCosts, seedMaterials, seedProducts } from "@/lib/seed";
import type { FixedCost, FixedCostConfig } from "@/lib/fixed-costs";
import type { LibraryMaterial } from "@/lib/materials";
import type { Product, ProductType } from "@/lib/products";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/settings";

// ── backend selection ───────────────────────────────────────────────────────
// The Vercel↔Upstash integration injects KV_REST_API_*; a bare Upstash project
// uses UPSTASH_REDIS_REST_*. Accept either so it works however the store was
// provisioned. No credentials → the file backend (local dev).
const REDIS_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = REDIS_URL && REDIS_TOKEN ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN }) : null;

type StoreKey = "products" | "settings" | "materials" | "costs";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE_FOR: Record<StoreKey, string> = {
  products: "products.json",
  settings: "settings.json",
  materials: "materials.json",
  costs: "costs.json",
};

/**
 * Read a collection. On first read the key is empty, so we seed it (and persist
 * the seed) so later reads and writes share one baseline. Any backend error
 * degrades to the in-memory seed rather than crashing a page render.
 */
async function load<T>(key: StoreKey, seed: T): Promise<T> {
  try {
    if (redis) {
      const value = await redis.get<T>(key);
      if (value == null) {
        await redis.set(key, seed);
        return seed;
      }
      return value;
    }
    const file = path.join(DATA_DIR, FILE_FOR[key]);
    if (!fs.existsSync(file)) {
      await save(key, seed);
      return seed;
    }
    return JSON.parse(fs.readFileSync(file, "utf8")) as T;
  } catch {
    return seed;
  }
}

/** Write a collection whole. */
async function save<T>(key: StoreKey, value: T): Promise<void> {
  if (redis) {
    await redis.set(key, value);
    return;
  }
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, FILE_FOR[key]), JSON.stringify(value, null, 2));
}

// ── products ────────────────────────────────────────────────────────────────

export async function listProducts(): Promise<Product[]> {
  return load("products", seedProducts);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return (await listProducts()).find((p) => p.id === id);
}

/** Insert or replace a product by id. */
export async function saveProduct(product: Product): Promise<void> {
  const all = await listProducts();
  const i = all.findIndex((p) => p.id === product.id);
  if (i >= 0) all[i] = product;
  else all.push(product);
  await save("products", all);
}

export async function deleteProduct(id: string): Promise<void> {
  const all = await listProducts();
  await save(
    "products",
    all.filter((p) => p.id !== id),
  );
}

export async function setArchived(id: string, archived: boolean): Promise<void> {
  const p = await getProduct(id);
  if (p) await saveProduct({ ...p, archived });
}

/** A full copy, saved as a new draft named "… (copy)" (product-actions spec). */
export async function duplicateProduct(id: string): Promise<Product | undefined> {
  const p = await getProduct(id);
  if (!p) return undefined;
  const copy: Product = {
    ...p,
    id: `${slugify(p.name)}-${Date.now().toString(36)}`,
    name: `${p.name} (copy)`,
    workflow: "draft",
    archived: false,
    materials: p.materials.map((m) => ({ ...m })),
    labour: p.labour.map((l) => ({ ...l })),
    otherCosts: p.otherCosts.map((o) => ({ ...o })),
    benchmark: (p.benchmark ?? []).map((b) => ({ ...b })),
  };
  await saveProduct(copy);
  return copy;
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "product"
  );
}

/**
 * A new product is a valid placeholder draft the moment it has a name (PRD §5).
 * Target margin / VAT default to the sample account's settings (there's no
 * Settings model yet — see §14).
 */
export async function createDraft(name: string, type: ProductType): Promise<Product> {
  const product: Product = {
    id: `${slugify(name)}-${Date.now().toString(36)}`,
    name: name.trim(),
    type,
    workflow: "draft",
    finalPrice: null,
    materials: [],
    labour: [],
    otherCosts: [],
    benchmark: [],
  };
  await saveProduct(product);
  return product;
}

// ── account settings ──────────────────────────────────────────────────────

export async function getSettings(): Promise<Settings> {
  // spread over defaults so a new field added later still has a value
  return { ...DEFAULT_SETTINGS, ...(await load("settings", DEFAULT_SETTINGS)) };
}

export async function saveSettings(s: Settings): Promise<void> {
  await save("settings", s);
}

// ── materials library ───────────────────────────────────────────────────────

export async function listMaterials(): Promise<LibraryMaterial[]> {
  return load("materials", seedMaterials);
}

export async function saveMaterial(material: LibraryMaterial): Promise<void> {
  const all = await listMaterials();
  const i = all.findIndex((m) => m.id === material.id);
  if (i >= 0) all[i] = material;
  else all.push(material);
  await save("materials", all);
}

export async function deleteMaterial(id: string): Promise<void> {
  const all = await listMaterials();
  await save(
    "materials",
    all.filter((m) => m.id !== id),
  );
}

// ── fixed / business costs ──────────────────────────────────────────────────

type CostsFile = { costs: FixedCost[]; config: FixedCostConfig };
const seedCosts: CostsFile = { costs: seedFixedCosts, config: seedFixedCostConfig };

async function readCosts(): Promise<CostsFile> {
  return load("costs", seedCosts);
}

export async function getFixedCosts(): Promise<FixedCost[]> {
  return (await readCosts()).costs;
}

export async function getFixedCostConfig(): Promise<FixedCostConfig> {
  return (await readCosts()).config;
}

export async function saveFixedCost(cost: FixedCost): Promise<void> {
  const data = await readCosts();
  const i = data.costs.findIndex((c) => c.id === cost.id);
  if (i >= 0) data.costs[i] = cost;
  else data.costs.push(cost);
  await save("costs", data);
}

export async function deleteFixedCost(id: string): Promise<void> {
  const data = await readCosts();
  await save("costs", { ...data, costs: data.costs.filter((c) => c.id !== id) });
}

export async function saveFixedCostConfig(config: FixedCostConfig): Promise<void> {
  await save("costs", { ...(await readCosts()), config });
}
