/**
 * The library's sidebar tree, Storybook-style: Overview, then Foundations,
 * Components (grouped atoms → molecules → sheets and chrome) and Patterns.
 * One entry per page. The two registries (foundations/, components/) map the
 * same slugs to the page content, and the routes build their static params
 * from here, so adding a page means adding it once, in this file.
 */
export type NavItem = { slug: string; name: string };
export type NavGroup = { name: string; base: string; items: NavItem[] };

export const FOUNDATIONS: NavItem[] = [
  { slug: "colour", name: "Colour" },
  { slug: "ink", name: "Ink ladder" },
  { slug: "typography", name: "Typography" },
  { slug: "spacing", name: "Spacing" },
  { slug: "radii", name: "Radii" },
  { slug: "lines", name: "Lines" },
  { slug: "shadows", name: "Shadows" },
  { slug: "shadcn", name: "shadcn bridge" },
];

export const COMPONENT_GROUPS: { name: string; items: NavItem[] }[] = [
  {
    name: "Atoms",
    items: [
      { slug: "glint", name: "Glint" },
      { slug: "chip", name: "Chip" },
      { slug: "button", name: "Button" },
      { slug: "price", name: "Price" },
      { slug: "section-label", name: "SectionLabel" },
      { slug: "input", name: "Input" },
      { slug: "combobox", name: "Combobox" },
      { slug: "switch", name: "Switch" },
      { slug: "dropdown", name: "Dropdown" },
    ],
  },
  {
    name: "Molecules",
    items: [
      { slug: "radio-cards", name: "RadioCards" },
      { slug: "tinted-band", name: "TintedBand" },
      { slug: "framed-surface", name: "FramedSurface" },
      { slug: "list-row", name: "ListRow" },
      { slug: "collapse", name: "Collapse" },
      { slug: "inline-form", name: "Inline form" },
      { slug: "assistant-slot", name: "AssistantSlot" },
    ],
  },
  {
    name: "Sheets and chrome",
    items: [
      { slug: "action-sheet", name: "ActionSheet" },
      { slug: "iris-sheet", name: "IrisSheet" },
      { slug: "bottom-nav", name: "BottomNav" },
    ],
  },
  {
    name: "Screen-level",
    items: [{ slug: "screens", name: "In the app" }],
  },
];

export const COMPONENTS: NavItem[] = COMPONENT_GROUPS.flatMap((g) => g.items);

export const PATTERNS: NavItem[] = [
  { slug: "composition", name: "Composition" },
  { slug: "voice", name: "Voice and copy" },
  { slug: "anti-patterns", name: "Anti-patterns" },
];

/** The full tree, in sidebar order. */
export const NAV: NavGroup[] = [
  { name: "Foundations", base: "/design/foundations", items: FOUNDATIONS },
  ...COMPONENT_GROUPS.map((g) => ({ name: g.name, base: "/design/components", items: g.items })),
  { name: "Patterns", base: "/design/patterns", items: PATTERNS },
];

/** Previous / next page across the whole tree, for the footer links. */
export function neighbours(href: string): { prev?: { name: string; href: string }; next?: { name: string; href: string } } {
  const flat = NAV.flatMap((g) => g.items.map((i) => ({ name: i.name, href: `${g.base}/${i.slug}` })));
  const i = flat.findIndex((p) => p.href === href);
  return { prev: i > 0 ? flat[i - 1] : undefined, next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : undefined };
}
