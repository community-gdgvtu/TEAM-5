import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Upload ID, select skill category (electrician, mason, gardener...). */
export const WorkerOnboardingScreen: React.FC = () => {
  return (
    <ScreenShell title="Onboarding" subtitle="Skill category + ID proof" role="worker">
      <p className="text-sm text-slate-300">WorkerOnboardingScreen — 🟠 worker, build me.</p>
    </ScreenShell>
  );
};

export default WorkerOnboardingScreen;