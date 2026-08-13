import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Past jobs, before/after gallery, badges. */
export const WorkerProfileScreen: React.FC = () => {
  return (
    <ScreenShell title="Worker Profile" subtitle="Portfolio & badges" role="worker">
      <p className="text-sm text-slate-300">WorkerProfileScreen — 🟠 worker, build me.</p>
    </ScreenShell>
  );
};

export default WorkerProfileScreen;