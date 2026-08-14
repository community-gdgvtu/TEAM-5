import React from "react";
import { Compass, LayoutGrid, MessageCircle, Settings, ArrowLeft, Bell, Trophy } from "lucide-react";
import { useApp } from "../../context/AppContext";

export type InvestorTab = "discover" | "portfolio" | "analytics" | "messages" | "settings";

const TABS: { key: InvestorTab; icon: React.ElementType; label: string }[] = [
  { key: "discover", icon: Compass, label: "Discover" },
  { key: "portfolio", icon: LayoutGrid, label: "Portfolio" },
  { key: "analytics", label: "Analytics", icon: MessageCircle },
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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="w-full max-w-md sm:max-w-3xl lg:max-w-6xl mx-auto min-h-screen flex flex-col bg-slate-950 border-x border-slate-800/60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/60 px-4 py-3 flex items-center gap-3">
          {onBack ? (
            <button onClick={onBack} className="text-slate-300 hover:text-white transition-colors" aria-label="Back">
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-sm font-bold text-white">
              {initials}
            </span>
          )}
          <div className="flex-1 flex items-center gap-1.5">
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Civic Fix
            </span>
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Investor
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onLeaderboard} className="text-slate-300 hover:text-white transition-colors" aria-label="Leaderboard" title="Leaderboard">
              <Trophy className="w-4 h-4" />
            </button>
            <button className="text-slate-300 hover:text-white" aria-label="Notifications">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-12">{children}</main>

        {/* Bottom tab bar — Discord-inspired */}
        <nav className="border-t border-slate-700/50 px-4 py-1.5 fixed bottom-0 left-0 right-0 z-20 bg-slate-950/90 backdrop-blur-sm">
          <div className="max-w-md mx-auto flex flex-col sm:flex-row justify-center items-center gap-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.key;
              const tabClass = isActive
                ? "flex-1 rounded-md px-1.5 py-1 text-xs font-medium text-white transition-colors bg-purple-600"
                : "flex-1 rounded-md px-1.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-800/50 transition-colors";
              return (
                <button
                  key={t.key}
                  onClick={() => onTab(t.key)}
                  className={tabClass}
                  aria-label={t.label}
                >
                  <Icon
                    className="w-4.5 h-4.5 mb-0.5"
                    style={{ color: isActive ? "#fff" : "#94a3b8" }}
                  />
                  <span className="text-[7px] font-medium">
                    {t.label}
                  </span>
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