import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import BrandMascot from "./BrandMascot.jsx";
import styles from "./Nav.module.css";

const LINKS = [
  { label: "Work",    to: { pathname: "/", hash: "#work" },     section: "work" },
  { label: "Craft",   to: { pathname: "/", hash: "#services" }, section: "services" },
  { label: "Proof",   to: { pathname: "/", hash: "#proof" },    section: "proof" },
  { label: "Studio",  to: "/studio" },
  { label: "Contact", to: { pathname: "/", hash: "#contact" },  section: "contact" },
];

/** Fixed header that floats over every page, turning glassmorphic on scroll. */
export default function Nav() {
  const theme = "dark";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const location = useLocation();
  const observerRef = useRef(null);

  // Any navigation (route or in-page hash) closes the mobile menu.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  // Monitor scroll to apply backdrop blur
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section tracker — IntersectionObserver watches each section
  useEffect(() => {
    // Only track sections on the home page
    if (location.pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const sectionIds = ["work", "services", "proof", "contact"];
    const targets = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!targets.length) return;

    // Use a map to track which sections are currently visible
    const visibleSections = new Map();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleSections.set(entry.target.id, entry.isIntersecting);
        });
        // Highlight the first visible section in DOM order
        const first = sectionIds.find((id) => visibleSections.get(id));
        setActiveSection(first ?? null);
      },
      {
        threshold: 0,
        rootMargin: "-15% 0px -60% 0px", // trigger when ~top quarter enters viewport
      }
    );

    targets.forEach((el) => observerRef.current.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [location.pathname]);

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
          {LINKS.map((link) => {
            const isActive =
              link.section
                ? activeSection === link.section
                : location.pathname === link.to;

            return (
              <Link
                key={link.label}
                to={link.to}
                data-active={isActive || undefined}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
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
          {LINKS.map((link) => {
            const isActive =
              link.section
                ? activeSection === link.section
                : location.pathname === link.to;

            return (
              <Link
                key={link.label}
                to={link.to}
                data-active={isActive || undefined}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
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
