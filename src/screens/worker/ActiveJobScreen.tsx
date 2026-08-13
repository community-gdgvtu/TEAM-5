import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Navigation to site, job checklist, instructions. */
export const ActiveJobScreen: React.FC = () => {
  return (
    <ScreenShell title="Active Job" subtitle="Checklist & instructions" role="worker">
      <p className="text-sm text-slate-300">ActiveJobScreen — 🟠 worker, build me.</p>
    </ScreenShell>
  );
};

export default ActiveJobScreen;