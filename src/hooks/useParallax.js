import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Drifts a decorative element against the scroll for a sense of depth. Uses a
 * transform (yPercent) scrubbed across the element's section, so it composes
 * with any existing CSS translate (e.g. a centred aura keeps its centring).
 *
 * Desktop only and disabled under reduced motion — parallax on touch tends to
 * feel laggy and fights momentum scrolling.
 *
 * @param {object} ref      ref to the element to drift
 * @param {object} [range]  { from, to } in yPercent
 * @param {boolean} reduced prefers-reduced-motion
 */
export function useParallax(ref, { from = -10, to = 10 } = {}, reduced) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: from },
        {
          yPercent: to,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement || el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [ref, reduced, from, to]);
}
