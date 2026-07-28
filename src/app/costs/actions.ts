/**
 * Business-costs Server Actions. Editing the fixed-cost layer or its allocation
 * ripples into every product's full cost, margin and status — so each action
 * revalidates the overview, dashboard and detail pages too. Store imported
 * lazily to stay server-only.
 */
"use server";

import { revalidatePath } from "next/cache";
import type { FixedCost, FixedCostConfig } from "@/lib/fixed-costs";

function revalidateEverywhere() {
  revalidatePath("/costs");
  revalidatePath("/products");
  revalidatePath("/dashboard");
  revalidatePath("/products/[id]", "page");
}

export async function saveFixedCostAction(cost: FixedCost): Promise<void> {
  const { saveFixedCost } = await import("@/lib/store");
  saveFixedCost(cost);
  revalidateEverywhere();
}

export async function deleteFixedCostAction(id: string): Promise<void> {
  const { deleteFixedCost } = await import("@/lib/store");
  deleteFixedCost(id);
  revalidateEverywhere();
}

export async function saveFixedCostConfigAction(config: FixedCostConfig): Promise<void> {
  const { saveFixedCostConfig } = await import("@/lib/store");
  saveFixedCostConfig(config);
  revalidateEverywhere();
}
