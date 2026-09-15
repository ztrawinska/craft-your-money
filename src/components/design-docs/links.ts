/**
 * Where the library points when it says "read the why" or "open the source".
 * The rationale lives in docs/, the code in src/; the library only links.
 */
const REPO = "https://github.com/ztrawinska/craft-your-money/blob/main";

/** A file in this repo, on GitHub. */
export const repo = (path: string) => `${REPO}/${path}`;

/** The design-system doc, the source of every rule shown here. */
export const DESIGN_SYSTEM_DOC = repo("docs/craft-your-money-design-system.md");

/** A shadcn/ui component page. */
export const shadcn = (slug: string) => `https://ui.shadcn.com/docs/components/${slug}`;
