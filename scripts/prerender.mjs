// Post-build static prerender. Runs after `vite build`:
//   1. bundles the SSR entry,
//   2. renders each known route to HTML,
//   3. bakes per-route <title>/description/OG/canonical/JSON-LD into the page,
//   4. writes dist/<route>/index.html + dist/sitemap.xml.
//
// Dependency-free (react-dom/server + react-router StaticRouter). If the SSR
// render can't run for some reason, it falls back to head-only injection so the
// SEO tags still ship.

import { promises as fs } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const dist = path.join(root, "dist");
const ssrDir = path.join(root, ".ssr");

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// SEO helpers are loaded straight from source (plain ESM, Node can import it).
const seoMod = await import(pathToFileURL(path.join(root, "src/data/seo.js")).href);
const { getSeo, PRERENDER_ROUTES, SITE } = seoMod;

const mdMod = await import(pathToFileURL(path.join(root, "src/data/markdown.js")).href);
const { getMarkdownForRoute } = mdMod;

// Try to build + load the SSR renderer for full-body prerender.
let render = null;
try {
  const { build } = await import("vite");
  await build({
    logLevel: "warn",
    ssr: {
      noExternal: ["gsap", "react-router-dom"],
    },
    build: {
      ssr: path.join(root, "src/entry-server.jsx"),
      outDir: ssrDir,
      emptyOutDir: true,
      rollupOptions: { 
        output: { 
          entryFileNames: "entry-server.js",
          format: "esm"
        } 
      },
    },
  });
  const mod = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);
  render = mod.render;
} catch (err) {
  console.warn("[prerender] SSR render unavailable, head-only mode:", err.message);
}

function headTags(seo) {
  const tags = [
    `<link rel="canonical" href="${esc(seo.canonical)}" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:locale" content="${esc(SITE.locale)}" />`,
    `<meta property="og:type" content="${esc(seo.ogType)}" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta property="og:url" content="${esc(seo.canonical)}" />`,
    `<meta property="og:image" content="${esc(seo.ogImage)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
    `<meta name="twitter:image" content="${esc(seo.ogImage)}" />`,
  ];
  for (const ld of seo.jsonLd || []) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(ld)}</script>`);
  }
  return tags.join("\n    ");
}

const template = await fs.readFile(path.join(dist, "index.html"), "utf8");

for (const route of PRERENDER_ROUTES) {
  const seo = getSeo(route);

  let body = "";
  if (render) {
    try {
      body = (await render(route)).html;
    } catch (err) {
      console.warn(`[prerender] render failed for ${route} (${err.message}) — head-only`);
    }
  }

  const page = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`)
    .replace(
      /<meta[^>]*name="description"[^>]*>/,
      `<meta name="description" content="${esc(seo.description)}" />`
    )
    .replace("</head>", `    ${headTags(seo)}\n  </head>`)
    .replace(/<div id="root">\s*<\/div>/, `<div id="root">${body}</div>`);

  const outDir = route === "/" ? dist : path.join(dist, route);
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, "index.html"), page, "utf8");

  // Save the Markdown representation
  const md = getMarkdownForRoute(route);
  if (md) {
    await fs.writeFile(path.join(outDir, "index.md"), md, "utf8");
  }

  console.log(`[prerender] ${route}`);
}

// Sitemap from the same route list.
const urls = PRERENDER_ROUTES.map((r) => {
  const loc = SITE.url + (r === "/" ? "/" : r);
  return `  <url><loc>${loc}</loc></url>`;
}).join("\n");
await fs.writeFile(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  "utf8"
);
console.log("[prerender] sitemap.xml");

await fs.rm(ssrDir, { recursive: true, force: true });
console.log("[prerender] done");
