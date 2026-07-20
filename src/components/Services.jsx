import { useRef } from "react";

import { services } from "../data/services.js";
import { useReveal } from "../hooks/useReveal.js";
import { useParallax } from "../hooks/useParallax.js";
import styles from "./Services.module.css";

/**
 * The Craft — A premium, 2x2 editorial card grid representing the disciplines.
 * Each card features translucent glassmorphism, animated inline SVG light objects,
 * and elegant typography consistent with the Empyreic homepage.
 */
export default function Services({ reduced }) {
  const ref = useRef(null);
  const glowRef = useRef(null);
  const headRef = useRef(null);
  useParallax(glowRef, { from: -16, to: 16 }, reduced);
  useParallax(headRef, { from: -5, to: 5 }, reduced);

  // Section header reveals first, cards staggered behind
  useReveal(ref, reduced, "[data-head]", { delay: 0 });
  useReveal(ref, reduced, "[data-row]", { delay: 120 });

  return (
    <section
      className={styles.services}
      id="services"
      aria-labelledby="services-title"
      ref={ref}
    >
      {/* Shared subtle center glow for disciplines */}
      <div className={styles.sharedGlow} aria-hidden="true" ref={glowRef} />

      <header className={styles.head} ref={headRef}>
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

      <div className={styles.grid}>
        {services.map((s) => (
          <div
            className={styles.card}
            key={s.id}
            data-row
          >
            {/* Abstract visual light objects */}
            {s.id === "frontend" && (
              <div className={styles.visualWrapper}>
                <svg className={styles.frontendVisual} viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="10" width="140" height="100" rx="4" stroke="rgba(241, 237, 227, 0.12)" strokeWidth="1" fill="rgba(11, 15, 27, 0.2)" />
                  <line x1="10" y1="28" x2="150" y2="28" stroke="rgba(241, 237, 227, 0.12)" strokeWidth="1" />
                  <circle cx="22" cy="19" r="2.5" fill="rgba(241, 237, 227, 0.2)" />
                  <circle cx="30" cy="19" r="2.5" fill="rgba(241, 237, 227, 0.2)" />
                  <circle cx="38" cy="19" r="2.5" fill="rgba(241, 237, 227, 0.2)" />
                  <defs>
                    <radialGradient id="frontendGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#e8d4a7" stopOpacity="0.25" />
                      <stop offset="50%" stopColor="#6e82a5" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect x="25" y="42" width="110" height="52" rx="2" fill="url(#frontendGlow)" className={styles.luminousBody} />
                </svg>
              </div>
            )}

            {s.id === "ai" && (
              <div className={styles.visualWrapper}>
                <svg className={styles.aiVisual} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="aiOrb" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#e8d4a7" stopOpacity="0.35" />
                      <stop offset="40%" stopColor="#6e82a5" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="60" cy="60" r="30" fill="url(#aiOrb)" className={styles.luminousBody} />
                  <circle cx="60" cy="60" r="8" fill="#e8d4a7" opacity="0.18" className={styles.aiCore} />
                  <ellipse cx="60" cy="60" rx="45" ry="15" stroke="rgba(241, 237, 227, 0.08)" strokeWidth="0.8" transform="rotate(-15 60 60)" />
                  <ellipse cx="60" cy="60" rx="45" ry="20" stroke="rgba(241, 237, 227, 0.08)" strokeWidth="0.8" transform="rotate(45 60 60)" />
                  <circle cx="22" cy="52" r="2" fill="#e8d4a7" opacity="0.7" className={styles.orbitNode1} />
                  <circle cx="95" cy="80" r="1.5" fill="#e8d4a7" opacity="0.8" className={styles.orbitNode2} />
                  <circle cx="60" cy="15" r="2.5" fill="#e8d4a7" opacity="0.6" className={styles.orbitNode3} />
                </svg>
              </div>
            )}

            {s.id === "automation" && (
              <div className={styles.visualWrapper}>
                <svg className={styles.automationVisual} viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6e82a5" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#e8d4a7" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#6e82a5" stopOpacity="0.15" />
                    </linearGradient>
                    <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#e8d4a7" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <path d="M 20 80 Q 50 30 80 70 T 130 40" fill="none" stroke="url(#flowLine)" strokeWidth="1.5" strokeDasharray="3 3" className={styles.flowPath} />
                  <circle cx="20" cy="80" r="3.5" fill="rgba(241, 237, 227, 0.2)" stroke="rgba(241, 237, 227, 0.4)" strokeWidth="0.8" />
                  <circle cx="62" cy="48" r="3.5" fill="rgba(241, 237, 227, 0.2)" stroke="rgba(241, 237, 227, 0.4)" strokeWidth="0.8" />
                  <circle cx="92" cy="65" r="3.5" fill="rgba(241, 237, 227, 0.2)" stroke="rgba(241, 237, 227, 0.4)" strokeWidth="0.8" />
                  <circle cx="130" cy="40" r="3.5" fill="rgba(241, 237, 227, 0.2)" stroke="rgba(241, 237, 227, 0.4)" strokeWidth="0.8" />
                  <circle cx="62" cy="48" r="12" fill="url(#nodeGlow)" className={styles.luminousBody} />
                  <circle cx="92" cy="65" r="10" fill="url(#nodeGlow)" className={styles.luminousBody} />
                </svg>
              </div>
            )}

            {s.id === "motion" && (
              <div className={styles.visualWrapper}>
                <svg className={styles.motionVisual} viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="motionGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#e8d4a7" stopOpacity="0.4" />
                      <stop offset="60%" stopColor="#6e82a5" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 30 15 C 60 45 20 85 90 125" fill="none" stroke="url(#motionGlow)" strokeWidth="6" strokeLinecap="round" className={styles.motionRibbon1} style={{ filter: "blur(3px)" }} />
                  <path d="M 30 15 C 60 45 20 85 90 125" fill="none" stroke="#e8d4a7" strokeWidth="1" strokeLinecap="round" className={styles.motionRibbon2} opacity="0.3" />
                </svg>
              </div>
            )}

            {/* Card Header */}
            <div className={styles.cardHeader}>
              <span className={styles.cardNumber}>{s.index}</span>
            </div>

            {/* Card Main Body */}
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{s.name}</h3>
              <p className={styles.cardTagline}>{s.tagline}</p>
              <p className={styles.cardDescription}>{s.blurb}</p>
            </div>

            {/* Card Footer (Capabilities Stack) */}
            <div className={styles.cardFooter}>
              <ul className={styles.capabilities}>
                {s.stack.map((t) => (
                  <li key={t} className={styles.capabilityTag}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
