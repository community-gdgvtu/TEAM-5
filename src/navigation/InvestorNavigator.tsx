import React, { useState, useEffect } from "react";
import { NavScreenProps, NavParams } from "../navigation/types";
import InvestorShell, { InvestorTab } from "../components/investor/InvestorShell";
import { FeedScreen } from "../components/feed/FeedScreen";
import { CampaignDetailScreen } from "../screens/investor/CampaignDetailScreen";
import { TrustScoreScreen } from "../screens/investor/TrustScoreScreen";
import { FundingDecisionScreen } from "../screens/investor/FundingDecisionScreen";
import { PortfolioScreen } from "../screens/investor/PortfolioScreen";
import { CompletionReportScreen } from "../screens/investor/CompletionReportScreen";
import { PayoutConfirmScreen } from "../screens/investor/PayoutConfirmScreen";
import { RegionalAnalyticsScreen } from "../screens/investor/RegionalAnalyticsScreen";
import { InvestorSettingsScreen } from "../screens/investor/InvestorSettingsScreen";
import { MessagesScreen } from "../components/messages/MessagesScreen";
import { useRouter } from "../router";

const TAB_ROOT: Record<InvestorTab, string> = {
  discover: "dashboard",
  portfolio: "portfolio",
  analytics: "impact",
  messages: "messages",
  settings: "settings",
};

const SECTION_TO_TAB: Record<string, InvestorTab> = {
  discover: "discover",
  portfolio: "portfolio",
  analytics: "analytics",
  messages: "messages",
  settings: "settings",
};

const TAB_TO_SECTION: Record<InvestorTab, string> = {
  discover: "discover",
  portfolio: "portfolio",
  analytics: "analytics",
  messages: "messages",
  settings: "settings",
};

/**
 * 🟣 Investor navigator — social-media style shell with a 5-tab bar
 * (Discover / Portfolio / Analytics / Messages / Settings).
 * The active tab is reflected in the URL (/investor/discover, /investor/messages…).
 */
export const InvestorNavigator: React.FC<{ section?: string }> = ({ section }) => {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<InvestorTab>(() => SECTION_TO_TAB[section ?? "discover"] ?? "discover");
  const [stack, setStack] = useState<{ name: string; params?: NavParams }[]>([{ name: "dashboard" }]);

  useEffect(() => {
    const tab = SECTION_TO_TAB[section ?? "discover"];
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
      setStack([{ name: TAB_ROOT[tab] }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  const go = (name: string, params?: NavParams) => setStack((s) => [...s, { name, params }]);
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const onTab = (t: InvestorTab) => {
    setActiveTab(t);
    setStack([{ name: TAB_ROOT[t] }]);
    navigate(`/investor/${TAB_TO_SECTION[t]}`);
  };

  const current = stack[stack.length - 1];
  const showBack = stack.length > 1;

  const props: NavScreenProps = { go, back, params: current.params };

  const renderScreen = () => {
    switch (current.name) {
      case "dashboard":
        return <FeedScreen {...props} role="investor" />;
      case "messages":
        return <MessagesScreen role="investor" />;
      case "detail":
        return <CampaignDetailScreen {...props} />;
      case "trust":
        return <TrustScoreScreen {...props} />;
      case "fund":
        return <FundingDecisionScreen {...props} />;
      case "portfolio":
        return <PortfolioScreen {...props} />;
      case "completion":
        return <CompletionReportScreen {...props} />;
      case "payout":
        return <PayoutConfirmScreen {...props} />;
      case "impact":
        return <RegionalAnalyticsScreen {...props} />;
      case "settings":
        return <InvestorSettingsScreen {...props} />;
      default:
        return <FeedScreen {...props} role="investor" />;
    }
  };

  return (
    <InvestorShell active={activeTab} onTab={onTab} onBack={showBack ? back : undefined}>
      {renderScreen()}
    </InvestorShell>
  );
};

export default InvestorNavigator;
