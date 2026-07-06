import eslintReact from "@eslint-react/eslint-plugin";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Flat config for the monorepo.
 *
 * Preferences from our shared reference config, adapted for this stack:
 * ESLint 10 + typescript-eslint + @eslint-react (not eslint-plugin-react).
 *
 * Not using projectService / type-checked rules yet — monorepo multi-tsconfig
 * coverage for Storybook/scripts is incomplete; re-enable when we add a single
 * ESLint-oriented tsconfig if needed.
 */
export default defineConfig(
  {
    name: "monorepo/ignores",
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/storybook-static/**",
      "**/.cache/**",
      "**/coverage/**",
      "pnpm-lock.yaml",
    ],
  },

  eslint.configs.recommended,

  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  {
    name: "monorepo/typescript",
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",

      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "no-param-reassign": "error",
      "no-console": "warn",
    },
  },

  // React 19–friendly rules (ESLint 10). TypeScript preset.
  {
    name: "monorepo/eslint-react",
    files: ["**/*.{ts,tsx}"],
    ...eslintReact.configs["recommended-typescript"],
    rules: {
      ...eslintReact.configs["recommended-typescript"].rules,
      "@eslint-react/no-array-index-key": "error",
      // Reference: react/no-danger
      "@eslint-react/dom-no-dangerously-set-innerhtml": "error",
      "@eslint-react/dom-no-dangerously-set-innerhtml-with-children": "error",
    },
  },

  // Official Rules of Hooks (reference: error + warn exhaustive-deps).
  {
    name: "monorepo/react-hooks",
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Prefer @eslint-react where it overlaps with react-hooks.
  {
    files: ["**/*.{ts,tsx}"],
    ...eslintReact.configs["disable-conflict-eslint-plugin-react-hooks"],
  },

  // Accessibility (reference: jsx-a11y recommended).
  {
    name: "monorepo/jsx-a11y",
    files: ["**/*.{jsx,tsx}"],
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
  },

  {
    name: "monorepo/browser-globals",
    files: ["**/*.{jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },

  // Storybook demos often measure computed styles after paint.
  {
    name: "monorepo/storybook",
    files: ["**/stories/**/*.{ts,tsx}", "**/.storybook/**/*.{ts,tsx}"],
    rules: {
      "@eslint-react/set-state-in-effect": "off",
      // Foundation stories often use index keys for static token grids.
      "@eslint-react/no-array-index-key": "off",
    },
  },

  {
    name: "monorepo/node-tooling",
    files: [
      "**/*.{js,mjs,cjs}",
      "**/vite.config.ts",
      "**/vitest.config.ts",
      "**/scripts/**/*.{ts,mts}",
      "**/.storybook/**/*.{ts,tsx}",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Scripts/tools often log progress.
      "no-console": "off",
    },
  },

  // Note: reference had react/jsx-props-no-spreading. No @eslint-react
  // equivalent; eslint-plugin-react does not support ESLint 10 yet — skipped.

  // Disables rules that conflict with Prettier — keep last.
  eslintConfigPrettier,
);
