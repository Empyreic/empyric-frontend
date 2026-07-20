import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./CinematicClouds.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * SectionFog — A thin scrolling fog band placed between sections.
 * Uses GSAP ScrollTrigger to fade up to 0.6 opacity as it crosses
 * the center of the viewport and fade out as it leaves.
 */
export default function SectionFog() {
  const fogRef = useRef(null);

  useEffect(() => {
    const el = fogRef.current;
    if (!el) return;

    // Transition fade trigger
    const triggerObj = gsap.fromTo(
      el,
      { opacity: 0 },
      {
        opacity: 0.62,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: el,
          start: "top bottom", // enters viewport
          end: "bottom top",   // exits viewport
          scrub: true,
        },
      }
    );

    return () => {
      if (triggerObj.scrollTrigger) {
        triggerObj.scrollTrigger.kill();
      }
      triggerObj.kill();
    };
  }, []);

  return (
    <div className={styles.sectionFogWrapper} aria-hidden="true">
      <div ref={fogRef} className={styles.sectionFog} />
    </div>
  );
}
