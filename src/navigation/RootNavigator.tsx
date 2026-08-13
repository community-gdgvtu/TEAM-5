import React from "react";
import { useApp } from "../context/AppContext";
import { CitizenNavigator } from "./CitizenNavigator";
import { OrgNavigator } from "./OrgNavigator";
import { WorkerNavigator } from "./WorkerNavigator";
import { InvestorNavigator } from "./InvestorNavigator";

/**
 * Shared — role-based routing switch.
 * Renders the navigator matching the logged-in user's role.
 * Each teammate swaps their own navigator's screens; this file stays small.
 */
export const RootNavigator: React.FC = () => {
  const { currentUser } = useApp();
  const role = currentUser?.role ?? "citizen";

  switch (role) {
    case "organization":
      return <OrgNavigator />;
    case "worker":
      return <WorkerNavigator />;
    case "investor":
      return <InvestorNavigator />;
    case "citizen":
    default:
      return <CitizenNavigator />;
  }
};

export default RootNavigator;