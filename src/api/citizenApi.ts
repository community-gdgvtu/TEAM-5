import { apiFetch, withFallback, toSessionToken } from "./index";

/**
 * 🟢 Citizen API client.
 * Matches backend/routes/citizen.routes.ts.
 * Reads MongoDB-backed endpoints; falls back to demo data when offline.
 */
export interface ReportInput {
  issueType: string;
  description: string;
  photoUrl?: string;
  location?: { city: string; state: string; country: string };
  postType?: "issue" | "completed" | "failed";
  taggedWorker?: string;
  hashtags?: string[];
  title?: string;
  qualityScore?: number;
  userEstimate?: number;
}

export interface Report {
  id: string;
  issueType: string;
  description: string;
  location: { city: string; state: string; country: string };
  aiEstimate?: { amount: number; currency: string; severity: string; confidence: number };
  status: string;
  photoUrl?: string;
  title?: string;
  category?: string;
  emoji?: string;
  gradient?: string;
  area?: string;
  citizenName?: string;
  citizenAvatar?: string;
  submittedAt?: string;
  aiConfidence?: number;
  urgency?: string;
  postType?: "issue" | "completed" | "failed";
  taggedWorker?: string;
  hashtags?: string[];
  userEstimate?: number;
}

export async function getMyReports(token?: string | null): Promise<{ reports: Report[] }> {
  return withFallback<{ reports: Report[] }>(
    apiFetch("/api/reports", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
    { reports: [] }
  );
}

export async function createReport(input: ReportInput, token?: string | null): Promise<{ report: Report }> {
  const mockReport: Report = {
    id: `rep_local_${Date.now()}`,
    issueType: input.issueType,
    description: input.description,
    location: input.location || { city: "Mumbai", state: "Maharashtra", country: "India" },
    status: "Submitted",
    title: input.title || input.issueType,
    category: input.issueType,
    photoUrl: input.photoUrl,
    submittedAt: new Date().toISOString(),
  };
  return withFallback<{ report: Report }>(
    apiFetch("/api/reports", {
      method: "POST",
      headers: { Authorization: `Bearer ${toSessionToken(token)}` },
      body: JSON.stringify(input),
    }),
    { report: mockReport }
  );
}

export async function getDonationCampaigns(): Promise<{ campaigns: any[] }> {
  return withFallback<{ campaigns: any[] }>(
    apiFetch("/api/campaigns"),
    { campaigns: [] }
  );
}

export async function getIssueDetail(id: string): Promise<{ report: Report | undefined }> {
  const report = await withFallback<Report | undefined>(
    apiFetch(`/api/reports/${id}`).then((r: any) => r.report),
    (await getMyReports()).reports.find((r) => r.id === id)
  );
  return { report };
}
