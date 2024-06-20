import { defineConfig } from "vite";

const banner = `
/**
 * L.Map.SelectArea - Area selection tool for leaflet
 *
 * @author Alexander Milevski <info@w8r.name>
 * @see https://github.com/w8r/leaflet-area-select
 * @license MIT
 * @preserve
 */`;

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.mjs",
      name: "L.Map.SelectArea",
      formats: ["es", "cjs", "umd"],
      fileName: (format) =>
        `index.${{ es: "mjs", cjs: "cjs", umd: "js" }[format]}`,
    },
    rollupOptions: {
      external: ["leaflet"],
      output: {
        banner,
        globals: {
          leaflet: "L",
        },
      },
    },
  },
});
