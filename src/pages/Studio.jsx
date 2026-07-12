import { useEffect } from "react";
import { Link } from "react-router-dom";
import anime from "animejs";

import ArrowIcon from "../components/icons/ArrowIcon.jsx";
import { studio, team } from "../data/team.js";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import styles from "./Studio.module.css";



// Sub-component to render custom visual widgets for dashboard signals
function SignalVisual({ label }) {
  if (label === "Active builds") {
    return (
      <div className={styles.signalVisual}>
        <div className={styles.pulseContainer}>
          <span className={styles.pulseDot} />
          <span className={styles.pulseRing} />
        </div>
      </div>
    );
  }
  if (label === "Review rhythm") {
    return (
      <div className={styles.signalVisual}>
        <svg className={styles.rhythmCycle} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" strokeDasharray="3 3" opacity="0.4" />
          <path d="M12 3a9 9 0 0 1 9 9" stroke="var(--champagne)" />
        </svg>
      </div>
    );
  }
  if (label === "Team access") {
    return (
      <div className={styles.signalVisual}>
        <svg className={styles.accessNodes} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="6" cy="18" r="2" fill="currentColor" />
          <circle cx="18" cy="18" r="2" fill="currentColor" />
          <circle cx="12" cy="6" r="2" fill="currentColor" />
          <path d="M8 16.5 L11 8.5 M16 16.5 L13 8.5" opacity="0.6" />
        </svg>
      </div>
    );
  }
  return null;
}

// Helper to return custom icons for Bento Grid values
function getValueIcon(title) {
  if (title.toLowerCase().includes("senior")) {
    return (
      <svg className={styles.valueIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" strokeDasharray="4 2" />
        <path d="M12 2v20M2 12h20M12 8l4 4-4 4-4-4 4-4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (title.toLowerCase().includes("show")) {
    return (
      <svg className={styles.valueIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4M7 8l5 4 5-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className={styles.valueIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 21h16M6 21V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14M10 9h4M10 13h4M10 17h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Studio() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    anime({
      targets: "[data-rise]",
      translateY: [28, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1000,
      delay: anime.stagger(90),
    });
  }, [reduced]);

  // Handle mouse move to feed coordinate variables into the hover card glow
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={`eyebrow ${styles.eyebrow}`} data-rise>
            <span className="eyebrow__mark" />
            The Studio / since {studio.founded}
          </p>
          <h1 className={styles.title} data-rise>
            The people behind <span className={styles.titleHighlight}>the light.</span>
          </h1>
          <p className={styles.lead} data-rise>
            {studio.story}
          </p>
        </div>

        <aside className={styles.signals} aria-label="Studio operating signals" data-rise>

          <div className={styles.signalsGrid}>
            {studio.signals.map((signal) => (
              <div className={styles.signal} key={signal.label}>
                <div className={styles.signalMeta}>
                  <span className={styles.signalValue}>{signal.value}</span>
                  <span className={styles.signalLabel}>{signal.label}</span>
                </div>
                <SignalVisual label={signal.label} />
              </div>
            ))}
          </div>
        </aside>
      </header>

      <section className={styles.valuesSection} aria-label="How we work">
        <div className={styles.sectionHeader}>
          <p className={`eyebrow ${styles.eyebrow}`} data-rise>
            <span className="eyebrow__mark" />
            Core Values
          </p>
        </div>
        <div className={styles.valuesGrid}>
          {studio.values.map((v, idx) => (
            <div 
              className={`${styles.valueCard} ${styles[`card-${idx + 1}`]}`} 
              key={v.title} 
              data-rise
              onMouseMove={handleMouseMove}
            >
              <div className={styles.cardGlow} />
              <div className={styles.valueCardInner}>
                <div className={styles.valueCardHeader}>
                  {getValueIcon(v.title)}
                  <span className={styles.cardIndex}>0{idx + 1}</span>
                </div>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueBody}>{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.standards} aria-labelledby="standards-title">
        <div className={styles.standardsHead}>
          <p className={`eyebrow ${styles.eyebrow}`} data-rise>
            <span className="eyebrow__mark" />
            Operating Standards
          </p>
          <h2 className={styles.standardsTitle} id="standards-title" data-rise>
            How we keep a project trustworthy while it moves.
          </h2>
        </div>
        <ol className={styles.standardList}>
          {studio.standards.map((standard, i) => (
            <li className={styles.standard} key={standard.title} data-rise>
              <div className={styles.standardIndicator}>
                <span className={styles.standardNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.standardLine} />
              </div>
              <div className={styles.standardContent}>
                <h3 className={styles.standardTitle}>{standard.title}</h3>
                <p className={styles.standardBody}>{standard.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.teamSection} aria-labelledby="team-title">
        <div className={styles.teamHead}>
          <div className={styles.teamHeadText}>
            <p className={`eyebrow ${styles.eyebrow}`} data-rise>
              <span className="eyebrow__mark" />
              The Roster
            </p>
            <h2 className={styles.teamTitle} id="team-title" data-rise>
              {studio.size}.
            </h2>
          </div>
          <p className={styles.teamLede} data-rise>
            Who you&apos;d be working with. Direct developer/designer access, no layers.
          </p>
        </div>

        <ul className={styles.grid}>
          {team.map((m) => (
            <li 
              className={styles.member} 
              key={m.name} 
              data-rise
              onMouseMove={handleMouseMove}
            >
              <div className={styles.cardGlow} />
              <div className={styles.memberInner}>
                <div className={styles.memberHeader}>
                  <div className={styles.avatar} aria-hidden="true">
                    {m.photo ? <img src={m.photo} alt="" /> : <span>{m.initials}</span>}
                  </div>
                  <div className={styles.memberMeta}>
                    <h3 className={styles.memberName}>{m.name}</h3>
                    <p className={styles.memberRole}>{m.role}</p>
                  </div>
                </div>

                <div className={styles.memberDetails}>
                  <div className={styles.memberLocRow}>
                    <span className={styles.memberLoc}>
                      <svg className={styles.pinIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {m.location}
                    </span>
                  </div>
                  
                  <p className={styles.memberBio}>{m.bio}</p>
                  
                  <a
                    className={styles.memberLink}
                    href={m.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    LinkedIn
                    <ArrowIcon size={14} />
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaGlow} />
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Like the sound of us?</h2>
          <p className={styles.ctaCopy}>
            If the timing&apos;s right, tell us what you&apos;re building.
          </p>
          <div className={styles.ctaActions}>
            <Link className="btn btn--primary" to={{ pathname: "/", hash: "#contact" }}>
              Start a project
            </Link>
            <Link className="btn btn--ghost" to={{ pathname: "/", hash: "#work" }}>
              See our work
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
      </div>
    </main>
  );
}
