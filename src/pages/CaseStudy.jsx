import { useEffect, useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import anime from "animejs";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import { workById, nextWork } from "../data/work.js";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import styles from "./CaseStudy.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function CaseStudy() {
  const { slug } = useParams();
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef(null);
  const c = workById(slug);

  useEffect(() => {
    if (!c || reduced) return;
    const root = rootRef.current;
    if (!root) return;

    const trace = root.querySelector("[data-trace-path]");
    const traceMotion = trace
      ? anime({
          targets: trace,
          strokeDashoffset: [anime.setDashoffset, 0],
          duration: 1800,
          delay: 300,
          easing: "easeInOutSine",
        })
      : null;

    const intro = anime
      .timeline({ easing: "easeOutExpo" })
      .add({
        targets: root.querySelectorAll("[data-hero]"),
        translateY: [36, 0],
        opacity: [0, 1],
        duration: 1050,
        delay: anime.stagger(95),
      })
      .add(
        {
          targets: root.querySelectorAll("[data-hero-metric]"),
          translateY: [22, 0],
          opacity: [0, 1],
          duration: 760,
          delay: anime.stagger(80),
        },
        "-=650"
      );

    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-pop]").forEach((el) => {
        const tilt = Number(el.dataset.tilt || 0);
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 72, rotate: tilt },
          {
            autoAlpha: 1,
            y: 0,
            rotate: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 84%",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray("[data-parallax]").forEach((el, index) => {
        gsap.to(el, {
          yPercent: index % 2 ? -9 : -13,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.to("[data-marquee-track]", {
        xPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      root.querySelectorAll("[data-count]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => countUp(el),
        });
      });
    }, root);

    return () => {
      intro.pause();
      if (traceMotion) traceMotion.pause();
      ctx.revert();
    };
  }, [c, reduced, slug]);

  if (!c) return <Navigate to="/" replace />;

  const next = nextWork(c.id);
  const heroShot = c.gallery[0];
  const ticker = [c.client, c.sector, c.year, c.timeline, c.role];
  const tickerItems = [...ticker, ...ticker, ...ticker];

  return (
    <main className={styles.page} style={{ "--accent": c.accent }} ref={rootRef}>
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack} data-marquee-track>
          {tickerItems.map((item, i) => (
            <span key={`${item}-${i}`}>{item}</span>
          ))}
        </div>
      </div>

      <div className={styles.wrap}>
        <Link className={styles.back} to={{ pathname: "/", hash: "#work" }}>
          <span aria-hidden="true">&larr;</span>
          All work
        </Link>

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker} data-hero>
              Case study / {c.sector} / {c.year}
            </p>
            <h1 className={styles.title} data-hero>
              {c.title}
            </h1>
            <p className={styles.summary} data-hero>
              {c.summary}
            </p>
          </div>

          <div className={styles.heroPlate} data-hero data-parallax>
            <div className={styles.plateImage}>
              {heroShot?.src ? (
                <img src={heroShot.src} alt={heroShot.caption} />
              ) : (
                <div className={styles.shotPlaceholder} />
              )}
            </div>
            <svg className={styles.trace} viewBox="0 0 420 420" aria-hidden="true">
              <path
                className={styles.traceGhost}
                d="M34 312C86 229 139 344 189 222C238 101 313 202 386 62"
              />
              <path
                className={styles.traceLine}
                d="M34 312C86 229 139 344 189 222C238 101 313 202 386 62"
                data-trace-path
              />
            </svg>
            <div className={styles.plateMeta}>
              <span>{c.client}</span>
              <span>{c.timeline}</span>
            </div>
          </div>

          <div className={styles.metrics} data-hero>
            {c.metrics.map((m) => (
              <div className={styles.metricCard} key={m.label} data-hero-metric>
                <span className={styles.metricValue} data-count={m.value}>
                  {m.value}
                </span>
                <span className={styles.metricLabel}>{m.label}</span>
              </div>
            ))}
          </div>
        </header>

        <section className={styles.dossier}>
          <aside className={styles.specs} data-pop data-tilt="-2">
            <Spec label="Client" value={c.client} />
            <Spec label="Sector" value={c.sector} />
            <Spec label="Timeline" value={c.timeline} />
            <Spec label="Role" value={c.role} />
            <div className={styles.spec}>
              <span className={styles.specLabel}>Stack</span>
              <div className={styles.stack}>
                {c.stack.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </aside>

          <div className={styles.blocks}>
            <Block eyebrow="01" tag="The brief" body={c.brief} />
            <Block eyebrow="02" tag="The pressure point" body={c.challenge} strong />
          </div>
        </section>

        <section className={styles.approach}>
          <div className={styles.sectionIntro} data-pop>
            <span>Build path</span>
            <h2>How the work moved from friction to release.</h2>
          </div>
          <ol className={styles.steps}>
            {c.approach.map((step, i) => (
              <li className={styles.step} key={step.title} data-pop data-tilt={i % 2 ? 2.5 : -2.5}>
                <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.gallerySection}>
          <div className={styles.sectionIntro} data-pop>
            <span>Surface checks</span>
            <h2>Fragments from the finished system.</h2>
          </div>
          <div className={styles.gallery}>
            {c.gallery.map((g, i) => (
              <figure className={styles.shot} key={g.caption} data-pop data-tilt={i % 2 ? 1.5 : -1.5}>
                <div className={styles.shotFrame} data-parallax>
                  {g.src ? (
                    <img src={g.src} alt={g.caption} loading="lazy" />
                  ) : (
                    <div className={styles.shotPlaceholder} />
                  )}
                </div>
                <figcaption className={styles.shotCaption}>{g.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className={styles.outcome} data-pop>
          <span className={styles.outcomeTag}>Outcome</span>
          <p className={styles.outcomeProse}>{c.outcome}</p>
        </section>
      </div>

      <Link className={styles.next} to={`/work/${next.id}`} style={{ "--next-accent": next.accent }}>
        <span className={styles.nextLabel}>Next project</span>
        <span className={styles.nextTitle}>{next.client}</span>
        <span className={styles.nextSummary}>{next.title}</span>
        <span className={styles.nextArrow} aria-hidden="true">
          &rarr;
        </span>
      </Link>

      <section className={styles.cta}>
        <h2 className={styles.ctaTitle} data-pop>
          Want results
          <br />
          like these?
        </h2>
        <div className={styles.ctaActions} data-pop>
          <Link className={`${styles.nbtn} ${styles.nbtnPrimary}`} to={{ pathname: "/", hash: "#contact" }}>
            Start a project
          </Link>
          <Link className={`${styles.nbtn} ${styles.nbtnGhost}`} to="/studio">
            Meet the team
          </Link>
        </div>
      </section>
    </main>
  );
}

function Block({ eyebrow, tag, body, strong = false }) {
  return (
    <section className={`${styles.block} ${strong ? styles.blockStrong : ""}`} data-pop>
      <span className={styles.blockEyebrow}>{eyebrow}</span>
      <h2 className={styles.blockTag}>{tag}</h2>
      <p className={styles.prose}>{body}</p>
    </section>
  );
}

function Spec({ label, value }) {
  return (
    <div className={styles.spec}>
      <span className={styles.specLabel}>{label}</span>
      <strong className={styles.specValue}>{value}</strong>
    </div>
  );
}

function countUp(el) {
  if (el.dataset.counted === "true") return;
  el.dataset.counted = "true";

  const raw = el.dataset.count;
  const match = raw.match(/[\d.]+/);
  if (!match) {
    el.textContent = raw;
    return;
  }

  const target = parseFloat(match[0]);
  const decimals = (match[0].split(".")[1] || "").length;
  const prefix = raw.slice(0, match.index);
  const suffix = raw.slice(match.index + match[0].length);
  const obj = { v: 0 };

  anime({
    targets: obj,
    v: target,
    duration: 1500,
    easing: "easeOutExpo",
    update: () => {
      el.textContent = prefix + obj.v.toFixed(decimals) + suffix;
    },
  });
}
