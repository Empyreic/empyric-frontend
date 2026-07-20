import { useEffect, useRef } from "react";
import anime from "animejs";

import { proofChecks, proofPillars, proofStats } from "../data/proof.js";
import { useInView } from "../hooks/useInView.js";
import { useCountUp } from "../hooks/useCountUp.js";
import { useDrawIn } from "../hooks/useDrawIn.js";
import { useParallax } from "../hooks/useParallax.js";
import styles from "./Proof.module.css";

export default function Proof({ reduced }) {
  const [ref, inView] = useInView({ threshold: 0.12 });
  const headRef = useRef(null);
  useCountUp(ref, reduced);
  useDrawIn(ref, reduced);
  useParallax(headRef, { from: -5, to: 5 }, reduced);

  useEffect(() => {
    if (!inView || reduced) return;
    const root = ref.current;
    if (!root) return;

    const motion = anime
      .timeline({ easing: "easeOutExpo" })
      .add({
        targets: root.querySelectorAll("[data-proof-head]"),
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 950,
        delay: anime.stagger(100),
      })
      .add(
        {
          targets: root.querySelectorAll("[data-proof-item]"),
          translateY: [34, 0],
          opacity: [0, 1],
          duration: 900,
          delay: anime.stagger(80),
        },
        "-=620"
      );

    return () => motion.pause();
  }, [inView, reduced, ref]);

  return (
    <section className={styles.proof} id="proof" aria-labelledby="proof-title" ref={ref}>
      <div className={styles.inner}>
        <header className={styles.head} ref={headRef}>
          <p className={`eyebrow ${styles.eyebrow}`} data-proof-head>
            <span className="eyebrow__mark" />
            Proof System
          </p>
          <h2 className={styles.title} id="proof-title" data-proof-head>
            The trust layer clients look for before they say yes.
          </h2>
        </header>

        <div className={styles.stats} aria-label="Engagement facts">
          {proofStats.map((stat) => (
            <div className={styles.stat} key={stat.label} data-proof-item>
              <span className={styles.statValue} data-count={stat.value}>
                {stat.value}
              </span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.grid}>
          <ol className={styles.pillars}>
            {proofPillars.map((pillar, i) => (
              <li className={styles.pillar} key={pillar.title} data-proof-item>
                <span className={styles.pillarNum}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                  <p className={styles.pillarBody}>{pillar.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <aside className={styles.checks} data-proof-item>
            <h3 className={styles.checkTitle}>What is included</h3>
            <ul>
              {proofChecks.map((check) => (
                <li key={check}>
                  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                    <path
                      d="M5 12.5l4.2 4.2L19 7"
                      pathLength="1"
                      data-draw
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{check}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
