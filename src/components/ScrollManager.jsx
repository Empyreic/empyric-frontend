import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * On route change: jump to the top. When a hash is present (e.g. a nav link
 * to /#work from another page), scroll to that section — re-checking until
 * its absolute position stops moving, because the home page's pinned intro
 * adds a tall scroll spacer that settles a few frames after mount.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const pathMap = {
      "/work": "#work",
      "/craft": "#services",
      "/proof": "#proof",
      "/contact": "#contact",
    };

    const targetHash = hash || pathMap[pathname];

    if (!targetHash) {
      window.scrollTo(0, 0);
      return;
    }

    let lastY = -1;
    let tries = 0;
    let timer;

    const go = () => {
      const el = document.querySelector(targetHash);
      if (el) {
        const y = Math.round(el.getBoundingClientRect().top + window.scrollY);
        el.scrollIntoView();
        if (Math.abs(y - lastY) < 2) return; // position has settled
        lastY = y;
      }
      if (tries++ < 14) timer = setTimeout(go, 110);
    };

    timer = setTimeout(go, 50);
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
