import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:9000",
        changeOrigin: true
      }
    }
  }
});
