import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, MessageSquare } from "lucide-react";
import { useApp } from "../../context/AppContext";

export interface CivicosMascotProps {
  currentStep: number;
  className?: string;
  isReturningUser?: boolean;
  userName?: string;
}

export const CivicosMascot: React.FC<CivicosMascotProps> = ({
  currentStep,
  className = "",
  isReturningUser = false,
  userName = "",
}) => {
  const { t } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (isDismissed) return null;

  const currentMessage =
    isReturningUser && currentStep === 4
      ? t("mascotWelcomeBack", { name: userName ? `, ${userName}` : "" })
      : t(`mascotStep${currentStep}`) || t("mascotStep1");

  return (
    <motion.div
      className={`relative flex flex-col items-center sm:items-start ${className}`}
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Speech Bubble Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: -6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="relative mb-2 max-w-[260px] sm:max-w-[280px] bg-slate-900/95 border border-purple-500/40 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl shadow-purple-950/30 text-slate-100 text-xs sm:text-sm font-medium leading-snug flex items-start space-x-2.5 z-20"
        >
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1 text-slate-200">
            <span className="font-semibold text-purple-300 mr-1">CIVICOS:</span>
            {currentMessage}
          </div>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss mascot helper"
            className="text-slate-400 hover:text-slate-200 p-0.5 rounded-md hover:bg-slate-800/80 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Speech Bubble Tail */}
          <div className="absolute -bottom-1.5 left-8 w-3 h-3 bg-slate-900 border-r border-b border-purple-500/40 rotate-45" />
        </motion.div>
      </AnimatePresence>

      {/* CIVICOS Robot Character Avatar */}
      <motion.div
        className="relative group cursor-pointer"
        animate={
          prefersReducedMotion
            ? { y: 0 }
            : {
                y: [0, -6, 0],
              }
        }
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        onClick={() => setIsDismissed(false)}
        title="CIVICOS AI Guide"
      >
        {/* Glow backdrop */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition-opacity" />

        <svg
          width="76"
          height="76"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-md"
        >
          {/* Antenna line & glowing tip */}
          <line x1="50" y1="20" x2="50" y2="10" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" />
          <motion.circle
            cx="50"
            cy="8"
            r="4"
            fill="#38BDF8"
            animate={
              prefersReducedMotion
                ? { scale: 1 }
                : {
                    scale: [1, 1.4, 1],
                    opacity: [0.7, 1, 0.7],
                  }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Head Body */}
          <rect x="20" y="20" width="60" height="52" rx="16" fill="url(#bot-head-grad)" stroke="#6366F1" strokeWidth="2" />

          {/* Visor Screen */}
          <rect x="28" y="30" width="44" height="24" rx="8" fill="#090D16" stroke="#38BDF8" strokeWidth="1.5" />

          {/* Animated Eyes */}
          <motion.g
            animate={
              prefersReducedMotion
                ? { scaleY: 1 }
                : {
                    scaleY: [1, 1, 0.1, 1, 1],
                  }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              times: [0, 0.9, 0.93, 0.96, 1],
            }}
            style={{ transformOrigin: "50% 42px" }}
          >
            {/* Left Eye */}
            <circle cx="41" cy="42" r="4" fill="#38BDF8" />
            <circle cx="42" cy="41" r="1.5" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle cx="59" cy="42" r="4" fill="#38BDF8" />
            <circle cx="60" cy="41" r="1.5" fill="#FFFFFF" />
          </motion.g>

          {/* Smile Mouth Arc */}
          <path d="M43 49 Q50 53 57 49" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Ear Bolts */}
          <rect x="14" y="38" width="6" height="16" rx="3" fill="#6366F1" />
          <rect x="80" y="38" width="6" height="16" rx="3" fill="#6366F1" />

          {/* Neck Joint */}
          <rect x="42" y="72" width="16" height="6" rx="2" fill="#475569" />

          {/* Torso Shoulder Collar */}
          <path d="M25 78 C25 78 35 76 50 76 C65 76 75 78 75 78 L80 92 H20 L25 78 Z" fill="url(#bot-body-grad)" stroke="#6366F1" strokeWidth="1.5" />

          {/* Chest Badge */}
          <circle cx="50" cy="84" r="3.5" fill="#A855F7" />

          <defs>
            <linearGradient id="bot-head-grad" x1="20" y1="20" x2="80" y2="72" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E1B4B" />
              <stop offset="1" stopColor="#312E81" />
            </linearGradient>
            <linearGradient id="bot-body-grad" x1="20" y1="76" x2="80" y2="92" gradientUnits="userSpaceOnUse">
              <stop stopColor="#312E81" />
              <stop offset="1" stopColor="#1E1B4B" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default CivicosMascot;
