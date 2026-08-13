import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Quote input (min ₹20, max estimate) + timeline dropdown. Uses workerApi.submitBid. */
export const SubmitBidScreen: React.FC = () => {
  return (
    <ScreenShell title="Submit Bid" subtitle="Quote price + timeline" role="worker">
      <p className="text-sm text-slate-300">SubmitBidScreen — 🟠 worker, build me.</p>
    </ScreenShell>
  );
};

export default SubmitBidScreen;