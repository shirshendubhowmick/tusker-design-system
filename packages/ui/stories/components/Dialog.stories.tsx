import { Cross2Icon } from "@radix-ui/react-icons";
import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentPropsWithoutRef, type ReactNode, useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "../../src/components/Button";
import {
  Close,
  Content,
  Description,
  type DialogContentSize,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from "../../src/components/Dialog";
import { IconButton } from "../../src/components/IconButton";
import { Input } from "../../src/components/Input";
import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { surfaceSectionClass } from "../../src/utils/surface";
import { docsDefault } from "../utils/docs";

/**
 * Story-only composition knobs (not Radix `Root` props).
 * Documented in autodocs so consumers see optional panel regions.
 */
type DialogStoryArgs = ComponentPropsWithoutRef<typeof Root> & {
  /**
   * Show the action footer region (`surfaceSectionClass.footer`).
   * Composition helper for Stories / Docs — not a Radix or Dialog prop.
   */
  footer?: boolean;
};

const meta: Meta<DialogStoryArgs> = {
  title: "Components/Dialog",
  component: Root,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Thin styled re-export of `@radix-ui/react-dialog`. Behavior and API match Radix; import from `@design-system/ui/Dialog`.",
          "",
          "### Panel layout (composition)",
          "Dialog has no built-in header/body/footer parts. Compose regions with `surfaceSectionClass` from `@design-system/ui/surface`:",
          "",
          "| Region | Recipe | Role |",
          "| --- | --- | --- |",
          "| **Header** | `surfaceSectionClass.header` | Title, description, optional close (`IconButton` + `Close asChild`) |",
          "| **Body** | `surfaceSectionClass.body` | Main content (forms, copy) |",
          "| **Footer** | `surfaceSectionClass.footer` | **Optional** action row (Cancel / Save, danger confirm, …) |",
          "",
          "The **footer** control on Playground toggles that action region. Other stories keep a footer when the product pattern needs actions.",
          "",
          "### Sizing",
          "Set panel size with the **`Content` `size` prop** (`sm` / `md` / `lg` / `xl`, default `md`). Styling only — not a Radix prop. Do not pass `dialogContentVariants({ size })` as `className` on `Content` (double-applies the default).",
          "",
          "Product scale — larger than alert/confirm panels (Alert Dialog will own the compact scale).",
          "",
          "**Mobile (&lt;768px, base tier only — not tablet):** `sm` stays a centered panel; `md` / `lg` / `xl` go **full-screen**. From `tablet:` up (≥768px), all sizes are centered panels with the max-widths below.",
          "",
          "| size | tablet+ max-width | ~width | mobile |",
          "| --- | --- | --- | --- |",
          "| `sm` | `max-w-xl` | 576px | centered panel |",
          "| `md` (default) | `max-w-2xl` | 672px | full-screen |",
          "| `lg` | `max-w-4xl` | 896px | full-screen |",
          "| `xl` | `max-w-6xl` | 1152px | full-screen |",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Controlled open state.",
      ...docsDefault("undefined", { type: "boolean" }),
    },
    defaultOpen: {
      control: "boolean",
      ...docsDefault("false"),
    },
    modal: {
      control: "boolean",
      description:
        "When true, interaction outside is blocked and focus is trapped.",
      ...docsDefault("true"),
    },
    footer: {
      control: "boolean",
      description:
        "Composition: show the optional action footer (`surfaceSectionClass.footer` with Cancel/Save). Not a Radix prop — panel region only.",
      table: {
        category: "Composition",
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    // Root children / callbacks — hide noise from the controls table
    children: { table: { disable: true }, control: false },
    onOpenChange: { table: { disable: true }, control: false },
  },
  args: {
    defaultOpen: false,
    modal: true,
    footer: true,
  },
};

export default meta;
type Story = StoryObj<DialogStoryArgs>;

function DialogShell({
  title,
  description,
  size,
  children,
  showClose = true,
}: {
  title: string;
  description?: string;
  size?: DialogContentSize;
  children?: ReactNode;
  showClose?: boolean;
}) {
  return (
    <Portal>
      <Overlay />
      <Content
        size={size}
        // Radix warns without Description; omit association when unused.
        {...(description ? {} : { "aria-describedby": undefined })}
      >
        <div className={surfaceSectionClass.header}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <Title>{title}</Title>
              {description ? <Description>{description}</Description> : null}
            </div>
            {showClose ? (
              <Close asChild>
                <IconButton
                  aria-label="Close"
                  variant="tertiary"
                  size="sm"
                  className="shrink-0"
                >
                  <Cross2Icon />
                </IconButton>
              </Close>
            ) : null}
          </div>
        </div>
        {children}
      </Content>
    </Portal>
  );
}

function ActionFooter({ children }: { children: ReactNode }) {
  return (
    <div className={`${surfaceSectionClass.footer} flex justify-end gap-2`}>
      {children}
    </div>
  );
}

/** Uncontrolled playground — toggle the optional action footer from Controls. */
export const Playground: Story = {
  render: function PlaygroundRender({ footer = true, ...args }) {
    return (
      <Root {...args}>
        <Trigger asChild>
          <Button>Edit profile</Button>
        </Trigger>
        <DialogShell
          title="Edit profile"
          description="Make changes to your profile here. Click save when you're done."
        >
          <div className={surfaceSectionClass.body}>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Text
                  as="label"
                  htmlFor="dialog-name"
                  variant={TextVariant.label}
                  size={TextSize.md}
                  color={TextColor.default}
                >
                  Name
                </Text>
                <Input id="dialog-name" defaultValue="Ada Lovelace" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Text
                  as="label"
                  htmlFor="dialog-username"
                  variant={TextVariant.label}
                  size={TextSize.md}
                  color={TextColor.default}
                >
                  Username
                </Text>
                <Input id="dialog-username" defaultValue="@ada" />
              </div>
            </div>
          </div>
          {footer ? (
            <ActionFooter>
              <Close asChild>
                <Button variant="secondary">Cancel</Button>
              </Close>
              <Close asChild>
                <Button variant="primary">Save changes</Button>
              </Close>
            </ActionFooter>
          ) : null}
        </DialogShell>
      </Root>
    );
  },
  /**
   * Layer 4 (ADR-003) — keyboard / focus on the primary composition story.
   * Portaled content lives under `document.body`, not `canvasElement`.
   */
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);
    const trigger = canvas.getByRole("button", { name: "Edit profile" });

    await step("Open dialog — focus moves inside the modal", async () => {
      await userEvent.click(trigger);
      const dialog = await page.findByRole("dialog");
      await expect(dialog).toBeInTheDocument();
      await expect(
        dialog.contains(document.activeElement),
        "focus should be inside the dialog after open",
      ).toBe(true);
      // Content ships `focusRing()` utilities (ADR-002 focus contract).
      await expect(dialog.className.split(/\s+/)).toEqual(
        expect.arrayContaining([
          "focus-visible:shadow-focus",
          "focus-visible:outline-none",
        ]),
      );
    });

    await step("Tab keeps focus within the dialog (focus trap)", async () => {
      const dialog = page.getByRole("dialog");
      const activeBefore = document.activeElement;
      await userEvent.tab();
      const activeAfter = document.activeElement;
      await expect(activeAfter).not.toBe(activeBefore);
      await expect(
        dialog.contains(activeAfter),
        "Tab must not leave the focus-trapped dialog",
      ).toBe(true);
      // Another Tab still trapped (covers more than a single hop).
      await userEvent.tab();
      await expect(dialog.contains(document.activeElement)).toBe(true);
    });

    await step("Escape closes and restores focus to the trigger", async () => {
      await userEvent.keyboard("{Escape}");
      await expect(page.queryByRole("dialog")).not.toBeInTheDocument();
      await expect(trigger).toHaveFocus();
    });
  },
};

