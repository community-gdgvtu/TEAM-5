import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Full issue photos, location, AI cost estimate, funding status. */
export const JobDetailScreen: React.FC = () => {
  return (
    <ScreenShell title="Job Detail" subtitle="Issue details & estimate" role="worker">
      <p className="text-sm text-slate-300">JobDetailScreen — 🟠 worker, build me.</p>
    </ScreenShell>
  );
};

export default JobDetailScreen;