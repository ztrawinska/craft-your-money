/** /design/components/<slug>: one component per page, from the registry. */
import { notFound } from "next/navigation";
import { COMPONENT_DOCS } from "@/components/design-docs/components";
import { DocFooter } from "@/components/design-docs/DocFooter";
import { COMPONENTS } from "@/components/design-docs/nav";

export function generateStaticParams() {
  return COMPONENTS.map(({ slug }) => ({ slug }));
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const Doc = COMPONENT_DOCS[slug];
  if (!Doc) notFound();
  return (
    <>
      <Doc />
      <DocFooter href={`/design/components/${slug}`} />
    </>
  );
}
