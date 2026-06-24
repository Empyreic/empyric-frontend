import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// host: true exposes the dev server on the LAN (and behind a tunnel),
// port pinned to 4321 to match the existing launch profile.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4321,
    host: true,
    allowedHosts: ["3f68-152-56-178-50.ngrok-free.app"],
  },
  build: {
    outDir: "dist",
  },
});
