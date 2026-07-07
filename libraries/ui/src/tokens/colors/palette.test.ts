import { RADIX_STEPS, overlays, palette } from "./palette";

describe("palette", () => {
  it("defines all product palettes with radix sources and roles", () => {
    expect(Object.keys(palette).sort()).toEqual(
      ["amber", "blue", "brand", "gray", "green", "red"].sort(),
    );

    for (const [name, entry] of Object.entries(palette)) {
      expect(entry.radix, name).toBeTruthy();
      expect(entry.role, name).toBeTruthy();
      expect(entry.description, name).toMatch(/\S/);
    }
  });

  it("maps gray → slate and brand → indigo", () => {
    expect(palette.gray.radix).toBe("slate");
    expect(palette.brand.radix).toBe("indigo");
  });

  it("exposes the full Radix 1–12 step list", () => {
    expect([...RADIX_STEPS]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("defines black/white overlay scales", () => {
    expect(overlays.black.radix).toBe("black");
    expect(overlays.white.radix).toBe("white");
  });
});
