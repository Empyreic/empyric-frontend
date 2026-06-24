import { work } from "./work.js";

/**
 * Single source of truth for per-route SEO.
 *
 * `getSeo(pathname)` is used in two places that must agree:
 *   • the build-time prerender script (scripts/prerender.mjs) — bakes these
 *     tags into the static HTML each route ships, for crawlers & link previews
 *   • the runtime <Seo> component — keeps the document head correct during
 *     client-side (SPA) navigation
 *
 * ⚠️ Update SITE.url to the real production domain before launch — canonical
 * URLs, Open Graph URLs, and the sitemap are all derived from it.
 */
export const SITE = {
  name: "Empyreic",
  url: "https://empyreic.studio",
  defaultTitle: "Empyreic — Design & engineering studio",
  description:
    "A senior design & engineering studio building websites, web apps, and AI products end to end. Remote-first, worldwide.",
  ogImage: "/gateway.png",
  locale: "en_US",
};

const abs = (p) => (/^https?:\/\//.test(p) ? p : SITE.url + p);

const orgLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: abs("/mascot.svg"),
  description: SITE.description,
  sameAs: ["https://www.linkedin.com/"],
});

const websiteLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
});

const breadcrumbLd = (c, canonical) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE.url + "/" },
    { "@type": "ListItem", position: 2, name: "Work", item: SITE.url + "/#work" },
    { "@type": "ListItem", position: 3, name: c.client, item: canonical },
  ],
});

const caseStudyLd = (c, canonical) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: c.title,
  headline: c.title,
  about: c.sector,
  dateCreated: c.year,
  url: canonical,
  image: abs(c.gallery?.[0]?.src || SITE.ogImage),
  creator: { "@type": "Organization", name: SITE.name, url: SITE.url },
});

export function getSeo(pathname = "/") {
  const path = pathname.replace(/\/+$/, "") || "/";
  const canonical = SITE.url + (path === "/" ? "/" : path);

  if (path === "/") {
    return {
      title: SITE.defaultTitle,
      description: SITE.description,
      canonical,
      ogImage: abs(SITE.ogImage),
      ogType: "website",
      jsonLd: [orgLd(), websiteLd()],
    };
  }

  if (path === "/studio") {
    return {
      title: "Studio — the people behind Empyreic",
      description:
        "A small, senior studio. The people who pitch the work are the ones who build it — a handful of engagements at a time.",
      canonical,
      ogImage: abs(SITE.ogImage),
      ogType: "website",
      jsonLd: [orgLd()],
    };
  }

  const match = path.match(/^\/work\/(.+)$/);
  if (match) {
    const c = work.find((w) => w.id === match[1]);
    if (c) {
      return {
        title: `${c.client} — ${c.title}`,
        description: c.summary,
        canonical,
        ogImage: abs(c.gallery?.[0]?.src || SITE.ogImage),
        ogType: "article",
        jsonLd: [breadcrumbLd(c, canonical), caseStudyLd(c, canonical)],
      };
    }
  }

  // Unknown route (SPA redirects it home) — keep it indexable but generic.
  return {
    title: SITE.defaultTitle,
    description: SITE.description,
    canonical,
    ogImage: abs(SITE.ogImage),
    ogType: "website",
    jsonLd: [orgLd()],
  };
}

/** Every URL we statically prerender + list in the sitemap. */
export const PRERENDER_ROUTES = [
  "/",
  "/studio",
  ...work.map((w) => `/work/${w.id}`),
];
