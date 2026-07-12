import "@testing-library/jest-dom/vitest";

import { expectNoA11yViolations } from "./a11y";

/**
 * Unit-project globals (vitest `globals: true` + this setup file):
 * - jest-dom matchers on `expect` (`toBeInTheDocument`, …)
 * - ADR-003 Layer 2: `expectNoA11yViolations(container)` (structural axe in jsdom)
 *
 * Storybook browser projects do not load this file — they use Layer 1 story axe.
 */
Object.assign(globalThis, { expectNoA11yViolations });
