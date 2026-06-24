# Empyreic

A luminous, weightless landing experience. The hero dissolves into a
scroll-scrubbed video with cross-fading captions — one pinned canvas driven
by scroll.

Built with **React + Vite**, **GSAP / ScrollTrigger** (the pinned scroll-scrub),
and **anime.js** (the hero entrance).

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
```

```bash
npm run build    # production bundle in dist/
npm run preview  # preview the production build
```

## Pages (React Router)

| Route          | Page          | What it is                                            |
| -------------- | ------------- | ----------------------------------------------------- |
| `/`            | `Home`        | The scroll experience + Craft / Work / Voices / Contact |
| `/work/:slug`  | `CaseStudy`   | Full case study per project (brief → outcome)          |
| `/studio`      | `Studio`      | About & team — who you'd be working with               |

`ScrollManager` jumps to top on navigation and resolves `/#section` deep links
(re-checking until the pinned intro's scroll spacer settles). A `public/_redirects`
provides SPA fallback so deep links work on static hosts.

## Structure

```
.
├── index.html               # Vite entry (mounts #root, loads fonts)
├── vite.config.js           # dev server on :4321, host: true for LAN/tunnels
├── public/                  # static assets served at the web root
│   ├── threshold.mp4 · poster.jpg · gateway.png
│   └── _redirects           # SPA fallback for static hosting
├── media/                   # source masters (not served)
└── src/
    ├── main.jsx             # React root + <BrowserRouter>
    ├── App.jsx              # <Routes> shell + persistent Nav / Footer
    ├── styles/global.css    # tokens, reset, shared primitives, keyframes
    ├── data/
    │   ├── captions.js      # intro caption phases
    │   ├── services.js      # the four disciplines (deliverables, stack, length)
    │   ├── work.js          # case studies  ← replace with real projects
    │   ├── team.js          # studio + team  ← replace with real people
    │   └── testimonials.js  # quotes  ← replace with real ones
    ├── hooks/               # usePrefersReducedMotion · useInView ·
    │                        #   useHeroEntrance (anime) · useScrollScrub (GSAP)
    ├── pages/               # Home · CaseStudy · Studio
    └── components/          # Grain · Nav · Footer · Stage · HeroContent ·
                             #   Captions · ScrollCue · Services · Work ·
                             #   Testimonials · Contact · ScrollManager · icons/
```

## Personalize (placeholder content to replace)

- **`src/data/work.js`** — case studies (copy, metrics, gallery images in `/public`).
- **`src/data/team.js`** — names, roles, bios, locations, LinkedIn URLs (add `photo`
  per member to use a real headshot instead of initials).
- **`src/data/testimonials.js`** — quotes & attributions.
- **`src/components/Contact.jsx`** — `EMAIL` and `CALENDAR` constants.
- Availability date (“Q3 2026”) in `HeroContent.jsx` and `Contact.jsx`.

## How the scrub works

`useScrollScrub` pins `.pin` with ScrollTrigger and builds a single scrubbed
timeline. A proxy value is tweened from `0 → duration` and written to
`video.currentTime` each frame (seek-guarded so an in-flight seek never
backlogs). The same timeline fades the hero out, cross-fades the captions, and
fills the progress rail. Scroll distance is `~4.6 × viewport height`.

`prefers-reduced-motion` disables the scrub entirely: the clip loops quietly
and the captions lay out as static stacked panels (handled in CSS).
