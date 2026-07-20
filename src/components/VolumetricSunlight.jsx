import { useEffect, useState } from "react";
import styles from "./VolumetricSunlight.module.css";

/**
 * VolumetricSunlight — Renders slow-moving volumetric sun rays
 * and floating sparkles for a spiritual sunrise atmosphere in the Hero.
 */
export default function VolumetricSunlight() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate randomized particles that loop nicely
    const items = Array.from({ length: 28 }).map((_, i) => {
      const size = Math.random() * 3 + 1.2; // 1.2px to 4.2px
      const left = Math.random() * 100;
      const top = Math.random() * 80 + 10; // offset slightly from top
      const duration = Math.random() * 12 + 8; // 8s to 20s
      const delay = Math.random() * -20; // start immediately
      const driftX = Math.random() * 80 - 40; // -40px to 40px
      const driftY = Math.random() * -140 - 70; // -70px to -210px
      const opacity = Math.random() * 0.45 + 0.35; // 0.35 to 0.8 opacity
      return { id: i, size, left, top, duration, delay, driftX, driftY, opacity };
    });
    setParticles(items);
  }, []);

  return (
    <div className={styles.sunlightContainer} aria-hidden="true">
      {/* Sunrise Sun Core Glow */}
      <div className={styles.sunriseGlow} />

      {/* Volumetric Sunrise Light Rays */}
      <div className={styles.ray1} />
      <div className={styles.ray2} />
      <div className={styles.ray3} />
      <div className={styles.ray4} />

      {/* Sparkling Dust Particles */}
      <div className={styles.particleContainer}>
        {particles.map((p) => (
          <div
            key={p.id}
            className={styles.particle}
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: `${p.top}%`,
              "--drift-x": `${p.driftX}px`,
              "--drift-y": `${p.driftY}px`,
              "--opacity-max": p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
