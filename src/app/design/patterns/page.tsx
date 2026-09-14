import { redirect } from "next/navigation";
import { PATTERNS } from "@/components/design-docs/nav";

export default function PatternsIndex() {
  redirect(`/design/patterns/${PATTERNS[0].slug}`);
}
