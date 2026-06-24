import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Draws SVG stroke paths on as they scroll into view. Targets must declare
 * `pathLength="1"` so a normalised dash (1 → 0) traces the whole path without
 * measuring geometry.
 *
 * @param {object} ref       container ref to scan
 * @param {boolean} reduced  prefers-reduced-motion — show paths drawn, no trace
 * @param {string} [selector="[data-draw]"]
 */
export function useDrawIn(ref, reduced, selector = "[data-draw]") {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const paths = root.querySelectorAll(selector);
    if (!paths.length) return;

    if (reduced) {
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
    }, root);

    return () => ctx.revert();
  }, [ref, reduced, selector]);
}
