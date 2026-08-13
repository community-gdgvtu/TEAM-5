import React from "react";

/** Card surface used across all role screens. */
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
      className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl ${
        onClick ? "cursor-pointer hover:border-slate-600 transition-colors" : ""
      } ${className}`}
    >
      {title && (
        <div className="mb-3">
          <div className="flex items-center gap-2">
            {accent && <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />}
            <h3 className="font-bold text-slate-100">{title}</h3>
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};