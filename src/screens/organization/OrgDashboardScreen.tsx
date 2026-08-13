import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Overview: pending reports, active jobs, total funded, completion rate. */
export const OrgDashboardScreen: React.FC = () => {
  return (
    <ScreenShell title="Organization Dashboard" subtitle="Overview" role="organization">
      <p className="text-sm text-slate-300">OrgDashboardScreen — 🔵 organization, build me.</p>
    </ScreenShell>
  );
};

export default OrgDashboardScreen;