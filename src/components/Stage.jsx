import { useRef } from "react";

import HeroContent from "./HeroContent.jsx";
import Captions from "./Captions.jsx";
import ScrollCue from "./ScrollCue.jsx";
import { captions } from "../data/captions.js";
import { useScrollScrub } from "../hooks/useScrollScrub.js";
import { useHeroEntrance } from "../hooks/useHeroEntrance.js";
import styles from "./Stage.module.css";

/**
 * One pinned canvas: the hero dissolves into a scroll-scrubbed video
 * with cross-fading captions. GSAP/ScrollTrigger drives the scrub;
 * anime.js handles the hero entrance.
 */
export default function Stage({ reduced }) {
  const stageRef = useRef(null);
  const pinRef = useRef(null);
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const scrimRef = useRef(null);
  const railRef = useRef(null);
  const cueRef = useRef(null);
  const capsRef = useRef([]);

  useScrollScrub(
    { stageRef, pinRef, canvasRef, heroRef, scrimRef, railRef, cueRef, capsRef },
    captions,
    reduced
  );
  useHeroEntrance(heroRef, reduced);

  const skipIntro = () => {
    document
      .getElementById("services")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className={styles.stage}
      id="stage"
      aria-label="Empyreic, in motion"
      ref={stageRef}
    >
      <div className={styles.pin} ref={pinRef}>
        {/* Scroll-scrubbed image sequence drawn onto a canvas (Apple-style).
            The .video class + poster background show until the first frame
            paints. Frame loading + scrub are driven by useScrollScrub. */}
        <canvas
          className={styles.video}
          ref={canvasRef}
          width={1280}
          height={720}
          aria-hidden="true"
        />

        <div className={styles.shade} aria-hidden="true" />
        <div className={styles.scrim} ref={scrimRef} aria-hidden="true" />

        {/* Phase 0 — the hero */}
        <div className={styles.inner} ref={heroRef}>
          <HeroContent />
        </div>

        {/* Phases 1–3 — captions cross-fade as the clip scrubs */}
        <Captions captions={captions} capsRef={capsRef} />

        <div className={styles.rail} aria-hidden="true">
          <span className={styles.railFill} ref={railRef} />
        </div>

        <ScrollCue ref={cueRef} />

        <button
          type="button"
          className={styles.skip}
          onClick={skipIntro}
          aria-label="Skip the intro and scroll to the content"
        >
          <span>Skip intro</span>
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path
              d="M12 5v14M6 13l6 6 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
