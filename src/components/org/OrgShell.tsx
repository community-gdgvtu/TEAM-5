import React from "react";
import { Inbox, MessageCircle, Users, Settings, ArrowLeft, Bell, Trophy } from "lucide-react";
import { useApp } from "../../context/AppContext";

export type OrgTab = "reports" | "jobs" | "analytics" | "messages" | "team";

const TABS: { key: OrgTab; icon: React.ElementType; label: string }[] = [
  { key: "reports", icon: Inbox, label: "Reports" },
  { key: "jobs", label: "Jobs", icon: MessageCircle },
  { key: "analytics", label: "Analytics", icon: MessageCircle },
  { key: "messages", icon: MessageCircle, label: "Messages" },
  { key: "team", icon: Users, label: "Team" },
];

export const OrgShell: React.FC<{
  active: OrgTab;
  onTab: (t: OrgTab) => void;
  onBack?: () => void;
  onSettings?: () => void;
  onHome?: () => void;
  onLeaderboard?: () => void;
  pendingCount?: number;
  children: React.ReactNode;
}> = ({ active, onTab, onBack, onSettings, onHome, onLeaderboard, pendingCount = 0, children }) => {
  const { currentUser } = useApp();
  const initials = (currentUser?.name || "MC")
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
            <button onClick={onHome} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white hover:ring-2 hover:ring-blue-400/50 transition-all" aria-label="Go to dashboard" title="Dashboard">
              {initials}
            </button>
          )}
          <div className="flex-1 flex items-center gap-1.5">
            <button onClick={onHome} className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              Civic Fix
            </button>
            <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
              Municipal
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onLeaderboard} className="text-slate-300 hover:text-white transition-colors" aria-label="Leaderboard" title="Leaderboard">
              <Trophy className="w-4 h-4" />
            </button>
            <button className="relative text-slate-300 hover:text-white transition-colors" aria-label="Notifications">
              <Bell className="w-4 h-4" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={onSettings}
              className="text-slate-300 hover:text-white transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
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
                ? "flex-1 rounded-md px-1.5 py-1 text-xs font-medium text-white transition-colors bg-blue-600"
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

export default OrgShell;