import {
  SurfaceElevation,
  SurfacePadding,
  surface,
  surfaceClass,
  surfaceElevationShadowClass,
  surfacePaddingClass,
  surfaceSectionClass,
} from "./surface";

describe("surface", () => {
  it("defaults to raised surface, border, radius, and md elevation", () => {
    expect(surface()).toBe(
      "bg-bg-surface text-fg-default border-border-default border rounded-md shadow-md",
    );
  });

  it("supports every elevation step", () => {
    for (const elevation of Object.values(SurfaceElevation)) {
      expect(surface({ elevation })).toContain(
        surfaceElevationShadowClass[elevation],
      );
    }
  });

  it("supports padding steps", () => {
    expect(surface({ padding: SurfacePadding.none })).not.toMatch(/\bp-\d/);
    expect(surface({ padding: SurfacePadding.sm })).toContain(
      surfacePaddingClass.sm,
    );
    expect(surface({ padding: SurfacePadding.md })).toContain(
      surfacePaddingClass.md,
    );
    expect(surface({ padding: SurfacePadding.lg })).toContain(
      surfacePaddingClass.lg,
    );
  });

  it("can drop border and radius", () => {
    const classes = surface({ bordered: false, rounded: false });
    expect(classes).not.toContain("border-border-default");
    expect(classes).not.toContain("rounded-md");
    expect(classes).toContain("bg-bg-surface");
  });

  it("inverse uses inverse fill/text and defaults to unbordered", () => {
    const classes = surface({ inverse: true });
    expect(classes).toContain("bg-bg-inverse");
    expect(classes).toContain("text-fg-on-inverse");
    expect(classes).not.toContain("border-border-default");
    expect(classes).toContain("shadow-md");
  });

  it("merges className last", () => {
    expect(surface({ className: "w-80 max-w-full" })).toContain("w-80");
    expect(surface({ className: "w-80 max-w-full" })).toContain("max-w-full");
  });

  it("exposes named recipes", () => {
    expect(surfaceClass.card).toContain("shadow-sm");
    expect(surfaceClass.card).toContain("p-4");
    expect(surfaceClass.popover).toContain("shadow-md");
    expect(surfaceClass.dialog).toContain("shadow-lg");
    expect(surfaceClass.menu).toContain(surfaceSectionClass.menu);
    expect(surfaceClass.inverse).toContain("bg-bg-inverse");
  });

  it("keeps section recipes as full Tailwind class strings", () => {
    expect(surfaceSectionClass.header).toContain("border-b");
    expect(surfaceSectionClass.body).toBe("p-4");
    expect(surfaceSectionClass.footer).toContain("border-t");
    expect(surfaceSectionClass.menu).toBe("p-1");
  });
});
