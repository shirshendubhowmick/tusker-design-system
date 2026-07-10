/**
 * Generate package.json `exports` from the public surface:
 * - src/components/<Name>/index.ts → ./Name
 * - fixed entries: tokens, cn, styles.css, package.json
 *
 * Usage:
 *   node --experimental-strip-types ./scripts/gen-exports.mts
 *   node --experimental-strip-types ./scripts/gen-exports.mts --check
 */
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const packageJsonPath = join(root, "package.json");
const componentsDir = join(root, "src/components");

export type ExportsMap = Record<string, string>;

export function listPublicComponents(
  componentsRoot: string = componentsDir,
): string[] {
  if (!existsSync(componentsRoot)) return [];

  return readdirSync(componentsRoot)
    .filter((name) => {
      const dir = join(componentsRoot, name);
      if (!statSync(dir).isDirectory()) return false;
      return (
        existsSync(join(dir, "index.ts")) || existsSync(join(dir, "index.tsx"))
      );
    })
    .sort((a, b) => a.localeCompare(b));
}

/** Fixed public subpaths (not derived from components/). */
export function fixedExports(): ExportsMap {
  return {
    "./tokens": "./src/tokens/index.ts",
    "./cn": "./src/utils/cn.ts",
    "./focus-ring": "./src/utils/focus-ring.ts",
    "./styles.css": "./src/styles/index.css",
    "./package.json": "./package.json",
  };
}

export function buildExports(
  components: string[],
  componentsRoot: string = componentsDir,
): ExportsMap {
  const exportsMap: ExportsMap = {};

  for (const name of components) {
    const indexTs = join(componentsRoot, name, "index.ts");
    const indexTsx = join(componentsRoot, name, "index.tsx");
    // Prefer .ts; fall back to .tsx only when that is the public entry on disk.
    // Default to .ts (package convention) when the path does not exist yet.
    const rel =
      existsSync(indexTsx) && !existsSync(indexTs)
        ? `./src/components/${name}/index.tsx`
        : `./src/components/${name}/index.ts`;
    exportsMap[`./${name}`] = rel;
  }

  return { ...exportsMap, ...fixedExports() };
}

export function syncPackageExports(options: {
  checkOnly?: boolean;
  pkgPath?: string;
  componentsRoot?: string;
}): { changed: boolean; exports: ExportsMap; components: string[] } {
  const pkgPath = options.pkgPath ?? packageJsonPath;
  const componentsRoot = options.componentsRoot ?? componentsDir;
  const components = listPublicComponents(componentsRoot);
  const nextExports = buildExports(components, componentsRoot);

  const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as {
    exports?: ExportsMap;
    [key: string]: unknown;
  };

  const prev = JSON.stringify(pkg.exports ?? {}, null, 2);
  const next = JSON.stringify(nextExports, null, 2);
  const changed = prev !== next;

  if (!changed) {
    return { changed: false, exports: nextExports, components };
  }

  if (options.checkOnly) {
    return { changed: true, exports: nextExports, components };
  }

  pkg.exports = nextExports;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
  return { changed: true, exports: nextExports, components };
}

function isExecutedAsCli(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  return entry.endsWith("gen-exports.mts") || entry.endsWith("gen-exports.ts");
}

if (isExecutedAsCli()) {
  const checkOnly = process.argv.includes("--check");
  const result = syncPackageExports({ checkOnly });

  if (!result.changed) {
    console.log(
      `exports up to date (${result.components.length} component(s): ${result.components.join(", ") || "none"})`,
    );
    process.exit(0);
  }

  if (checkOnly) {
    console.error("package.json exports are stale. Run: pnpm exports:generate");
    console.error("Expected:\n" + JSON.stringify(result.exports, null, 2));
    process.exit(1);
  }

  console.log(
    `wrote exports (${result.components.length} component(s): ${result.components.join(", ") || "none"})`,
  );
}
