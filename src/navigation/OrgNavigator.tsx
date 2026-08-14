import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavScreenProps, NavParams } from "../navigation/types";
import OrgShell, { OrgTab } from "../components/org/OrgShell";
import { useFetch } from "../hooks/useFetch";
import { getOrgReports } from "../api/organizationApi";
import { OrgDashboardScreen } from "../screens/organization/OrgDashboardScreen";
import { ReportsQueueScreen } from "../screens/organization/ReportsQueueScreen";
import { VerifyReportScreen } from "../screens/organization/VerifyReportScreen";
import { MarketplacePushScreen } from "../screens/organization/MarketplacePushScreen";
import { ActiveJobsScreen } from "../screens/organization/ActiveJobsScreen";
import { DisputeScreen } from "../screens/organization/DisputeScreen";
import { WorkerDirectoryScreen } from "../screens/organization/WorkerDirectoryScreen";
import { AnalyticsScreen } from "../screens/organization/AnalyticsScreen";
import { TeamSettingsScreen } from "../screens/organization/TeamSettingsScreen";
import { SettingsScreen } from "../screens/organization/SettingsScreen";
import { LeaderboardScreen } from "../screens/shared/LeaderboardScreen";
import { WorkTrackingScreen } from "../screens/shared/WorkTrackingScreen";
import { MessagesScreen } from "../components/messages/MessagesScreen";
import { useRouter } from "../router";

const TAB_ROOT: Record<OrgTab, string> = {
  reports: "reports",
  jobs: "jobs",
  analytics: "analytics",
  messages: "messages",
  team: "team",
};

const SECTION_TO_TAB: Record<string, OrgTab> = {
  dashboard: "reports",
  reports: "reports",
  jobs: "jobs",
  analytics: "analytics",
  messages: "messages",
  team: "team",
};

const TAB_TO_SECTION: Record<OrgTab, string> = {
  reports: "reports",
  jobs: "jobs",
  analytics: "analytics",
  messages: "messages",
  team: "team",
};

/** URL section → the stack root it should render (dashboard is its own screen). */
const sectionRoot = (sec?: string): { tab: OrgTab; root: string } => {
  if (sec === "dashboard") return { tab: "reports", root: "dashboard" };
  const tab = SECTION_TO_TAB[sec ?? "dashboard"] ?? "reports";
  return { tab, root: TAB_ROOT[tab] };
};

/**
 * Dynamic screen registry — add a new org screen by dropping it here.
 * Screens keep their own data-loading; the navigator only routes.
 */
const ORG_SCREENS: Record<string, React.FC<NavScreenProps>> = {
  dashboard: OrgDashboardScreen,
  reports: ReportsQueueScreen,
  verify: VerifyReportScreen,
  push: MarketplacePushScreen,
  jobs: ActiveJobsScreen,
  disputes: DisputeScreen,
  directory: WorkerDirectoryScreen,
  analytics: AnalyticsScreen,
  team: TeamSettingsScreen,
  settings: SettingsScreen,
  leaderboard: (props: NavScreenProps) => <LeaderboardScreen {...props} role="organization" />,
  tracking: (props: NavScreenProps) => <WorkTrackingScreen {...props} role="organization" />,
};

/** Screen transition variants (respects reduced motion via CSS). */
const variants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? 40 : -40,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? -40 : 40,
    opacity: 0,
  }),
};

/**
 * 🔵 Organization navigator — 5-tab shell (Reports / Jobs / Analytics / Messages / Team)
 * with a stack flow: verify → push to marketplace, disputes, worker directory, settings.
 * The active tab is reflected in the URL (/org/reports, /org/messages…).
 */
export const OrgNavigator: React.FC<{ section?: string }> = ({ section }) => {
  const { data: pending } = useFetch(() => getOrgReports("pending"), []);
  const { navigate } = useRouter();
  const pendingCount = pending?.length ?? 0;

  const [activeTab, setActiveTab] = useState<OrgTab>(() => sectionRoot(section).tab);
  const [stack, setStack] = useState<{ name: string; params?: NavParams }[]>([
    { name: sectionRoot(section).root },
  ]);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const next = sectionRoot(section);
    if (next.tab !== activeTab) {
      setActiveTab(next.tab);
      setStack([{ name: next.root }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const go = (name: string, params?: NavParams) => {
    setDirection(1);
    setStack((s) => [...s, { name, params }]);
  };
  const back = () => {
    setDirection(-1);
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  };
  const onTab = (t: OrgTab) => {
    setActiveTab(t);
    setDirection(1);
    setStack([{ name: TAB_ROOT[t] }]);
    navigate(`/organization/${TAB_TO_SECTION[t]}`);
  };
  const onSettings = () => go("settings");
  const onHome = () => navigate("/organization/dashboard");

  const current = stack[stack.length - 1];
  const showBack = stack.length > 1;

  const props: NavScreenProps = { go, back, params: current.params };

  const renderScreen = () => {
    if (current.name === "messages") return <MessagesScreen role="organization" />;
    const Screen = ORG_SCREENS[current.name] ?? ORG_SCREENS.dashboard;
    return <Screen {...props} />;
  };

  return (
    <OrgShell
      active={activeTab}
      onTab={onTab}
      onBack={showBack ? back : undefined}
      onSettings={onSettings}
      onHome={onHome}
      onLeaderboard={() => go("leaderboard")}
      pendingCount={pendingCount}
    >
      <AnimatePresence mode="popLayout" initial={false} custom={direction}>
        <motion.div
          key={current.name + (current.params?.id ?? "")}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </OrgShell>
  );
};

export default OrgNavigator;
