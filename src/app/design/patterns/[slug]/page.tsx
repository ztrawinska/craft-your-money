/** /design/patterns/<slug>: one pattern per page, from the registry. */
import { notFound } from "next/navigation";
import { DocFooter } from "@/components/design-docs/DocFooter";
import { PATTERNS } from "@/components/design-docs/nav";
import { PATTERN_DOCS } from "@/components/design-docs/patterns";

export function generateStaticParams() {
  return PATTERNS.map(({ slug }) => ({ slug }));
}

export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const Doc = PATTERN_DOCS[slug];
  if (!Doc) notFound();
  return (
    <>
      <Doc />
      <DocFooter href={`/design/patterns/${slug}`} />
    </>
  );
}
