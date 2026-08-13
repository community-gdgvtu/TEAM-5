import React from "react";
import { Compass, LayoutGrid, BarChart3, MessageCircle, Settings, ArrowLeft, Bell } from "lucide-react";
import { useApp } from "../../context/AppContext";

export type InvestorTab = "discover" | "portfolio" | "analytics" | "messages" | "settings";

const TABS: { key: InvestorTab; icon: React.ElementType; label: string }[] = [
  { key: "discover", icon: Compass, label: "Discover" },
  { key: "portfolio", icon: LayoutGrid, label: "Portfolio" },
  { key: "analytics", icon: BarChart3, label: "Analytics" },
  { key: "messages", icon: MessageCircle, label: "Messages" },
  { key: "settings", icon: Settings, label: "Settings" },
];

const ACCENT = "#a855f7";

export const InvestorShell: React.FC<{
  active: InvestorTab;
  onTab: (t: InvestorTab) => void;
  onBack?: () => void;
  children: React.ReactNode;
}> = ({ active, onTab, onBack, children }) => {
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
            <button onClick={onBack} className="text-slate-300 hover:text-white" aria-label="Back">
              <ArrowLeft className="w-5 h-5" />
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
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Investor
            </span>
          </div>
          <button className="text-slate-300 hover:text-white" aria-label="Notifications">
            <Bell className="w-5 h-5" />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pb-24">{children}</main>

        {/* Bottom tab bar */}
        <nav className="fixed bottom-0 inset-x-0 z-20 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/60">
          <div className="max-w-md mx-auto grid grid-cols-5">
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
                  <span
                    className="text-[9px] font-medium"
                    style={{ color: isActive ? ACCENT : "#94a3b8" }}
                  >
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
