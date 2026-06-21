import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.{test,spec}.{js,mjs}"],
    exclude: ["node_modules", "dist", "build", "coverage"],
  },
});
