import {
  ControlSize,
  controlBoxClass,
  controlBoxLockClass,
  controlGlyphClass,
  controlGlyphSvgClass,
  controlHeightClass,
  controlIconOnlyGlyphSvgClass,
  controlSizeOrder,
  resolveControlSize,
} from "./size";

describe("ControlSize", () => {
  it("lists every size once in ascending order", () => {
    expect(controlSizeOrder).toEqual([
      ControlSize.sm,
      ControlSize.md,
      ControlSize.lg,
    ]);
    expect(new Set(controlSizeOrder).size).toBe(controlSizeOrder.length);
    expect([...controlSizeOrder].sort()).toEqual(
      Object.keys(controlHeightClass).sort(),
    );
  });

  it("keeps height and box maps in lockstep", () => {
    for (const size of controlSizeOrder) {
      expect(controlHeightClass[size]).toBeDefined();
      expect(controlBoxClass[size]).toBeDefined();
      expect(controlBoxLockClass[size]).toBeDefined();
      expect(controlGlyphClass[size]).toBeDefined();
      expect(controlGlyphSvgClass[size]).toBeDefined();
      expect(controlIconOnlyGlyphSvgClass[size]).toBeDefined();
    }
  });

  it("matches the product control geometry", () => {
    expect(controlHeightClass).toEqual({
      sm: "h-8",
      md: "h-9",
      lg: "h-10",
    });
    expect(controlBoxClass).toEqual({
      sm: "size-8",
      md: "size-9",
      lg: "size-10",
    });
    expect(controlGlyphClass).toEqual({
      sm: "size-3.5",
      md: "size-4",
      lg: "size-4.5",
    });
  });

  it("resolveControlSize defaults and accepts known tokens", () => {
    expect(resolveControlSize(undefined)).toBe(ControlSize.md);
    expect(resolveControlSize(null)).toBe(ControlSize.md);
    expect(resolveControlSize(ControlSize.sm)).toBe(ControlSize.sm);
    expect(resolveControlSize(ControlSize.lg)).toBe(ControlSize.lg);
  });
});
