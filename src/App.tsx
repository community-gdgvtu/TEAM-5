import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { LoginSignupFlow } from "./components/auth/LoginSignupFlow";
import { RootNavigator } from "./navigation/RootNavigator";
import LandingPage from "./components/landing/LandingPage";

type View = "landing" | "login";

const MainContent: React.FC = () => {
  const { currentUser } = useApp();
  const [view, setView] = useState<View>("landing");

  if (currentUser) return <RootNavigator />;
  if (view === "login") return <LoginSignupFlow />;
  return <LandingPage onSignIn={() => setView("login")} />;
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
