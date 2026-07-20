import { useEffect, useRef } from "react";
import styles from "./CinematicClouds.module.css";

/**
 * Cinematic Sunrise Clouds Experience.
 * Repeats a single image itself horizontally (repeat-x) and drifts it using background-position.
 * Only the Foreground layer (clouda) shifts vertically on scroll.
 */
export default function CinematicClouds({ isCaseStudy }) {
  const containerRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const sy = window.scrollY;

            // Full hero page scroll distance (stage section pinned scrub height = ~4.6 * innerHeight)
            const stageEl = document.getElementById("stage");
            const heroHeight = stageEl && stageEl.offsetHeight > window.innerHeight
              ? stageEl.offsetHeight - window.innerHeight
              : window.innerHeight * 4.6;

            const fadeDistance = isCaseStudy ? window.innerHeight * 0.8 : heroHeight;

            // Calculate horizontal scroll offset for clouds to move left and right gracefully across full hero page
            const bgX = -sy * 0.15;     // Background cloud shifts left
            const midX = sy * 0.28;      // Middle cloud shifts right
            const fgX = -sy * 0.45;     // Foreground cloud shifts left faster

            // Calculate vertical scroll offset for Foreground layer
            const fgY = -(sy * 0.12) % 1200;

            // Calculate slow fade out / hide progress as user scrolls down the full hero page
            const progress = Math.min(1, Math.max(0, sy / fadeDistance));
            const cloudOpacity = Math.max(0, 1 - Math.pow(progress, 1.15));
            const cloudVisibility = cloudOpacity > 0.001 ? "visible" : "hidden";

            containerRef.current.style.setProperty("--scroll-x-bg", `${bgX}px`);
            containerRef.current.style.setProperty("--scroll-x-mid", `${midX}px`);
            containerRef.current.style.setProperty("--scroll-x-fg", `${fgX}px`);
            containerRef.current.style.setProperty("--scroll-y-fg", `${fgY}px`);
            containerRef.current.style.setProperty("--cloud-opacity", cloudOpacity.toFixed(3));
            containerRef.current.style.setProperty("--cloud-visibility", cloudVisibility);

            // Calculate overall scroll progress ratio to evolve sky background
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollRatio = docHeight > 0 ? Math.min(1, Math.max(0, sy / docHeight)) : 0;
            containerRef.current.style.setProperty("--scroll-ratio", scrollRatio);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initialize on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isCaseStudy]);

  return (
    <div ref={containerRef} className={styles.cloudStage} aria-hidden="true">
      {/* Layer 5: Background atmospheric haze (almost static, sunrise colors) */}
      <div className={styles.layerHaze}>
        <div className={styles.sunGlow} />
        <div className={styles.layerHazeDaylight} />
      </div>

      {/* Cloud Layers Wrapper — handles scroll fade-out (slowly hide) */}
      <div className={styles.cloudsWrapper}>
        {/* Layer 3: Background clouds (repeats horizontally, drifts left, shifts left on scroll) */}
        <div className={styles.layerBackground}>
          <div className={`${styles.floatBg} ${styles.cloudC}`} />
        </div>

        {/* Layer 2: Middle clouds (repeats horizontally, drifts right, shifts right on scroll) */}
        <div className={styles.layerMiddle}>
          <div className={`${styles.floatMid} ${styles.cloudB}`} />
        </div>

        {/* Layer 1: Foreground clouds (repeats horizontally, drifts left, shifts left & vertical on scroll) */}
        <div className={styles.layerForeground}>
          <div className={`${styles.floatFg} ${styles.cloudA}`} />
        </div>
      </div>
    </div>
  );
}
