/**
 * Materials-library Server Actions. Each edits one material and revalidates the
 * library plus the product detail pages (whose autofill reads it). No redirect
 * — the screen edits in place. Store imported lazily to stay server-only.
 */
"use server";

import { revalidatePath } from "next/cache";
import type { LibraryMaterial } from "@/lib/materials";

export async function saveMaterialAction(material: LibraryMaterial): Promise<void> {
  const { saveMaterial } = await import("@/lib/store");
  await saveMaterial(material);
  revalidatePath("/materials");
  revalidatePath("/products/[id]", "page");
}

export async function deleteMaterialAction(id: string): Promise<void> {
  const { deleteMaterial } = await import("@/lib/store");
  await deleteMaterial(id);
  revalidatePath("/materials");
  revalidatePath("/products/[id]", "page");
}
