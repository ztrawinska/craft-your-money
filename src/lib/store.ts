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
import { seedProducts } from "@/lib/seed";
import type { Product, ProductType } from "@/lib/products";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "products.json");

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
    targetMarginPct: 40,
    vatRatePct: 20,
    businessCostShare: null,
    materials: [],
    labour: [],
    otherCosts: [],
  };
  saveProduct(product);
  return product;
}
