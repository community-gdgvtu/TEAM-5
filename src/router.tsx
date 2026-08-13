import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "./types";

export type AppRole = "citizen" | "organization" | "worker" | "investor";

const ROLES: AppRole[] = ["citizen", "organization", "worker", "investor"];

export interface AppRoute {
  kind: "landing" | "login" | "role";
  role?: AppRole;
  section?: string;
}

/** The section a role lands on when only the role is in the URL. */
export const ROLE_DEFAULT_SECTION: Record<AppRole, string> = {
  citizen: "dashboard",
  organization: "reports",
  worker: "marketplace",
  investor: "discover",
};

/** Valid `/:role/:section` paths — one per bottom-tab in each navigator. */
export const VALID_SECTIONS: Record<AppRole, string[]> = {
  citizen: ["dashboard", "search", "report", "messages", "profile"],
  organization: ["reports", "jobs", "analytics", "messages", "team"],
  worker: ["marketplace", "jobs", "wallet", "messages", "profile"],
  investor: ["discover", "portfolio", "analytics", "messages", "settings"],
};

/** Turn a pathname like `/worker/wallet` into a route object. */
export function parseRoute(pathname: string): AppRoute {
  const segs = pathname.split("/").filter(Boolean);
  if (segs.length === 0) return { kind: "landing" };
  if (segs[0] === "login") return { kind: "login" };
  const role = segs[0] as AppRole;
  if (ROLES.includes(role)) {
    const section = VALID_SECTIONS[role].includes(segs[1]) ? segs[1] : ROLE_DEFAULT_SECTION[role];
    return { kind: "role", role, section };
  }
  return { kind: "landing" };
}

/**
 * Canonical demo users per role — the same ids the backend seeds threads &
 * posts against, so URL-deep-linked sections (messages, profile grid) work.
 */
export function demoUserForRole(role: AppRole): UserProfile {
  const now = new Date().toISOString();
  const base = { verifiedWhatsApp: true, createdAt: now, countryCode: "+91" as const };
  switch (role) {
    case "citizen":
      return {
        ...base,
        id: "user_citizen_001",
        name: "Ananya Sharma",
        mobile: "9876500001",
        email: "ananya.sharma@citizen.in",
        age: 27,
        location: { city: "Mumbai", state: "Maharashtra", country: "India" },
        role,
        supplementaryData: {},
      };
    case "organization":
      return {
        ...base,
        id: "org_mumbai_001",
        name: "Brihanmumbai Municipal Corporation",
        mobile: "9876500002",
        email: "operations@municipal.gov",
        age: 34,
        location: { city: "Mumbai", state: "Maharashtra", country: "India" },
        role,
        supplementaryData: { organizationRegId: "MC-MUM-2026-99", organizationType: "Municipal Corporation" },
      };
    case "worker":
      return {
        ...base,
        id: "user_demo_worker_001",
        name: "Rahul Deshmukh",
        mobile: "9876500003",
        email: "rahul.works@contractor.in",
        age: 31,
        location: { city: "Bengaluru", state: "Karnataka", country: "India" },
        role,
        supplementaryData: { workerSkillCategory: "Sanitation & Drainage", workerLicenseId: "TR-5582910" },
      };
    case "investor":
      return {
        ...base,
        id: "user_demo_investor_001",
        name: "Nikhil Rao",
        mobile: "9876500004",
        email: "nikhil.rao@invest.in",
        age: 30,
        location: { city: "Mumbai", state: "Maharashtra", country: "India" },
        role,
        supplementaryData: { investorEntityName: "Nikhil Rao Capital", investorKycStatus: "Verified Individual" },
      };
  }
}

interface RouterCtx {
  route: AppRoute;
  navigate: (path: string) => void;
}

const RouterContext = createContext<RouterCtx | undefined>(undefined);

/**
 * Tiny history-based router (no dependency): `pushState` navigation +
 * `popstate` for browser back/forward. Shared through context so any screen
 * can navigate and every consumer re-renders together.
 */
export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<AppRoute>(() => parseRoute(window.location.pathname));

  useEffect(() => {
    const onPop = () => setRoute(parseRoute(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = (path: string) => {
    if (path === window.location.pathname) return;
    window.history.pushState({}, "", path);
    setRoute(parseRoute(path));
  };

  return <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>;
};

export function useRouter(): RouterCtx {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within a RouterProvider");
  return ctx;
}
