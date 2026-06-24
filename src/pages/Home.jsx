import Stage from "../components/Stage.jsx";
import Services from "../components/Services.jsx";
import Proof from "../components/Proof.jsx";
import Work from "../components/Work.jsx";
import Testimonials from "../components/Testimonials.jsx";
import Contact from "../components/Contact.jsx";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

export default function Home() {
  const reduced = usePrefersReducedMotion();

  return (
    <main id="top">
      <Stage reduced={reduced} />
      <Services reduced={reduced} />
      <Proof reduced={reduced} />
      <Work reduced={reduced} />
      <Testimonials reduced={reduced} />
      <Contact reduced={reduced} />
    </main>
  );
}
