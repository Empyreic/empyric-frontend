import { useMorphPath } from "../hooks/useMorphPath.js";
import styles from "./Mascot.module.css";

/**
 * Empyreic's mascot — an abstract champagne face that morphs between moods.
 * Adapted from the framer-motion sketch into the studio's hand-rolled motion
 * stack: the outline + mouth are sprung via useMorphPath, every expression
 * accessory is a layer toggled by the `data-emotion` attribute in CSS.
 *
 * Ink is `currentColor`, so the same component reads as gold on the dark shell
 * and ink on the light case-study nav — drive it with `color` from the parent.
 */

// Outline + mouth path per mood. Within each layer all paths share identical
// SVG commands/point counts so useMorphPath can lerp between any two.
const FACE = {
  base: {
    outer: "M 40,60 C 60,80 80,120 100,160 C 120,120 140,80 160,60",
    inner: "M 85,123 L 100,110 L 115,123",
  },
  sparkling: {
    outer: "M 40,60 C 60,80 80,120 100,160 C 120,120 140,80 160,60",
    inner: "M 85,123 L 100,110 L 115,123",
  },
  squinched: {
    outer: "M 40,60 C 60,80 80,120 100,160 C 120,120 140,80 160,60",
    inner: "M 92,122 L 100,128 L 108,122",
  },
  droopy: {
    outer: "M 35,110 C 40,50 75,70 100,140 C 125,70 160,50 165,110",
    inner: "M 86,110 L 100,98 L 114,110",
  },
  angry: {
    outer: "M 40,70 C 60,100 80,130 100,160 C 120,130 140,100 160,70",
    inner: "M 83,122 L 100,122 L 117,122",
  },
  blushing: {
    outer: "M 40,60 C 60,80 80,120 100,160 C 120,120 140,80 160,60",
    inner: "M 85,123 L 100,110 L 115,123",
  },
  confused: {
    outer: "M 40,60 C 60,80 80,120 100,160 C 115,120 150,110 170,145",
    inner: "M 84,128 L 102,112 L 118,125",
  },
  panicking: {
    outer: "M 40,60 C 60,80 80,120 100,160 C 120,120 140,80 160,60",
    inner: "M 85,123 L 100,110 L 115,123",
  },
  surprised: {
    outer: "M 50,50 C 66.6,86.6 83.3,123.3 100,160 C 116.6,123.3 133.3,86.6 150,50",
    inner: "M 87,125 L 100,110 L 113,125",
  },
};

