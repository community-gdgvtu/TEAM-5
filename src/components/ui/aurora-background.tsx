"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Snowfall from "./snowfall"

export interface AuroraBackgroundProps {
  /** Extra wrapper classes */
  className?: string
  /** Content to render on top of the background */
  children?: React.ReactNode
  /** Number of "star" points */
  starCount?: number
  /** Two CSS-variable backed colors for the radial overlays */
  gradientColors?: [string, string]
  /** Pulse animation duration in seconds */
  pulseDuration?: number
  /** ARIA label for the animated background */
  ariaLabel?: string
  /** Theme context: dark or light */
  theme?: "dark" | "light"
  /** Whether to show the ambient snowfall layer */
  showSnowfall?: boolean
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  className = "",
  children,
  starCount = 50,
  gradientColors = [
    "var(--aurora-color1, rgba(168,85,247,0.2))",
    "var(--aurora-color2, rgba(79,70,229,0.2))",
  ],
  pulseDuration = 10,
  ariaLabel = "Animated aurora background",
  theme = "dark",
  showSnowfall = true,
}) => {
  const [colorA, colorB] = gradientColors
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const bgClass =
    theme === "dark"
      ? "bg-slate-950 text-slate-50"
      : "bg-slate-900 text-slate-50"

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`relative flex flex-col w-full min-h-screen items-center justify-center ${bgClass} overflow-hidden transition-colors duration-700 ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Radial gradient pulsation */}
        <div
          className="absolute inset-0 opacity-60 transition-all duration-1000"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, ${colorA} 0%, transparent 70%),
              radial-gradient(circle at 80% 70%, ${colorB} 0%, transparent 70%)
            `,
            backgroundSize: "100% 100%",
            animation: prefersReducedMotion ? "none" : `pulse ${pulseDuration}s infinite ease-in-out`,
          }}
        />

        {/* Motion Aurora blobs */}
        <motion.div
          className="absolute inset-0 mix-blend-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute -top-1/4 -left-1/4 w-3/4 h-3/4 rounded-full filter blur-3xl opacity-40 transition-colors duration-1000"
            style={{ backgroundColor: colorA.includes("rgba") ? undefined : colorA }}
            animate={
              prefersReducedMotion
                ? { x: 0, y: 0, scale: 1 }
                : {
                    x: [-50, 50, -50],
                    y: [-20, 20, -20],
                    scale: [1, 1.2, 1],
                  }
            }
            transition={{
              duration: 30,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 rounded-full filter blur-3xl opacity-40 transition-colors duration-1000"
            style={{ backgroundColor: colorB.includes("rgba") ? undefined : colorB }}
            animate={
              prefersReducedMotion
                ? { x: 0, y: 0, scale: 1 }
                : {
                    x: [50, -50, 50],
                    y: [20, -20, 20],
                    scale: [1, 1.3, 1],
                  }
            }
            transition={{
              duration: 40,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 left-1/3 w-1/2 h-1/2 bg-indigo-700/30 rounded-full filter blur-3xl opacity-30"
            animate={
              prefersReducedMotion
                ? { x: 0, y: 0, rotate: 0 }
                : {
                    x: [20, -20, 20],
                    y: [-30, 30, -30],
                    rotate: [0, 360, 0],
                  }
            }
            transition={{
              duration: 50,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Twinkling star field */}
        {Array.from({ length: starCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full pointer-events-none"
            initial={{
              x: `${(i * 17 + 23) % 100}vw`,
              y: `${(i * 31 + 11) % 100}vh`,
              opacity: 0,
            }}
            animate={
              prefersReducedMotion
                ? { opacity: 0.3 }
                : {
                    opacity: [0, 0.7, 0],
                  }
            }
            transition={{
              duration: (i % 3) + 2.5,
              repeat: Infinity,
              delay: (i % 5) * 0.8,
            }}
          />
        ))}

        {/* Ambient Snowfall Layer */}
        {showSnowfall && <Snowfall particleCount={40} />}
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
        {children}
      </div>
    </div>
  )
}

export default AuroraBackground
