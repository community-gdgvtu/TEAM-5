import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { NavScreenProps } from "../../navigation/types";

/** Browse all local campaigns, filter by category/status. */
export const CommunityFeedScreen: React.FC<NavScreenProps> = () => {
  return (
    <ScreenShell title="Community Feed" subtitle="All local campaigns" role="citizen">
      <Card>
        <p className="text-sm text-slate-400 mb-3">Select a campaign to support.</p>
        <div className="grid grid-cols-2 gap-3">
          <Card title="Pothole Repair - Main St" subtitle="₹45 raised of ₹100 target">
            <Badge tone="green">80% funded</Badge>
          </Card>
          <Card title="Streetlight LED Upgrade" subtitle="₹20 raised of ₹50 target">
            <Badge tone="amber">40% funded</Badge>
          </Card>
          <Card title="Park Cleanup Day" subtitle="₩0 raised of ₹75 target">
            <Badge tone="slate">0% funded</Badge>
          </Card>
          <Card title="Tree Planting Drive" subtitle="₹15 raised of ₹200 target">
            <Badge tone="emerald">8% funded</Badge>
          </Card>
        </div>
      </Card>
      <Button color="citizen" onClick={() => window.alert("View all campaigns")}>View All Campaigns</Button>
      <Button color="citizen" variant="ghost" onClick={() => window.history.back()}>← Back</Button>
    </ScreenShell>
  );
};

export default CommunityFeedScreen;