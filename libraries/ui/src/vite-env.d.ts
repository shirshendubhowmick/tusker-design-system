/// <reference types="vite/client" />

declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

/** Allow side-effect and default CSS imports (Storybook / Vite). */
declare module "*.css";
