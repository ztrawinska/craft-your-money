import { redirect } from "next/navigation";
import { FOUNDATIONS } from "@/components/design-docs/nav";

export default function FoundationsIndex() {
  redirect(`/design/foundations/${FOUNDATIONS[0].slug}`);
}
