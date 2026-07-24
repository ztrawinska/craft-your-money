/**
 * Product Detail (/products/[id]) — a thin Server Component: it looks the
 * product up by the route segment and hands it to the interactive editor.
 * All behaviour (cost entry, the pricing decision) lives in ProductEditor.
 */
import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/ProductEditor";
import { getProduct } from "@/lib/store";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return <ProductEditor product={product} />;
}
