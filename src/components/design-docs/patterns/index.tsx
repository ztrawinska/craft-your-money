/** slug → the pattern page. Slugs are declared in nav.ts. */
import type { ComponentType } from "react";
import { AntiPatternsDoc } from "./AntiPatterns";
import { CompositionDoc } from "./Composition";
import { VoiceDoc } from "./Voice";

export const PATTERN_DOCS: Record<string, ComponentType> = {
  composition: CompositionDoc,
  voice: VoiceDoc,
  "anti-patterns": AntiPatternsDoc,
};
