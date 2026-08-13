import { apiFetch } from "./index";
import {
  getReports,
  getReport,
  getJobs,
  getDisputes,
  getWorkers,
  getTeam,
  getAnalytics,
  getOrgSettings,
  OrgReport,
  OrgJob,
  OrgWorker,
  OrgTeamMember,
  OrgAnalytics,
  Dispute,
  JobStage,
} from "../data/orgMock";

/**
 * 🔵 Organization API client — Teammate B owns this file.
 * Matches backend/routes/organization.routes.ts (all endpoints under
 * /api/organization/*). Every call prefers the live backend and falls back to
 * the offline demo mocks so the municipal dashboard always renders.
 */

export interface OrgSettings {
  orgName: string;
  orgType: string;
  regId: string;
  jurisdiction: string;
  email: string;
  phone: string;
  notifNewReport: boolean;
  notifAiFlag: boolean;
  notifEscrow: boolean;
  notifDispute: boolean;
  notifEmailDigest: boolean;
  autoApproveLowUrgency: boolean;
}

export interface OrgDashboardPayload {
  analytics: OrgAnalytics;
  reports: OrgReport[];
}

/** Fall back to the local mock whenever the network/backend is unavailable. */
async function withFallback<T>(promise: Promise<T>, fallback: T | (() => T | Promise<T>)): Promise<T> {
  try {
    return await promise;
  } catch {
    return typeof fallback === "function" ? (fallback as () => T | Promise<T>)() : fallback;
  }
}

// ------------------------------------------------------------- dashboard

export async function getOrgDashboard(): Promise<OrgDashboardPayload> {
  return withFallback(apiFetch<OrgDashboardPayload>("/api/organization/dashboard"), async () => {
    const [analytics, reports] = await Promise.all([getAnalytics(), getReports()]);
    return { analytics, reports };
  });
}

// ------------------------------------------------------------- reports

export async function getOrgReports(status: "all" | "pending" | "approved" | "rejected" = "all"): Promise<OrgReport[]> {
  return withFallback(
    apiFetch<{ reports: OrgReport[] }>(`/api/organization/reports?status=${status}`).then((d) => d.reports),
    () => getReports().then((all) => (status === "all" ? all : all.filter((r) => r.status === status)))
  );
}

export async function getOrgReport(id: string): Promise<OrgReport | undefined> {
  return withFallback(
    apiFetch<{ report: OrgReport }>(`/api/organization/reports/${id}`).then((d) => d.report),
    () => getReport(id)
  );
}

