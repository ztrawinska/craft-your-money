/**
 * Settings (/settings) — a thin Server Component that reads the account
 * settings and hands them to the interactive form. Reached from the dashboard
 * avatar (Settings is not a nav tab, §2.10).
 */
import { SettingsForm } from "@/components/SettingsForm";
import { getSettings } from "@/lib/store";

// Reads the mutable store (the saved settings), so it must always render fresh.
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  return <SettingsForm initial={await getSettings()} />;
}
