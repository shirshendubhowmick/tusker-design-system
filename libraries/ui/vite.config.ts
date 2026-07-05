import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import { fileURLToPath, URL } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const src = (rel: string) => fileURLToPath(new URL(rel, import.meta.url));

/** Storybook loads this file for the preview pipeline. */
const isStorybook = process.argv[1]?.includes('storybook') ?? false;

/**
 * Build modes (single config file):
 * - default / `lib`  → tree-shakeable JS under dist/
 * - `styles`         → design-system.css only (vite build --mode styles)
 * - Storybook        → preview plugins only (no lib build options)
 */
type BuildKind = 'storybook' | 'styles' | 'lib';

function resolveBuildKind(mode: string): BuildKind {
  if (isStorybook) return 'storybook';
  if (mode === 'styles') return 'styles';
  return 'lib';
}

/** Public JS graph is pure (no CSS imports). */
function hasModuleSideEffects(_id: string): boolean {
  return false;
}

function storybookConfig(): UserConfig {
  return {
    plugins: [react(), tailwindcss()],
    root: undefined,
  };
}

/** Emits dist/design-system.css from src/styles/index.css */
function stylesConfig(): UserConfig {
  return {
    plugins: [tailwindcss()],
    build: {
      // JS build runs first and clears dist; this pass only adds CSS.
      emptyOutDir: false,
      // Required when the library entry is a CSS file.
      cssCodeSplit: true,
      lib: {
        entry: src('./src/styles/index.css'),
        formats: ['es'],
        // Tiny stub may be emitted by the bundler; not part of public exports.
        fileName: () => 'design-system-styles.js',
      },
      rollupOptions: {
        output: {
          assetFileNames: 'design-system.[ext]',
        },
      },
    },
  };
}

/** Tree-shakeable ESM/CJS module graph (no style side effects on the barrel). */
function libConfig(): UserConfig {
  return {
    plugins: [
      react(),
      tailwindcss(),
      dts({
        include: ['src'],
        exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx'],
        rollupTypes: true,
        insertTypesEntry: true,
        tsconfigPath: './tsconfig.json',
      }),
    ],
    build: {
      lib: {
        entry: src('./src/index.ts'),
        name: 'DesignSystem',
        formats: ['es', 'cjs'],
      },
      minify: false,
      sourcemap: true,
      cssCodeSplit: true,
      emptyOutDir: true,
      target: 'es2022',
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          'react/jsx-dev-runtime',
          'class-variance-authority',
          'clsx',
          'tailwind-merge',
        ],
        treeshake: {
          moduleSideEffects: hasModuleSideEffects,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
        },
        output: [
          {
            format: 'es',
            preserveModules: true,
            preserveModulesRoot: 'src',
            entryFileNames: '[name].js',
            exports: 'named',
          },
          {
            format: 'cjs',
            preserveModules: true,
            preserveModulesRoot: 'src',
            entryFileNames: '[name].cjs',
            exports: 'named',
          },
        ],
      },
    },
    root: rootDir,
  };
}

export default defineConfig(({ mode }) => {
  const kind = resolveBuildKind(mode);

  switch (kind) {
    case 'storybook':
      return storybookConfig();
    case 'styles':
      return stylesConfig();
    case 'lib':
    default:
      return libConfig();
  }
});
