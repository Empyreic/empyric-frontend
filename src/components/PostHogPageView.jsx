import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import posthog from "../lib/posthog.js";

export default function PostHogPageView() {
  const location = useLocation();

  useEffect(() => {
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [location]);

  return null;
}
