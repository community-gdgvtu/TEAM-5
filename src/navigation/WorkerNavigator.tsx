import React from "react";
import { RoleDashboard } from "../components/dashboard/RoleDashboard";
import { JobFeedScreen } from "../screens/worker/JobFeedScreen";

/**
 * 🟠 Teammate C — Worker navigator. Own this file.
 * Showcases the demo dashboard for now; swap in your screens (JobFeedScreen, etc.)
 * as you build them.
 */
export const WorkerNavigator: React.FC = () => {
  // TODO(C): replace this return with your routing once screens are ready.
  return <RoleDashboard />;
};

export default WorkerNavigator;