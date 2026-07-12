import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
  ExternalLinkIcon,
  FileTextIcon,
  HamburgerMenuIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentPropsWithoutRef, type ReactNode, useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "../../src/components/Button";
import {
  CheckboxItem,
  Content,
  Group,
  Item,
  ItemIndicator,
  Label,
  Portal,
  RadioGroup,
  RadioItem,
  Root,
  Separator,
  Sub,
  SubContent,
  SubTrigger,
  Trigger,
} from "../../src/components/DropdownMenu";
import { IconButton } from "../../src/components/IconButton";
import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { docsDefault } from "../utils/docs";

type DropdownMenuStoryArgs = ComponentPropsWithoutRef<typeof Root>;

const meta: Meta<DropdownMenuStoryArgs> = {
  title: "Components/DropdownMenu",
  component: Root,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Thin styled re-export of `@radix-ui/react-dropdown-menu`. Behavior and API match Radix; import from `@design-system/ui/DropdownMenu`.",
          "",
          "Prefer **`Trigger asChild`** with `Button` / `IconButton`. Floating chrome uses `surfaceClass.menu` + `z-dropdown`.",
          "",
          "### Composition",
          "",
          "| Part | Role |",
          "| --- | --- |",
          "| **Content** / **SubContent** | Portaled menu panel |",
          '| **Item** | Action row — optional DS `tone="danger"` for destructive actions |',
          "| **CheckboxItem** / **RadioItem** | Toggle / exclusive options + **ItemIndicator** |",
          "| **Label** / **Group** / **Separator** | Structure |",
          "| **Sub** / **SubTrigger** / **SubContent** | Nested menus |",
          "",
          "### Links (consumer composition)",
          "There is no menu-specific Link part. Navigation rows use **`Item asChild`** with a native `<a>` or app router `Link` (must forward ref). DS keeps row chrome; the consumer owns `href` / routing.",
          "",
          "```tsx",
          "<Item asChild>",
          '  <a href="/settings">Settings</a>',
          "</Item>",
          "",
          "<Item asChild>",
          '  <Link href="/docs">Documentation</Link>',
          "</Item>",
          "```",
          "",
          "Prefer plain `Item` + `onSelect` for in-page actions; use `asChild` + link only when the row is real navigation.",
          "",
          "Tone is styling only (not a Radix prop). Keyboard, typeahead, and focus management stay upstream.",
          "",
          "**Playground** is the interactive demo (Layer 4 keyboard). **Matrix** opens panels for visual QA of mixed tones, links, checkable rows, structure, and triggers.",
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
        "When true, interaction outside is blocked while open (Radix default).",
      ...docsDefault("true"),
    },
    children: { table: { disable: true }, control: false },
    onOpenChange: { table: { disable: true }, control: false },
  },
  args: {
    defaultOpen: false,
    modal: true,
  },
};

export default meta;
type Story = StoryObj<DropdownMenuStoryArgs>;

function Shortcut({ children }: { children: string }) {
  return (
    <span className="text-label-sm text-fg-muted ml-auto tracking-wide">
      {children}
    </span>
  );
}

function SectionHeading({ children }: { children: string }) {
  return (
    <Text
      as="h3"
      variant={TextVariant.heading}
      size={TextSize.xs}
      className="border-border-default border-b pb-2"
    >
      {children}
    </Text>
  );
}

function ExampleLabel({ children }: { children: string }) {
  return (
    <Text
      as="p"
      variant={TextVariant.label}
      size={TextSize.sm}
      color={TextColor.muted}
    >
      {children}
    </Text>
  );
}

/**
 * Fixed-position open menu for matrix cells — avoids portal stacking chaos.
 * `modal={false}` so multiple open menus can coexist for visual QA.
 */
function MatrixMenu({
  label,
  trigger,
  children,
  align = "start",
}: {
  label: string;
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "center" | "end";
}) {
  return (
    <div className="flex flex-col gap-2">
      <ExampleLabel>{label}</ExampleLabel>
      <div className="relative min-h-48">
        <Root defaultOpen modal={false}>
          <Trigger asChild>{trigger}</Trigger>
          <Portal>
            <Content sideOffset={4} align={align} className="min-w-44">
              {children}
            </Content>
          </Portal>
        </Root>
      </div>
    </div>
  );
}

