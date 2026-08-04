/**
 * cn — the shadcn class-merge helper.
 *
 * clsx joins conditional class lists; tailwind-merge then resolves Tailwind
 * conflicts so the LAST utility wins (e.g. a caller's `bg-ink/14` overrides a
 * component's default `bg-primary`). This is what lets a shadcn component be
 * re-skinned by passing `className` without fighting specificity.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
