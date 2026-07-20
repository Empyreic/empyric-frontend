import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Grain from "./components/Grain.jsx";
import PostHogPageView from "./components/PostHogPageView.jsx";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import CookieConsent from "./components/CookieConsent.jsx";
import Seo from "./components/Seo.jsx";
import ScrollManager from "./components/ScrollManager.jsx";
import Home from "./pages/Home.jsx";
import CinematicClouds from "./components/CinematicClouds.jsx";
import SmoothScroll from "./components/SmoothScroll.jsx";

const CaseStudy = lazy(() => import("./pages/CaseStudy.jsx"));
const Studio = lazy(() => import("./pages/Studio.jsx"));
const LegalPage = lazy(() => import("./pages/LegalPage.jsx"));

export default function App() {
  const location = useLocation();
  const isCaseStudy = location.pathname.startsWith("/work/") && location.pathname !== "/work";

  useEffect(() => {
    // The home intro is one tall scroll-driven stage — never restore a
    // mid-page position on reload.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  return (
    <SmoothScroll>
      <PostHogPageView />
      <Seo />
      <CinematicClouds isCaseStudy={isCaseStudy} />
      <Grain />
      <Nav />
      <ScrollManager />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Home />} />
          <Route path="/craft" element={<Home />} />
          <Route path="/proof" element={<Home />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/work/:slug" element={<CaseStudy />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/legal/:slug" element={<LegalPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <Footer />
      <CookieConsent />
    </SmoothScroll>
  );
}
