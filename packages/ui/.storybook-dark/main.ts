/**
 * Dark-theme Vitest project only (ADR-003 Layer 1).
 *
 * `@storybook/addon-vitest` forces the Vitest project name to
 * `storybook:${configDir}`. Light + dark cannot share `.storybook` or Storybook
 * UI fails with "Project name is not unique". This directory re-exports the
 * real Storybook config so the dark project gets a distinct `configDir`.
 */
export { default } from "../.storybook/main";
