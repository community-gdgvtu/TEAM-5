import React from "react";

const TONES: Record<string, string> = {
  green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/30",
  purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  red: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  slate: "bg-slate-500/10 text-slate-300 border-slate-500/30",
};

/** Status pill. `tone` is one of green/blue/orange/purple/red/amber/slate. */
export const Badge: React.FC<{ tone?: string; children: React.ReactNode }> = ({ tone = "slate", children }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${TONES[tone] || TONES.slate}`}>
      {children}
    </span>
  );
};