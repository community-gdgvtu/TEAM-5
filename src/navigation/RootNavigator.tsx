import React from "react";
import { CitizenNavigator } from "./CitizenNavigator";
import { OrgNavigator } from "./OrgNavigator";
import { WorkerNavigator } from "./WorkerNavigator";
import { InvestorNavigator } from "./InvestorNavigator";
import { AppRole } from "../router";

/**
 * Shared — role-based routing switch.
 * The URL decides the role (e.g. /citizen/dashboard → CitizenNavigator);
 * the section string deep-links to that role's tab (e.g. "messages").
 * Each teammate swaps their own navigator's screens; this file stays small.
 */
export const RootNavigator: React.FC<{ role: AppRole; section?: string }> = ({ role, section }) => {
  switch (role) {
    case "organization":
      return <OrgNavigator section={section} />;
    case "worker":
      return <WorkerNavigator section={section} />;
    case "investor":
      return <InvestorNavigator section={section} />;
    case "citizen":
    default:
      return <CitizenNavigator section={section} />;
  }
};

export default RootNavigator;
