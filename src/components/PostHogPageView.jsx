import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import posthog from "../lib/posthog.js";

export default function PostHogPageView() {
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("empyreic_cookie_consent") !== "accepted") return;
    posthog.opt_in_capturing({ captureEventName: false });
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [location]);

  return null;
}
