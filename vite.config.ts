import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

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
      }),
  ],
  build: isStorybook
    ? undefined
    : {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
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
});