export async function verifyOrgReportApi(
  id: string,
  decision: "approve" | "reject",
  note?: string
): Promise<OrgReport> {
  return withFallback(
    apiFetch<{ report: OrgReport }>(`/api/organization/reports/${id}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, note }),
    }).then((d) => d.report),
    async () => {
      const mock = await getReport(id);
      if (!mock) throw new Error("Report not found.");
      return { ...mock, status: decision === "reject" ? "rejected" : "approved", municipalNote: note || mock.municipalNote };
    }
  );
}

// ------------------------------------------------------- push to marketplace

export async function publishOrgJobApi(id: string, payload: { payout: number; urgency: "High" | "Medium" | "Low" }): Promise<OrgJob> {
  return withFallback(
    apiFetch<{ job: OrgJob }>(`/api/organization/reports/${id}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((d) => d.job),
    async () => {
      const mock = await getReport(id);
      return {
        id: `job_${Date.now()}`,
        title: mock?.title || "Civic repair job",
        category: mock?.category || "General",
        emoji: mock?.emoji || "🔧",
        gradient: mock?.gradient || "linear-gradient(135deg,#3b82f6,#6366f1)",
        area: mock?.area || "—",
        location: mock?.location || "India",
        payout: payload.payout,
        raised: 0,
        stage: "Open",
        bidsCount: 0,
        postedAt: "just now",
        dueDate: payload.urgency === "High" ? "Aug 18" : payload.urgency === "Medium" ? "Aug 22" : "Aug 30",
      };
    }
  );
}

// ------------------------------------------------------------- jobs

export async function getOrgJobsApi(): Promise<OrgJob[]> {
  return withFallback(
    apiFetch<{ jobs: OrgJob[] }>("/api/organization/jobs").then((d) => d.jobs),
    () => getJobs()
  );
}

export async function advanceOrgJobApi(id: string, stage?: JobStage): Promise<OrgJob> {
  return withFallback(
    apiFetch<{ job: OrgJob }>(`/api/organization/jobs/${id}/advance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    }).then((d) => d.job),
    async () => {
      const mock = (await getJobs()).find((j) => j.id === id);
      if (!mock) throw new Error("Job not found.");
      const order: JobStage[] = ["Open", "Claimed", "InProgress", "Submitted", "Verified"];
      const idx = order.indexOf(mock.stage);
      return { ...mock, stage: stage || order[Math.min(idx + 1, order.length - 1)] };
    }
  );
}

// ------------------------------------------------------------- disputes

export async function getOrgDisputesApi(): Promise<Dispute[]> {
  return withFallback(
    apiFetch<{ disputes: Dispute[] }>("/api/organization/disputes").then((d) => d.disputes),
    () => getDisputes()
  );
}

export async function resolveOrgDisputeApi(id: string): Promise<Dispute> {
  return withFallback(
    apiFetch<{ dispute: Dispute }>(`/api/organization/disputes/${id}/resolve`, { method: "POST" }).then((d) => d.dispute),
    async () => {
      const mock = (await getDisputes()).find((d) => d.id === id);
      if (!mock) throw new Error("Dispute not found.");
      return { ...mock, status: "resolved" };
    }
  );
}

// ------------------------------------------------------------- workers

export async function getOrgWorkersApi(): Promise<OrgWorker[]> {
  return withFallback(
    apiFetch<{ workers: OrgWorker[] }>("/api/organization/workers").then((d) => d.workers),
    () => getWorkers()
  );
}

export async function setWorkerStatusApi(id: string, status: OrgWorker["status"]): Promise<OrgWorker> {
  return withFallback(
    apiFetch<{ worker: OrgWorker }>(`/api/organization/workers/${id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then((d) => d.worker),
    async () => {
      const mock = (await getWorkers()).find((w) => w.id === id);
      if (!mock) throw new Error("Worker not found.");
      return { ...mock, status };
    }
  );
}

export async function setWorkerVerifiedApi(id: string, verified: boolean): Promise<OrgWorker> {
  return withFallback(
    apiFetch<{ worker: OrgWorker }>(`/api/organization/workers/${id}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verified }),
    }).then((d) => d.worker),
    async () => {
      const mock = (await getWorkers()).find((w) => w.id === id);
      if (!mock) throw new Error("Worker not found.");
      return { ...mock, verified };
    }
  );
}

// ------------------------------------------------------------- analytics

export async function getOrgAnalyticsApi(): Promise<OrgAnalytics> {
  return withFallback(
    apiFetch<{ analytics: OrgAnalytics }>("/api/organization/analytics").then((d) => d.analytics),
    () => getAnalytics()
  );
}

// ------------------------------------------------------------- team

export async function getOrgTeamApi(): Promise<OrgTeamMember[]> {
  return withFallback(
    apiFetch<{ team: OrgTeamMember[] }>("/api/organization/team").then((d) => d.team),
    () => getTeam()
  );
}

export async function addOrgTeamMemberApi(input: {
  name: string;
  email: string;
  level: OrgTeamMember["level"];
}): Promise<OrgTeamMember[]> {
  return withFallback(
    apiFetch<{ team: OrgTeamMember[] }>("/api/organization/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }).then((d) => d.team),
    async () => {
      const current = await getTeam();
      const initials = input.name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      return [
        ...current,
        {
          id: `tm_${Date.now()}`,
          name: input.name,
          email: input.email,
          level: input.level,
          avatar: initials,
          lastActive: "just added",
        },
      ];
    }
  );
}

export async function updateOrgTeamMemberApi(id: string, level: OrgTeamMember["level"]): Promise<OrgTeamMember[]> {
  return withFallback(
    apiFetch<{ team: OrgTeamMember[] }>(`/api/organization/team/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level }),
    }).then((d) => d.team),
    async () => (await getTeam()).map((m) => (m.id === id ? { ...m, level } : m))
  );
}

// ------------------------------------------------------------- settings

export async function getOrgSettingsApi(): Promise<OrgSettings> {
  return withFallback(
    apiFetch<{ settings: OrgSettings }>("/api/organization/settings").then((d) => d.settings),
    () => getOrgSettings()
  );
}

export async function updateOrgSettingsApi(patch: Partial<OrgSettings>): Promise<OrgSettings> {
  return withFallback(
    apiFetch<{ settings: OrgSettings }>("/api/organization/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).then((d) => d.settings),
    async () => ({ ...(await getOrgSettings()), ...patch })
  );
}

// Re-export the shared types so screens import everything from one place.
export type { OrgReport, OrgJob, OrgWorker, OrgTeamMember, OrgAnalytics, Dispute, JobStage };
