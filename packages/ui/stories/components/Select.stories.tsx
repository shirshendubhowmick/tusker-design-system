import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { expect, userEvent, within } from "storybook/test";

import {
  Content,
  Group,
  Icon,
  Item,
  ItemIndicator,
  ItemText,
  Label,
  Portal,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  type SelectTriggerColor,
  type SelectTriggerSize,
  Separator,
  Trigger,
  Value,
  Viewport,
  selectContentVariants,
  selectItemIndicatorVariants,
  selectItemVariants,
  selectLabelVariants,
  selectSeparatorVariants,
  selectViewportVariants,
} from "../../src/components/Select";
import {
  Text,
  TextColor,
  TextSize,
  TextVariant,
} from "../../src/components/Text";
import { controlSizeOrder } from "../../src/tokens/control";
import { cn } from "../../src/utils/cn";
import { docsDefault } from "../utils/docs";

type SelectStoryArgs = ComponentPropsWithoutRef<typeof Root> & {
  /**
   * Trigger size (styling only — not a Radix Root prop).
   * Composition helper for Playground / Docs.
   */
  size?: SelectTriggerSize;
  /**
   * Trigger validation color (styling only).
   * Composition helper for Playground / Docs.
   */
  color?: SelectTriggerColor;
  /**
   * Stretch trigger to parent (styling only).
   */
  fullWidth?: boolean;
};

const TRIGGER_COLORS = [
  "default",
  "success",
  "danger",
  "warning",
] as const satisfies readonly SelectTriggerColor[];

const meta: Meta<SelectStoryArgs> = {
  title: "Components/Select",
  component: Root,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Thin styled re-export of `@radix-ui/react-select`. Behavior and API match Radix; import from `@design-system/ui/Select`.",
          "",
          "### Composition",
          "",
          "| Part | Role |",
          "| --- | --- |",
          "| **Trigger** | Field chrome — DS `size` / `color` / `fullWidth` (styling only) |",
          "| **Value** | Selected text or `placeholder` |",
          "| **Icon** | Trailing chevron (pass `@radix-ui/react-icons` ChevronDown) |",
          '| **Content** / **Viewport** | Portaled listbox — prefer `position="popper"` + `sideOffset` |',
          "| **Item** / **ItemText** / **ItemIndicator** | Option rows + check mark |",
          "| **Group** / **Label** / **Separator** | Structure |",
          "| **ScrollUpButton** / **ScrollDownButton** | Long lists |",
          "",
          "### States",
          "",
          "| State | How | Notes |",
          "| --- | --- | --- |",
          "| **Placeholder** | `Value` `placeholder` with no selection | Muted trigger text via `data-placeholder` |",
          "| **Selected** | `value` / `defaultValue` | Trigger shows `ItemText`; open list shows `ItemIndicator` |",
          "| **Open** | User opens the listbox | Prefer interactive **Playground** (Radix locks scroll while open) |",
          "| **Disabled (control)** | `Root` `disabled` | Trigger not interactive; `cursor-not-allowed` + opacity |",
          "| **Disabled (option)** | `Item` `disabled` | Row muted; not selectable |",
          "| **Required** | `Root` `required` | Form constraint on the hidden select bubble input |",
          "| **Validation color** | Trigger `color` | Same intents as Input: `default` / `success` / `danger` / `warning` |",
          "",
          "### Sizing",
          "Trigger uses shared **`ControlSize`** (`sm` / `md` / `lg`) — same heights as Input / Button. Styling only (not a Radix prop).",
          "",
          "Trigger chrome aligns with **Input** (border, focus ring, validation colors). List chrome uses `surfaceClass.popover` + `z-dropdown`.",
          "",
          "Pair with `@design-system/ui/Field` for label / description / message layout.",
          "",
          "**Playground** is the interactive demo (Layer 4 keyboard). **Matrix** is visual QA for trigger states and list chrome (static list preview — no portaled open panels, so Docs stays scrollable).",
        ].join("\n"),
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "text",
      description: "Controlled selected value (must match an Item `value`).",
      ...docsDefault("undefined", { type: "string" }),
    },
    defaultValue: {
      control: "text",
      description: "Uncontrolled initial value.",
      ...docsDefault("undefined", { type: "string" }),
    },
    // Controlled `open` without `useArgs` traps the listbox closed — document only.
    open: {
      control: false,
      description: "Controlled open state (wire with `onOpenChange` in apps).",
      ...docsDefault("undefined", { type: "boolean" }),
    },
    defaultOpen: {
      control: "boolean",
      description: "Uncontrolled initial open state (Playground only).",
      ...docsDefault("false"),
    },
    disabled: {
      control: "boolean",
      description: "Disables the trigger and selection.",
      ...docsDefault("false"),
    },
    required: {
      control: "boolean",
      description: "Marks the control required for form submission.",
      ...docsDefault("false"),
    },
    name: {
      control: "text",
      description: "Name for the form bubble input.",
      ...docsDefault("undefined", { type: "string" }),
    },
    size: {
      control: "select",
      options: [...controlSizeOrder],
      description: "Trigger height (styling only — not a Radix prop).",
      ...docsDefault("md", { type: "ControlSize" }),
      table: {
        category: "Trigger",
        type: { summary: "ControlSize" },
        defaultValue: { summary: "md" },
      },
    },
    color: {
      control: "select",
      options: [...TRIGGER_COLORS],
      description:
        "Validation intent on the trigger (styling only — same as Input).",
      ...docsDefault("default"),
      table: {
        category: "Trigger",
        type: { summary: "default | success | danger | warning" },
        defaultValue: { summary: "default" },
      },
    },
    fullWidth: {
      control: "boolean",
      description: "Stretch trigger to parent (styling only).",
      ...docsDefault("true"),
      table: {
        category: "Trigger",
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    children: { table: { disable: true }, control: false },
    onValueChange: { table: { disable: true }, control: false },
    onOpenChange: { table: { disable: true }, control: false },
  },
  args: {
    disabled: false,
    required: false,
    defaultOpen: false,
    size: "md",
    color: "default",
    fullWidth: true,
  },
};

