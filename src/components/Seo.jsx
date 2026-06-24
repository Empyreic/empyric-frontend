import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { getSeo, SITE } from "../data/seo.js";

/**
 * Keeps <head> in sync with the current route on the client. The static HTML
 * each route ships already carries the correct tags (baked by the prerender
 * script); this updates them when react-router swaps pages without a reload,
 * and supplies them in dev where there's no prerender step.
 */
function upsertMeta(selector, attr, key, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getSeo(pathname);

    document.title = seo.title;
    upsertMeta('meta[name="description"]', "name", "description", seo.description);
    upsertCanonical(seo.canonical);

    upsertMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE.name);
    upsertMeta('meta[property="og:type"]', "property", "og:type", seo.ogType);
    upsertMeta('meta[property="og:title"]', "property", "og:title", seo.title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", seo.description);
    upsertMeta('meta[property="og:url"]', "property", "og:url", seo.canonical);
    upsertMeta('meta[property="og:image"]', "property", "og:image", seo.ogImage);

    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", seo.title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", seo.description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", seo.ogImage);
  }, [pathname]);

  return null;
}
