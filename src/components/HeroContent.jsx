import { useRef } from "react";

import ArrowIcon from "./icons/ArrowIcon.jsx";
import { useMagnetic } from "../hooks/useMagnetic.js";
import styles from "./Stage.module.css";

/** Phase 0 — the hero copy that opens the experience. */
export default function HeroContent() {
  const ctaRef = useRef(null);
  useMagnetic(ctaRef);

  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <p className="eyebrow reveal">
          <span className="eyebrow__mark" />
          Design &amp; engineering studio
        </p>
        <h1 className="headline reveal">
          Where everything
          <br />
          finally comes together.
        </h1>
        <p className="subhead reveal">
          We design and build websites, web apps, and AI products — end to end.
        </p>
        <div className="actions reveal">
          <a className="btn btn--primary" href="#contact" ref={ctaRef}>
            Start a project
          </a>
          <a className="btn btn--ghost" href="#work">
            See our work
            <ArrowIcon />
          </a>
        </div>
        <p className="trust reveal">
          Independent &amp; remote-first
          <span className="trust__dot" aria-hidden="true">
            ·
          </span>
          Booking projects for Q3 2026
        </p>
      </div>
    </div>
  );
}
