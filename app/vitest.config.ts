import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Il dominio e' puro: environment node, niente jsdom.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
