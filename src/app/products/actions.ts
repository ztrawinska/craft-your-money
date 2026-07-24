/**
 * Server Actions for products — the only way the client mutates data. They run
 * on the server, write through the store, revalidate the pages that show
 * products, and navigate.
 */
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Product, ProductType } from "@/lib/products";
import { createDraft, saveProduct } from "@/lib/store";

function revalidateProduct(id: string) {
  revalidatePath("/products");
  revalidatePath("/dashboard");
  revalidatePath(`/products/${id}`);
}

/** Persist the editor's current state, then return to the overview. */
export async function saveProductAction(product: Product): Promise<void> {
  saveProduct(product);
  revalidateProduct(product.id);
  redirect("/products");
}

/** Create a name-only draft (PRD §5) and open it for costing. */
export async function createProductAction(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "Other") as ProductType;
  if (!name) return; // the form marks name required; this guards direct posts

  const product = createDraft(name, type);
  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect(`/products/${product.id}`);
}
