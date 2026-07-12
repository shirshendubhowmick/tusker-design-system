/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

/** Allow side-effect and default CSS imports (Storybook / Vite). */
declare module "*.css";

interface ImportMetaEnv {
  /**
   * Set by Vite `define` on Vitest projects `storybook-light` / `storybook-dark`
   * (`vitest.config.ts`). Unset in interactive Storybook (toolbar theme applies).
   */
  readonly STORYBOOK_TEST_THEME?: "light" | "dark";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
