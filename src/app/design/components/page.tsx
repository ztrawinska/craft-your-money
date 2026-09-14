import { redirect } from "next/navigation";
import { COMPONENTS } from "@/components/design-docs/nav";

export default function ComponentsIndex() {
  redirect(`/design/components/${COMPONENTS[0].slug}`);
}
