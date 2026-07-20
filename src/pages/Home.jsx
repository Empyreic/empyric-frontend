import { Suspense, lazy, useEffect, useState } from "react";

import Stage from "../components/Stage.jsx";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

const Services = lazy(() => import("../components/Services.jsx"));
const Proof = lazy(() => import("../components/Proof.jsx"));
const Work = lazy(() => import("../components/Work.jsx"));
const Testimonials = lazy(() => import("../components/Testimonials.jsx"));
const Contact = lazy(() => import("../components/Contact.jsx"));
const SectionFog = lazy(() => import("../components/SectionFog.jsx"));

const hasPrerenderedMarkup = () =>
  typeof document === "undefined" ||
  Boolean(document.getElementById("root")?.hasChildNodes());

export default function Home() {
  const reduced = usePrefersReducedMotion();
  const [showRest, setShowRest] = useState(hasPrerenderedMarkup);

  useEffect(() => {
    const show = () => setShowRest(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(show, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(show, 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <main id="top">
      <Stage reduced={reduced} />
      {showRest && (
        <Suspense fallback={null}>
          <Services reduced={reduced} />
          <SectionFog />
          <Proof reduced={reduced} />
          <SectionFog />
          <Work reduced={reduced} />
          <SectionFog />
          <Testimonials reduced={reduced} />
          <SectionFog />
          <Contact reduced={reduced} />
        </Suspense>
      )}
    </main>
  );
}
