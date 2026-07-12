import { services } from "./services.js";
import { work } from "./work.js";
import { studio, team } from "./team.js";
import { proofStats, proofPillars, proofChecks } from "./proof.js";
import { testimonials } from "./testimonials.js";
import { legalPages } from "./legal.js";

/**
 * Generates clean, semantic Markdown representation of public pages.
 * Keeps HTML and Markdown content synchronized by using the same source data.
 */
export function getMarkdownForRoute(pathname = "/") {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/") {
    const serviceList = services
      .map(
        (s) =>
          `### ${s.index} — ${s.name}\n*${s.tagline}*\n${s.blurb}\nCapabilities: ${s.stack.join(", ")}`
      )
      .join("\n\n");

    const workList = work
      .map(
        (w) =>
          `### ${w.client}\n*${w.title}*\n${w.summary}\nSector: ${w.sector} | Stack: ${w.stack.join(", ")}`
      )
      .join("\n\n");

    const statList = proofStats.map((s) => `- **${s.value}**: ${s.label}`).join("\n");
    const pillarList = proofPillars
      .map((p) => `### ${p.title}\n${p.body}`)
      .join("\n\n");
    const checkList = proofChecks.map((c) => `- ${c}`).join("\n");

    const testimonialList = testimonials
      .map((t) => `> "${t.quote}"\n> — **${t.name}**, ${t.role} at ${t.company}`)
      .join("\n\n");

    return `# Empyreic — Design & engineering studio

A senior design & engineering studio building websites, web apps, and AI products end to end. Remote-first, worldwide.

## Core Disciplines

${serviceList}

## Shipped Work

${workList}

## Operating Standards

${statList}

${pillarList}

### Delivery Checklist
${checkList}

## Testimonials

${testimonialList}

## Start a Project

Tell us what you're building. Typical engagements range from 2 to 12 weeks, working directly with senior designers and engineers.
Email: hello@empyreic.studio
`;
  }

  if (path === "/studio") {
    const valuesList = studio.values
      .map((v) => `### ${v.title}\n${v.body}`)
      .join("\n\n");

    const standardsList = studio.standards
      .map((s, i) => `### 0${i + 1} — ${s.title}\n${s.body}`)
      .join("\n\n");

    const teamList = team
      .map(
        (m) =>
          `### ${m.name} — ${m.role}\n*Location: ${m.location} / ${m.tz}*\n${m.bio}`
      )
      .join("\n\n");

    return `# The people behind the light

${studio.story}

## Core Values

${valuesList}

## Operating Standards

${standardsList}

## The Team

${teamList}
`;
  }

  if (path === "/work") {
    const workList = work
      .map(
        (w) =>
          `## ${w.client} — ${w.title}\n${w.summary}\n- **Sector**: ${w.sector}\n- **Year**: ${w.year}\n- **Role**: ${w.role}\n- **Stack**: ${w.stack.join(", ")}`
      )
      .join("\n\n");

    return `# Shipped Work

Explore our archive of recent fintech, consumer, and B2B SaaS products designed and built in-house.

${workList}
`;
  }

  if (path === "/craft") {
    const craftList = services
      .map(
        (s) =>
          `## ${s.index} — ${s.name}\n*${s.tagline}*\n${s.blurb}\n- **Capabilities**: ${s.stack.join(", ")}`
      )
      .join("\n\n");

    return `# The Craft — Four disciplines, one light

Sleek, fluid interfaces, practical AI features, robust background automation, and interactive motion choreography.

${craftList}
`;
  }

  if (path === "/proof") {
    const statList = proofStats.map((s) => `- **${s.value}**: ${s.label}`).join("\n");
    const pillarList = proofPillars
      .map((p) => `### ${p.title}\n${p.body}`)
      .join("\n\n");
    const checkList = proofChecks.map((c) => `- ${c}`).join("\n");

    return `# Operating Standards

How we keep a project trustworthy while it moves. Senior hands only, transparent delivery logs, and defined performance budgets.

## Typical Project Metrics
${statList}

## Trust Pillars

${pillarList}

## Delivery Checklist
${checkList}
`;
  }

  if (path === "/contact") {
    return `# Start a Project

If the timing's right, tell us what you're building. Typical engagements range from 2 to 12 weeks, working directly with senior designers and engineers.

## Typical Engagement Ranges
- **Frontend**: 2–10 weeks
- **AI**: 2–8 weeks
- **Automation**: 1–6 weeks
- **Motion**: 2–12 weeks

Contact: hello@empyreic.studio
`;
  }

  const legalMatch = path.match(/^\/legal\/(.+)$/);
  if (legalMatch) {
    const page = legalPages[legalMatch[1]];
    if (page) {
      const sections = page.sections
        .map((section) => `## ${section.title}\n\n${section.body}`)
        .join("\n\n");

      return `# ${page.title}

${page.description}

Last updated: ${page.updated}

Temporary placeholder content. This is not legal advice and should be replaced before launch.

${sections}
`;
    }
  }

  const match = path.match(/^\/work\/(.+)$/);
  if (match) {
    const c = work.find((w) => w.id === match[1]);
    if (c) {
      const metricsList = c.metrics
        .map((m) => `- **${m.value}**: ${m.label}`)
        .join("\n");

      const approachList = c.approach
        .map((a) => `### ${a.title}\n${a.body}`)
        .join("\n\n");

      return `# Case Study: ${c.client}

${c.title}

- **Sector**: ${c.sector}
- **Year**: ${c.year}
- **Timeline**: ${c.timeline}
- **Role**: ${c.role}
- **Stack**: ${c.stack.join(", ")}

## Performance Metrics

${metricsList}

## Project Brief

${c.brief}

## The Challenge

${c.challenge}

## Our Approach

${approachList}

## Outcome

${c.outcome}
`;
    }
  }

  return null;
}
