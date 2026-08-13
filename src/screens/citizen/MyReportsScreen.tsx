import React from "react";
import { ScreenShell } from "../../components/common/ScreenShell";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { EmptyState } from "../../components/common/EmptyState";
import { NavScreenProps } from "../../navigation/types";
import { useFetch } from "../../hooks/useFetch";

/** List + status tracker for issues I reported. Uses citizenApi.getMyReports. */
export const MyReportsScreen: React.FC<NavScreenProps> = () => {
  const { data: reports } = useFetch(() => import("../../api/citizenApi").then(m => m.getMyReports()), []);

  return (
    <ScreenShell title="My Reports" subtitle="Status tracker" role="citizen">
      {reports && reports.reports && reports.reports.length === 0 ? (
        <EmptyState title="No reports yet" hint="Create your first report above" />
      ) : (
        <div className="space-y-3">
          {reports?.reports?.map((report: any) => (
            <Card key={report.id} title={report.issueType} subtitle={report.status}>
              <p className="text-sm text-slate-400">{report.description?.substring(0, 60) || ""}…</p>
              <p className="text-xs text-slate-500">{report.location?.city}</p>
            </Card>
          ))}
        </div>
      )}
      <Button color="citizen" onClick={() => window.location.reload()}>← Refresh</Button>
    </ScreenShell>
  );
};

export default MyReportsScreen;