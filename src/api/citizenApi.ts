import { apiFetch } from "./index";

/**
 * 🟢 Citizen API client — Teammate A owns this file.
 * Matches backend/routes/citizen.routes.ts.
 */
export interface ReportInput {
  issueType: string;
  description: string;
  photoUrl?: string;
  location?: { city: string; state: string; country: string };
}

export interface Report {
  id: string;
  issueType: string;
  description: string;
  location: { city: string; state: string; country: string };
  aiEstimate?: { amount: number; currency: string; severity: string; confidence: number };
  status: string;
  photoUrl?: string;
}

export async function getMyReports(token?: string | null): Promise<{ reports: Report[] }> {
  return apiFetch<{ reports: Report[] }>("/api/reports", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function createReport(input: ReportInput, token?: string | null): Promise<{ report: Report }> {
  return apiFetch<{ report: Report }>("/api/reports", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(input),
  });
}

export async function getDonationCampaigns(): Promise<{ campaigns: any[] }> {
  return apiFetch<{ campaigns: any[] }>("/api/campaigns");
}

export async function getIssueDetail(id: string): Promise<{ report: Report | undefined }> {
  const { reports } = await getMyReports();
  const found = reports.find((r) => r.id === id) || reports[0];
  return { report: found };
}