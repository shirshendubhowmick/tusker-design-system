/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

/** Allow side-effect and default CSS imports (Storybook / Vite). */
declare module "*.css";
