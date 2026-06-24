/* The four disciplines. `id` maps to a line-art glyph in ServiceGlyphs.
   Copy is deliberately concrete: what you get, the stack, how long. */
export const services = [
  {
    id: "frontend",
    index: "01",
    name: "Frontend",
    tagline: "Interfaces with exceptional taste.",
    blurb: "Sites, web apps, and the design systems behind them.",
    deliverables: [
      "Marketing & product sites",
      "Web apps in React / Next.js",
      "Design systems & component libraries",
      "Headless CMS, analytics & SEO",
    ],
    stack: ["React", "Next.js", "TypeScript", "Webflow", "GSAP"],
    engagement: "2–10 weeks",
  },
  {
    id: "backend",
    index: "02",
    name: "Backend",
    tagline: "Foundations that never flinch.",
    blurb: "APIs, dashboards, auth, billing, and the infra behind them.",
    deliverables: [
      "REST & GraphQL APIs",
      "Admin tools & dashboards",
      "Auth, billing & integrations",
      "Cloud infra & CI/CD",
    ],
    stack: ["Node", "PostgreSQL", "Prisma", "AWS", "Vercel"],
    engagement: "3–12 weeks",
  },
  {
    id: "ai",
    index: "03",
    name: "AI",
    tagline: "Intelligence, tastefully applied.",
    blurb: "LLM features that ship and earn their keep.",
    deliverables: [
      "In-product LLM features",
      "RAG & semantic search",
      "Agents & workflows",
      "Evaluation & guardrails",
    ],
    stack: ["LLM APIs", "RAG", "Vector search", "Python / TS"],
    engagement: "2–8 weeks",
  },
  {
    id: "automation",
    index: "04",
    name: "Automation",
    tagline: "Work that runs itself.",
    blurb: "Internal tools and pipelines that reclaim hours.",
    deliverables: [
      "Internal tools & ops dashboards",
      "Data pipelines & syncs",
      "Zapier / Make / n8n builds",
      "Custom integrations",
    ],
    stack: ["Node", "Python", "Zapier", "Make", "n8n"],
    engagement: "1–6 weeks",
  },
];
