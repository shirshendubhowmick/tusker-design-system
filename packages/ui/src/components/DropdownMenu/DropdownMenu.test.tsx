// @vitest-environment jsdom
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
  HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";

import { Button } from "../Button";
import { IconButton } from "../IconButton";
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
  dropdownMenuContentVariants,
  dropdownMenuItemVariants,
  dropdownMenuLabelVariants,
  dropdownMenuSeparatorVariants,
} from "./DropdownMenu";

function classTokens(className: string | null | undefined): Set<string> {
  return new Set((className ?? "").split(/\s+/).filter(Boolean));
}

function expectHasClasses(
  className: string | null | undefined,
  expected: string[],
): void {
  const tokens = classTokens(className);
  for (const token of expected) {
    expect(tokens.has(token), `expected "${token}" in "${className}"`).toBe(
      true,
    );
  }
}

function BasicMenu({
  defaultOpen = false,
  open: openProp,
  onOpenChange,
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Root defaultOpen={defaultOpen} open={openProp} onOpenChange={onOpenChange}>
      <Trigger asChild>
        <Button>Open menu</Button>
      </Trigger>
      <Portal>
        <Content sideOffset={4} align="start">
          <Item>New file</Item>
          <Item>Open…</Item>
          <Item disabled>Disabled item</Item>
          <Separator />
          <Item tone="danger">Delete</Item>
        </Content>
      </Portal>
    </Root>
  );
}

describe("dropdownMenu variants", () => {
  it("content uses menu surface + dropdown z-index", () => {
    expectHasClasses(dropdownMenuContentVariants(), [
      "z-dropdown",
      "shadow-md",
      "bg-bg-surface",
      "rounded-md",
      "p-1",
      "min-w-40",
    ]);
  });

  it("item defaults to pointer cursor and resets global anchor chrome", () => {
    expectHasClasses(dropdownMenuItemVariants(), [
      "text-label-md",
      "text-fg-default",
      "rounded-sm",
      "cursor-pointer",
      "data-[disabled]:cursor-not-allowed",
      "no-underline",
      "hover:no-underline",
    ]);
    expect(dropdownMenuItemVariants()).not.toContain("text-danger-text");
  });

  it("supports Item asChild link composition", async () => {
    render(
      <Root defaultOpen>
        <Trigger asChild>
          <Button>Menu</Button>
        </Trigger>
        <Portal>
          <Content>
            <Item asChild>
              <a href="#docs">Documentation</a>
            </Item>
          </Content>
        </Portal>
      </Root>,
    );

    const link = screen.getByRole("menuitem", { name: "Documentation" });
    expect(link).toBeInstanceOf(HTMLAnchorElement);
    expect(link).toHaveAttribute("href", "#docs");
    expectHasClasses(link.className, ["text-fg-default", "no-underline"]);
  });

  it("item supports danger tone and inset", () => {
    expectHasClasses(dropdownMenuItemVariants({ tone: "danger" }), [
      "text-danger-text",
    ]);
    expectHasClasses(dropdownMenuItemVariants({ inset: true }), ["pl-8"]);
  });

  it("label and separator use semantic tokens", () => {
    expectHasClasses(dropdownMenuLabelVariants(), [
      "text-label-sm",
      "text-fg-muted",
    ]);
    expectHasClasses(dropdownMenuSeparatorVariants(), [
      "bg-border-default",
      "h-px",
    ]);
  });
});

