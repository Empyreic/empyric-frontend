import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import BrandMascot from "./BrandMascot.jsx";
import styles from "./Nav.module.css";

const LINKS = [
  { label: "Work", to: { pathname: "/", hash: "#work" } },
  { label: "Craft", to: { pathname: "/", hash: "#services" } },
  { label: "Proof", to: { pathname: "/", hash: "#proof" } },
  { label: "Studio", to: "/studio" },
  { label: "Contact", to: { pathname: "/", hash: "#contact" } },
];

/** Fixed header that floats over every page, turning glassmorphic on scroll. */
export default function Nav() {
  const theme = "dark";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Any navigation (route or in-page hash) closes the mobile menu.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  // Monitor scroll height to apply glassmorphic backing
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while the mobile menu overlay is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header
      className={styles.nav}
      data-theme={theme}
      data-open={open || undefined}
      data-scrolled={scrolled || undefined}
    >
      <div className={styles.inner}>
        <Link className={styles.wordmark} to="/" aria-label="Empyreic home">
          <BrandMascot className={styles.glyph} size={38} />
          <span>Empyreic</span>
        </Link>

        <nav className={styles.links} aria-label="Primary">
          {LINKS.map((link) => (
            <Link key={link.label} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          className={`btn btn--outline ${styles.cta}`}
          to={{ pathname: "/", hash: "#contact" }}
        >
          Start a project
        </Link>

        <button
          type="button"
          className={styles.toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.toggleBar} />
          <span className={styles.toggleBar} />
        </button>
      </div>

      <div className={styles.panel} id="mobile-menu" hidden={!open}>
        <nav className={styles.panelLinks} aria-label="Mobile">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            className={`btn btn--primary ${styles.panelCta}`}
            to={{ pathname: "/", hash: "#contact" }}
            onClick={() => setOpen(false)}
          >
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}
