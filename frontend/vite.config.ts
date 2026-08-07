import { defineConfig } from "vite";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:3001";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    // Proxy API calls to the fake backend so the frontend can use same-origin /api paths.
    proxy: {
      "/api": {
        target: backendUrl,
        changeOrigin: true,
      },
    },
  },
});
