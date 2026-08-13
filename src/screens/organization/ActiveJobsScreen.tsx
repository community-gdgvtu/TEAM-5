import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Kanban-style view: Open → Claimed → In Progress → Submitted → Verified. */
export const ActiveJobsScreen: React.FC = () => {
  return (
    <ScreenShell title="Active Jobs" subtitle="Kanban tracker" role="organization">
      <p className="text-sm text-slate-300">ActiveJobsScreen — 🔵 organization, build me.</p>
    </ScreenShell>
  );
};

export default ActiveJobsScreen;