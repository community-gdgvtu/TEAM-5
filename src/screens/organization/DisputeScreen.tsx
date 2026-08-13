import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Handle flagged jobs: bad work, wrong worker, funding issues. */
export const DisputeScreen: React.FC = () => {
  return (
    <ScreenShell title="Dispute Resolution" subtitle="Flagged jobs" role="organization">
      <p className="text-sm text-slate-300">DisputeScreen — 🔵 organization, build me.</p>
    </ScreenShell>
  );
};

export default DisputeScreen;