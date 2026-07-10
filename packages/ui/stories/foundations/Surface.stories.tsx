import type { Meta, StoryObj } from "@storybook/react";

import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { zIndexClass } from "../../src/tokens/z-index";
import { cn } from "../../src/utils/cn";
import { overlayClass } from "../../src/utils/overlay";
import {
  SurfaceElevation,
  surface,
  surfaceClass,
  surfaceSectionClass,
} from "../../src/utils/surface";

const meta = {
  title: "Foundations/Surface",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const ELEVATIONS = Object.values(SurfaceElevation);

/** Named recipes side by side */
export const Recipes: Story = {
  render: function RecipesStory() {
    return (
      <div className="flex flex-wrap items-start gap-4">
        <div className={cn(surfaceClass.card, "max-w-56 min-w-40")}>
          <div className={surfaceSectionClass.header}>
            <Text as="p" variant={TextVariant.label} size={TextSize.md}>
              card
            </Text>
          </div>
          <div className={surfaceSectionClass.body}>
            <Text
              as="p"
              variant={TextVariant.body}
              size={TextSize.sm}
              color={TextColor.muted}
            >
              Resting surface on canvas.
            </Text>
          </div>
        </div>

        <div className={cn(surfaceClass.popover, "max-w-56 min-w-40 p-3")}>
          <Text as="p" variant={TextVariant.label} size={TextSize.sm}>
            popover
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Select / dropdown shell.
          </Text>
        </div>

        <div className={cn(surfaceClass.menu, "max-w-56 min-w-40")}>
          <Text as="p" variant={TextVariant.label} size={TextSize.sm}>
            menu
          </Text>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Compact list padding.
          </Text>
        </div>

        <div className={cn(surfaceClass.dialog, "max-w-56 min-w-40")}>
          <div className={surfaceSectionClass.header}>
            <Text as="p" variant={TextVariant.label} size={TextSize.md}>
              dialog
            </Text>
          </div>
          <div className={surfaceSectionClass.body}>
            <Text
              as="p"
              variant={TextVariant.body}
              size={TextSize.sm}
              color={TextColor.muted}
            >
              Modal panel elevation.
            </Text>
          </div>
          <div className={surfaceSectionClass.footer}>
            <Text as="p" variant={TextVariant.label} size={TextSize.sm}>
              Footer
            </Text>
          </div>
        </div>

        <div className={cn(surfaceClass.inverse, "max-w-56 min-w-40")}>
          <Text as="p" variant={TextVariant.label} size={TextSize.sm}>
            inverse
          </Text>
          <Text as="p" variant={TextVariant.body} size={TextSize.sm}>
            Tooltip-style panel.
          </Text>
        </div>
      </div>
    );
  },
};

/** Elevation ladder on canvas */
export const Elevations: Story = {
  render: function ElevationsStory() {
    return (
      <div className="bg-bg-subtle flex flex-wrap gap-4 rounded-lg p-6">
        {ELEVATIONS.map(function renderElevation(elevation) {
          return (
            <div
              key={elevation}
              className={cn(
                surface({ elevation, padding: "md" }),
                "min-w-32 text-center",
              )}
            >
              <Text as="p" variant={TextVariant.label} size={TextSize.sm}>
                {elevation}
              </Text>
            </div>
          );
        })}
      </div>
    );
  },
};

/**
 * Dialog-style stack: scrim (`z-overlay`) + panel (`z-modal`).
 * Decorative only — no focus trap / portal behavior.
 */
export const OverlayWithDialog: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: function OverlayWithDialogStory() {
    return (
      <div className="bg-bg-canvas relative min-h-80">
        <div className="p-6">
          <Text as="p" variant={TextVariant.body} size={TextSize.md}>
            Page content behind the overlay.
          </Text>
        </div>
        <div className={overlayClass.scrim} aria-hidden />
        <div
          className={cn(
            surfaceClass.dialog,
            zIndexClass("modal"),
            "fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
          )}
          role="dialog"
          aria-labelledby="demo-dialog-title"
        >
          <div className={surfaceSectionClass.header}>
            <Text
              as="h2"
              id="demo-dialog-title"
              variant={TextVariant.heading}
              size={TextSize.xs}
            >
              Confirm action
            </Text>
          </div>
          <div className={surfaceSectionClass.body}>
            <Text
              as="p"
              variant={TextVariant.body}
              size={TextSize.sm}
              color={TextColor.muted}
            >
              Scrim uses{" "}
              <code className="font-mono text-xs">overlayClass.scrim</code>
              {". "}
              Panel uses{" "}
              <code className="font-mono text-xs">surfaceClass.dialog</code>
              {" + "}
              <code className="font-mono text-xs">z-modal</code>
              {"."}
            </Text>
          </div>
          <div className={surfaceSectionClass.footer}>
            <Text as="p" variant={TextVariant.label} size={TextSize.sm}>
              Footer actions slot
            </Text>
          </div>
        </div>
      </div>
    );
  },
};
