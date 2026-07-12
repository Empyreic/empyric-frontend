import { PassThrough } from "node:stream";

import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import App from "./App.jsx";

/** Render a route to a static HTML string for the prerender step. */
export function render(url) {
  return new Promise((resolve, reject) => {
    let html = "";

    const stream = renderToPipeableStream(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>,
      {
        onAllReady() {
          const body = new PassThrough();
          body.setEncoding("utf8");
          body.on("data", (chunk) => {
            html += chunk;
          });
          body.on("end", () => resolve({ html }));
          stream.pipe(body);
        },
        onError(error) {
          reject(error);
        },
      }
    );
  });
}

// Re-exported so the prerender script reads SEO from the same bundle.
export { getSeo, PRERENDER_ROUTES, SITE } from "./data/seo.js";
