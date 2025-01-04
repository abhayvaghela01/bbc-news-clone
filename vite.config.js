import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
   base: '/bbc-news-clone/',
  css: {
    postcss: "./postcss.config.cjs" // Ensure this matches your PostCSS file name
  }
});
