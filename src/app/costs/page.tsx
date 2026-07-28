/**
 * Business costs (/costs) — thin Server Component. Reads the fixed-cost layer
 * and picks a real product (one with labour) as the bench-time example. The
 * "Costs" nav tab points here.
 */
import { CostsEditor } from "@/components/CostsEditor";
import { productLabourHours } from "@/lib/products";
import { getFixedCostConfig, getFixedCosts, listProducts } from "@/lib/store";

export default function CostsPage() {
  const example = listProducts().find((p) => p.labour.length > 0) ?? null;
  const sample = example
    ? { name: example.name, labourHours: productLabourHours(example) }
    : null;

  return (
    <CostsEditor
      initialCosts={getFixedCosts()}
      initialConfig={getFixedCostConfig()}
      sample={sample}
    />
  );
}
