/**
 * The materials library (PRD §14) — reusable materials with a unit cost and an
 * optional stock layer. Separate from a product's own ProductMaterial lines:
 * a product keeps its own cost copy, so deleting a library material is safe and
 * never changes a saved product.
 *
 * Pure types + display helpers, safe to import anywhere.
 */
import { formatMoney, GBP_CUR, type Cur } from "@/lib/currency";

export type LibraryMaterial = {
  id: string;
  name: string;
  unit: string; // "g", "cm", "pair", or "" for a plain count
  unitCost: number;
  stock: number | null; // optional; null = not tracked (a ghost hint in the UI)
};

/** "£0.62 / g" · "£6.50 each" — the unit-cost line. */
export function materialUnitLabel(
  m: Pick<LibraryMaterial, "unit" | "unitCost">,
  cur: Cur = GBP_CUR,
): string {
  const u = m.unit.trim();
  const each = formatMoney(m.unitCost, cur);
  return u ? `${each} / ${u}` : `${each} each`;
}

/** "120g in stock" · "no stock tracked". */
export function materialStockLabel(m: Pick<LibraryMaterial, "unit" | "stock">): string {
  if (m.stock == null) return "no stock tracked";
  const u = m.unit.trim();
  return `${m.stock}${u} in stock`;
}
