import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { NavScreenProps } from "../../navigation/types";

/** Funding milestones, job claimed, work completed. */
export const NotificationsScreen: React.FC<NavScreenProps> = () => {
  const milestones = [
    { title: "Report Submitted", time: "2 hours ago", status: "pending" },
    { title: "Campaign Funded", time: " yesterday", status: "success" },
    { title: "Job Claimed", time: "3 days ago", status: "info" },
    { title: "AI Verification Complete", time: "1 week ago", status: "success" },
  ];

  return (
    <ScreenShell title="Notifications" subtitle="Stay in the loop" role="citizen">
      <Card>
        <p className="text-sm text-slate-400 mb-3">Recent activity.</p>
        <div>
          <p className="font-medium text-slate-200">Report Submitted</p>
          <p className="text-xs text-slate-400">2 hours ago</p>
          <p className="text-sm text-slate-400">{milestones[0].title}: {milestones[0].status}</p>
          <p className="font-medium text-slate-200">Campaign Funded</p>
          <p className="text-xs text-slate-400"> yesterday</p>
          <p className="text-sm text-slate-400">{milestones[1].title}: {milestones[1].status}</p>
          <p className="font-medium text-slate-200">Job Claimed</p>
          <p className="text-xs text-slate-400">3 days ago</p>
          <p className="text-sm text-slate-400">{milestones[2].title}: {milestones[2].status}</p>
          <p className="font-medium text-slate-200">AI Verification Complete</p>
          <p className="text-xs text-slate-400">1 week ago</p>
          <p className="text-sm text-slate-400">{milestones[3].title}: {milestones[3].status}</p>
        </div>
      </Card>
      <Button color="citizen" onClick={() => window.history.back()}>← Back</Button>
    </ScreenShell>
  );
};

export default NotificationsScreen;