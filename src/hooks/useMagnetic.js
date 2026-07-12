import { useEffect } from "react";

/**
 * Gives an element a subtle "magnetic" pull toward the cursor — a premium
 * micro-interaction for primary CTAs. Desktop / hover-capable pointers only,
 * and disabled under reduced motion.
 *
 * @param {object} ref       ref to the element to magnetize
 * @param {object} [options]
 * @param {number} [options.strength=0.4] how far it follows the cursor (0–1)
 */
export function useMagnetic(ref, { strength = 0.4 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let gsapInstance;
    let xTo;
    let yTo;
    let cancelled = false;

    const onMove = (e) => {
      if (!xTo || !yTo) return;
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    import("gsap").then(({ default: gsap }) => {
      if (cancelled) return;
      gsapInstance = gsap;
      xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
      el.addEventListener("mousemove", onMove);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      cancelled = true;
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsapInstance?.killTweensOf(el);
      gsapInstance?.set(el, { x: 0, y: 0 });
    };
  }, [ref, strength]);
}
