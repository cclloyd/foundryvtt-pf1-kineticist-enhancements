import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    sourcemap: true,
    lib: {
      // Your entry file (no HTML needed)
      entry: "src/module/pf1-kineticist-enhancements.ts",
      // A global name for UMD/IIFE builds (optional if you don’t emit those)
      name: "Pf1KineticistEnhancements",
      // Output filename base (without extension)
      fileName: (format) => `index.${format}`
      // formats: ["es", "cjs", "umd"], // pick what you need; default is ["es","umd"]
    },
    rollupOptions: {
      // Mark deps as external if you don’t want them bundled
      // external: ["react"],
      // output: { globals: { react: "React" } },
    },
    // target: "modules", // optional
    // minify: "esbuild", // default
  },
});
