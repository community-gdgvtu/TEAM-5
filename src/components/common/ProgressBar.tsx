import React from "react";

/** Funding / progress bar. percent 0-100. */
export const ProgressBar: React.FC<{ percent: number; color?: string; label?: string }> = ({
  percent,
  color = "#22c55e",
  label,
}) => {
  const pct = Math.max(0, Math.min(100, percent));
  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
};