import { useEffect } from "react";
import { Link } from "react-router-dom";
import anime from "animejs";

import ArrowIcon from "../components/icons/ArrowIcon.jsx";
import { studio, team } from "../data/team.js";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";
import styles from "./Studio.module.css";

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

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={`eyebrow ${styles.eyebrow}`} data-rise>
            <span className="eyebrow__mark" />
            The Studio / since {studio.founded}
          </p>
          <h1 className={styles.title} data-rise>
            The people behind the light.
          </h1>
          <p className={styles.lead} data-rise>
            {studio.story}
          </p>
        </div>

        <aside className={styles.signals} aria-label="Studio operating signals" data-rise>
          {studio.signals.map((signal) => (
            <div className={styles.signal} key={signal.label}>
              <span className={styles.signalValue}>{signal.value}</span>
              <span className={styles.signalLabel}>{signal.label}</span>
            </div>
          ))}
        </aside>
      </header>

      <section className={styles.values} aria-label="How we work">
        {studio.values.map((v) => (
          <div className={styles.value} key={v.title} data-rise>
            <h2 className={styles.valueTitle}>{v.title}</h2>
            <p className={styles.valueBody}>{v.body}</p>
          </div>
        ))}
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
              <span className={styles.standardNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.standardTitle}>{standard.title}</h3>
              <p className={styles.standardBody}>{standard.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.teamSection} aria-labelledby="team-title">
        <div className={styles.teamHead}>
          <h2 className={styles.teamTitle} id="team-title" data-rise>
            {studio.size}.
          </h2>
          <p className={styles.teamLede} data-rise>
            Who you&apos;d be working with.
          </p>
        </div>

        <ul className={styles.grid}>
          {team.map((m) => (
            <li className={styles.member} key={m.name} data-rise>
              <div className={styles.avatar} aria-hidden="true">
                {m.photo ? <img src={m.photo} alt="" /> : <span>{m.initials}</span>}
              </div>
              <div className={styles.memberBody}>
                <h3 className={styles.memberName}>{m.name}</h3>
                <p className={styles.memberRole}>{m.role}</p>
                <p className={styles.memberLoc}>
                  {m.location} / {m.tz}
                </p>
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
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.cta}>
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
      </section>
    </main>
  );
}
