import { RADIX_STEPS, palette } from "./palette";
import {
  type SemanticRef,
  formatSemanticRef,
  getSemanticRef,
  hasModeOverride,
  semanticColorGroups,
  semanticColorTokens,
} from "./semantic";

function assertValidRef(ref: SemanticRef, label: string): void {
  if ("kind" in ref && ref.kind === "fixed") {
    expect(ref.value, label).toMatch(/\S/);
    return;
  }
  if ("kind" in ref && ref.kind === "overlay") {
    expect(["black", "white"]).toContain(ref.name);
    expect(RADIX_STEPS).toContain(ref.step);
    return;
  }
  if ("kind" in ref && ref.kind === "mix") {
    expect(ref.aPercent, label).toBeGreaterThanOrEqual(1);
    expect(ref.aPercent, label).toBeLessThanOrEqual(99);
    expect(Object.keys(palette)).toContain(ref.a.palette);
    expect(RADIX_STEPS).toContain(ref.a.step);
    if ("kind" in ref.b) {
      expect(["black", "white"]).toContain(ref.b.kind);
    } else {
      expect(Object.keys(palette)).toContain(ref.b.palette);
      expect(RADIX_STEPS).toContain(ref.b.step);
    }
    return;
  }
  expect(Object.keys(palette)).toContain(ref.palette);
  expect(RADIX_STEPS).toContain(ref.step);
}

describe("semanticColorTokens", () => {
  it("has unique names", () => {
    const names = semanticColorTokens.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("covers every declared group", () => {
    const used = new Set(semanticColorTokens.map((t) => t.group));
    for (const group of semanticColorGroups) {
      expect(used.has(group), `missing group ${group}`).toBe(true);
    }
  });

  it("has valid light/dark primitive refs for every token", () => {
    for (const token of semanticColorTokens) {
      assertValidRef(token.light, `${token.name}.light`);
      assertValidRef(token.dark, `${token.name}.dark`);
      expect(token.description).toMatch(/\S/);
    }
  });

  it("uses light≠dark overrides only where documented", () => {
    const elevated = semanticColorTokens.filter(hasModeOverride);
    const names = elevated.map((t) => t.name).sort();
    // Intentional mode overrides in the catalog today.
    expect(names).toEqual(
      [
        "bg-surface",
        "bg-surface-active",
        "bg-surface-hover",
        // Status text: darker step in light (AA on soft), step 11 in dark.
        "info-text",
        "overlay-scrim",
        "success-text",
        "warning-text",
      ].sort(),
    );
  });

  it("formatSemanticRef and getSemanticRef work for palette, fixed, and overlay", () => {
    const canvas = semanticColorTokens.find((t) => t.name === "bg-canvas");
    expect(canvas).toBeDefined();
    if (!canvas) return;
    expect(formatSemanticRef(canvas.light)).toBe("gray.1");
    expect(getSemanticRef(canvas, "light")).toEqual(canvas.light);
    expect(getSemanticRef(canvas, "dark")).toEqual(canvas.dark);

    const onWarning = semanticColorTokens.find(
      (t) => t.name === "fg-on-warning",
    );
    expect(onWarning).toBeDefined();
    if (!onWarning) return;
    expect(formatSemanticRef(onWarning.light)).toBe("#1c2024");

    const scrim = semanticColorTokens.find((t) => t.name === "overlay-scrim");
    expect(scrim).toBeDefined();
    if (!scrim) return;
    expect(formatSemanticRef(scrim.light)).toBe("black-a8");
    expect(formatSemanticRef(scrim.dark)).toBe("black-a9");
    expect(hasModeOverride(scrim)).toBe(true);
  });

  it("maps brand/accent tokens to brand palette (indigo via palette)", () => {
    const accent = semanticColorTokens.filter((t) => t.group === "accent");
    expect(accent.length).toBeGreaterThan(0);
    for (const token of accent) {
      if (!("kind" in token.light)) {
        expect(token.light.palette).toBe("brand");
      }
    }
  });
});
