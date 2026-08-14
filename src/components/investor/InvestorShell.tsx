import React from "react";
import { Compass, LayoutGrid, MessageCircle, Settings, ArrowLeft, Bell, Trophy, BarChart3 } from "lucide-react";
import { useApp } from "../../context/AppContext";

export type InvestorTab = "discover" | "portfolio" | "analytics" | "messages" | "settings";

const TABS: { key: InvestorTab; icon: React.ElementType; label: string }[] = [
  { key: "discover", icon: Compass, label: "Discover" },
  { key: "portfolio", icon: LayoutGrid, label: "Portfolio" },
  { key: "analytics", icon: BarChart3, label: "Analytics" },
  { key: "messages", icon: MessageCircle, label: "Messages" },
  { key: "settings", icon: Settings, label: "Settings" },
];

export const InvestorShell: React.FC<{
  active: InvestorTab;
  onTab: (t: InvestorTab) => void;
  onBack?: () => void;
  onLeaderboard?: () => void;
  children: React.ReactNode;
}> = ({ active, onTab, onBack, onLeaderboard, children }) => {
  const { currentUser } = useApp();
  const initials = (currentUser?.name || "IV")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      {/* Ambient aurora */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 -left-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.5), transparent 70%)", animation: "aurora-drift 14s ease-in-out infinite" }}
        />
        <div
          className="absolute top-1/4 -right-28 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.5), transparent 70%)", animation: "aurora-drift 18s ease-in-out infinite reverse" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md sm:max-w-3xl lg:max-w-6xl mx-auto min-h-screen flex flex-col bg-slate-950/60 border-x border-slate-800/60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 px-4 py-3 flex items-center gap-3">
          {onBack ? (
            <button
              onClick={onBack}
              className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center text-slate-300 transition-all duration-200 hover:bg-slate-800/80 hover:text-white hover:scale-105 active:scale-90"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onTab("discover")}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-sm font-bold text-white ring-2 ring-purple-500/20 transition-all duration-300 hover:scale-110 hover:ring-purple-400/50 active:scale-95"
              aria-label="Profile"
            >
              {initials}
            </button>
          )}
          <div className="flex-1 flex items-center gap-1.5">
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Civic Fix
            </span>
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Investor
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onLeaderboard}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 transition-all duration-200 hover:bg-slate-800/80 hover:text-amber-300 hover:scale-110 active:scale-90"
              aria-label="Leaderboard"
              title="Leaderboard"
            >
              <Trophy className="w-4 h-4" />
            </button>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 transition-all duration-200 hover:bg-slate-800/80 hover:text-white hover:scale-110 active:scale-90"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-16">{children}</main>

        {/* Bottom tab bar */}
        <nav className="border-t border-slate-700/50 px-4 py-1.5 fixed bottom-0 left-0 right-0 z-20 bg-slate-950/90 backdrop-blur-xl">
          <div className="max-w-md mx-auto flex justify-center items-center gap-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => onTab(t.key)}
                  className={`relative flex-1 max-w-20 rounded-xl px-1.5 py-1.5 flex flex-col items-center gap-1 transition-all duration-300 ${
                    isActive
                      ? "text-white bg-gradient-to-b from-purple-600 to-fuchsia-600 shadow-lg shadow-purple-900/40 scale-105"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 hover:scale-105 active:scale-95"
                  }`}
                  aria-label={t.label}
                >
                  {isActive && (
                    <span className="absolute -top-1.5 h-1 w-8 rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-400" />
                  )}
                  <Icon className="w-5 h-5" style={{ color: isActive ? "#fff" : "#94a3b8" }} />
                  <span className="text-[8px] font-semibold leading-none">{t.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default InvestorShell;
