import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver-backed visibility flag for triggering
 * scroll-in animations. Returns `[ref, inView]`.
 *
 * @param {object} [opts]
 * @param {number} [opts.threshold=0.2]
 * @param {boolean} [opts.once=true]   stop observing after first reveal
 * @param {string} [opts.rootMargin]
 */
export function useInView({ threshold = 0.2, once = true, rootMargin = "0px 0px -10% 0px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, once, rootMargin]);

  return [ref, inView];
}