describe("DropdownMenu", () => {
  it("opens from trigger and exposes menu role with items", async () => {
    const user = userEvent.setup();
    const { container } = render(<BasicMenu />);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
    expectHasClasses(menu.className, ["z-dropdown", "bg-bg-surface", "p-1"]);
    expect(
      within(menu).getByRole("menuitem", { name: "New file" }),
    ).toBeInTheDocument();
    expect(
      within(menu).getByRole("menuitem", { name: "Delete" }),
    ).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it("selects an item, calls onSelect, and closes", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <Root onOpenChange={onOpenChange}>
        <Trigger asChild>
          <Button>Actions</Button>
        </Trigger>
        <Portal>
          <Content>
            <Item onSelect={onSelect}>Rename</Item>
          </Content>
        </Portal>
      </Root>,
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));
    await user.click(screen.getByRole("menuitem", { name: "Rename" }));

    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("does not select disabled items", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <Root defaultOpen>
        <Trigger asChild>
          <Button>Actions</Button>
        </Trigger>
        <Portal>
          <Content>
            <Item disabled onSelect={onSelect}>
              Locked
            </Item>
          </Content>
        </Portal>
      </Root>,
    );

    const item = screen.getByRole("menuitem", { name: "Locked" });
    expect(item).toHaveAttribute("data-disabled");
    expectHasClasses(item.className, [
      "cursor-pointer",
      "data-[disabled]:cursor-not-allowed",
    ]);
    await user.click(item);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>External open</Button>
          <Root open={open} onOpenChange={setOpen}>
            <Trigger asChild>
              <Button>Menu</Button>
            </Trigger>
            <Portal>
              <Content>
                <Item>One</Item>
              </Content>
            </Portal>
          </Root>
        </>
      );
    }

    render(<Controlled />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "External open" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("supports checkbox items", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <Root defaultOpen>
        <Trigger asChild>
          <Button>View</Button>
        </Trigger>
        <Portal>
          <Content>
            <CheckboxItem checked={false} onCheckedChange={onCheckedChange}>
              <ItemIndicator>
                <CheckIcon />
              </ItemIndicator>
              Show sidebar
            </CheckboxItem>
          </Content>
        </Portal>
      </Root>,
    );

    const item = screen.getByRole("menuitemcheckbox", { name: "Show sidebar" });
    expect(item).toHaveAttribute("data-state", "unchecked");
    await user.click(item);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("supports radio items", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Root defaultOpen>
        <Trigger asChild>
          <Button>Sort</Button>
        </Trigger>
        <Portal>
          <Content>
            <RadioGroup value="name" onValueChange={onValueChange}>
              <RadioItem value="name">
                <ItemIndicator>
                  <DotFilledIcon />
                </ItemIndicator>
                Name
              </RadioItem>
              <RadioItem value="date">
                <ItemIndicator>
                  <DotFilledIcon />
                </ItemIndicator>
                Date
              </RadioItem>
            </RadioGroup>
          </Content>
        </Portal>
      </Root>,
    );

    expect(screen.getByRole("menuitemradio", { name: "Name" })).toHaveAttribute(
      "data-state",
      "checked",
    );
    await user.click(screen.getByRole("menuitemradio", { name: "Date" }));
    expect(onValueChange).toHaveBeenCalledWith("date");
  });

  it("renders labels, groups, and separators", () => {
    render(
      <Root defaultOpen>
        <Trigger asChild>
          <Button>Menu</Button>
        </Trigger>
        <Portal>
          <Content>
            <Label>Account</Label>
            <Group>
              <Item>Profile</Item>
              <Item>Settings</Item>
            </Group>
            <Separator data-testid="menu-sep" />
            <Item>Sign out</Item>
          </Content>
        </Portal>
      </Root>,
    );

    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByTestId("menu-sep")).toBeInTheDocument();
    expect(
      screen.getByRole("menuitem", { name: "Profile" }),
    ).toBeInTheDocument();
  });

  it("opens a submenu", async () => {
    const user = userEvent.setup();

    render(
      <Root defaultOpen>
        <Trigger asChild>
          <Button>Menu</Button>
        </Trigger>
        <Portal>
          <Content>
            <Sub>
              <SubTrigger>
                More
                <ChevronRightIcon className="ml-auto" />
              </SubTrigger>
              <Portal>
                <SubContent sideOffset={2}>
                  <Item>Save as…</Item>
                </SubContent>
              </Portal>
            </Sub>
          </Content>
        </Portal>
      </Root>,
    );

    await user.hover(screen.getByRole("menuitem", { name: "More" }));
    expect(
      await screen.findByRole("menuitem", { name: "Save as…" }),
    ).toBeInTheDocument();
  });

  it("forwards refs on Trigger and Content", async () => {
    const user = userEvent.setup();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Root>
        <Trigger ref={triggerRef} asChild>
          <IconButton aria-label="Options">
            <HamburgerMenuIcon />
          </IconButton>
        </Trigger>
        <Portal>
          <Content ref={contentRef}>
            <Item>A</Item>
          </Content>
        </Portal>
      </Root>,
    );

    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    await user.click(screen.getByRole("button", { name: "Options" }));
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
    expect(contentRef.current).toHaveAttribute("role", "menu");
  });

  it("applies danger tone classes on Item", () => {
    render(
      <Root defaultOpen>
        <Trigger asChild>
          <Button>Menu</Button>
        </Trigger>
        <Portal>
          <Content>
            <Item tone="danger">Delete project</Item>
          </Content>
        </Portal>
      </Root>,
    );

    expectHasClasses(
      screen.getByRole("menuitem", { name: "Delete project" }).className,
      ["text-danger-text"],
    );
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<BasicMenu />);

    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
