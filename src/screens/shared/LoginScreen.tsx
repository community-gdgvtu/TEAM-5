import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Phone OTP login. The real flow lives in components/auth/LoginSignupFlow. */
export const LoginScreen: React.FC = () => {
  return (
    <ScreenShell title="Login" subtitle="WhatsApp OTP verification" role="citizen">
      <p className="text-sm text-slate-300">LoginScreen — stub for shared ownership (see LoginSignupFlow).</p>
    </ScreenShell>
  );
};

export default LoginScreen;