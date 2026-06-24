import { useEffect } from "react";
import { Link } from "react-router-dom";
import anime from "animejs";

import ArrowIcon from "./icons/ArrowIcon.jsx";
import { work } from "../data/work.js";
import { useInView } from "../hooks/useInView.js";
import { useCountUp } from "../hooks/useCountUp.js";
import styles from "./Work.module.css";

/** Selected Work - concrete case studies, each linking to its full page. */
export default function Work({ reduced }) {
  const [ref, inView] = useInView({ threshold: 0.1 });
  useCountUp(ref, reduced);

  useEffect(() => {
    if (!inView || reduced) return;
    const root = ref.current;
    anime
      .timeline({ easing: "easeOutExpo" })
      .add({
        targets: root.querySelectorAll("[data-head]"),
        translateY: [28, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(110),
      })
      .add(
        {
          targets: root.querySelectorAll("[data-case]"),
          translateY: [48, 0],
          opacity: [0, 1],
          duration: 1000,
          delay: anime.stagger(140),
        },
        "-=750"
      );
  }, [inView, reduced, ref]);

  return (
    <section className={styles.work} id="work" aria-labelledby="work-title" ref={ref}>
      <header className={styles.head}>
        <p className={`eyebrow ${styles.eyebrow}`} data-head>
          <span className="eyebrow__mark" />
          Selected Work
        </p>
        <h2 className={styles.title} id="work-title" data-head>
          Proof, not adjectives.
        </h2>
        <p className={styles.lede} data-head>
          A few recent engagements - the brief, what we built, and what changed
          because of it. Open any one for the full story.
        </p>
      </header>

      <ol className={styles.list}>
        {work.map((c) => (
          <li className={styles.case} key={c.id} data-case>
            <Link className={styles.caseLink} to={`/work/${c.id}`}>
              <div className={styles.caseMeta}>
                <span className={styles.client}>{c.client}</span>
                <span className={styles.sector}>{c.sector}</span>
                <span className={styles.timeline}>{c.timeline}</span>
              </div>

              <div className={styles.caseBody}>
                <h3 className={styles.caseTitle}>{c.title}</h3>
                <p className={styles.caseSummary}>{c.summary}</p>
                <ul className={styles.stack}>
                  {c.stack.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <span className={styles.view}>
                  View case study
                  <ArrowIcon size={15} />
                </span>
              </div>

              <div className={styles.metrics}>
                {c.metrics.slice(0, 2).map((m) => (
                  <div className={styles.metric} key={m.label}>
                    <span className={styles.metricValue} data-count={m.value}>
                      {m.value}
                    </span>
                    <span className={styles.metricLabel}>{m.label}</span>
                  </div>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
