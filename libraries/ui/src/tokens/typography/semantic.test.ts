import { describe, expect, it } from "vitest";

import { fontFamilies } from "./families";
import {
  fontSizeAliases,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
} from "./scale";
import { textStyleGroups, textStyles } from "./semantic";

describe("typography primitives", () => {
  it("defines sans and mono families with non-empty stacks", () => {
    expect(fontFamilies.sans.stack.length).toBeGreaterThan(2);
    expect(fontFamilies.mono.stack.length).toBeGreaterThan(2);
    expect(fontFamilies.sans.stack[0]).toBe("Inter");
    expect(fontFamilies.mono.stack[0]).toBe("JetBrains Mono");
  });

  it("has rem/px/defaultLineHeight on every size step", () => {
    for (const [name, size] of Object.entries(fontSizes)) {
      expect(size.rem, name).toMatch(/rem$/);
      expect(size.px, name).toBeGreaterThan(0);
      expect(size.defaultLineHeight, name).toMatch(/\d/);
    }
  });

  it("aliases text-base to md (16px)", () => {
    expect(fontSizeAliases.base).toBe("md");
    expect(fontSizes.md.px).toBe(16);
  });
});

describe("textStyles", () => {
  it("has unique names and covers every group", () => {
    const names = textStyles.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);

    const used = new Set(textStyles.map((t) => t.group));
    for (const group of textStyleGroups) {
      expect(used.has(group), `missing group ${group}`).toBe(true);
    }
  });

  it("only references valid primitive tokens", () => {
    for (const style of textStyles) {
      expect(fontFamilies).toHaveProperty(style.family);
      expect(fontSizes).toHaveProperty(style.size);
      expect(fontWeights).toHaveProperty(style.weight);
      expect(lineHeights).toHaveProperty(style.leading);
      expect(letterSpacings).toHaveProperty(style.tracking);
      if ("transform" in style && style.transform !== undefined) {
        expect(["none", "uppercase"]).toContain(style.transform);
      }
    }
  });

  it("uses mono only for code styles and uppercase only for overline", () => {
    for (const style of textStyles) {
      if (style.group === "code") {
        expect(style.family).toBe("mono");
      } else {
        expect(style.family).toBe("sans");
      }
    }
    const upper = textStyles.filter(
      (s) => "transform" in s && s.transform === "uppercase",
    );
    expect(upper.map((s) => s.name)).toEqual(["label-overline"]);
  });

  it("defaults body-md to dense 14px tool body", () => {
    const bodyMd = textStyles.find((s) => s.name === "body-md");
    expect(bodyMd).toBeDefined();
    if (!bodyMd) return;
    expect(bodyMd.size).toBe("sm");
    expect(fontSizes.sm.px).toBe(14);
  });
});
