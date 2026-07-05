import eslint from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    name: 'monorepo/ignores',
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/storybook-static/**',
      '**/.cache/**',
      '**/coverage/**',
      'pnpm-lock.yaml',
    ],
  },

  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    name: 'monorepo/typescript',
    files: ['**/*.{ts,tsx,mts,cts}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // React 19–friendly rules (ESLint 10 compatible). TypeScript preset.
  {
    files: ['**/*.{ts,tsx}'],
    ...eslintReact.configs['recommended-typescript'],
  },

  // Official Rules of Hooks (still complementary; supported on ESLint 10).
  {
    name: 'monorepo/react-hooks',
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },

  // Prefer @eslint-react where the two plugins overlap.
  {
    files: ['**/*.{ts,tsx}'],
    ...eslintReact.configs['disable-conflict-eslint-plugin-react-hooks'],
  },

  {
    name: 'monorepo/browser-globals',
    files: ['**/*.{jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // Storybook demos often measure computed styles after paint.
  {
    name: 'monorepo/storybook',
    files: ['**/stories/**/*.{ts,tsx}', '**/.storybook/**/*.{ts,tsx}'],
    rules: {
      '@eslint-react/set-state-in-effect': 'off',
    },
  },

  {
    name: 'monorepo/node-tooling',
    files: [
      '**/*.{js,mjs,cjs}',
      '**/vite.config.ts',
      '**/vitest.config.ts',
      '**/scripts/**/*.{ts,mts}',
      '**/.storybook/**/*.{ts,tsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Disables rules that conflict with Prettier — keep last.
  eslintConfigPrettier,
);
