import { forwardRef } from "react";
import styles from "./Stage.module.css";

/** Small "scroll to enter" affordance pinned to the stage corner. */
const ScrollCue = forwardRef(function ScrollCue(_props, ref) {
  return (
    <a
      className={styles.scrollcue}
      href="#stage"
      aria-label="Scroll to enter"
      ref={ref}
    >
      <span>Scroll to enter</span>
      <svg viewBox="0 0 24 36" width="14" height="22" aria-hidden="true" className={styles.mouseIcon}>
        <rect x="2" y="2" width="20" height="32" rx="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="12" y1="8" x2="12" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={styles.mouseWheel} />
      </svg>
    </a>
  );
});

export default ScrollCue;
