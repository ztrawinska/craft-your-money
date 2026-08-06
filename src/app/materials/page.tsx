/**
 * Materials (/materials) — thin Server Component; reads the library and hands
 * it to the editor. The "Materials" nav tab points here.
 */
import { MaterialsEditor } from "@/components/MaterialsEditor";
import { listMaterials } from "@/lib/store";

// Reads the mutable store, so it must never be prerendered/cached at build —
// otherwise a saved material or a currency change wouldn't show until something
// happened to revalidate this exact path.
export const dynamic = "force-dynamic";

export default async function MaterialsPage() {
  return <MaterialsEditor initial={await listMaterials()} />;
}
