import React, { useState } from "react";
import { NavScreenProps, NavParams } from "../navigation/types";
import InvestorShell, { InvestorTab } from "../components/investor/InvestorShell";
import { InvestorDashboardScreen } from "../screens/investor/InvestorDashboardScreen";
import { CampaignDetailScreen } from "../screens/investor/CampaignDetailScreen";
import { TrustScoreScreen } from "../screens/investor/TrustScoreScreen";
import { FundingDecisionScreen } from "../screens/investor/FundingDecisionScreen";
import { PortfolioScreen } from "../screens/investor/PortfolioScreen";
import { CompletionReportScreen } from "../screens/investor/CompletionReportScreen";
import { PayoutConfirmScreen } from "../screens/investor/PayoutConfirmScreen";
import { RegionalAnalyticsScreen } from "../screens/investor/RegionalAnalyticsScreen";
import { InvestorSettingsScreen } from "../screens/investor/InvestorSettingsScreen";

const TAB_ROOT: Record<InvestorTab, string> = {
  feed: "dashboard",
  discover: "dashboard",
  portfolio: "portfolio",
  impact: "impact",
  settings: "settings",
};

/**
 * 🟣 Investor navigator — social-media style shell with a tab bar.
 * Stack-based routing; screens call go("detail", { id }) / back().
 */
export const InvestorNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InvestorTab>("feed");
  const [stack, setStack] = useState<{ name: string; params?: NavParams }[]>([{ name: "dashboard" }]);

  const go = (name: string, params?: NavParams) => setStack((s) => [...s, { name, params }]);
  const back = () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  const onTab = (t: InvestorTab) => {
    setActiveTab(t);
    setStack([{ name: TAB_ROOT[t] }]);
  };

  const current = stack[stack.length - 1];
  const showBack = stack.length > 1;

  const props: NavScreenProps = { go, back, params: current.params };

  const renderScreen = () => {
    switch (current.name) {
      case "dashboard":
        return <InvestorDashboardScreen {...props} />;
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
        return <InvestorDashboardScreen {...props} />;
    }
  };

  return (
    <InvestorShell active={activeTab} onTab={onTab} onBack={showBack ? back : undefined}>
      {renderScreen()}
    </InvestorShell>
  );
};

export default InvestorNavigator;
