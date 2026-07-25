/**
 * Settings Server Action. Persists account settings, then revalidates every
 * screen that reads them (their numbers all ripple) and returns to the
 * dashboard. The store is imported lazily so its node:fs stays server-only.
 */
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Settings } from "@/lib/settings";

export async function saveSettingsAction(settings: Settings): Promise<void> {
  const { saveSettings } = await import("@/lib/store");
  saveSettings(settings);
  revalidatePath("/products");
  revalidatePath("/dashboard");
  revalidatePath("/settings");
  revalidatePath("/products/[id]", "page");
  redirect("/dashboard");
}
