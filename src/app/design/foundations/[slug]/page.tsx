/** /design/foundations/<slug>: one foundation per page, from the registry. */
import { notFound } from "next/navigation";
import { DocFooter } from "@/components/design-docs/DocFooter";
import { FOUNDATION_DOCS } from "@/components/design-docs/foundations";
import { FOUNDATIONS } from "@/components/design-docs/nav";

export function generateStaticParams() {
  return FOUNDATIONS.map(({ slug }) => ({ slug }));
}

export default async function FoundationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const Doc = FOUNDATION_DOCS[slug];
  if (!Doc) notFound();
  return (
    <>
      <Doc />
      <DocFooter href={`/design/foundations/${slug}`} />
    </>
  );
}
