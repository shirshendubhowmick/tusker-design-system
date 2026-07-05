import type { Preview } from '@storybook/react';
import '../src/styles/index.css';
import {
  designSystemViewports,
  defaultStorybookViewport,
} from '../src/tokens/breakpoints';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
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
    theme: 'light',
    /** Start on desktop so full app layouts are visible by default. */
    viewport: { value: defaultStorybookViewport, isRotated: false },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      // defaultValue kept for older paths; initialGlobals is the SB 10 source of truth
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as string) === 'dark' ? 'dark' : 'light';
      const root = document.documentElement;

      root.classList.toggle('dark', theme === 'dark');
      root.classList.toggle('light', theme === 'light');
      root.dataset.theme = theme;

      return (
        <div
          className={
            theme === 'dark'
              ? 'dark min-h-screen bg-bg-canvas text-fg-default antialiased'
              : 'light min-h-screen bg-bg-canvas text-fg-default antialiased'
          }
          data-theme={theme}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
