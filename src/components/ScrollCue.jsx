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
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M12 5v14M6 13l6 6 6-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
});

export default ScrollCue;
