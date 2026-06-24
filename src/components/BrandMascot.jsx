import { useCallback, useState } from "react";

import Mascot from "./Mascot.jsx";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

/**
 * The mascot as a living brand mark — it reacts to the cursor:
 *
 *   hover → blushing
 *   click → angry
 *
 * Moving away settles it back to normal. It lives happily inside the wordmark
 * <Link>: a click reacts in place and never triggers navigation, while clicking
 * the actual word still goes home.
 */
export default function BrandMascot({ size = 34, className, title, ...rest }) {
  const reduced = usePrefersReducedMotion();
  const [emotion, setEmotion] = useState("base");

  const enter = useCallback(() => setEmotion("blushing"), []);
  const leave = useCallback(() => setEmotion("base"), []);
  const click = useCallback((e) => {
    // React in place — don't follow the surrounding brand link.
    e.preventDefault();
    e.stopPropagation();
    setEmotion("angry");
  }, []);

  return (
    <span
      className={className}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onClick={click}
      {...rest}
    >
      <Mascot emotion={emotion} size={size} reduced={reduced} title={title} />
    </span>
  );
}
