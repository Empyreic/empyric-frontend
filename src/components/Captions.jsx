import styles from "./Stage.module.css";

/**
 * Phase captions that cross-fade over the scrubbing clip.
 * `capsRef` collects each article so the scrub timeline can animate them.
 */
export default function Captions({ captions, capsRef }) {
  return (
    <div className={styles.captions}>
      {captions.map((cap, i) => (
        <article
          key={cap.eyebrow}
          className={styles.cap}
          ref={(el) => (capsRef.current[i] = el)}
        >
          <p className={styles.capEyebrow}>{cap.eyebrow}</p>
          <h2 className={styles.capTitle}>
            {cap.title.map((line, j) => (
              <span key={j}>
                {line}
                {j < cap.title.length - 1 && <br />}
              </span>
            ))}
          </h2>
          {cap.cta && (
            <a className={`btn btn--primary ${styles.capCta}`} href={cap.cta.href}>
              {cap.cta.label}
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
