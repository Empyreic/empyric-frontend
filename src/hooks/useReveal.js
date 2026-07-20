import { useEffect } from "react";

/**
 * useReveal — standardised scroll-reveal for all sections.
 *
 * Animates elements matching `selector` inside `containerRef` when the
 * container enters the viewport. Uses anime.js for the motion:
 *   fade + translateY(20px → 0) in 500ms, staggered 80ms apart.
 *
 * Timing matches §20 of the UX spec: "complete within 500–700ms".
 * Skipped entirely when `reduced` is true (elements remain visible via CSS).
 *
 * @param {React.RefObject<HTMLElement>} containerRef  root element to watch
 * @param {boolean} reduced                            prefers-reduced-motion
 * @param {string}  [selector="[data-reveal]"]         child selector
 * @param {object}  [opts]
 * @param {number}  [opts.delay=0]                     extra initial delay (ms)
 * @param {number}  [opts.threshold=0.12]              IO threshold
 */
export function useReveal(
  containerRef,
  reduced,
  selector = "[data-reveal]",
  { delay = 0, threshold = 0.12 } = {}
) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const targets = [...root.querySelectorAll(selector)];
    if (!targets.length) return;

    // Reduced motion: keep everything visible, no animation
    if (reduced) {
      targets.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    // Hide targets before they enter view
    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
    });

    let animation;
    let observed = false;
    let cancelled = false;

    const run = async () => {
      if (cancelled) return;
      const { default: anime } = await import("animejs");
      if (cancelled) return;

      animation = anime({
        targets,
        translateY: [20, 0],
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 500,
        delay: anime.stagger(80, { start: delay }),
      });
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || observed) return;
        observed = true;
        obs.disconnect();
        run();
      },
      {
        threshold,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    obs.observe(root);

    return () => {
      cancelled = true;
      obs.disconnect();
      animation?.pause();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, selector]);
}
