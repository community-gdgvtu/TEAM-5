import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavScreenProps, NavParams } from "../navigation/types";
import WorkerShell, { WorkerTab } from "../components/worker/WorkerShell";
import { useApp } from "../context/AppContext";
import { WorkerOnboardingScreen } from "../screens/worker/WorkerOnboardingScreen";
import { JobFeedScreen } from "../screens/worker/JobFeedScreen";
import { JobDetailScreen } from "../screens/worker/JobDetailScreen";
import { SubmitBidScreen } from "../screens/worker/SubmitBidScreen";
import { BidStatusScreen } from "../screens/worker/BidStatusScreen";
import { ActiveJobScreen } from "../screens/worker/ActiveJobScreen";
import { UploadProofScreen } from "../screens/worker/UploadProofScreen";
import { VerificationStatusScreen } from "../screens/worker/VerificationStatusScreen";
import { EarningsScreen } from "../screens/worker/EarningsScreen";
import { ReviewsScreen } from "../screens/worker/ReviewsScreen";
import { WorkerProfileScreen } from "../screens/worker/WorkerProfileScreen";
import { TaskHistoryScreen } from "../screens/worker/TaskHistoryScreen";
import { LeaderboardScreen } from "../screens/shared/LeaderboardScreen";
import { WorkTrackingScreen } from "../screens/shared/WorkTrackingScreen";
import { MessagesScreen } from "../components/messages/MessagesScreen";
import { useRouter } from "../router";

const TAB_ROOT: Record<WorkerTab, string> = {
  marketplace: "feed",
  jobs: "active",
  wallet: "earnings",
  messages: "messages",
  profile: "profile",
};

const SECTION_TO_TAB: Record<string, WorkerTab> = {
  marketplace: "marketplace",
  jobs: "jobs",
  wallet: "wallet",
  messages: "messages",
  profile: "profile",
};

const TAB_TO_SECTION: Record<WorkerTab, string> = {
  marketplace: "marketplace",
  jobs: "jobs",
  wallet: "wallet",
  messages: "messages",
  profile: "profile",
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
 * 🟠 Worker navigator — 5-tab shell (Market / My Jobs / Wallet / Messages / Profile)
 * with a stack-based flow for detail → bid → status → proof → verification.
 * First-time workers land on onboarding before the marketplace. The active tab
 * is reflected in the URL (/worker/marketplace, /worker/wallet…).
 */
export const WorkerNavigator: React.FC<{ section?: string }> = ({ section }) => {
  const { currentUser } = useApp();
  const { navigate } = useRouter();
  const onboarded = !!currentUser?.supplementaryData?.workerSkillCategory;

  const [activeTab, setActiveTab] = useState<WorkerTab>(() => SECTION_TO_TAB[section ?? "marketplace"] ?? "marketplace");
  const [stack, setStack] = useState<{ name: string; params?: NavParams }[]>([
    { name: onboarded ? "feed" : "onboarding" },
  ]);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const tab = SECTION_TO_TAB[section ?? "marketplace"];
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
      setStack([{ name: TAB_ROOT[tab] }]);
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
  const onTab = (t: WorkerTab) => {
    setActiveTab(t);
    setDirection(1);
    setStack([{ name: TAB_ROOT[t] }]);
    navigate(`/worker/${TAB_TO_SECTION[t]}`);
  };

  const current = stack[stack.length - 1];
  const showBack = stack.length > 1;

  const props: NavScreenProps = { go, back, params: current.params };

  const renderScreen = () => {
    switch (current.name) {
      case "onboarding":
        return <WorkerOnboardingScreen {...props} />;
      case "messages":
        return <MessagesScreen role="worker" />;
      case "feed":
        return <JobFeedScreen {...props} />;
      case "detail":
        return <JobDetailScreen {...props} />;
      case "submit":
        return <SubmitBidScreen {...props} />;
      case "bidStatus":
        return <BidStatusScreen {...props} />;
      case "active":
        return <ActiveJobScreen {...props} />;
      case "upload":
        return <UploadProofScreen {...props} />;
      case "verification":
        return <VerificationStatusScreen {...props} />;
      case "earnings":
        return <EarningsScreen {...props} />;
      case "reviews":
        return <ReviewsScreen {...props} />;
      case "profile":
        return <WorkerProfileScreen {...props} />;
      case "taskHistory":
        return <TaskHistoryScreen {...props} />;
      case "leaderboard":
        return <LeaderboardScreen {...props} role="worker" />;
      case "tracking":
        return <WorkTrackingScreen {...props} role="worker" />;
      default:
        return <JobFeedScreen {...props} />;
    }
  };

  return (
    <WorkerShell active={activeTab} onTab={onTab} onBack={showBack ? back : undefined} onLeaderboard={() => go("leaderboard")}>
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
    </WorkerShell>
  );
};

export default WorkerNavigator;
