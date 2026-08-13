import { apiFetch } from "./index";

/**
 * 🔵 Organization API client — Teammate B owns this file.
 * Matches backend/routes/organization.routes.ts.
 */
export async function getPendingReports(token?: string | null): Promise<{ reports: any[] }> {
  return apiFetch<{ reports: any[] }>("/api/reports/pending", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function getOrgJobs(): Promise<{ jobs: any[] }> {
  return apiFetch<{ jobs: any[] }>("/api/jobs");
}

export async function getPendingBids(): Promise<{ bids: any[] }> {
  return apiFetch<{ bids: any[] }>("/api/bids");
}

export async function verifyReport(id: string, token?: string | null): Promise<any> {
  return apiFetch<any>(`/api/reports/${id}/verify`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}