import React from "react";
import { Inbox, KanbanSquare, BarChart3, MessageCircle, Users, Settings, ShieldCheck, Bell } from "lucide-react";
import { useApp } from "../../context/AppContext";

export type OrgTab = "reports" | "jobs" | "analytics" | "messages" | "team";

const TABS: { key: OrgTab; icon: React.ElementType; label: string }[] = [
  { key: "reports", icon: Inbox, label: "Reports" },
  { key: "jobs", icon: KanbanSquare, label: "Jobs" },
  { key: "analytics", icon: BarChart3, label: "Analytics" },
  { key: "messages", icon: MessageCircle, label: "Messages" },
  { key: "team", icon: Users, label: "Team" },
];

const ACCENT = "#3b82f6";

/**
 * 🔵 Org shell — blue app frame with a 5-tab bar and settings gear.
 * Reports / Jobs / Analytics / Messages / Team.
 */
export const OrgShell: React.FC<{
  active: OrgTab;
  onTab: (t: OrgTab) => void;
  onBack?: () => void;
  onSettings?: () => void;
  pendingCount?: number;
  children: React.ReactNode;
}> = ({ active, onTab, onBack, onSettings, pendingCount = 0, children }) => {
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
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </button>
          ) : (
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
              {initials}
            </span>
          )}
          <div className="flex-1 flex items-center gap-1.5">
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Civic Fix
            </span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
              Municipal
            </span>
            <span className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-medium ml-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {currentUser?.supplementaryData?.organizationRegId || "Verified Corp"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative text-slate-300 hover:text-white transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={onSettings}
              className="text-slate-300 hover:text-white transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-24">{children}</main>

        {/* Bottom tab bar */}
        <nav className="fixed bottom-0 inset-x-0 z-20 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/60">
          <div className="max-w-md mx-auto grid grid-cols-6">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = active === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => onTab(t.key)}
                  className="flex flex-col items-center justify-center py-2.5 gap-0.5"
                  aria-label={t.label}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: isActive ? ACCENT : "#94a3b8" }}
                    strokeWidth={isActive ? 2.4 : 1.8}
                  />
                  <span className="text-[9px] font-medium" style={{ color: isActive ? ACCENT : "#94a3b8" }}>
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
