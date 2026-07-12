import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type ViteUserConfig, defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Storybook + axe project for one color mode.
 *
 * Theme is pinned in this config via Vite `define` →
 * `import.meta.env.STORYBOOK_TEST_THEME`, which `.storybook/preview.tsx` reads.
 * No shell env vars required.
 */
function storybookProject(theme: "light" | "dark"): ViteUserConfig {
  return {
    define: {
      "import.meta.env.STORYBOOK_TEST_THEME": JSON.stringify(theme),
    },
    plugins: [
      react(),
      tailwindcss(),
      storybookTest({
        configDir: path.join(dirname, ".storybook"),
        storybookScript: "pnpm storybook --no-open",
      }),
    ],
    test: {
      name: `storybook-${theme}`,
      // // One story file at a time: parallel browser pages OOM constrained hosts.
      // fileParallelism: false,
      browser: {
        enabled: true,
        headless: true,
        provider: playwright({
          launchOptions: {
            args: ["--disable-dev-shm-usage"],
          },
        }),
        // Unique instance name per theme — Vitest forbids two bare "chromium" instances.
        instances: [{ browser: "chromium", name: `chromium-${theme}` }],
      },
    },
  };
}

/**
 * Projects:
 * 1. unit — token/component tests (node + jsdom)
 * 2–3. storybook-light / storybook-dark — stories + axe (ADR-003 Layer 1)
 */
export default defineConfig({
  test: {
    passWithNoTests: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: [
        "src/utils/**/*.{ts,tsx}",
        "src/tokens/**/*.{ts,tsx}",
        "src/components/**/*.{ts,tsx}",
      ],
      exclude: [
        "**/*.{test,spec}.{ts,tsx}",
        "**/index.ts",
        "src/**/*.d.ts",
        "src/tokens/**/*.css",
        "src/styles/**",
        "src/test/**",
        "scripts/**",
        "stories/**",
        "dist/**",
        "node_modules/**",
      ],
    },
    projects: [
      {
        plugins: [react()],
        test: {
          name: "unit",
          globals: true,
          environment: "node",
          include: [
            "src/**/*.test.ts",
            "src/**/*.test.tsx",
            "scripts/**/*.test.ts",
          ],
          setupFiles: ["./src/test/setup.ts"],
        },
      },
      storybookProject("light"),
      storybookProject("dark"),
    ],
  },
});
