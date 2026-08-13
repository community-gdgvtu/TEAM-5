import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Approved issue becomes an open job for workers. */
export const MarketplacePushScreen: React.FC = () => {
  return (
    <ScreenShell title="Push to Marketplace" subtitle="Turn issue into job" role="organization">
      <p className="text-sm text-slate-300">MarketplacePushScreen — 🔵 organization, build me.</p>
    </ScreenShell>
  );
};

export default MarketplacePushScreen;