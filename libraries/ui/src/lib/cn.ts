import { type CxOptions, cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

/** Arguments accepted by `cn` / CVA `cx` (strings, arrays, conditional objects, falsy). */
export type ClassValue = CxOptions[number];

/** Merge class names with Tailwind-aware conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(cx(inputs));
}
