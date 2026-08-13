import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Filter tabs (All / Nearby / My Bids), job cards, distance, payout. Uses workerApi.getOpenJobs. */
export const JobFeedScreen: React.FC = () => {
  return (
    <ScreenShell title="Job Marketplace" subtitle="Open jobs nearby" role="worker">
      <p className="text-sm text-slate-300">JobFeedScreen — 🟠 worker, build me.</p>
    </ScreenShell>
  );
};

export default JobFeedScreen;