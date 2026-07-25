/**
 * Materials (/materials) — thin Server Component; reads the library and hands
 * it to the editor. The "Materials" nav tab points here.
 */
import { MaterialsEditor } from "@/components/MaterialsEditor";
import { listMaterials } from "@/lib/store";

export default function MaterialsPage() {
  return <MaterialsEditor initial={listMaterials()} />;
}
