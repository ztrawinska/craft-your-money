/**
 * Server Actions for products — the only way the client mutates data. They run
 * on the server, write through the store, revalidate the pages that show
 * products, and navigate.
 */
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Product, ProductType } from "@/lib/products";

// The store uses node:fs. A client component imports these actions, so we load
// the store LAZILY here — a static import would pull fs into the client bundle
// ("require is not defined"). The dynamic import only runs server-side, at call
// time.

function revalidateProduct(id: string) {
  revalidatePath("/products");
  revalidatePath("/dashboard");
  revalidatePath(`/products/${id}`);
}

/** Persist the editor's current state, then return to the overview. */
export async function saveProductAction(product: Product): Promise<void> {
  const { saveProduct } = await import("@/lib/store");
  saveProduct(product);
  revalidateProduct(product.id);
  redirect("/products");
}

/** Create a name-only draft (PRD §5) and open it for costing. */
export async function createProductAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "Other") as ProductType;
  if (!name) return; // the form marks name required; this guards direct posts

  const { createDraft } = await import("@/lib/store");
  const product = createDraft(name, type);
  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect(`/products/${product.id}`);
}

// ── the ⋯ menu actions (product-actions spec) ─────────────────────────────

/** A full copy as a new draft; opens it to edit. */
export async function duplicateProductAction(id: string): Promise<void> {
  const { duplicateProduct } = await import("@/lib/store");
  const copy = duplicateProduct(id);
  revalidatePath("/products");
  if (copy) redirect(`/products/${copy.id}`);
}

/** Stop making it — keeps the record, leaves the overview and metrics. */
export async function archiveProductAction(id: string): Promise<void> {
  const { setArchived } = await import("@/lib/store");
  setArchived(id, true);
  revalidateProduct(id);
  redirect("/products");
}

export async function restoreProductAction(id: string): Promise<void> {
  const { setArchived } = await import("@/lib/store");
  setArchived(id, false);
  revalidateProduct(id);
}

/** Remove permanently. */
export async function deleteProductAction(id: string): Promise<void> {
  const { deleteProduct } = await import("@/lib/store");
  deleteProduct(id);
  revalidateProduct(id);
  redirect("/products");
}
