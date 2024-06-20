import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  publicDir: "./docs/public",
  build: {
    outDir: "dist/docs",
  },
});
