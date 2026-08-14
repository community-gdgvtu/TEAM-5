import React, { useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { LoginSignupFlow } from "./components/auth/LoginSignupFlow";
import { RootNavigator } from "./navigation/RootNavigator";
import LandingPage from "./components/landing/LandingPage";
import { RouterProvider, useRouter, demoUserForRole, ROLE_DEFAULT_SECTION } from "./router";

/**
 * URL-driven shell:
 *   /                    → landing page
 *   /login               → sign-in / demo-login flow
 *   /citizen/dashboard   → that role's app (auto demo-login if needed)
 *   /worker/wallet, /org/reports, /investor/discover … → each role's sections
 * Any role URL auto-signs in the matching demo user, so sections are
 * deep-linkable straight from the address bar.
 */
const MainContent: React.FC = () => {
  const { route, navigate } = useRouter();
  const { currentUser, setCurrentUser } = useApp();
  const role = route.kind === "role" ? (route.role as NonNullable<typeof route.role>) : null;

  // Role URLs auto-login the matching demo user (idempotent — same user per role).
  useEffect(() => {
    if (role && currentUser?.role !== role) {
      setCurrentUser(demoUserForRole(role));
    }
  }, [role, currentUser?.role, setCurrentUser]);

  // After a successful sign-in, jump straight into the user's dashboard —
  // honouring ?next= so flows like "Report an issue" land where they started.
  useEffect(() => {
    if (route.kind === "login" && currentUser) {
      const next = new URLSearchParams(window.location.search).get("next");
      if (next && next.startsWith("/")) {
        navigate(next);
      } else {
        navigate(`/${currentUser.role}/${ROLE_DEFAULT_SECTION[currentUser.role]}`);
      }
    }
  }, [route.kind, currentUser, navigate]);

  if (route.kind === "landing") {
    return <LandingPage onSignIn={() => navigate("/login")} />;
  }

  if (route.kind === "login") {
    return currentUser ? null : <LoginSignupFlow />;
  }

  if (role) {
    // Wait one render for the demo user to be set by the effect above.
    if (currentUser?.role !== role) return null;
    return <RootNavigator role={role} section={route.section} />;
  }

  return <LandingPage onSignIn={() => navigate("/login")} />;
};

export default function App() {
  return (
    <RouterProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </RouterProvider>
  );
}
