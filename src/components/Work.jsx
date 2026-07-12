import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import anime from "animejs";

import ArrowIcon from "./icons/ArrowIcon.jsx";
import { work } from "../data/work.js";
import { useInView } from "../hooks/useInView.js";
import { useCountUp } from "../hooks/useCountUp.js";
import styles from "./Work.module.css";

/** Selected Work - concrete case studies, rendered inside a scroll & button controlled carousel. */
export default function Work({ reduced }) {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const [activeIndex, setActiveIndex] = useState(0);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const navigate = useNavigate();

  useCountUp(ref, reduced);

  // Entrance header + track stagger fade in
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

  // Recalculate track position and card scales
  const updateLayout = () => {
    if (!stageRef.current || !trackRef.current) return;
    const stage = stageRef.current;
    const track = trackRef.current;
    const cards = track.children;
    if (cards.length === 0) return;

    const cardEl = cards[0];
    const cardWidth = cardEl.offsetWidth;
    const stepWidth = cardWidth + 28; // card width + margins (14px on each side)
    const offset = (stage.offsetWidth - cardWidth) / 2;

    track.style.transform = `translateX(${offset - activeIndex * stepWidth}px)`;

    Array.from(cards).forEach((card, i) => {
      if (i === activeIndex) {
        card.style.transform = "scale(1)";
        card.style.opacity = "1";
        card.style.pointerEvents = "auto";
      } else {
        card.style.transform = "scale(0.87)";
        card.style.opacity = "0.4";
        card.style.pointerEvents = "auto"; // allows click to shift index
      }
    });
  };

  useEffect(() => {
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [activeIndex]);

  // Handle wheel scrolling over the stage
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let wheelLock = false;
    const handleWheel = (e) => {
      e.preventDefault();
      if (wheelLock) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 8) return;

      wheelLock = true;
      const direction = delta > 0 ? 1 : -1;
      setActiveIndex((prev) => Math.max(0, Math.min(work.length - 1, prev + direction)));

      setTimeout(() => {
        wheelLock = false;
      }, 420);
    };

    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      stage.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleCardClick = (i, id) => {
    if (i === activeIndex) {
      navigate(`/work/${id}`);
    } else {
      setActiveIndex(i);
    }
  };

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

      {/* Screen Reader Outline Context */}
      <h3 className="sr-only" style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        A scroll and button controlled card carousel showing case studies one at a time, with hover reveal of extra detail.
      </h3>

      {/* Carousel Wrapper */}
      <div className={styles.carouselContainer}>
        {/* Navigation Buttons */}
        <button
          className={styles.navBtn}
          disabled={activeIndex === 0}
          onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
          aria-label="Previous card"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Stage */}
        <div
          ref={stageRef}
          className={styles.stage}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              setActiveIndex((prev) => Math.max(0, prev - 1));
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              setActiveIndex((prev) => Math.min(work.length - 1, prev + 1));
            }
          }}
        >
          {/* Track */}
          <div ref={trackRef} className={styles.track}>
            {work.map((c, i) => (
              <div
                className={styles.card}
                key={c.id}
                data-case
                onClick={() => handleCardClick(i, c.id)}
                role="button"
                aria-label={`View case study: ${c.client}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(i, c.id);
                  }
                }}
              >
                {/* Background Image / Placeholder */}
                <div className={styles.imageWrapper}>
                  {c.gallery?.[0]?.src ? (
                    <img src={c.gallery[0].src} alt="" className={styles.image} />
                  ) : (
                    <div className={styles.placeholder} />
                  )}
                  <div className={styles.overlay} />
                </div>

                {/* Card Meta Header */}
                <div className={styles.cardMeta}>
                  <span className={styles.client}>{c.client}</span>
                  <span className={styles.sector}>{c.sector}</span>
                </div>

                {/* Hover Slide-up Details Panel */}
                <div className={styles.panel}>
                  <h4 className={styles.caseTitle}>{c.title}</h4>
                  <p className={styles.caseSummary}>{c.summary}</p>

                  {/* Metrics */}
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

                  {/* Stack and Action Link */}
                  <div className={styles.panelFooter}>
                    <ul className={styles.stack}>
                      {c.stack.slice(0, 3).map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <span className={styles.viewLink}>
                      View
                      <ArrowIcon size={13} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className={styles.navBtn}
          disabled={activeIndex === work.length - 1}
          onClick={() => setActiveIndex((prev) => Math.min(work.length - 1, prev + 1))}
          aria-label="Next card"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Dots Indicator */}
      <div className={styles.dots}>
        {work.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to case study ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
