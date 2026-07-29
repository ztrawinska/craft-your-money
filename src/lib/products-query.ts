/**
 * Builds the overview URL for a status + type filter combination, so the two
 * filters compose (picking a type keeps the status, and vice versa). Pure and
 * client-safe. "all"/empty values are dropped so the URL stays clean.
 */
export function productsHref(params: { status?: string; type?: string }): string {
  const q = new URLSearchParams();
  if (params.status && params.status !== "all") q.set("status", params.status);
  if (params.type && params.type !== "all") q.set("type", params.type);
  const s = q.toString();
  return s ? `/products?${s}` : "/products";
}
