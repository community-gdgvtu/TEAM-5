import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";

/** Citizen/org feedback on completed jobs. */
export const ReviewsScreen: React.FC = () => {
  return (
    <ScreenShell title="Reviews" subtitle="Feedback on your work" role="worker">
      <p className="text-sm text-slate-300">ReviewsScreen — 🟠 worker, build me.</p>
    </ScreenShell>
  );
};

export default ReviewsScreen;