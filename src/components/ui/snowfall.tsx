import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

export interface SnowfallProps {
  /** Number of snow particles */
  particleCount?: number;
  /** Custom particle color CSS */
  color?: string;
  /** Extra wrapper CSS classes */
  className?: string;
}

interface Particle {
  id: number;
  x: number; // initial x percentage (0 - 100)
  size: number; // 1 - 3.5 px
  opacity: number; // 0.15 - 0.45
  duration: number; // 10 - 22 seconds
  delay: number; // 0 - 8 seconds
  sway: number; // 10 - 25 px horizontal sway
}

export const Snowfall: React.FC<SnowfallProps> = ({
  particleCount = 45,
  color = "rgba(255, 255, 255, 0.8)",
  className = "",
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Generate deterministic randomized particle configurations
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }).map((_, i) => {
      // Deterministic math based on index to avoid hydration re-render shifts
      const seed = (i * 9301 + 49297) % 233280;
      const rnd1 = seed / 233280;
      const seed2 = (seed * 9301 + 49297) % 233280;
      const rnd2 = seed2 / 233280;
      const seed3 = (seed2 * 9301 + 49297) % 233280;
      const rnd3 = seed3 / 233280;
      const seed4 = (seed3 * 9301 + 49297) % 233280;
      const rnd4 = seed4 / 233280;

      return {
        id: i,
        x: rnd1 * 100, // 0vw to 100vw
        size: 1 + rnd2 * 2.5, // 1px to 3.5px
        opacity: 0.15 + rnd3 * 0.3, // 0.15 to 0.45
        duration: 12 + rnd4 * 12, // 12s to 24s slow drift
        delay: (i % 7) * 1.5,
        sway: 10 + (i % 5) * 4, // 10px to 26px sway
      };
    });
  }, [particleCount]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
            filter: "blur(0.5px)",
            left: `${p.x}%`,
            top: `-20px`,
          }}
          initial={{
            y: "-10px",
            x: 0,
            opacity: 0,
          }}
          animate={{
            y: ["0vh", "108vh"],
            x: [0, p.sway, -p.sway, 0],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            y: {
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            },
            x: {
              duration: p.duration / 2,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
              delay: p.delay,
            },
            opacity: {
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            },
          }}
        />
      ))}
    </div>
  );
};

export default Snowfall;
