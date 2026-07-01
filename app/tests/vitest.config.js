import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../src", import.meta.url)),
      "open-sse": fileURLToPath(new URL("../open-sse", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    globals: true,
    passWithNoTests: true,
    root: rootDir,
  },
});