/** Uncontrolled playground — actions + danger + shortcuts. */
export const Playground: Story = {
  render: function PlaygroundRender(args) {
    return (
      <Root {...args}>
        <Trigger asChild>
          <Button variant="secondary">Actions</Button>
        </Trigger>
        <Portal>
          <Content sideOffset={4} align="start">
            <Item>
              <Pencil1Icon />
              Edit
              <Shortcut>⌘E</Shortcut>
            </Item>
            <Item>
              Duplicate
              <Shortcut>⌘D</Shortcut>
            </Item>
            <Item disabled>
              Archive
              <Shortcut>⌘⇧A</Shortcut>
            </Item>
            <Separator />
            <Item tone="danger">
              <TrashIcon />
              Delete
              <Shortcut>⌘⌫</Shortcut>
            </Item>
          </Content>
        </Portal>
      </Root>
    );
  },
  /**
   * Layer 4 (ADR-003) — keyboard / focus on the primary composition story.
   * Portaled content under `document.body`.
   */
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);
    const trigger = canvas.getByRole("button", { name: "Actions" });

    await step("Open menu — focus moves into the menu", async () => {
      await userEvent.click(trigger);
      const menu = await page.findByRole("menu");
      await expect(menu).toBeInTheDocument();
      await expect(
        menu.contains(document.activeElement),
        "focus should be inside the menu after open",
      ).toBe(true);
      await expect(menu.className.split(/\s+/)).toEqual(
        expect.arrayContaining(["z-dropdown", "bg-bg-surface", "p-1"]),
      );
    });

    await step("Arrow keys move highlight between items", async () => {
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{ArrowDown}");
      const menu = page.getByRole("menu");
      await expect(menu.contains(document.activeElement)).toBe(true);
    });

    await step("Escape closes and restores focus to the trigger", async () => {
      await userEvent.keyboard("{Escape}");
      await expect(page.queryByRole("menu")).not.toBeInTheDocument();
      await expect(trigger).toHaveFocus();
    });
  },
};

/**
 * Composition matrix for visual QA — panels open by default (`modal={false}`).
 * Axes: mixed item tones / states, links, checkable parts, structure, triggers.
 */
