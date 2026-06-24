import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Split a display value like "+38%", "2.4x", "-60%", "4.6/5", "48h" into a
 * prefix, an animatable number, and a suffix — preserving decimal places so
 * "0.9s" counts up as 0.0 → 0.9, not 0 → 1.
 */
function parseValue(raw) {
  const m = String(raw).match(/^([^\d.-]*)(-?\d+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const [, prefix, num, suffix] = m;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return { prefix, target: parseFloat(num), suffix, decimals };
}

/**
 * Counts every `[data-count]` element inside `ref` up to its final value the
 * first time it scrolls into view. The element's text content is overwritten,
 * so render the final value as the initial children for no-JS / SSR.
 *
 * @param {object} ref      ref to the container to scan
 * @param {boolean} reduced prefers-reduced-motion — skip the count, show final
 */
export function useCountUp(ref, reduced) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const els = root.querySelectorAll("[data-count]");
    if (!els.length) return;

    if (reduced) {
      els.forEach((el) => (el.textContent = el.dataset.count));
      return;
    }

    const ctx = gsap.context(() => {
      els.forEach((el) => {
        const parsed = parseValue(el.dataset.count);
        if (!parsed) {
          el.textContent = el.dataset.count;
          return;
        }
        const { prefix, target, suffix, decimals } = parsed;
        const proxy = { v: 0 };
        const render = () =>
          (el.textContent = prefix + proxy.v.toFixed(decimals) + suffix);

        // Start at zero so there's no flash of the final value before the
        // trigger fires further down the page.
        render();

        gsap.to(proxy, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: render,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, [ref, reduced]);
}
