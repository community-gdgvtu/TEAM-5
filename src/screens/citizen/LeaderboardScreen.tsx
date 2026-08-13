import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { NavScreenProps } from "../../navigation/types";

/** Civic points, badges, top contributors in area. */
export const LeaderboardScreen: React.FC<NavScreenProps> = () => {
  const leaders = [
    { name: "Ananya Sharma", points: 1250, contribution: "5 repairs" },
    { name: "Rajesh Verma", points: 980, contribution: "4 repairs" },
    { name: "Priya Patel", points: 870, contribution: "3 repairs" },
  ];

  return (
    <ScreenShell title="Leaderboard" subtitle="Top contributors in your area" role="citizen">
      <Card>
        <p className="text-sm text-slate-400 mb-3">Rankings.</p>
        <div>
          <p className="font-medium text-slate-200">1.</p>
          <p className="font-medium text-slate-200">{leaders[0].name}</p>
          <p className="text-xs text-slate-400">{leaders[0].points} points - {leaders[0].contribution}</p>
          <p className="font-medium text-slate-200">2.</p>
          <p className="font-medium text-slate-200">{leaders[1].name}</p>
          <p className="text-xs text-slate-400">{leaders[1].points} points - {leaders[1].contribution}</p>
          <p className="font-medium text-slate-200">3.</p>
          <p className="font-medium text-slate-200">{leaders[2].name}</p>
          <p className="text-xs text-slate-400">{leaders[2].points} points - {leaders[2].contribution}</p>
        </div>
      </Card>
      <Button color="citizen" onClick={() => window.history.back()}>← Back</Button>
    </ScreenShell>
  );
};

export default LeaderboardScreen;