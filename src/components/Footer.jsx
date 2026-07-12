import { Link } from "react-router-dom";

import BrandMascot from "./BrandMascot.jsx";
import styles from "./Footer.module.css";

const EMAIL = "hello@empyreic.studio";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link className={styles.wordmark} to="/" aria-label="Empyreic home">
            <BrandMascot size={30} className={styles.glyph} />
            <span>Empyreic</span>
          </Link>
          <p className={styles.tag}>
            Senior design &amp; engineering studio. Remote-first, worldwide.
          </p>
        </div>

        <nav className={styles.cols} aria-label="Footer">
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Studio</h3>
            <Link to="/studio">About &amp; team</Link>
            <Link to={{ pathname: "/", hash: "#services" }}>The craft</Link>
            <Link to={{ pathname: "/", hash: "#work" }}>Work</Link>
          </div>
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Connect</h3>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <Link to={{ pathname: "/", hash: "#contact" }}>Start a project</Link>
          </div>
        </nav>
      </div>

      <div className={styles.base}>
        <span>© {new Date().getFullYear()} Empyreic Studio</span>
        <span>Designed &amp; built in-house.</span>
      </div>
    </footer>
  );
}
