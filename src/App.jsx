import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Grain from "./components/Grain.jsx";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Seo from "./components/Seo.jsx";
import ScrollManager from "./components/ScrollManager.jsx";
import Home from "./pages/Home.jsx";
import CaseStudy from "./pages/CaseStudy.jsx";
import Studio from "./pages/Studio.jsx";

export default function App() {
  useEffect(() => {
    // The home intro is one tall scroll-driven stage — never restore a
    // mid-page position on reload.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  }, []);

  return (
    <>
      <Seo />
      <Grain />
      <Nav />
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
