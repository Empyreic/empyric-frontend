import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import BrandMascot from "./BrandMascot.jsx";
import ArrowIcon from "./icons/ArrowIcon.jsx";
import { useMagnetic } from "../hooks/useMagnetic.js";
import { useParallax } from "../hooks/useParallax.js";
import styles from "./Contact.module.css";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "hello@empyreic.studio";

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
  const sectionRef = useRef(null);
  const glowRef = useRef(null);
  const ctaRef = useRef(null);
  useMagnetic(ctaRef);
  useParallax(glowRef, { from: -14, to: 14 }, reduced);

  // The section sits at the foot of the page with no entrance of its own —
  // give it a calm staggered reveal as it scrolls in.
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const items = root.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (reduced) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
    }, root);

    return () => ctx.revert();
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
              <dt>Email</dt>
              <dd>
                <a href={mailtoHref}>{EMAIL}</a>
              </dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>Booking projects for Q3 2026</dd>
            </div>
            <div>
              <dt>Where</dt>
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
