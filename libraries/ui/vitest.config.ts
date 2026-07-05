import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@design-system/ui',
    environment: 'node',
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    // Token helpers and codegen are pure Node; no DOM needed.
    passWithNoTests: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html', 'lcov'],
      reportsDirectory: './coverage',
      // Token catalog + helpers. Codegen script is exercised via subprocess in
      // tests (not instrumented by v8), so it is omitted from coverage include.
      include: ['src/lib/**/*.{ts,tsx}', 'src/tokens/**/*.{ts,tsx}'],
      exclude: [
        '**/*.{test,spec}.{ts,tsx}',
        '**/index.ts',
        'src/**/*.d.ts',
        'src/tokens/**/*.css',
        'src/styles/**',
        'scripts/**',
        'stories/**',
        'dist/**',
        'node_modules/**',
      ],
    },
  },
});
