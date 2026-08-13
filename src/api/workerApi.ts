import { apiFetch } from "./index";

/**
 * 🟠 Worker API client — Teammate C owns this file.
 * Matches backend/routes/worker.routes.ts.
 */
export async function getOpenJobs(token?: string | null): Promise<{ jobs: any[] }> {
  return apiFetch<{ jobs: any[] }>("/api/jobs", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function getMyBids(token?: string | null): Promise<{ bids: any[] }> {
  return apiFetch<{ bids: any[] }>("/api/bids", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function submitBid(
  jobId: string,
  input: { amount: number; timeline: string; message?: string },
  token?: string | null
): Promise<{ bid: any }> {
  return apiFetch<{ bid: any }>(`/api/jobs/${jobId}/bids`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(input),
  });
}