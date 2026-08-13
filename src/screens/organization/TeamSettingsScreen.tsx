import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Add org staff, set permission levels. */
export const TeamSettingsScreen: React.FC = () => {
  return (
    <ScreenShell title="Team & Access" subtitle="Staff + permissions" role="organization">
      <p className="text-sm text-slate-300">TeamSettingsScreen — 🔵 organization, build me.</p>
    </ScreenShell>
  );
};

export default TeamSettingsScreen;