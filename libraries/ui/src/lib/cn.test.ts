import { describe, expect, it } from "vitest";

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
});
