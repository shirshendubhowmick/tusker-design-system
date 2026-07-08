import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * Minimal consumer of @design-system/ui (JIT source).
 * - Vite transforms workspace TS/TSX by default
 * - Tailwind v4 processes @design-system/ui/styles.css
 * - ssr.noExternal keeps the package in the transform pipeline under SSR
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  ssr: {
    noExternal: ["@design-system/ui"],
  },
  server: {
    host: "0.0.0.0",
  },
});
