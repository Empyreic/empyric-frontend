import { useEffect, useRef, useState } from "react";
import anime from "animejs";

import ServiceGlyph from "./icons/ServiceGlyphs.jsx";
import { services } from "../data/services.js";
import { useInView } from "../hooks/useInView.js";
import { useParallax } from "../hooks/useParallax.js";
import styles from "./Services.module.css";

/**
 * The Craft — an interactive expanding ledger. One discipline is open at a
 * time, revealing its blurb, tags, and a large living glyph. The open panel
 * is driven by scroll (it sweeps down the list as you move through the
 * section) and can be taken over by hover / focus / tap.
 */
export default function Services({ reduced }) {
  const [ref, inView] = useInView({ threshold: 0.12 });
  const [active, setActive] = useState(0);
  const rowEls = useRef([]);
  const hoveringRef = useRef(false);
  const glowRef = useRef(null);
  useParallax(glowRef, { from: -16, to: 16 }, reduced);

  // Entrance: header + rows stagger up once the section appears.
  useEffect(() => {
    if (!inView || reduced) return;
    const root = ref.current;

    anime
      .timeline({ easing: "easeOutExpo" })
      .add({
        targets: root.querySelectorAll("[data-head]"),
        translateY: [30, 0],
        opacity: [0, 1],
        duration: 1100,
        delay: anime.stagger(120),
      })
      .add(
        {
          targets: root.querySelectorAll("[data-row]"),
          translateY: [40, 0],
          opacity: [0, 1],
          duration: 1000,
          delay: anime.stagger(110),
        },
        "-=850"
      );
  }, [inView, reduced, ref]);

  // Scroll choreography: the row nearest the viewport centre opens, unless
  // the pointer is actively hovering the list. This is a desktop affordance —
  // on touch devices there's no hover, and the scroll-driven open fights the
  // user's taps, so we disable it and let tapping a row control the accordion.
  useEffect(() => {
    if (reduced) return;
    const hoverCapable = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!hoverCapable) return;
    let raf = 0;
    const pick = () => {
      raf = 0;
      if (hoveringRef.current) return;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      rowEls.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(pick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    pick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section
      className={styles.services}
      id="services"
      aria-labelledby="services-title"
      ref={ref}
    >
      <div className={styles.glow} aria-hidden="true" ref={glowRef} />

      <header className={styles.head}>
        <p className={`eyebrow ${styles.eyebrow}`} data-head>
          <span className="eyebrow__mark" />
          The Craft
        </p>
        <h2 className={styles.title} id="services-title" data-head>
          Four disciplines,
          <br />
          one light.
        </h2>
      </header>

      <ol
        className={styles.list}
        onMouseEnter={() => (hoveringRef.current = true)}
        onMouseLeave={() => (hoveringRef.current = false)}
      >
        {services.map((s, i) => {
          const open = i === active;
          return (
            <li
              className={styles.row}
              key={s.id}
              data-row
              data-active={open || undefined}
              ref={(el) => (rowEls.current[i] = el)}
            >
              <button
                type="button"
                className={styles.header}
                aria-expanded={open}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
              >
                <span className={styles.index} aria-hidden="true">
                  {s.index}
                </span>
                <span className={styles.name}>{s.name}</span>
                <span className={styles.tagline}>{s.tagline}</span>
                <span className={styles.mark} aria-hidden="true" />
                <span className={styles.rail} aria-hidden="true" />
              </button>

              <div className={styles.panel}>
                <div className={styles.panelInner}>
                  <div className={styles.panelBody}>
                    <div className={styles.copy}>
                      <p className={styles.blurb}>{s.blurb}</p>
                      <ul className={styles.deliverables}>
                        {s.deliverables.map((d) => (
                          <li key={d}>
                            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                              <path
                                d="M5 12.5l4 4 10-10"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {d}
                          </li>
                        ))}
                      </ul>
                      <div className={styles.meta}>
                        <span className={styles.engagement}>
                          Typical engagement · {s.engagement}
                        </span>
                        <ul className={styles.stack}>
                          {s.stack.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className={styles.glyphStage}>
                      <div className={styles.glyphHalo} aria-hidden="true" />
                      {open && (
                        <ServiceGlyph
                          id={s.id}
                          play={inView && !reduced}
                          key={s.id}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
