import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Shared pre-login screen. Replace with the app logo + tagline loading state. */
export const SplashScreen: React.FC = () => {
  return (
    <ScreenShell title="Civic Fix AI" subtitle="Decentralizing urban repair" role="citizen">
      <p className="text-sm text-slate-300">SplashScreen — stub for Teammate A/B/D (shared).</p>
    </ScreenShell>
  );
};

export default SplashScreen;