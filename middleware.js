/**
 * Vercel Edge Middleware for Accept: text/markdown content negotiation.
 * Intercepts requests requesting markdown and rewrites to pre-rendered static md files.
 */
export default function middleware(request) {
  const accept = request.headers.get("accept") || "";
  if (accept.includes("text/markdown")) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    const validPaths = ["/", "/studio", "/work", "/craft", "/proof", "/contact"];
    const isCaseStudy = path.startsWith("/work/");

    if (validPaths.includes(path) || isCaseStudy) {
      const mdPath = path === "/" ? "/index.md" : `${path}/index.md`;
      url.pathname = mdPath;

      return fetch(url).then((res) => {
        const newHeaders = new Headers(res.headers);
        newHeaders.set("Content-Type", "text/markdown; charset=utf-8");
        newHeaders.set("Vary", "Accept");
        return new Response(res.body, {
          status: res.status,
          statusText: res.statusText,
          headers: newHeaders,
        });
      });
    }
  }
}
