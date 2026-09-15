import { redirect } from "next/navigation";

/** The tokens used to live on one page; they are now under /design/foundations. */
export default function TokensRedirect() {
  redirect("/design/foundations/colour");
}
