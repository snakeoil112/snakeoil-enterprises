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
        "social/youtube": resolve(__dirname, "social/youtube/index.html"),
        "social/twitter": resolve(__dirname, "social/twitter/index.html"),
        "social/instagram": resolve(__dirname, "social/instagram/index.html"),
        "social/linkedin": resolve(__dirname, "social/linkedin/index.html"),
        "social/tiktok": resolve(__dirname, "social/tiktok/index.html"),
        "social/facebook": resolve(__dirname, "social/facebook/index.html"),
        "social/reddit": resolve(__dirname, "social/reddit/index.html"),
      },
    },
  },
});
