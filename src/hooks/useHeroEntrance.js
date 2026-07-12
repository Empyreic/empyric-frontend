import { useEffect } from "react";

/**
 * Staggered fade-and-rise for the hero copy, powered by anime.js.
 * Targets `.reveal` descendants of `containerRef` once, on mount.
 * Skipped entirely when the user prefers reduced motion (CSS leaves
 * the elements fully visible).
 *
 * @param {React.RefObject<HTMLElement>} containerRef
 * @param {boolean} reduced
 */
export function useHeroEntrance(containerRef, reduced) {
  useEffect(() => {
    if (reduced) return;
    const root = containerRef.current;
    if (!root) return;

    const targets = root.querySelectorAll(".reveal");
    if (!targets.length) return;

    let animation;
    let cancelled = false;
    const start = () => {
      import("animejs").then(({ default: anime }) => {
        if (cancelled) return;
        animation = anime({
          targets,
          translateY: [18, 0],
          easing: "easeOutCubic",
          duration: 800,
          delay: anime.stagger(110, { start: 40 }),
        });
      });
    };

    const id = window.setTimeout(start, 80);

    return () => {
      cancelled = true;
      window.clearTimeout(id);
      animation?.pause();
    };
  }, [containerRef, reduced]);
}
