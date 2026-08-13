import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Balance, withdrawal, payment history. */
export const EarningsScreen: React.FC = () => {
  return (
    <ScreenShell title="Earnings" subtitle="Wallet & history" role="worker">
      <p className="text-sm text-slate-300">EarningsScreen — 🟠 worker, build me.</p>
    </ScreenShell>
  );
};

export default EarningsScreen;