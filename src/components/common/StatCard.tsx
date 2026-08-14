import React, { ReactNode } from "react";

/** Simple stat tile for dashboards — Discord-inspired. */
export const StatCard: React.FC<{ label: string; value: ReactNode; sub?: string; accent?: string }> = ({
  label,
  value,
  sub,
  accent,
}) => {
  return (
    <div className="p-4 bg-slate-950/60 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-sm">
      <div className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
        {accent && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />}
        <span>{label}</span>
      </div>
      <div className="text-xl font-bold text-white mt-1">{value}</div>
      {sub && <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
};