import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./CinematicClouds.module.css";

gsap.registerPlugin(ScrollTrigger);

// Stable counter — incremented at module load time per-instance.
// Using a ref-captured value so HMR won't reset it mid-session.
let _instanceCount = 0;
const VARIANTS = ["a", "b", "c"];

/**
 * HeavenCloudBand — placed between sections.
 *
 * Creates the sensation of drifting through a distinct cloud bank each
 * time the user transitions between page sections. GSAP ScrollTrigger scrubs
 * the reveal so timing is tied to scroll velocity, not a clock.
 *
 * Uses height: 0 wrapper so the band doesn't add vertical whitespace —
 * it bleeds out of overflow: visible via negative top/bottom offsets.
 */
export default function HeavenCloudBand() {
  const wrapperRef = useRef(null);
  const bandRef    = useRef(null);
  const glowRef    = useRef(null);
  // Stable variant picked once per component mount
  const variant    = useRef(VARIANTS[_instanceCount++ % VARIANTS.length]).current;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const band    = bandRef.current;
    const glow    = glowRef.current;
    if (!wrapper || !band || !glow) return;

    const ctx = gsap.context(() => {

      // ── Band reveal/hide — single ScrollTrigger, opacity + Y as one tween ──
      gsap.fromTo(
        band,
        { opacity: 0, y: 40 },
        {
          opacity: 0.78,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: wrapper,
            start:  "top 92%",
            end:    "top 35%",
            scrub:  1.4,
          },
        }
      );

      gsap.fromTo(
        band,
        { opacity: 0.78, y: 0 },
        {
          opacity: 0,
          y: -40,
          ease: "power1.in",
          scrollTrigger: {
            trigger: wrapper,
            start:  "bottom 65%",
            end:    "bottom 8%",
            scrub:  1.4,
          },
        }
      );

      // ── Subtle upward parallax on the cloud texture ──────────────────────
      // Creates the "rising through the cloud" sensation
      gsap.fromTo(
        band,
        { backgroundPositionY: "80px" },
        {
          backgroundPositionY: "-80px",
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start:  "top bottom",
            end:    "bottom top",
            scrub:  true,
          },
        }
      );

      // ── Divine glow — follows band opacity with slight lag ───────────────
      gsap.fromTo(
        glow,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: wrapper,
            start:  "top 88%",
            end:    "bottom 12%",
            scrub:  2.5,
          },
        }
      );

    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className={styles.heavenBandWrapper} aria-hidden="true">
      <div ref={glowRef} className={styles.heavenGlow} />
      <div
        ref={bandRef}
        className={`${styles.heavenBand} ${styles[`heavenBand--${variant}`]}`}
      />
    </div>
  );
}
