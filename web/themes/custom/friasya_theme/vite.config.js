import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  root: "./",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/js/main.js"),
      },
      output: {
        entryFileNames: "js/[name].bundle.js",
        chunkFileNames: "js/[name].[hash].js",
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split(".").pop();

          // Usamos originalFileName para mantener la estructura de carpetas
          const originalPath = assetInfo.originalFileName;

          // Para imágenes
          if (/\.(png|jpe?g|gif|svg|webp)$/i.test(assetInfo.name)) {
            return `${originalPath.replace(/^public\//, "")}`;
          }

          // Para fuentes
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            // Mantiene la estructura de carpetas para las fuentes
            const fontPath = originalPath.replace(/^public\/assets\/fonts\//, ""); // Elimina el prefijo "public/assets/fonts/"
            return `assets/fonts/${fontPath}`; // Retorna con la estructura de carpetas
          }

          if (extType === "css") {
            return `css/[name][extname]`;
          }

          // Por defecto
          return `assets/[name][extname]`;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@js": resolve(__dirname, "src/js"),
      "@scss": resolve(__dirname, "src/scss"),
      "@utils": resolve(__dirname, "src/js/utils"),
      "@images": resolve(__dirname, "public/assets/images"),
      "@fonts": resolve(__dirname, "public/assets/fonts"),
    },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
        additionalData: `@import "@scss/base/index.scss"; @import "modern-normalize/modern-normalize.css";`,
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/js/drupal",
          dest: "js",
        },
      ],
    }),
  ],
});
