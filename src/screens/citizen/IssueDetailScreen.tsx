import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { roleColor } from "../../theme/colors";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";

/** Photos, funding progress bar, comments, timeline. */
export const IssueDetailScreen: React.FC<NavScreenProps> = () => {
  const { data: report } = useFetch(() => import("../../api/citizenApi").then(m => m.getIssueDetail("iss_001")), []);

  if (!report || !report.report) {
    return (
      <ScreenShell title="Issue Detail" subtitle="Progress & timeline" role="citizen">
        <EmptyState title="Issue not found" hint="The issue may have been updated or removed." />
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Issue Detail" subtitle="Progress & timeline" role="citizen">
      <Card title={report.report.issueType} accent={roleColor("citizen")}>
        <p className="text-sm text-slate-400">Location: {report.report.location?.city}, {report.report.location?.state}</p>
        <p className="text-sm text-slate-400">Status: {report.report.status}</p>
        {report.report.aiEstimate && (
          <p className="text-sm text-slate-400">
            AI Estimate: {report.report.aiEstimate.currency === "INR" ? "₿" : "$"}{report.report.aiEstimate.amount}
          </p>
        )}
        <p className="text-sm text-slate-300">{report.report.summary}</p>
      </Card>

      <div>
        <Button color="citizen" onClick={() => window.alert("Donate clicked")}>Donate</Button>
        <Button color="citizen" variant="ghost">← Back</Button>
      </div>
    </ScreenShell>
  );
};

export default IssueDetailScreen;