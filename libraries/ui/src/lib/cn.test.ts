import { cn } from "./cn";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("skips falsy values", () => {
    const off = false;
    expect(cn("a", off && "b", null, undefined, "c")).toBe("a c");
  });

  it("resolves Tailwind conflicts (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-fg-muted", "text-fg-default")).toBe("text-fg-default");
  });

  it("supports conditional objects", () => {
    expect(cn({ "bg-accent-solid": true, "bg-bg-subtle": false })).toBe(
      "bg-accent-solid",
    );
  });

  it("keeps semantic text style + text color (no false conflict)", () => {
    // Mirrors Button primary: size label + on-accent foreground.
    expect(cn("text-label-lg", "text-fg-on-accent")).toBe(
      "text-label-lg text-fg-on-accent",
    );
    expect(cn("text-fg-on-accent", "text-label-lg")).toBe(
      "text-fg-on-accent text-label-lg",
    );
  });

  it("still resolves conflicting semantic text styles (last wins)", () => {
    expect(cn("text-label-md", "text-label-lg")).toBe("text-label-lg");
  });

  it("still resolves conflicting semantic text colors (last wins)", () => {
    expect(cn("text-accent-text", "text-danger-text")).toBe("text-danger-text");
  });
});
