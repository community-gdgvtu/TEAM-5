import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavScreenProps, NavParams } from "../navigation/types";
import CitizenShell, { CitizenTab } from "../components/citizen/CitizenShell";
import { FeedScreen } from "../components/feed/FeedScreen";
import { ReportIssueScreen } from "../screens/citizen/ReportIssueScreen";
import { MyReportsScreen } from "../screens/citizen/MyReportsScreen";
import { IssueDetailScreen } from "../screens/citizen/IssueDetailScreen";
import { CitizenProfileScreen } from "../screens/citizen/CitizenProfileScreen";
import { CommunityFeedScreen } from "../screens/citizen/CommunityFeedScreen";
import { MessagesScreen } from "../components/messages/MessagesScreen";
import { useRouter } from "../router";

const TAB_ROOT: Record<CitizenTab, string> = {
  feed: "social",
  search: "search",
  report: "report",
  messages: "messages",
  profile: "profile",
};

/** URL section → tab key. */
const SECTION_TO_TAB: Record<string, CitizenTab> = {
  dashboard: "feed",
  search: "search",
  report: "report",
  messages: "messages",
  profile: "profile",
};

/** Tab key → URL section. */
const TAB_TO_SECTION: Record<CitizenTab, string> = {
  feed: "dashboard",
  search: "search",
  report: "report",
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
 * 🟢 Citizen navigator — 5-tab shell (Feed / Search / Report+ / Messages / Profile).
 * Feed is the shared community stream; reporting auto-posts to the backend feed.
 * The active tab is reflected in the URL (/citizen/dashboard, /citizen/messages…).
 */
export const CitizenNavigator: React.FC<{ section?: string }> = ({ section }) => {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<CitizenTab>(() => SECTION_TO_TAB[section ?? "dashboard"] ?? "feed");
  const [stack, setStack] = useState<{ name: string; params?: NavParams }[]>([{ name: "social" }]);
  const [direction, setDirection] = useState(0);

  // URL changed (typed or browser back/forward) → switch tab.
  useEffect(() => {
    const tab = SECTION_TO_TAB[section ?? "dashboard"];
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
  const onTab = (t: CitizenTab) => {
    setActiveTab(t);
    setDirection(1);
    setStack([{ name: TAB_ROOT[t] }]);
    navigate(`/citizen/${TAB_TO_SECTION[t]}`);
  };

  const current = stack[stack.length - 1];
  const showBack = stack.length > 1;

  const props: NavScreenProps = { go, back, params: current.params };

  const renderScreen = () => {
    switch (current.name) {
      case "social":
        return <FeedScreen {...props} role="citizen" />;
      case "search":
        return <CommunityFeedScreen {...props} />;
      case "report":
        return <ReportIssueScreen {...props} />;
      case "messages":
        return <MessagesScreen role="citizen" />;
      case "my":
        return <MyReportsScreen {...props} />;
      case "detail":
        return <IssueDetailScreen {...props} />;
      case "profile":
        return <CitizenProfileScreen {...props} />;
      default:
        return <FeedScreen {...props} role="citizen" />;
    }
  };

  return (
    <CitizenShell active={activeTab} onTab={onTab} onBack={showBack ? back : undefined}>
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
    </CitizenShell>
  );
};

export default CitizenNavigator;
