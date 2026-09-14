/** slug → the foundation's doc page. Slugs are declared in nav.ts. */
import type { ComponentType } from "react";
import { ColourDoc } from "./Colour";
import { InkDoc } from "./Ink";
import { LinesDoc } from "./Lines";
import { RadiiDoc } from "./Radii";
import { ShadcnDoc } from "./Shadcn";
import { SpacingDoc } from "./Spacing";
import { TypographyDoc } from "./Typography";

export const FOUNDATION_DOCS: Record<string, ComponentType> = {
  colour: ColourDoc,
  ink: InkDoc,
  typography: TypographyDoc,
  spacing: SpacingDoc,
  radii: RadiiDoc,
  lines: LinesDoc,
  shadcn: ShadcnDoc,
};
