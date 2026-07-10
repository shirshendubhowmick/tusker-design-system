import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { buildExports } from "./gen-exports.mts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("gen-exports", () => {
  it("maps each public component to its index and includes fixed entries", () => {
    const exportsMap = buildExports(["Button", "Input"]);
    expect(exportsMap["./Button"]).toBe("./src/components/Button/index.ts");
    expect(exportsMap["./Input"]).toBe("./src/components/Input/index.ts");
    expect(exportsMap["./tokens"]).toBe("./src/tokens/index.ts");
    expect(exportsMap["./cn"]).toBe("./src/utils/cn.ts");
    expect(exportsMap["./focus-ring"]).toBe("./src/utils/focus-ring.ts");
    expect(exportsMap["./surface"]).toBe("./src/utils/surface.ts");
    expect(exportsMap["./overlay"]).toBe("./src/utils/overlay.ts");
    expect(exportsMap["./styles.css"]).toBe("./src/styles/index.css");
    expect(exportsMap["./package.json"]).toBe("./package.json");
    // no root barrel
    expect(exportsMap["."]).toBeUndefined();
  });

  it("package.json exports match codegen (exports:check)", () => {
    expect(() =>
      execFileSync(
        process.execPath,
        ["--experimental-strip-types", "./scripts/gen-exports.mts", "--check"],
        { cwd: root, stdio: "pipe" },
      ),
    ).not.toThrow();
  });

  it("every component export target exists on disk", () => {
    const pkg = JSON.parse(
      readFileSync(join(root, "package.json"), "utf8"),
    ) as {
      exports: Record<string, string>;
    };
    for (const [subpath, target] of Object.entries(pkg.exports)) {
      if (subpath === "./package.json") continue;
      const abs = join(root, target);
      expect(existsSync(abs), `${subpath} → ${target}`).toBe(true);
    }
  });
});
