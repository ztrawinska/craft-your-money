/**
 * The product store — where the data actually lives. Server-only: it reads and
 * writes a JSON file under .data/, seeded from seed.ts on first run. Importing
 * "node:fs" keeps this out of any client bundle by construction.
 *
 * This is deliberately the simplest thing that persists: one file, read fresh
 * each call, written whole on save. A real database is the production path
 * (post-MVP) — the screens only ever call these four functions, so swapping the
 * backend later touches nothing else.
 *
 * The "node:fs" import keeps this server-only by construction: a client bundle
 * that tried to include it would fail to build.
 */
import fs from "node:fs";
import path from "node:path";
import { seedMaterials, seedProducts } from "@/lib/seed";
import type { LibraryMaterial } from "@/lib/materials";
import type { Product, ProductType } from "@/lib/products";
import { DEFAULT_SETTINGS, type Settings } from "@/lib/settings";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "products.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const MATERIALS_FILE = path.join(DATA_DIR, "materials.json");

function readAll(): Product[] {
  try {
    if (!fs.existsSync(FILE)) {
      writeAll(seedProducts);
      return seedProducts;
    }
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as Product[];
  } catch {
    return seedProducts;
  }
}

function writeAll(products: Product[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(products, null, 2));
}

export function listProducts(): Product[] {
  return readAll();
}

export function getProduct(id: string): Product | undefined {
  return readAll().find((p) => p.id === id);
}

/** Insert or replace a product by id. */
export function saveProduct(product: Product): void {
  const all = readAll();
  const i = all.findIndex((p) => p.id === product.id);
  if (i >= 0) all[i] = product;
  else all.push(product);
  writeAll(all);
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
export function createDraft(name: string, type: ProductType): Product {
  const product: Product = {
    id: `${slugify(name)}-${Date.now().toString(36)}`,
    name: name.trim(),
    type,
    workflow: "draft",
    finalPrice: null,
    businessCostShare: null,
    materials: [],
    labour: [],
    otherCosts: [],
  };
  saveProduct(product);
  return product;
}

// ── account settings ──────────────────────────────────────────────────────

export function getSettings(): Settings {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      writeSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    // spread over defaults so a new field added later still has a value
    return { ...DEFAULT_SETTINGS, ...JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8")) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeSettings(s: Settings): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(s, null, 2));
}

export function saveSettings(s: Settings): void {
  writeSettings(s);
}

// ── materials library ───────────────────────────────────────────────────────

function readMaterials(): LibraryMaterial[] {
  try {
    if (!fs.existsSync(MATERIALS_FILE)) {
      writeMaterials(seedMaterials);
      return seedMaterials;
    }
    return JSON.parse(fs.readFileSync(MATERIALS_FILE, "utf8")) as LibraryMaterial[];
  } catch {
    return seedMaterials;
  }
}

function writeMaterials(materials: LibraryMaterial[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(MATERIALS_FILE, JSON.stringify(materials, null, 2));
}

export function listMaterials(): LibraryMaterial[] {
  return readMaterials();
}

export function saveMaterial(material: LibraryMaterial): void {
  const all = readMaterials();
  const i = all.findIndex((m) => m.id === material.id);
  if (i >= 0) all[i] = material;
  else all.push(material);
  writeMaterials(all);
}

export function deleteMaterial(id: string): void {
  writeMaterials(readMaterials().filter((m) => m.id !== id));
}
