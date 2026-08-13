import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";
import { roleColor } from "../../theme/colors";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { ProgressBar } from "../../components/common/ProgressBar";
import { NavScreenProps } from "../../navigation/types";

/** AI Severity bar + estimated repair cost + "Use this estimate". */
export const CostEstimateScreen: React.FC<NavScreenProps> = ({ go, params }) => {
  const report = params?.report;
  const estimate = report?.aiEstimate || { amount: 45, currency: "INR", severity: "Moderate", confidence: 0.72, summary: "Small pothole on Main St — requires asphalt fill + compaction." };

  const severity = (estimate.severity || "Moderate") as keyof typeof SEVERITY;
  const severityColor = SEVERITY[severity] || SEVERITY.Moderate;
  const confidence = Math.round((estimate.confidence || 0.72) * 100);

  return (
    <ScreenShell title="Cost Estimate" subtitle="AI-generated repair estimate" role="citizen">
      <Card title={report?.issueType ? `Reported: ${report.issueType}` : "Analysis complete"} accent={roleColor("citizen")}>
        {/* Severity bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Minor</span>
            <span style={{ color: severityColor }} className="font-semibold">{severity}</span>
            <span>Critical</span>
          </div>
          <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "#1e293b" }}>
            <div className="h-full" style={{ width: `${confidence}%`, background: severityColor }} />
          </div>
          <p className="text-xs text-slate-400 mt-1">AI confidence {confidence}%</p>
        </div>

        <p className="text-center text-sm text-slate-400">Estimated repair cost</p>
        <p className="text-center text-2xl font-bold text-white my-2">
          {estimate.currency === "INR" ? "₹" : "$"}
          {estimate.amount}
        </p>

        <p className="text-sm text-slate-300">{estimate.summary}</p>

        <div className="mt-4 space-y-2">
          <Badge tone="green">Auto-generated campaign after confirmation</Badge>
          <Badge tone="slate">Funds held in escrow until verified</Badge>
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        <Button color="citizen" onClick={() => go("campaign-confirm", { report })}>
          Use this estimate → create campaign
        </Button>
        <Button color="citizen" variant="ghost" onClick={() => go("report")}>
          ← Retake photo
        </Button>
      </div>
    </ScreenShell>
  );
};

const SEVERITY = {
  Minor: "#22c55e",
  Moderate: "#f97316",
  Critical: "#ef4444",
};

export default CostEstimateScreen;