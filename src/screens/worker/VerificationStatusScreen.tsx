import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Match confidence score gauge (0-100%), pass/fail, side-by-side preview. */
export const VerificationStatusScreen: React.FC = () => {
  return (
    <ScreenShell title="AI Verification" subtitle="Before/after match" role="worker">
      <p className="text-sm text-slate-300">VerificationStatusScreen — 🟠 worker, build me.</p>
    </ScreenShell>
  );
};

export default VerificationStatusScreen;