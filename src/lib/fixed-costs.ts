/**
 * The fixed-cost (business-cost) layer (PRD §6, §14). An optional depth layer:
 * when configured, each product carries a share of the monthly business costs,
 * producing a full cost and a real margin. When it isn't, everything runs on
 * direct cost.
 *
 * Never called "overhead" in the UI — always "business costs".
 *
 * Pure types + math, safe to import anywhere.
 */
export type FixedCostPeriod = "monthly" | "seasonal";

export type FixedCost = {
  id: string;
  label: string;
  amount: number;
  period: FixedCostPeriod;
  monthsActive: number; // used only for seasonal costs
};

export type AllocationMethod = "per-unit" | "bench-time";

/** How the total is spread. `volume` means units/month (per-unit) or
 *  labour-hours/month (bench-time). */
export type FixedCostConfig = { method: AllocationMethod; volume: number | null };

export const DEFAULT_FIXED_COST_CONFIG: FixedCostConfig = {
  method: "per-unit",
  volume: null,
};

/** A cost's monthly-equivalent amount. A seasonal cost is spread over the year. */
export function monthlyEquivalent(fc: FixedCost): number {
  return fc.period === "monthly" ? fc.amount : fc.amount * (fc.monthsActive / 12);
}

export function totalMonthlyFixed(costs: FixedCost[]): number {
  return costs.reduce((sum, fc) => sum + monthlyEquivalent(fc), 0);
}

/**
 * The per-piece business-cost share, or null when the layer isn't usable — no
 * costs, or no/zero volume (the /costs result is then blocked with a notice).
 */
export function fixedCostPerUnit(
  costs: FixedCost[],
  config: FixedCostConfig,
  productLabourHours: number,
): number | null {
  const total = totalMonthlyFixed(costs);
  if (total <= 0) return null;
  if (config.volume == null || config.volume <= 0) return null;

  if (config.method === "per-unit") return total / config.volume;
  // bench-time: weighted by how long this piece takes
  return (productLabourHours / config.volume) * total;
}