export default function Mascot({
  emotion = "base",
  size = 40,
  reduced = false,
  className,
  title,
  ...rest
}) {
  const face = FACE[emotion] || FACE.base;
  const outer = useMorphPath(face.outer, reduced);
  const inner = useMorphPath(face.inner, reduced);

  const ink = "currentColor";

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={[styles.mascot, className].filter(Boolean).join(" ")}
      data-emotion={emotion}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title ? <title>{title}</title> : null}

      {/* Outline + little mouth — the morphing core */}
      <path
        d={outer}
        fill="none"
        stroke={ink}
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={inner}
        fill="none"
        stroke={ink}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ===================== EYES ===================== */}

      {/* Default round eye — scaled per mood (wide when sparkling, pin when
          panicking, tall when surprised) */}
      <ellipse className={styles.eyeBase} cx="100" cy="126" rx="6" ry="6" fill={ink} />
      {/* Sparkle highlight inside the eye */}
      <circle className={styles.sparkDot} cx="100" cy="124" r="1.6" fill={ink} opacity="0.55" />

      <path className={styles.eyeDroopy} d="M 96,115 A 4,4 0 0,0 104,115 Z" fill={ink} opacity="0.7" />
      <path className={styles.eyeAngry} d="M 92,127 Q 100,134 108,127 Z" fill={ink} />
      <path
        className={styles.eyeHappy}
        d="M 92,129 Q 100,121 108,129"
        fill="none"
        stroke={ink}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <g className={styles.eyeConfused}>
        <path d="M 95,123 L 107,119" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
        <path d="M 98,122 A 3 3 0 0 0 104,120 Z" fill={ink} />
      </g>

      {/* ===================== ACCESSORIES ===================== */}

      {/* Sparkles */}
      <g className={styles.sparkles}>
        <g className={styles.sparklesSpin}>
          <path d="M 50,25 L 53,37 L 65,40 L 53,43 L 50,55 L 47,43 L 35,40 L 47,37 Z" fill={ink} />
          <circle cx="40" cy="55" r="2.5" fill={ink} />
          <circle cx="65" cy="25" r="2" fill={ink} />
          <path d="M 150,25 L 153,37 L 165,40 L 153,43 L 150,55 L 147,43 L 135,40 L 147,37 Z" fill={ink} />
          <circle cx="160" cy="55" r="2.5" fill={ink} />
          <circle cx="135" cy="25" r="2" fill={ink} />
        </g>
      </g>

      {/* Squinched action lines */}
      <g className={styles.squinchLines}>
        <path d="M 35,45 C 25,55 25,75 35,85 M 25,40 C 10,55 10,75 25,90" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        <path d="M 165,45 C 175,55 175,75 165,85 M 175,40 C 190,55 190,75 175,90" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
      </g>
      <path
        className={styles.tearSquinch}
        d="M 142,105 C 152,112 147,122 138,115 C 135,112 138,108 142,105 Z"
        fill="none"
        stroke={ink}
        strokeWidth="4"
        opacity="0.8"
      />

      {/* Droopy sweat */}
      <path
        className={styles.sweatDroopy}
        d="M 120,125 C 135,145 115,160 110,145 C 108,138 115,130 120,125 Z"
        fill="none"
        stroke={ink}
        strokeWidth="4"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Angry vein */}
      <g className={styles.vein}>
        <path
          className={styles.veinPulse}
          d="M 140,40 L 142,48 L 150,50 L 142,52 L 140,60 L 138,52 L 130,50 L 138,48 Z"
          fill="none"
          stroke={ink}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </g>

      {/* Blushing — heat lines + rising steam */}
      <g className={styles.blushHeavy}>
        <path d="M 55,135 L 45,150 M 65,135 L 55,150 M 75,135 L 65,150 M 85,135 L 75,150" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        <path d="M 145,135 L 155,150 M 135,135 L 145,150 M 125,135 L 135,150 M 115,135 L 125,150" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        <g className={styles.steam}>
          <path d="M 85,90 Q 90,80 80,70 Q 70,60 85,50" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M 100,90 Q 105,80 95,70 Q 85,60 100,50" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M 115,90 Q 120,80 110,70 Q 100,60 115,50" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      {/* Confused question mark */}
      <g className={styles.question}>
        <path d="M 125,75 C 120,70 135,65 140,75 C 145,85 130,90 130,100" fill="none" stroke={ink} strokeWidth="6" strokeLinecap="round" />
        <circle cx="130" cy="112" r="3.5" fill={ink} />
      </g>

      {/* Panicking — jittering lines + sweat */}
      <g className={styles.panic}>
        <g className={styles.panicShake}>
          <path d="M 35,50 C 25,55 25,75 35,80 M 25,45 C 10,55 10,75 25,85" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M 165,50 C 175,55 175,75 165,80 M 175,45 C 190,55 190,75 175,85" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M 80,150 C 70,160 70,175 80,185 M 70,145 C 55,160 55,175 70,190" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M 120,150 C 130,160 130,175 120,185 M 130,145 C 145,160 145,175 130,190" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        </g>
        <path d="M 145,115 C 160,125 150,140 140,130 C 135,125 140,120 145,115 Z" fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round" opacity="0.8" />
      </g>

      {/* Surprised exclamation */}
      <g className={styles.exclaim}>
        <path d="M 100,45 L 100,85" fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round" />
        <circle cx="100" cy="100" r="4" fill={ink} />
      </g>
    </svg>
  );
}
