import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      // Forward /api calls to the .NET API during development.
      // This avoids CORS and the self-signed HTTPS certificate problem.
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || "https://localhost:7096",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
