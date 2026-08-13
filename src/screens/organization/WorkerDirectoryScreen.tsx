import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Registered workers, ratings, verification status. */
export const WorkerDirectoryScreen: React.FC = () => {
  return (
    <ScreenShell title="Worker Directory" subtitle="Registered workers" role="organization">
      <p className="text-sm text-slate-300">WorkerDirectoryScreen — 🔵 organization, build me.</p>
    </ScreenShell>
  );
};

export default WorkerDirectoryScreen;