import { apiFetch } from "./index";

/**
 * 🟣 Investor API client — Teammate D owns this file.
 * Matches backend/routes/investor.routes.ts.
 */
export async function getFundedProjects(token?: string | null): Promise<{ funded: any[] }> {
  return apiFetch<{ funded: any[] }>("/api/investor/funded", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function getImpactAnalytics(): Promise<{ impact: any[] }> {
  return apiFetch<{ impact: any[] }>("/api/investor/impact");
}

export async function fundCampaign(
  input: { campaignId: string; amount: number },
  token?: string | null
): Promise<{ transaction: any }> {
  return apiFetch<{ transaction: any }>("/api/investor/fund", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(input),
  });
}