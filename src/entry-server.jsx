import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import App from "./App.jsx";

/** Render a route to a static HTML string for the prerender step. */
export function render(url) {
  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
  return { html };
}

// Re-exported so the prerender script reads SEO from the same bundle.
export { getSeo, PRERENDER_ROUTES, SITE } from "./data/seo.js";
