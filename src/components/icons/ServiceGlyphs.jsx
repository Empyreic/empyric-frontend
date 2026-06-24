import { useEffect, useRef } from "react";
import anime from "animejs";

import s from "./ServiceGlyphs.module.css";

/* Living line-art scenes, one per discipline. Each glyph draws itself in
   once (anime.setDashoffset) and then runs a continuous, characterful loop
   that behaves like the thing it represents. `play` gates everything so
   reduced-motion / off-screen glyphs stay static. */

function useGlyph(play, setup) {
  const ref = useRef(null);
  useEffect(() => {
    if (!play) return;
    const root = ref.current;
    if (!root) return;

    let alive = true;
    const draw = root.querySelectorAll("[data-draw]");
    const loops = [];

    const intro = anime({
      targets: draw,
      strokeDashoffset: [anime.setDashoffset, 0],
      opacity: [0, 1],
      duration: 1100,
      easing: "easeInOutSine",
      delay: anime.stagger(34),
      complete: () => {
        if (!alive) return;
        setup(root, loops);
      },
    });

    return () => {
      alive = false;
      intro.pause();
      anime.remove(draw);
      loops.forEach((a) => {
        anime.remove(a.animatables.map((x) => x.target));
        a.pause();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);
  return ref;
}

/* ---------------- Frontend: UI assembling itself ---------------- */
function FrontendGlyph({ play }) {
  const ref = useGlyph(play, (root, loops) => {
    loops.push(
      anime({
        targets: root.querySelectorAll("[data-bar]"),
        scaleY: [0.34, 1],
        duration: 950,
        direction: "alternate",
        loop: true,
        easing: "easeInOutSine",
        delay: anime.stagger(150, { from: "last" }),
      })
    );
    loops.push(
      anime({
        targets: root.querySelector("[data-cursor]"),
        translateX: [-3, 7],
        translateY: [3, -5],
        duration: 1600,
        direction: "alternate",
        loop: true,
        easing: "easeInOutSine",
      })
    );
  });

  return (
    <svg ref={ref} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <rect data-draw x="18" y="24" width="84" height="56" rx="8" />
      <path data-draw d="M18 40 H102" />
      <circle data-draw cx="30" cy="32" r="2.2" />
      <circle data-draw cx="39" cy="32" r="2.2" />
      <rect className={s.barOrigin} data-bar x="34" y="54" width="8" height="18" rx="2" fill="currentColor" opacity="0.85" />
      <rect className={s.barOrigin} data-bar x="48" y="46" width="8" height="26" rx="2" fill="currentColor" opacity="0.85" />
      <rect className={s.barOrigin} data-bar x="62" y="58" width="8" height="14" rx="2" fill="currentColor" opacity="0.85" />
      <path data-cursor d="M82 58 l5 16 3 -7 7 -2 z" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Backend: data flowing through the stack ---------------- */
function BackendGlyph({ play }) {
  const ref = useGlyph(play, (root, loops) => {
    loops.push(
      anime({
        targets: root.querySelectorAll("[data-pulse]"),
        translateY: [0, 54],
        opacity: [
          { value: 0, duration: 0 },
          { value: 1, duration: 220 },
          { value: 1, duration: 1000 },
          { value: 0, duration: 420 },
        ],
        duration: 1700,
        loop: true,
        easing: "easeInOutSine",
        delay: anime.stagger(560),
      })
    );
  });

  return (
    <svg ref={ref} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <ellipse data-draw cx="60" cy="30" rx="26" ry="9" />
      <path data-draw d="M34 30 V58 a26 9 0 0 0 52 0 V30" />
      <path data-draw d="M34 58 V82 a26 9 0 0 0 52 0 V58" />
      <circle data-pulse cx="60" cy="30" r="3" fill="currentColor" opacity="0" />
      <circle data-pulse cx="60" cy="30" r="3" fill="currentColor" opacity="0" />
    </svg>
  );
}

/* ---------------- AI: a constellation that thinks ---------------- */
function AiGlyph({ play }) {
  const ref = useGlyph(play, (root, loops) => {
    loops.push(
      anime({
        targets: root.querySelectorAll("[data-node]"),
        scale: [1, 1.55],
        opacity: [0.5, 1],
        duration: 1300,
        direction: "alternate",
        loop: true,
        easing: "easeInOutSine",
        delay: anime.stagger(180, { from: "center" }),
      })
    );
    loops.push(
      anime({
        targets: root.querySelectorAll("[data-edge]"),
        opacity: [0.18, 0.85],
        duration: 1500,
        direction: "alternate",
        loop: true,
        easing: "easeInOutSine",
        delay: anime.stagger(130),
      })
    );
    loops.push(
      anime({
        targets: root.querySelector("[data-star]"),
        rotate: "1turn",
        duration: 9000,
        loop: true,
        easing: "linear",
      })
    );
  });

  return (
    <svg ref={ref} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <path data-edge data-draw d="M60 61 L30 32" />
      <path data-edge data-draw d="M60 61 L94 40" />
      <path data-edge data-draw d="M60 61 L34 88" />
      <path data-edge data-draw d="M60 61 L88 86" />
      <path data-edge data-draw d="M30 32 L94 40" />
      <path data-edge data-draw d="M34 88 L88 86" />
      <circle data-node data-draw className={s.spin} cx="30" cy="32" r="4" />
      <circle data-node data-draw className={s.spin} cx="94" cy="40" r="4" />
      <circle data-node data-draw className={s.spin} cx="34" cy="88" r="4" />
      <circle data-node data-draw className={s.spin} cx="88" cy="86" r="4" />
      <path
        data-star
        data-draw
        className={s.spin}
        d="M60 47 C61.5 57 64.5 60 74.5 61.5 C64.5 63 61.5 66 60 76 C58.5 66 55.5 63 45.5 61.5 C55.5 60 58.5 57 60 47 Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

/* ---------------- Automation: gears + an endless orbit ---------------- */
function AutomationGlyph({ play }) {
  const ref = useGlyph(play, (root, loops) => {
    loops.push(
      anime({
        targets: root.querySelector("[data-gear-a]"),
        rotate: "1turn",
        duration: 9000,
        loop: true,
        easing: "linear",
      })
    );
    loops.push(
      anime({
        targets: root.querySelector("[data-gear-b]"),
        rotate: "-1turn",
        duration: 7000,
        loop: true,
        easing: "linear",
      })
    );
    loops.push(
      anime({
        targets: root.querySelector("[data-orbit]"),
        rotate: "1turn",
        duration: 6000,
        loop: true,
        easing: "linear",
      })
    );
  });

  return (
    <svg ref={ref} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <g data-gear-a className={s.spin}>
        <circle data-draw cx="46" cy="52" r="15" />
        <circle data-draw cx="46" cy="52" r="5" />
        <path data-draw d="M31 52 H61" />
        <path data-draw d="M46 37 V67" />
        <path data-draw d="M35.4 41.4 L56.6 62.6" />
        <path data-draw d="M35.4 62.6 L56.6 41.4" />
      </g>
      <g data-gear-b className={s.spin}>
        <circle data-draw cx="76" cy="74" r="10" />
        <circle data-draw cx="76" cy="74" r="3.4" />
        <path data-draw d="M66 74 H86" />
        <path data-draw d="M76 64 V84" />
        <path data-draw d="M68.9 66.9 L83.1 81.1" />
        <path data-draw d="M68.9 81.1 L83.1 66.9" />
      </g>
      <g data-orbit className={s.orbit}>
        <circle cx="60" cy="24" r="3.2" fill="currentColor" />
      </g>
    </svg>
  );
}

const GLYPHS = {
  frontend: FrontendGlyph,
  backend: BackendGlyph,
  ai: AiGlyph,
  automation: AutomationGlyph,
};

export default function ServiceGlyph({ id, play }) {
  const Glyph = GLYPHS[id];
  return Glyph ? <Glyph play={play} /> : null;
}
