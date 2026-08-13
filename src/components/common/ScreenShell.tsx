import React from "react";
import { roleColor, RoleKey } from "../../theme/colors";

/**
 * Shared layout wrapper for every screen.
 * Give each screen a title + role color so teammates can tell dashboards apart.
 */
export const ScreenShell: React.FC<{
  title: string;
  subtitle?: string;
  role: RoleKey;
  children: React.ReactNode;
}> = ({ title, subtitle, role, children }) => {
  const accent = roleColor(role);
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: accent }} />
        <div>
          <h1 className="text-xl font-bold text-slate-100">{title}</h1>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
};