import React from "react";
import { Home, Search, Camera, MessageCircle, User, ArrowLeft, Bell } from "lucide-react";
import { useApp } from "../../context/AppContext";

export type CitizenTab = "feed" | "search" | "report" | "messages" | "profile";

const TABS: { key: CitizenTab; icon: React.ElementType; label: string; center?: boolean }[] = [
  { key: "feed", icon: Home, label: "Feed" },
  { key: "search", icon: Search, label: "Search" },
  { key: "report", icon: Camera, label: "Report", center: true },
  { key: "messages", icon: MessageCircle, label: "Messages" },
  { key: "profile", icon: User, label: "Profile" },
];

const ACCENT = "#22c55e";

/**
 * 🟢 Citizen shell — green app frame with a 5-tab bar.
 * Feed · Search · Report(+) · Messages · Profile. The Report tab is the
 * elevated center action, exactly like the v2 assignment.
 */
export const CitizenShell: React.FC<{
  active: CitizenTab;
  onTab: (t: CitizenTab) => void;
  onBack?: () => void;
  children: React.ReactNode;
}> = ({ active, onTab, onBack, children }) => {
  const { currentUser } = useApp();
  const initials = (currentUser?.name || "CU")
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
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-sm font-bold text-white">
              {initials}
            </span>
          )}
          <div className="flex-1 flex items-center gap-1.5">
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              Civic Fix
            </span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Citizen
            </span>
          </div>
          <button className="text-slate-300 hover:text-white transition-colors" aria-label="Notifications">
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
                  className="flex flex-col items-center justify-center py-2.5 gap-0.5 relative"
                  aria-label={t.label}
                >
                  {t.center ? (
                    <>
                      <span
                        className="absolute -top-3.5 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 border-4 border-slate-950 shadow-lg shadow-emerald-500/30 flex items-center justify-center"
                        style={{ color: "#fff" }}
                      >
                        <Icon className="w-5 h-5" strokeWidth={2.4} />
                      </span>
                      <span className="mt-6 text-[9px] font-medium" style={{ color: isActive ? ACCENT : "#94a3b8" }}>
                        {t.label}
                      </span>
                    </>
                  ) : (
                    <>
                      <Icon
                        className="w-5 h-5"
                        style={{ color: isActive ? ACCENT : "#94a3b8" }}
                        strokeWidth={isActive ? 2.4 : 1.8}
                      />
                      <span className="text-[9px] font-medium" style={{ color: isActive ? ACCENT : "#94a3b8" }}>
                        {t.label}
                      </span>
                    </>
                  )}
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
