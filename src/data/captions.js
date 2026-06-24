/* Caption phases that cross-fade over the scrubbing clip.
   `start`/`end` are normalized scroll-progress positions (0..1)
   along the pinned stage. */
export const captions = [
  {
    start: 0.22,
    end: 0.46,
    eyebrow: "I · Arrival",
    title: ["Everything you carry,", "finally set down."],
  },
  {
    start: 0.5,
    end: 0.72,
    eyebrow: "II · Convergence",
    title: ["Tools, teammates, momentum —", "drawn into one light."],
  },
  {
    start: 0.76,
    end: 0.99,
    eyebrow: "III · The Threshold",
    title: ["This is where", "you cross over."],
    cta: { label: "Start a project", href: "#contact" },
  },
];
