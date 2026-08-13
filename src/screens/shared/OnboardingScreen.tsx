import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** 3-slide carousel explaining the loop: report → fund → fix → verify. */
export const OnboardingScreen: React.FC = () => {
  return (
    <ScreenShell title="How it works" subtitle="Report → Fund → Fix → Verify" role="citizen">
      <p className="text-sm text-slate-300">OnboardingScreen — stub for shared ownership.</p>
    </ScreenShell>
  );
};

export default OnboardingScreen;