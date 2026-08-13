import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Role-specific signup: org = registration ID, worker = skill category + ID, investor = KYC. */
export const SignupScreen: React.FC = () => {
  return (
    <ScreenShell title="Create account" subtitle="Role-specific signup" role="citizen">
      <p className="text-sm text-slate-300">SignupScreen — stub for shared ownership (see LoginSignupFlow).</p>
    </ScreenShell>
  );
};

export default SignupScreen;