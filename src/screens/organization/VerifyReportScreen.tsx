import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** View photo + AI estimate, approve/reject, add municipal notes. */
export const VerifyReportScreen: React.FC = () => {
  return (
    <ScreenShell title="Verify Report" subtitle="Approve or reject" role="organization">
      <p className="text-sm text-slate-300">VerifyReportScreen — 🔵 organization, build me.</p>
    </ScreenShell>
  );
};

export default VerifyReportScreen;