import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { getMarkdownForRoute } from "./src/data/markdown.js";

// host: true exposes the dev server on the LAN (and behind a tunnel),
// port pinned to 4321 to match the existing launch profile.
export default defineConfig({
  plugins: [
    react(),
    {
      name: "markdown-negotiator",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const accept = req.headers.accept || "";
          if (accept.includes("text/markdown")) {
            const url = new URL(req.url, "http://localhost");
            const pathname = url.pathname;
            const md = getMarkdownForRoute(pathname);
            if (md) {
              res.setHeader("Content-Type", "text/markdown; charset=utf-8");
              res.setHeader("Vary", "Accept");
              res.end(md);
              return;
            }
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          const accept = req.headers.accept || "";
          if (accept.includes("text/markdown")) {
            const url = new URL(req.url, "http://localhost");
            const pathname = url.pathname;
            const md = getMarkdownForRoute(pathname);
            if (md) {
              res.setHeader("Content-Type", "text/markdown; charset=utf-8");
              res.setHeader("Vary", "Accept");
              res.end(md);
              return;
            }
          }
          next();
        });
      }
    }
  ],
  server: {
    port: 4321,
    host: true,
    allowedHosts: ["3f68-152-56-178-50.ngrok-free.app"],
  },
  build: {
    outDir: "dist",
  },
});
