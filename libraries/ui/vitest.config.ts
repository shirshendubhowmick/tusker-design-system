import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@design-system/ui',
    environment: 'node',
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
    // Token helpers and codegen are pure Node; no DOM needed.
    passWithNoTests: false,
  },
});
