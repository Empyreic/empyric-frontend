import posthog from "posthog-js";

if (typeof window !== "undefined") {
  posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: false,
    opt_out_capturing_by_default: true,
    opt_out_persistence_by_default: true,
  });
}

export default posthog;
