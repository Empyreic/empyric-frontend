import { useEffect, useRef } from "react";
import styles from "./CinematicClouds.module.css";

/**
 * Cinematic Heaven Clouds — site-wide immersive cloud experience.
 *
 * Scroll journey:
 *  0 → hero end : clouds at full vivid presence, hero-era horizontal parallax
 *  hero → page end : clouds persist as a soft atmospheric ambient layer,
 *                    slowly ascending (vertical parallax = rising through heaven)
 *  Sky background : 5 heaven moods interpolated in JS and written directly
 *                   to element.style.background (avoids CSS custom-property
 *                   gradient transition limitation).
 */
export default function CinematicClouds({ isCaseStudy }) {
  const containerRef = useRef(null);
  const hazeRef      = useRef(null);

  useEffect(() => {
    let ticking = false;

    // ── Five heaven sky moods ──────────────────────────────────────────────
    // Each entry: [stop0%, stop45%, stop100%] (hex strings)
    const MOODS = [
      ["#050814", "#0a142c", "#1d1532"],   // 0  Deep Twilight
      ["#120820", "#3a1a0e", "#7a3810"],   // 1  Golden Heaven
      ["#060e24", "#1a3260", "#3a64a8"],   // 2  Celestial Blue
      ["#0e1e3a", "#264070", "#6888b8"],   // 3  Misty Cloud Realm
      ["#020406", "#04091a", "#080f22"],   // 4  Midnight Celestial
    ];

    const lerp   = (a, b, t) => a + (b - a) * t;
    const hexToRgb = (h) => [
      parseInt(h.slice(1, 3), 16),
      parseInt(h.slice(3, 5), 16),
      parseInt(h.slice(5, 7), 16),
    ];
    const lerpHex = (a, b, t) => {
      const [ar, ag, ab] = hexToRgb(a);
      const [br, bg, bb] = hexToRgb(b);
      const to2 = (n) => Math.round(n).toString(16).padStart(2, "0");
      return `#${to2(lerp(ar, br, t))}${to2(lerp(ag, bg, t))}${to2(lerp(ab, bb, t))}`;
    };

    const buildSky = (ratio) => {
      const seg = ratio * (MOODS.length - 1);
      const idx = Math.min(Math.floor(seg), MOODS.length - 2);
      const t   = seg - idx;
      const [top, mid, bot] = MOODS[idx].map((c, i) => lerpHex(c, MOODS[idx + 1][i], t));
      return `linear-gradient(180deg, ${top} 0%, ${mid} 45%, ${bot} 100%)`;
    };

    // Cache last sky string to avoid redundant style writes
    let lastSky = "";

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const el   = containerRef.current;
          const haze = hazeRef.current;
          if (!el || !haze) { ticking = false; return; }

          const sy        = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const ratio     = docHeight > 0 ? Math.min(1, Math.max(0, sy / docHeight)) : 0;

          // ── Hero scroll distance ─────────────────────────────────────────
          const stageEl    = document.getElementById("stage");
          const heroScroll = stageEl && stageEl.offsetHeight > window.innerHeight
            ? stageEl.offsetHeight - window.innerHeight
            : window.innerHeight * 4.6;

          const heroProgress = Math.min(1, Math.max(0, sy / heroScroll));

          // ── Horizontal parallax (significant only in the hero era) ───────
          // Attenuate after hero so they don't jitter on deep-page scroll
          const hAttenuation = Math.max(0, 1 - heroProgress);
          const bgX  = -sy * 0.10 * hAttenuation;
          const midX =  sy * 0.18 * hAttenuation;
          const fgX  = -sy * 0.30 * hAttenuation;

          // ── Vertical ascent (full page) ──────────────────────────────────
          // All layers rise slowly as user scrolls the whole page →
          // feels like ascending through heaven.
          const bgY   = ratio * -100;
          const midY  = ratio * -150;
          const fgY   = -(sy * 0.10) % 1200 + ratio * -220; // hero-scrub + ascent

          // ── Cloud opacity ────────────────────────────────────────────────
          // Hero phase: 1.0 → 0.18 (ambient).
          // Case-study pages: quick fade since no long scrub.
          const heroFade = isCaseStudy
            ? Math.max(0, 1 - Math.min(1, sy / (window.innerHeight * 0.7)))
            : 1 - Math.pow(heroProgress, 1.05) * 0.82;
          // Always keep a soft ambient floor so clouds breathe behind content
          const opacity = Math.max(0.10, heroFade);

          // ── Write CSS vars ───────────────────────────────────────────────
          el.style.setProperty("--scroll-x-bg",  `${bgX}px`);
          el.style.setProperty("--scroll-x-mid", `${midX}px`);
          el.style.setProperty("--scroll-x-fg",  `${fgX}px`);
          el.style.setProperty("--scroll-y-bg",  `${bgY}px`);
          el.style.setProperty("--scroll-y-mid", `${midY}px`);
          el.style.setProperty("--scroll-y-fg",  `${fgY}px`);
          el.style.setProperty("--cloud-opacity", opacity.toFixed(3));
          el.style.setProperty("--scroll-ratio",  ratio.toFixed(4));

          // ── Sky gradient (written directly — CSS vars can't animate gradients) ──
          const sky = buildSky(ratio);
          if (sky !== lastSky) {
            haze.style.background = sky;
            lastSky = sky;
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCaseStudy]);

  return (
    <div ref={containerRef} className={styles.cloudStage} aria-hidden="true">

      {/* ── Layer 5: Evolving heaven sky ── */}
      <div ref={hazeRef} className={styles.layerHaze}>
        <div className={styles.layerHazeVignette} />
        <div className={styles.sunGlow} />
        <div className={styles.layerHazeDaylight} />
      </div>

      {/* ── Cloud layers (opacity + visibility driven by JS) ── */}
      <div className={styles.cloudsWrapper}>

        {/* Background — large, blurred, barely moves */}
        <div className={styles.layerBackground}>
          <div className={`${styles.floatBg} ${styles.cloudC}`} />
        </div>

        {/* Middle — medium speed, slight blur */}
        <div className={styles.layerMiddle}>
          <div className={`${styles.floatMid} ${styles.cloudB}`} />
        </div>

        {/* Foreground — fastest, sharpest, passes in front of stage content */}
        <div className={styles.layerForeground}>
          <div className={`${styles.floatFg} ${styles.cloudA}`} />
        </div>

      </div>
    </div>
  );
}
