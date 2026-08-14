import React from "react";

/** Card surface used across all role screens — Discord-inspired with glassmorphism. */
export const Card: React.FC<{
  title?: string;
  subtitle?: string;
  accent?: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ title, subtitle, accent, children, onClick, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-950/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-md transition-colors ${
        onClick ? "cursor-pointer hover:border-slate-500 transition-colors" : ""
      } ${className}`}
    >
      {title && (
        <div className="mb-3">
          <div className="flex items-center gap-2">
            {accent && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accent }} />}
            <h3 className="font-semibold text-slate-100">{title}</h3>
          </div>
          {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};