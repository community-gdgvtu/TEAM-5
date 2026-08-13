import React from "react";
import { RoleDashboard } from "../components/dashboard/RoleDashboard";
import { HomeFeedScreen } from "../screens/citizen/HomeFeedScreen";

/**
 * 🟢 Teammate A — Citizen navigator. Own this file.
 * Showcases the demo dashboard for now; swap in your screens (HomeFeedScreen, etc.)
 * as you build them.
 */
export const CitizenNavigator: React.FC = () => {
  // TODO(A): replace this return with your routing once screens are ready.
  return <RoleDashboard />;
};

export default CitizenNavigator;