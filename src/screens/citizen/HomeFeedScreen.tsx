import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Map + list of nearby issues/campaigns. */
export const HomeFeedScreen: React.FC = () => {
  return (
    <ScreenShell title="Home" subtitle="Nearby issues & campaigns" role="citizen">
      <p className="text-sm text-slate-300">HomeFeedScreen — 🟢 citizen, build me.</p>
    </ScreenShell>
  );
};

export default HomeFeedScreen;