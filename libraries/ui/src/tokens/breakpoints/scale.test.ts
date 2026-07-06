import { describe, expect, it } from "vitest";

import {
  breakpointOrder,
  breakpoints,
  formatBreakpointRange,
  resolveBreakpoint,
} from "./scale";
import { defaultStorybookViewport, designSystemViewports } from "./viewports";

describe("breakpoints", () => {
  it("defines mobile / tablet / desktop in order", () => {
    expect([...breakpointOrder]).toEqual(["mobile", "tablet", "desktop"]);
    expect(Object.keys(breakpoints).sort()).toEqual(
      [...breakpointOrder].sort(),
    );
  });

  it("uses contiguous mobile-first ranges", () => {
    expect(breakpoints.mobile.minWidthPx).toBe(0);
    expect(breakpoints.mobile.maxWidthPx).toBe(
      breakpoints.tablet.minWidthPx - 1,
    );
    expect(breakpoints.tablet.maxWidthPx).toBe(
      breakpoints.desktop.minWidthPx - 1,
    );
    expect(breakpoints.desktop.maxWidthPx).toBeNull();
    expect(breakpoints.tablet.minWidthRem).toBe("48rem");
    expect(breakpoints.desktop.minWidthRem).toBe("64rem");
  });

  it("resolveBreakpoint maps widths to tiers", () => {
    expect(resolveBreakpoint(0)).toBe("mobile");
    expect(resolveBreakpoint(767)).toBe("mobile");
    expect(resolveBreakpoint(768)).toBe("tablet");
    expect(resolveBreakpoint(1023)).toBe("tablet");
    expect(resolveBreakpoint(1024)).toBe("desktop");
    expect(resolveBreakpoint(1920)).toBe("desktop");
  });

  it("formatBreakpointRange is human-readable", () => {
    expect(formatBreakpointRange("mobile")).toBe("0 – 767px");
    expect(formatBreakpointRange("tablet")).toBe("768 – 1023px");
    expect(formatBreakpointRange("desktop")).toBe("≥ 1024px");
  });

  it("Storybook viewports align with product tiers", () => {
    expect(defaultStorybookViewport).toBe("desktop");
    for (const name of breakpointOrder) {
      expect(designSystemViewports[name].type).toBe(name);
      const width = Number.parseInt(
        designSystemViewports[name].styles.width,
        10,
      );
      expect(resolveBreakpoint(width)).toBe(name);
    }
  });
});
