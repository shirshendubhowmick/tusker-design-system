import type { ElementContext, RunOptions } from "axe-core";

declare global {
  /** ADR-003 Layer 2 — registered in `src/test/setup.ts` (unit project only). */
  function expectNoA11yViolations(
    container: ElementContext,
    options?: RunOptions,
  ): Promise<void>;
}

export {};
