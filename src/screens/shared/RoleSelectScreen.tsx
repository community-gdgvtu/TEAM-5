import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** "I'm a Citizen / Organization / Worker / Investor" → sets role before signup. */
export const RoleSelectScreen: React.FC = () => {
  return (
    <ScreenShell title="Who are you?" subtitle="Choose your role to get started" role="citizen">
      <p className="text-sm text-slate-300">RoleSelectScreen — stub for shared ownership.</p>
    </ScreenShell>
  );
};

export default RoleSelectScreen;