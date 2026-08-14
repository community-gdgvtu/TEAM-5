import React from "react";
import { Home, Compass, Camera, MessageCircle, User, ArrowLeft, Bell, Trophy } from "lucide-react";
import { useApp } from "../../context/AppContext";

export type CitizenTab = "feed" | "search" | "report" | "messages" | "profile";

const TABS: { key: CitizenTab; icon: React.ElementType; label: string }[] = [
  { key: "feed", icon: Home, label: "Home" },
  { key: "search", icon: Compass, label: "Community" },
  { key: "report", icon: Camera, label: "Report" },
  { key: "messages", icon: MessageCircle, label: "Group Chat" },
  { key: "profile", icon: User, label: "Profile" },
];

export const CitizenShell: React.FC<{
  active: CitizenTab;
  onTab: (t: CitizenTab) => void;
  onBack?: () => void;
  onLeaderboard?: () => void;
  onNotifications?: () => void;
  children: React.ReactNode;
}> = ({ active, onTab, onBack, onLeaderboard, onNotifications, children }) => {
  const { currentUser } = useApp();
  const initials = (currentUser?.name || "CU")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="h-dvh bg-slate-950 text-slate-100 overflow-hidden">
      <div className="w-full max-w-2xl mx-auto h-full flex flex-col bg-slate-950">
        {/* Reddit-style header */}
        <header className="border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBack ? (
                <button onClick={onBack} className="text-slate-300 hover:text-white transition-colors" aria-label="Back">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-white">
                  {initials}
                </span>
              )}
              <div className="flex-1 flex items-center justify-center">
                <h1 className="text-xl font-bold text-white tracking-tight">r/CivicFix</h1>
                <p className="text-xs text-slate-400">Civic issues & funded fixes</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-slate-300 hover:text-white transition-colors" aria-label="Sort">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <button
                onClick={onLeaderboard}
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="Leaderboard"
                title="Leaderboard"
              >
                <Trophy className="w-4 h-4" />
              </button>
              <button
                onClick={onNotifications}
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Bottom navigation - all 5 sections visible */}
        <nav className="border-t border-slate-800/60 bg-slate-950/90 backdrop-blur-sm shrink-0">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 grid grid-cols-5 gap-1 h-16 items-center">
            {TABS.map((tab) => {
              const isActive = active === tab.key;
              const isReport = tab.key === "report";
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => onTab(tab.key)}
                  aria-label={tab.label}
                  title={tab.label}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 transition-colors ${
                    isReport
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 mx-auto w-14 h-14 -mt-5 rounded-full"
                      : isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`${isReport ? "w-5 h-5" : "w-5 h-5"} ${isActive && !isReport ? "text-emerald-400" : ""}`} />
                  <span className={`text-[9px] font-semibold leading-none ${isReport ? "" : ""}`}>
                    {isReport ? "Report" : tab.label}
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

export default CitizenShell;