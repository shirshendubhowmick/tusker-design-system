import type { Preview } from "@storybook/react";

import "../src/styles/index.css";
import {
  defaultStorybookViewport,
  designSystemViewports,
} from "../src/tokens/breakpoints";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    backgrounds: {
      disable: true,
    },
    /**
     * Viewport toolbar — only our product tiers (mobile / tablet / desktop).
     * Replaces Storybook’s default device list.
     */
    viewport: {
      options: designSystemViewports,
    },
  },
  initialGlobals: {
    theme: "light",
    /** Start on desktop so full app layouts are visible by default. */
    viewport: { value: defaultStorybookViewport, isRotated: false },
  },
  globalTypes: {
    theme: {
      description: "Color theme",
      // defaultValue kept for older paths; initialGlobals is the SB 10 source of truth
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme =
        (context.globals.theme as string) === "dark" ? "dark" : "light";
      const root = document.documentElement;
      const body = document.body;

      root.classList.toggle("dark", theme === "dark");
      root.classList.toggle("light", theme === "light");
      root.dataset.theme = theme;

      // Paint the preview surface on html/body so we do not need min-h-screen on
      // the story wrapper. Docs embeds (often viewMode=story iframes) were each
      // forced to 100vh and ballooned page scroll.
      for (const el of [root, body]) {
        el.classList.add("bg-bg-canvas", "text-fg-default", "antialiased");
      }

      return (
        <div className={theme} data-theme={theme}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
