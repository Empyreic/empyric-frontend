import { useEffect } from "react";
import anime from "animejs";

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

    const animation = anime({
      targets,
      translateY: [24, 0],
      opacity: [0, 1],
      easing: "easeOutCubic",
      duration: 950,
      delay: anime.stagger(150, { start: 80 }),
    });

    return () => animation.pause();
  }, [containerRef, reduced]);
}
