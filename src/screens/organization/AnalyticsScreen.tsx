import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Heatmap of issue density, response time stats, category breakdown. */
export const AnalyticsScreen: React.FC = () => {
  return (
    <ScreenShell title="Area Analytics" subtitle="Heatmap & response stats" role="organization">
      <p className="text-sm text-slate-300">AnalyticsScreen — 🔵 organization, build me.</p>
    </ScreenShell>
  );
};

export default AnalyticsScreen;