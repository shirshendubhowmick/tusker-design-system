import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    name: "@design-system/ui",
    // describe / it / expect / vi available without importing from "vitest".
    globals: true,
    // Token/helpers stay on Node; component tests opt into jsdom via file pragma.
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "scripts/**/*.test.ts"],
    setupFiles: ["./src/test/setup.ts"],
    passWithNoTests: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "html", "lcov"],
      reportsDirectory: "./coverage",
      // Token catalog + helpers. Codegen script is exercised via subprocess in
      // tests (not instrumented by v8), so it is omitted from coverage include.
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
  },
});
