import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Two Vitest projects:
 * 1. unit — existing token/component tests (node + jsdom via pragma)
 * 2. storybook — portable stories in Playwright Chromium + axe (ADR-003 Layer 1)
 */
export default defineConfig({
  test: {
    // Root-level defaults shared when projects set `extends: true` carefully;
    // each project sets its own name/environment so they stay isolated.
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
          // describe / it / expect / vi available without importing from "vitest".
          globals: true,
          // Token/helpers stay on Node; component tests opt into jsdom via file pragma.
          environment: "node",
          include: [
            "src/**/*.test.ts",
            "src/**/*.test.tsx",
            "scripts/**/*.test.ts",
          ],
          setupFiles: ["./src/test/setup.ts"],
        },
      },
      {
        // Storybook project needs the same Vite plugins as Storybook (Tailwind).
        plugins: [
          react(),
          tailwindcss(),
          // Transforms stories into Vitest tests; injects a11y checks from addon-a11y.
          // See: https://storybook.js.org/docs/writing-tests/integrations/vitest-addon
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
            // Used for failure links in watch mode; CI does not need Storybook running.
            storybookScript: "pnpm storybook --no-open",
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({
              // Docker/devcontainers default /dev/shm to 64MB; Chromium exhausts
              // it and the page crashes ("Browser connection was closed").
              // Route its shared memory to /tmp instead. Harmless on CI runners.
              launchOptions: {
                args: ["--disable-dev-shm-usage"],
              },
            }),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
