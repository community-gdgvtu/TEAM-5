import React, { ReactNode } from "react";

/** Simple stat tile for dashboards. */
export const StatCard: React.FC<{ label: string; value: ReactNode; sub?: string; accent?: string }> = ({
  label,
  value,
  sub,
  accent,
}) => {
  return (
    <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
      <div className="text-slate-400 text-xs font-medium flex items-center gap-2">
        {accent && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />}
        <span>{label}</span>
      </div>
      <div className="text-2xl font-bold text-white mt-1.5">{value}</div>
      {sub && <div className="text-[11px] text-slate-400 mt-1">{sub}</div>}
    </div>
  );
};