export default meta;
type Story = StoryObj<SelectStoryArgs>;

function SelectOption({
  value,
  children,
  disabled,
}: {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <Item value={value} disabled={disabled}>
      <ItemIndicator>
        <CheckIcon />
      </ItemIndicator>
      <ItemText>{children}</ItemText>
    </Item>
  );
}

function SelectPanel({ children }: { children: ReactNode }) {
  return (
    <Portal>
      <Content position="popper" sideOffset={4}>
        <ScrollUpButton>
          <ChevronUpIcon />
        </ScrollUpButton>
        <Viewport>{children}</Viewport>
        <ScrollDownButton>
          <ChevronDownIcon />
        </ScrollDownButton>
      </Content>
    </Portal>
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

function FieldSelect({
  label,
  defaultValue,
  disabled,
  required,
  size,
  color,
  placeholder,
  "aria-label": ariaLabel,
}: {
  "label": string;
  "defaultValue"?: string;
  "disabled"?: boolean;
  "required"?: boolean;
  "size"?: SelectTriggerSize;
  "color"?: SelectTriggerColor;
  "placeholder"?: string;
  "aria-label": string;
}) {
  return (
    <div className="flex w-56 flex-col gap-2">
      <ExampleLabel>{label}</ExampleLabel>
      <Root defaultValue={defaultValue} disabled={disabled} required={required}>
        <Trigger size={size} color={color} aria-label={ariaLabel}>
          <Value placeholder={placeholder} />
          <Icon>
            <ChevronDownIcon />
          </Icon>
        </Trigger>
        <SelectPanel>
          <SelectOption value="next">Next.js</SelectOption>
          <SelectOption value="remix">Remix</SelectOption>
          <SelectOption value="vite">Vite</SelectOption>
          <SelectOption value="astro" disabled>
            Astro (disabled)
          </SelectOption>
        </SelectPanel>
      </Root>
    </div>
  );
}

/**
 * Static list chrome for Matrix / Docs — same CVA classes as real parts,
 * without opening a portaled Select (which locks body scroll and breaks Docs).
 */
function StaticListPreview({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <ExampleLabel>{label}</ExampleLabel>
      <div
        className={cn(selectContentVariants(), "relative w-56")}
        // Decorative preview — not an interactive listbox
        aria-hidden
      >
        <div className={selectViewportVariants()}>{children}</div>
      </div>
    </div>
  );
}

function StaticItem({
  children,
  highlighted,
  disabled,
  checked,
}: {
  children: ReactNode;
  highlighted?: boolean;
  disabled?: boolean;
  checked?: boolean;
}) {
  return (
    <div
      className={selectItemVariants()}
      data-highlighted={highlighted ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      data-state={checked ? "checked" : "unchecked"}
    >
      {checked ? (
        <span className={selectItemIndicatorVariants()}>
          <CheckIcon />
        </span>
      ) : null}
      {children}
    </div>
  );
}

/** Uncontrolled playground — Controls for size / color / fullWidth / disabled. */
export const Playground: Story = {
  decorators: [
    function Frame(Story) {
      return (
        <div className="w-72 max-w-[min(18rem,100%)]">
          <Story />
        </div>
      );
    },
  ],
  render: function PlaygroundRender({
    size = "md",
    color = "default",
    fullWidth = true,
    value,
    defaultValue,
    open: _open,
    ...args
  }) {
    // Prefer controlled when value is set; ignore empty text-control strings.
    const selectionProps =
      value !== undefined && value !== ""
        ? { value }
        : defaultValue !== undefined && defaultValue !== ""
          ? { defaultValue }
          : {};

    return (
      <Root {...args} {...selectionProps}>
        <Trigger
          size={size}
          color={color}
          fullWidth={fullWidth}
          aria-label="Framework"
        >
          <Value placeholder="Select a framework…" />
          <Icon>
            <ChevronDownIcon />
          </Icon>
        </Trigger>
        <SelectPanel>
          <Group>
            <Label>Popular</Label>
            <SelectOption value="next">Next.js</SelectOption>
            <SelectOption value="remix">Remix</SelectOption>
            <SelectOption value="vite">Vite</SelectOption>
          </Group>
          <Separator />
          <Group>
            <Label>Other</Label>
            <SelectOption value="astro">Astro</SelectOption>
            <SelectOption value="nuxt" disabled>
              Nuxt (disabled)
            </SelectOption>
          </Group>
        </SelectPanel>
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
    const trigger = canvas.getByRole("combobox", { name: "Framework" });

    await step("Open select — listbox appears", async () => {
      await userEvent.click(trigger);
      const listbox = await page.findByRole("listbox");
      await expect(listbox).toBeInTheDocument();
    });

    await step("Arrow keys move among options", async () => {
      await userEvent.keyboard("{ArrowDown}");
      await userEvent.keyboard("{ArrowDown}");
      await expect(page.getByRole("listbox")).toBeInTheDocument();
    });

    await step("Escape closes and restores focus to the trigger", async () => {
      await userEvent.keyboard("{Escape}");
      await expect(page.queryByRole("listbox")).not.toBeInTheDocument();
      await expect(trigger).toHaveFocus();
    });
  },
};

/**
 * Visual QA matrix — trigger states + static list chrome.
 * Does **not** leave Radix Selects open (open listboxes lock body scroll and
 * break the Docs page when Matrix is inlined under autodocs).
 */
export const Matrix: Story = {
  argTypes: {
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    open: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    disabled: { table: { disable: true } },
    required: { table: { disable: true } },
    name: { table: { disable: true } },
    size: { table: { disable: true } },
    color: { table: { disable: true } },
    fullWidth: { table: { disable: true } },
  },
  parameters: {
    controls: { disable: true },
    layout: "padded",
  },
  render: function MatrixStory() {
    return (
      <div className="flex w-full max-w-5xl flex-col gap-10 p-2">
        {/* ── Size ──────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <SectionHeading>Trigger size</SectionHeading>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Shared <code className="text-label-sm">ControlSize</code> with Input
            / Button. Open any trigger to exercise the listbox.
          </Text>
          <div className="flex flex-wrap items-start gap-6">
            {controlSizeOrder.map(function renderSize(size) {
              return (
                <FieldSelect
                  key={size}
                  label={size}
                  size={size}
                  defaultValue="vite"
                  aria-label={`Size ${size}`}
                />
              );
            })}
          </div>
        </section>

        {/* ── Color ─────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <SectionHeading>Trigger color (validation)</SectionHeading>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Same intent mapping as Input — border + focus ring. Pair{" "}
            <code className="text-label-sm">danger</code> with Field message
            tone for errors.
          </Text>
          <div className="flex flex-wrap items-start gap-6">
            {TRIGGER_COLORS.map(function renderColor(color) {
              return (
                <FieldSelect
                  key={color}
                  label={color}
                  color={color}
                  defaultValue="remix"
                  aria-label={`Color ${color}`}
                />
              );
            })}
          </div>
        </section>

        {/* ── States ────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <SectionHeading>Trigger states</SectionHeading>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Closed triggers only here — open listboxes use scroll-lock and must
            not be multi-mounted under Docs. Use <strong>Playground</strong> for
            open / keyboard.
          </Text>
          <div className="flex flex-wrap items-start gap-6">
            <FieldSelect
              label="Placeholder"
              placeholder="Pick one…"
              aria-label="Placeholder"
            />
            <FieldSelect
              label="Selected"
              defaultValue="remix"
              aria-label="Selected"
            />
            <FieldSelect
              label="Disabled (control)"
              defaultValue="next"
              disabled
              aria-label="Disabled control"
            />
            <FieldSelect
              label="Required + danger"
              required
              color="danger"
              placeholder="Required…"
              aria-label="Required danger"
            />
          </div>
        </section>

        {/* ── List chrome (static) ──────────────────────────────── */}
        <section className="flex flex-col gap-4">
          <SectionHeading>List chrome (static preview)</SectionHeading>
          <Text
            as="p"
            variant={TextVariant.body}
            size={TextSize.sm}
            color={TextColor.muted}
          >
            Same CVA recipes as Content / Item / Label / Separator — rendered
            inline without a portaled open Select so Docs remains usable.
          </Text>
          <div className="flex flex-wrap items-start gap-8">
            <StaticListPreview label="Highlighted · checked · disabled">
              <div className={selectLabelVariants()}>Popular</div>
              <StaticItem checked>Remix</StaticItem>
              <StaticItem highlighted>Vite</StaticItem>
              <div className={selectSeparatorVariants()} />
              <div className={selectLabelVariants()}>Other</div>
              <StaticItem>Astro</StaticItem>
              <StaticItem disabled>Nuxt (disabled)</StaticItem>
            </StaticListPreview>

            <StaticListPreview label="Group structure">
              <div className={selectLabelVariants()}>Frameworks</div>
              <StaticItem checked>Next.js</StaticItem>
              <StaticItem>Remix</StaticItem>
              <div className={selectSeparatorVariants()} />
              <StaticItem>Vite</StaticItem>
            </StaticListPreview>
          </div>
        </section>
      </div>
    );
  },
};
