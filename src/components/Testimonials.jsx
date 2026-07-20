import { useEffect, useRef, useState } from "react";
import anime from "animejs";

import { testimonials } from "../data/testimonials.js";
import { useInView } from "../hooks/useInView.js";
import { useParallax } from "../hooks/useParallax.js";
import styles from "./Testimonials.module.css";

const ROTATE_MS = 6500;

/**
 * Voices — one luminous pull-quote at a time. Each quote reveals word by
 * word (anime stagger); auto-advances, pauses on hover, and lets you jump
 * via the author tabs.
 */
export default function Testimonials({ reduced }) {
  const [ref, inView] = useInView({ threshold: 0.3 });
  const [active, setActive] = useState(0);
  const quoteRef = useRef(null);
  const pausedRef = useRef(false);
  const auraRef = useRef(null);
  const headRef = useRef(null);
  useParallax(auraRef, { from: -8, to: 8 }, reduced);
  useParallax(headRef, { from: -5, to: 5 }, reduced);

  const current = testimonials[active];

  // Auto-advance once visible (skipped for reduced motion).
  useEffect(() => {
    if (!inView || reduced) return;
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setActive((a) => (a + 1) % testimonials.length);
      }
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [inView, reduced]);

  // Word-by-word reveal whenever the active quote changes.
  useEffect(() => {
    if (!inView || reduced) return;
    const root = quoteRef.current;
    if (!root) return;

    anime.timeline({ easing: "easeOutExpo" })
      .add({
        targets: root.querySelectorAll("[data-word]"),
        translateY: [26, 0],
        opacity: [0, 1],
        duration: 900,
        delay: anime.stagger(26),
      })
      .add(
        {
          targets: root.querySelectorAll("[data-meta]"),
          translateY: [12, 0],
          opacity: [0, 1],
          duration: 600,
        },
        "-=450"
      );
  }, [active, inView, reduced]);

  return (
    <section
      className={styles.testimonials}
      aria-labelledby="testimonials-title"
      ref={ref}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className={styles.aura} aria-hidden="true" ref={auraRef} />

      <p className={`eyebrow ${styles.eyebrow}`}>
        <span className="eyebrow__mark" />
        Voices
      </p>
      <h2 className={styles.heading} id="testimonials-title" ref={headRef}>
        Words from those who crossed over.
      </h2>

      <figure className={styles.figure} ref={quoteRef}>
        <span className={styles.quoteMark} aria-hidden="true">
          &ldquo;
        </span>
        <blockquote className={styles.quote} key={active}>
          {current.quote.split(" ").map((word, i) => (
            <span className={styles.word} data-word key={i}>
              {word}
              {" "}
            </span>
          ))}
        </blockquote>
        <figcaption className={styles.meta} data-meta>
          <div className={styles.avatar}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className={styles.metaText}>
            <span className={styles.name}>{current.name}</span>
            <span className={styles.role}>
              {current.role}, {current.company}
            </span>
          </div>
        </figcaption>
      </figure>

      <div className={styles.tabs} role="tablist" aria-label="Choose a testimonial">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            role="tab"
            aria-selected={i === active}
            aria-label={`${t.name}, ${t.company}`}
            className={`${styles.tab} ${i === active ? styles.tabActive : ""}`}
            onClick={() => setActive(i)}
          >
            <span className={styles.tabName}>{t.name}</span>
            <span className={styles.tabCo}>{t.company}</span>
            {i === active && <div className={styles.tabProgress} />}
          </button>
        ))}
      </div>
    </section>
  );
}
