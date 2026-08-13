import React from "react";
import { Store, Wrench, Wallet, MessageCircle, User, ArrowLeft, Bell } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Badge } from "../common/Badge";

export type WorkerTab = "marketplace" | "jobs" | "wallet" | "messages" | "profile";

const TABS: { key: WorkerTab; icon: React.ElementType; label: string }[] = [
  { key: "marketplace", icon: Store, label: "Market" },
  { key: "jobs", icon: Wrench, label: "My Jobs" },
  { key: "wallet", icon: Wallet, label: "Wallet" },
  { key: "messages", icon: MessageCircle, label: "Messages" },
  { key: "profile", icon: User, label: "Profile" },
];

const ACCENT = "#f97316";

/**
 * 🟠 Worker shell — app frame with an orange accent and a 5-tab bar.
 * Marketplace / My Jobs / Wallet / Messages / Profile.
 */
export const WorkerShell: React.FC<{
  active: WorkerTab;
  onTab: (t: WorkerTab) => void;
  onBack?: () => void;
  children: React.ReactNode;
}> = ({ active, onTab, onBack, children }) => {
  const { currentUser } = useApp();
  const initials = (currentUser?.name || "WD")
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
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-sm font-bold text-white">
              {initials}
            </span>
          )}
          <div className="flex-1 flex items-center gap-1.5">
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Civic Fix
            </span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30">
              Worker
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="orange">⚡ {currentUser?.supplementaryData?.workerSkillCategory?.split(" & ")[0] || "Verified"}</Badge>
            <button className="text-slate-300 hover:text-white transition-colors" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </button>
          </div>
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

export default WorkerShell;