export const Matrix: Story = {
  argTypes: {
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    modal: { table: { disable: true } },
  },
  parameters: {
    controls: { disable: true },
    layout: "padded",
    // Multiple open non-modal menus for visual QA — not a single focus path.
    a11y: { test: "off" },
  },
  render: function MatrixStory() {
    return (
      <div className="flex w-full max-w-4xl flex-col gap-10 p-2">
        {/* ── Item tones & states ───────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <SectionHeading>Item tones &amp; states</SectionHeading>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            A menu mixes tones per row — default actions plus a destructive{" "}
            <code className="text-label-sm">tone=&quot;danger&quot;</code> item.
            Disabled is Radix <code className="text-label-sm">disabled</code>.
          </Text>
          <div className="flex flex-wrap gap-8">
            <MatrixMenu
              label="Mixed tones (product pattern)"
              trigger={
                <Button variant="secondary" size="sm">
                  Actions
                </Button>
              }
            >
              <Item>
                <Pencil1Icon />
                Edit
                <Shortcut>⌘E</Shortcut>
              </Item>
              <Item>Duplicate</Item>
              <Item disabled>Archive (disabled)</Item>
              <Separator />
              <Item tone="danger">
                <TrashIcon />
                Delete
                <Shortcut>⌘⌫</Shortcut>
              </Item>
              <Item tone="danger" disabled>
                Delete forever (disabled)
              </Item>
            </MatrixMenu>
          </div>
        </section>

        {/* ── Links ─────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <SectionHeading>Links</SectionHeading>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Navigation via <code className="text-label-sm">Item asChild</code> +
            native <code className="text-label-sm">&lt;a&gt;</code> (or a router{" "}
            <code className="text-label-sm">Link</code> that forwards ref). No
            DS menu-Link part — consumer owns routing.
          </Text>
          <div className="flex flex-wrap gap-8">
            <MatrixMenu
              label="Item asChild + anchor"
              trigger={
                <Button variant="secondary" size="sm">
                  Navigate
                </Button>
              }
            >
              <Item asChild>
                <a href="#docs">
                  <FileTextIcon />
                  Documentation
                </a>
              </Item>
              <Item asChild>
                <a href="#settings">Settings</a>
              </Item>
              <Item asChild>
                <a href="https://example.com" target="_blank" rel="noreferrer">
                  <ExternalLinkIcon />
                  External site
                </a>
              </Item>
              <Separator />
              <Item>In-page action (onSelect)</Item>
            </MatrixMenu>

            <MatrixMenu
              label="Links mixed with danger action"
              trigger={
                <Button variant="secondary" size="sm">
                  Account
                </Button>
              }
            >
              <Item asChild>
                <a href="#profile">Profile</a>
              </Item>
              <Item asChild>
                <a href="#billing">Billing</a>
              </Item>
              <Separator />
              <Item tone="danger">Sign out</Item>
            </MatrixMenu>
          </div>
        </section>

        {/* ── Checkable ─────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <SectionHeading>Checkable</SectionHeading>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            CheckboxItem / RadioItem + ItemIndicator (Check / Dot icons).
          </Text>
          <div className="flex flex-wrap gap-8">
            <CheckableMatrixCell />
          </div>
        </section>

        {/* ── Structure ─────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <SectionHeading>Structure</SectionHeading>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Label, Group, Separator, Sub / SubTrigger / SubContent.
          </Text>
          <div className="flex flex-wrap gap-8">
            <MatrixMenu
              label="Label · group · separator"
              trigger={
                <Button variant="secondary" size="sm">
                  Structure
                </Button>
              }
            >
              <Label>Account</Label>
              <Group>
                <Item>Profile</Item>
                <Item>Billing</Item>
              </Group>
              <Separator />
              <Item>Sign out</Item>
            </MatrixMenu>

            <MatrixMenu
              label="Submenu"
              trigger={
                <Button variant="secondary" size="sm">
                  With sub
                </Button>
              }
            >
              <Item>New tab</Item>
              <Sub defaultOpen>
                <SubTrigger>
                  More tools
                  <ChevronRightIcon className="ml-auto" />
                </SubTrigger>
                <Portal>
                  <SubContent sideOffset={2} alignOffset={-4}>
                    <Item>Save page as…</Item>
                    <Item>Create shortcut…</Item>
                    <Separator />
                    <Item>Developer tools</Item>
                  </SubContent>
                </Portal>
              </Sub>
              <Separator />
              <Item>Print…</Item>
            </MatrixMenu>
          </div>
        </section>

        {/* ── Triggers ──────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <SectionHeading>Triggers</SectionHeading>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Prefer <code className="text-label-sm">Trigger asChild</code> with
            Button or IconButton.
          </Text>
          <div className="flex flex-wrap gap-8">
            <MatrixMenu
              label="Button"
              trigger={
                <Button variant="secondary" size="sm">
                  Actions
                </Button>
              }
            >
              <Item>Edit</Item>
              <Item>Duplicate</Item>
              <Separator />
              <Item tone="danger">Delete</Item>
            </MatrixMenu>

            <MatrixMenu
              label="IconButton"
              align="end"
              trigger={
                <IconButton
                  aria-label="Open menu"
                  variant="secondary"
                  size="sm"
                >
                  <HamburgerMenuIcon />
                </IconButton>
              }
            >
              <Item>Settings</Item>
              <Item>Keyboard shortcuts</Item>
              <Separator />
              <Item>Sign out</Item>
            </MatrixMenu>
          </div>
        </section>
      </div>
    );
  },
};

function CheckableMatrixCell() {
  const [bookmarks, setBookmarks] = useState(true);
  const [urls, setUrls] = useState(false);
  const [person, setPerson] = useState("ada");

  return (
    <MatrixMenu
      label="Checkbox + radio"
      trigger={
        <Button variant="secondary" size="sm">
          View options
        </Button>
      }
    >
      <Label>Display</Label>
      <CheckboxItem checked={bookmarks} onCheckedChange={setBookmarks}>
        <ItemIndicator>
          <CheckIcon />
        </ItemIndicator>
        Show bookmarks
      </CheckboxItem>
      <CheckboxItem checked={urls} onCheckedChange={setUrls}>
        <ItemIndicator>
          <CheckIcon />
        </ItemIndicator>
        Show full URLs
      </CheckboxItem>
      <Separator />
      <Label>People</Label>
      <RadioGroup value={person} onValueChange={setPerson}>
        <RadioItem value="ada">
          <ItemIndicator>
            <DotFilledIcon />
          </ItemIndicator>
          Ada Lovelace
        </RadioItem>
        <RadioItem value="grace">
          <ItemIndicator>
            <DotFilledIcon />
          </ItemIndicator>
          Grace Hopper
        </RadioItem>
        <RadioItem value="alan">
          <ItemIndicator>
            <DotFilledIcon />
          </ItemIndicator>
          Alan Turing
        </RadioItem>
      </RadioGroup>
    </MatrixMenu>
  );
}
