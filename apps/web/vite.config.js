import { resolve } from "node:path";
import { defineConfig } from "vite";

const basePath = process.env.VITE_BASE_PATH ?? "/";

export default defineConfig({
  base: basePath,
  server: {
    port: 5173,
    strictPort: false,
  },
  preview: {
    port: 4173,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "waitlist/product-opportunity-radar": resolve(
          __dirname,
          "waitlist/product-opportunity-radar/index.html",
        ),
        "waitlist/trade-cost-calculator": resolve(
          __dirname,
          "waitlist/trade-cost-calculator/index.html",
        ),
        "waitlist/pet-groomer-crm": resolve(
          __dirname,
          "waitlist/pet-groomer-crm/index.html",
        ),
        "research-feed": resolve(__dirname, "research-feed/index.html"),
        metrics: resolve(__dirname, "metrics/index.html"),
      },
    },
  },
});
