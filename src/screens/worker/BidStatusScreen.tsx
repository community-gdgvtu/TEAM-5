import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Pending / Awarded / Rejected status for each bid. */
export const BidStatusScreen: React.FC = () => {
  return (
    <ScreenShell title="Bid Status" subtitle="Track your bids" role="worker">
      <p className="text-sm text-slate-300">BidStatusScreen — 🟠 worker, build me.</p>
    </ScreenShell>
  );
};

export default BidStatusScreen;