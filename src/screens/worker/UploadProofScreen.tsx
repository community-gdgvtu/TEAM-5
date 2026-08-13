import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Before/after toggle, capture "after" photo, submit for AI verification. */
export const UploadProofScreen: React.FC = () => {
  return (
    <ScreenShell title="Upload Proof" subtitle="Before/after photo" role="worker">
      <p className="text-sm text-slate-300">UploadProofScreen — 🟠 worker, build me.</p>
    </ScreenShell>
  );
};

export default UploadProofScreen;