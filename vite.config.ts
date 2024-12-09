import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    tsConfigPaths(),
    dts({
      include: ["lib/**/*"],
      beforeWriteFile: (filePath, content) => ({
        filePath: filePath.replace("/lib", ""),
        content,
      }),
    }),
  ],
  build: {
    lib: {
      entry: resolve("lib", "main.ts"),
      name: "ReactFeatureFlag",
      formats: ["cjs", "es", "umd", "iife"],
      fileName: (format) => `cobblemon-model-renderer.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
    },
  },
}));
