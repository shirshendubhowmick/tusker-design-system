import {
  DocsContainer,
  type DocsContainerProps,
} from "@storybook/addon-docs/blocks";
import type { Preview } from "@storybook/react";
import { type PropsWithChildren, useEffect, useState } from "react";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import { themes } from "storybook/theming";

import "../src/styles/index.css";
import {
  defaultStorybookViewport,
  designSystemViewports,
} from "../src/tokens/breakpoints";

type ColorMode = "light" | "dark";

function resolveMode(value: unknown): ColorMode {
  return value === "dark" ? "dark" : "light";
}

/**
 * Apply product color mode on the preview document (html/body).
 * Shared by story canvas and Docs so token utilities resolve correctly.
 */
function applyColorMode(theme: ColorMode): void {
  const root = document.documentElement;
  const body = document.body;

  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.dataset.theme = theme;

  // Paint canvas on html/body so stories need no min-h-screen wrapper.
  for (const el of [root, body]) {
    el.classList.add("bg-bg-canvas", "text-fg-default", "antialiased");
  }
}

function readToolbarMode(context: DocsContainerProps["context"]): ColorMode {
  try {
    const story = context.storyById();
    return resolveMode(context.getStoryContext(story).globals.theme);
  } catch {
    return "light";
  }
}

/**
 * Docs chrome (title, description, arg table, source) uses Storybook's own
 * theme tokens — not our Tailwind utilities. Pass `themes.dark` / `themes.light`
 * so the full Docs page follows the toolbar Theme control, not only the canvas.
 *
 * Note: preview hooks (`useGlobals`) cannot run here — only in decorators/stories.
 * We read globals from the docs context and subscribe to GLOBALS_UPDATED.
 */
function ThemedDocsContainer({
  children,
  context,
}: PropsWithChildren<DocsContainerProps>) {
  const [mode, setMode] = useState<ColorMode>(() => readToolbarMode(context));

  useEffect(() => {
    applyColorMode(mode);
  }, [mode]);

  useEffect(() => {
    const onGlobalsUpdated = (payload: {
      globals?: Record<string, unknown>;
    }) => {
      if (payload.globals && "theme" in payload.globals) {
        setMode(resolveMode(payload.globals.theme));
      }
    };

    context.channel.on(GLOBALS_UPDATED, onGlobalsUpdated);
    // Sync in case globals changed before mount completed.
    setMode(readToolbarMode(context));

    return () => {
      context.channel.off(GLOBALS_UPDATED, onGlobalsUpdated);
    };
  }, [context]);

  return (
    <DocsContainer
      context={context}
      theme={mode === "dark" ? themes.dark : themes.light}
    >
      {children}
    </DocsContainer>
  );
}

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
    docs: {
      container: ThemedDocsContainer,
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
      const theme = resolveMode(context.globals.theme);
      applyColorMode(theme);

      return (
        <div className={theme} data-theme={theme}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
