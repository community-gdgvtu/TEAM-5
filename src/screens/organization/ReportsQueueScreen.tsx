import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** List of new citizen reports awaiting review. Uses organizationApi.getPendingReports. */
export const ReportsQueueScreen: React.FC = () => {
  return (
    <ScreenShell title="Reports Queue" subtitle="Awaiting review" role="organization">
      <p className="text-sm text-slate-300">ReportsQueueScreen — 🔵 organization, build me.</p>
    </ScreenShell>
  );
};

export default ReportsQueueScreen;