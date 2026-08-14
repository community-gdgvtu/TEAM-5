"use client"

import React from "react"

export interface AuroraBackgroundProps {
  /** Extra wrapper classes */
  className?: string
  /** Content to render on top of the background */
  children?: React.ReactNode
  /** Two CSS-variable backed colors for the radial overlays */
  gradientColors?: [string, string]
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
  gradientColors = [
    "var(--aurora-color1, rgba(168,85,247,0.2))",
    "var(--aurora-color2, rgba(79,70,229,0.2))",
  ],
  ariaLabel = "Civic Fix background",
  theme = "dark",
  showSnowfall = false,
}) => {
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
        {/* Simple radial gradient background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              radial-gradient(circle at 20% 30%, ${gradientColors[0]} 0%, transparent 70%),
              radial-gradient(circle at 80% 70%, ${gradientColors[1]} 0%, transparent 70%)
            `,
            backgroundSize: "400% 400%",
            animation: "aurora 20s ease-in-out infinite",
          }}
        />

        {showSnowfall && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url('/snowflakes.svg')",
              backgroundSize: "50px 50px",
              opacity: 0.3,
            }}
          />
        )}
      </div>

      <div className="relative z-10 w-full flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
        {children}
      </div>
    </div>
  )
}

export default AuroraBackground