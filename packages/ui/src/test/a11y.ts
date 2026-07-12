import axe from "axe-core";

/**
 * ADR-003 Layer 2 — axe in jsdom unit tests.
 *
 * Independent structural/ARIA oracle (not author-intent asserts).
 * Color contrast needs a real layout engine → Layer 1 / Layer 3.
 */

/** Rules that require computed styles / layout — unreliable or empty in jsdom. */
const JSDOM_RULE_OVERRIDES: NonNullable<axe.RunOptions["rules"]> = {
  "color-contrast": { enabled: false },
  "link-in-text-block": { enabled: false },
};

function formatViolations(violations: axe.Result[]): string {
  return violations
    .map((violation) => {
      const nodes = violation.nodes
        .map((node) => {
          const summary = node.failureSummary?.replace(/\n/g, "\n    ") ?? "";
          return `  - ${node.html}${summary ? `\n    ${summary}` : ""}`;
        })
        .join("\n");
      return `[${violation.id}] ${violation.help} (${violation.impact ?? "unknown"})\n  ${violation.helpUrl}\n${nodes}`;
    })
    .join("\n\n");
}

/**
 * Run axe-core against a Testing Library container (or any Element).
 * Fails the test with a readable violation dump when anything is found.
 */
export async function expectNoA11yViolations(
  container: axe.ElementContext,
  options?: axe.RunOptions,
): Promise<void> {
  const results = await axe.run(container, {
    ...options,
    rules: {
      ...JSDOM_RULE_OVERRIDES,
      ...options?.rules,
    },
  });

  if (results.violations.length === 0) return;

  throw new Error(
    `Expected no accessibility violations; found ${results.violations.length}:\n\n${formatViolations(results.violations)}`,
  );
}
