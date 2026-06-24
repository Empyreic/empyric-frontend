export const work = [
  {
    id: "meridian",
    accent: "#5EC8FF",
    client: "Meridian",
    sector: "Fintech",
    year: "2025",
    timeline: "10 weeks",
    role: "Product design / Frontend / Design system",
    title: "An analytics product rebuilt for speed and clarity.",
    summary:
      "Re-platformed a sluggish dashboard onto Next.js — tuned until it felt instant.",
    stack: ["Next.js", "TypeScript", "Design System", "PostgreSQL"],
    metrics: [
      { value: "2.4x", label: "faster load" },
      { value: "+38%", label: "activation" },
      { value: "-60%", label: "time to insight" },
    ],
    brief:
      "A four-year-old dashboard with no design system — slow to ship, heavy to use, onboarding sliding. We rebuilt the surface without pausing the roadmap.",
    challenge:
      "Performance under real data. Dashboards with tens of thousands of rows had to feel instant — migrated page by page, zero downtime.",
    approach: [
      {
        title: "Audit and design tokens",
        body: "Mapped every component, then distilled them into a small token set and 40 accessible primitives.",
      },
      {
        title: "Incremental re-platform",
        body: "New screens shipped on Next.js behind a flag, route by route — the old app ran until each was ready.",
      },
      {
        title: "Performance budget",
        body: "Virtualized tables, streamed data, and a hard 100ms budget on every view.",
      },
    ],
    gallery: [
      { src: "/gateway.png", caption: "Dashboard overview with faster insight paths" },
      { src: "/poster.jpg", caption: "Detail view designed for high-volume analysis" },
    ],
    outcome:
      "Fully live within a quarter. 2.4x faster loads, +38% activation, and features that now ship in days.",
  },
  {
    id: "halcyon",
    accent: "#FF90E8",
    client: "Halcyon",
    sector: "Consumer",
    year: "2025",
    timeline: "5 weeks",
    role: "Art direction / Webflow build / Motion",
    title: "A cinematic marketing site that actually converts.",
    summary:
      "A brand-led launch site with a headless CMS and built-in experimentation.",
    stack: ["Webflow", "GSAP", "CMS", "Analytics"],
    metrics: [
      { value: "+62%", label: "demo requests" },
      { value: "0.9s", label: "largest paint" },
      { value: "+24%", label: "scroll depth" },
    ],
    brief:
      "A flagship relaunch that had to feel as considered as the hardware. The old template buried the story and barely converted.",
    challenge:
      "Cinematic without slow. Rich motion and full-bleed imagery — plus a sub-second paint.",
    approach: [
      {
        title: "Narrative-first design",
        body: "Storyboarded like a film: five scenes, each earning the scroll, one clear call to action.",
      },
      {
        title: "Performance-safe motion",
        body: "GPU-driven GSAP reveals, lazy media, and preloaded hero frames — smooth on mid-range phones.",
      },
      {
        title: "Built to experiment",
        body: "A headless CMS and clean tracking let the team A/B test without a developer.",
      },
    ],
    gallery: [
      { src: "/poster.jpg", caption: "Launch hero with cinematic product pacing" },
      { src: "/gateway.png", caption: "Feature sequence structured for conversion" },
    ],
    outcome:
      "Shipped in five weeks. +62% demo requests, sub-second paint, and a team that runs its own tests.",
  },
  {
    id: "vesper",
    accent: "#C6F24E",
    client: "Vesper",
    sector: "B2B SaaS",
    year: "2026",
    timeline: "8 weeks",
    role: "AI engineering / Evaluation / Frontend",
    title: "AI features that shipped - measured, not magic.",
    summary:
      "A retrieval-backed assistant with a real evaluation harness — quality provable before launch.",
    stack: ["RAG", "Evals", "TypeScript", "Vector search"],
    metrics: [
      { value: "-45%", label: "support tickets" },
      { value: "4.6/5", label: "user CSAT" },
      { value: "92%", label: "answer accuracy" },
    ],
    brief:
      "An in-product assistant answering from their own docs — after a past demo that looked great and broke in production.",
    challenge:
      "Trust. A confidently wrong AI is worse than none. We had to prove accuracy and keep it honest about what it doesn't know.",
    approach: [
      {
        title: "Retrieval over guessing",
        body: "Every answer grounded in their docs with semantic search, sources cited inline.",
      },
      {
        title: "An evaluation harness",
        body: "A graded test set ran on every change — we shipped only above an agreed bar.",
      },
      {
        title: "Guardrails and fallbacks",
        body: "Clear uncertainty behavior and a one-tap handoff to a human.",
      },
    ],
    gallery: [
      { src: "/gateway.png", caption: "Assistant experience grounded in product data" },
      { src: "/poster.jpg", caption: "Evaluation dashboard for release confidence" },
    ],
    outcome:
      "Launched at 92% measured accuracy. Support tickets fell 45% in a month; help CSAT hit 4.6/5.",
  },
];

export const workById = (id) => work.find((c) => c.id === id);

export const nextWork = (id) => {
  const i = work.findIndex((c) => c.id === id);
  return work[(i + 1) % work.length];
};
