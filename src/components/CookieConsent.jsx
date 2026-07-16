import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import posthog from "../lib/posthog.js";
import styles from "./CookieConsent.module.css";

const CONSENT_KEY = "empyreic_cookie_consent";

export default function CookieConsent() {
  const [choice, setChoice] = useState(() => {
    if (typeof window === "undefined") return "pending";
    return localStorage.getItem(CONSENT_KEY) || "pending";
  });

  useEffect(() => {
    if (choice === "accepted") {
      posthog.opt_in_capturing({ captureEventName: false });
      return;
    }

    if (choice === "rejected") {
      posthog.opt_out_capturing();
    }
  }, [choice]);

  const saveChoice = (nextChoice) => {
    localStorage.setItem(CONSENT_KEY, nextChoice);
    setChoice(nextChoice);

    if (nextChoice === "accepted") {
      posthog.opt_in_capturing({ captureEventName: false });
      posthog.capture("$pageview", { $current_url: window.location.href });
    } else {
      posthog.opt_out_capturing();
    }
  };

  if (choice !== "pending") return null;

  return (
    <aside className={styles.popup} aria-label="Cookie consent">
      <p className={styles.kicker}>Cookie preferences</p>
      <p className={styles.copy}>
        We use essential storage for the site and optional analytics to understand
        what visitors find useful.
      </p>
      <div className={styles.actions}>
        <button
          className="btn btn--primary"
          type="button"
          onClick={() => saveChoice("accepted")}
        >
          Accept
        </button>
        <button
          className={`btn btn--outline ${styles.reject}`}
          type="button"
          onClick={() => saveChoice("rejected")}
        >
          Reject
        </button>
        <Link className={styles.details} to="/legal/cookies">
          Details
        </Link>
      </div>
    </aside>
  );
}
