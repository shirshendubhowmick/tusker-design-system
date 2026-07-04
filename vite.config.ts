import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import { fileURLToPath, URL } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

// Storybook loads this config for the preview; only emit library artifacts for `vite build`.
const isStorybook = process.argv[1]?.includes('storybook') ?? false;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    !isStorybook &&
      dts({
        include: ['src'],
        exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx'],
        rollupTypes: true,
        insertTypesEntry: true,
        tsconfigPath: './tsconfig.json',
      }),
  ],
  build: isStorybook
    ? undefined
    : {
        lib: {
          entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
          name: 'DesignSystem',
          formats: ['es', 'cjs'],
          fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
        },
        rollupOptions: {
          external: [
            'react',
            'react-dom',
            'react/jsx-runtime',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
          ],
          output: {
            assetFileNames: 'design-system.[ext]',
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'jsxRuntime',
            },
          },
        },
        cssCodeSplit: false,
        sourcemap: true,
        emptyOutDir: true,
      },
  // keep root explicit for Vite 8 / Storybook resolution
  root: isStorybook ? undefined : rootDir,
});