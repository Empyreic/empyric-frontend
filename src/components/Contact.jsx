import { useEffect, useRef, useState } from "react";

import BrandMascot from "./BrandMascot.jsx";
import ArrowIcon from "./icons/ArrowIcon.jsx";
import { useMagnetic } from "../hooks/useMagnetic.js";
import { useParallax } from "../hooks/useParallax.js";
import styles from "./Contact.module.css";

const EMAIL = "hello@empyreic.studio";

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const STEPS = [
  {
    n: "01",
    title: "Say hello",
    body: "Tell us what you're building and the timeline.",
  },
  {
    n: "02",
    title: "We scope it",
    body: "Within two days: a plan, timeline, and fixed quote.",
  },
  {
    n: "03",
    title: "We build",
    body: "Weekly demos and a launch you're proud of.",
  },
];

export default function Contact({ reduced }) {
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);
  const glowRef = useRef(null);
  const ctaRef = useRef(null);
  useMagnetic(ctaRef);
  useParallax(glowRef, { from: -14, to: 14 }, reduced);

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const items = root.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (reduced) {
      items.forEach((item) => {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      });
      return;
    }

    let ctx;
    let cancelled = false;

    const init = async () => {
      const [{ default: gsap }, { default: ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(items, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: "top 72%", once: true },
        });
      }, root);
    };

    init();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced]);

  const mailtoHref = `mailto:${EMAIL}?subject=${encodeURIComponent(
    "Project enquiry"
  )}&body=${encodeURIComponent(
    "Hi Empyreic,\n\nWhat we're building:\nTimeline:\nRough budget:\n\n- "
  )}`;

  const callHref = `mailto:${EMAIL}?subject=${encodeURIComponent(
    "Fit call request"
  )}&body=${encodeURIComponent(
    "Hi Empyreic,\n\nI'd like to schedule a 20-minute fit call.\n\nProject context:\nBest times:\n\n- "
  )}`;

  return (
    <section className={styles.contact} id="contact" ref={sectionRef}>
      <div className={styles.glow} aria-hidden="true" ref={glowRef} />

      <div className={styles.inner}>
        <div className={styles.lead}>
          <BrandMascot size={72} className={styles.star} data-reveal />
          <p className={`eyebrow ${styles.eyebrow}`} data-reveal>
            <span className="eyebrow__mark" />
            Start here
          </p>
          <h2 className={styles.title} data-reveal>
            Let&apos;s build something
            <br />
            that lasts.
          </h2>
          <p className={styles.copy} data-reveal>
            Bring your budget and timeline — we&apos;ll scope it precisely
            before any work begins.
          </p>

          <div className={styles.actions} data-reveal>
            <a className="btn btn--primary" href={mailtoHref} ref={ctaRef}>
              Email the studio
            </a>
            <a className="btn btn--ghost" href={callHref}>
              Request a fit call
              <ArrowIcon />
            </a>
          </div>

          <dl className={styles.meta} data-reveal>
            <div>
              <dt className={styles.metaLabel}>
                <MailIcon />
                <span>Email</span>
              </dt>
              <dd className={styles.emailRow}>
                <a href={mailtoHref}>{EMAIL}</a>
                <button
                  type="button"
                  className={styles.copyBtn}
                  onClick={copyEmail}
                  aria-label="Copy email address to clipboard"
                >
                  {copied ? (
                    <span className={styles.copiedText}>Copied!</span>
                  ) : (
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.copyIcon}>
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </button>
              </dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>
                <CalendarIcon />
                <span>Availability</span>
              </dt>
              <dd>Booking projects for Q3 2026</dd>
            </div>
            <div>
              <dt className={styles.metaLabel}>
                <GlobeIcon />
                <span>Where</span>
              </dt>
              <dd>Remote-first / worldwide</dd>
            </div>
          </dl>
        </div>

        <ol className={styles.steps} aria-label="How it works">
          {STEPS.map((s) => (
            <li className={styles.step} key={s.n} data-reveal>
              <span className={styles.stepNum}>{s.n}</span>
              <div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepBody}>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