/** Size matrix via `Content` `size` prop (styling only — not a Radix prop). */
export const Sizes: Story = {
  argTypes: {
    footer: { table: { disable: true }, control: false },
  },
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Root key={size}>
          <Trigger asChild>
            <Button variant="secondary">Open {size}</Button>
          </Trigger>
          <DialogShell
            title={`Size ${size}`}
            description="Product dialog max-width from Content size prop."
            size={size}
          >
            <div className={surfaceSectionClass.body}>
              <Text
                as="p"
                variant={TextVariant.body}
                size={TextSize.sm}
                color={TextColor.muted}
              >
                Size <code className="text-label-sm">{size}</code>
                {" → "}
                {
                  {
                    sm: "max-w-xl (~576px), always centered",
                    md: "tablet:max-w-2xl (~672px); full-screen on mobile only",
                    lg: "tablet:max-w-4xl (~896px); full-screen on mobile only",
                    xl: "tablet:max-w-6xl (~1152px); full-screen on mobile only",
                  }[size]
                }
                .
              </Text>
            </div>
            <ActionFooter>
              <Close asChild>
                <Button size="sm">Done</Button>
              </Close>
            </ActionFooter>
          </DialogShell>
        </Root>
      ))}
    </div>
  ),
};

/** Controlled open — close after a simulated async save. */
export const ControlledAsync: Story = {
  argTypes: {
    footer: { table: { disable: true }, control: false },
  },
  render: function ControlledRender() {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    return (
      <Root open={open} onOpenChange={setOpen}>
        <Trigger asChild>
          <Button>Rename workspace</Button>
        </Trigger>
        <DialogShell
          title="Rename workspace"
          description="Pick a short, unique name."
        >
          <form
            className="contents"
            onSubmit={(event) => {
              event.preventDefault();
              setSaving(true);
              window.setTimeout(() => {
                setSaving(false);
                setOpen(false);
              }, 600);
            }}
          >
            <div className={surfaceSectionClass.body}>
              <Input
                name="name"
                defaultValue="acme-prod"
                aria-label="Workspace name"
                required
              />
            </div>
            <ActionFooter>
              <Close asChild>
                <Button type="button" variant="secondary" disabled={saving}>
                  Cancel
                </Button>
              </Close>
              <Button type="submit" loading={saving} loadingText="Saving…">
                Save
              </Button>
            </ActionFooter>
          </form>
        </DialogShell>
      </Root>
    );
  },
};
