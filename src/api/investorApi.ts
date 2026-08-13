import { apiFetch, withFallback, getDemoSessionToken } from "./index";
import {
  getInvestorFeed as mockFeed,
  getCampaign as mockCampaign,
  getPortfolio as mockPortfolio,
  getTrustScore as mockTrustScore,
  getCompletionReport as mockCompletionReport,
  getPayout as mockPayout,
  getRegionalImpact as mockRegionalImpact,
  fundCampaignMock as mockFund,
  fmtMoney,
} from "../data/investorMock";
import type {
  Campaign,
  Comment,
  WorkerBid,
  RegionalImpact,
} from "../data/investorMock";

export { fmtMoney };

export type { Campaign, Comment, WorkerBid, RegionalImpact } from "../data/investorMock";

/**
 * 🟣 Investor API client — mirrors the investor mock's function names and
 * types so every screen stays the same except the import path.
 * Reads MongoDB-backed endpoints; falls back to demo data when offline.
 */

export async function getInvestorFeed(): Promise<Campaign[]> {
  const res = await withFallback<{ campaigns: any[] }>(
    apiFetch("/api/investor/feed"),
    { campaigns: await mockFeed() }
  );
  return res.campaigns;
}

export async function getCampaign(id: string): Promise<Campaign | undefined> {
  return withFallback<Campaign | undefined>(
    apiFetch(`/api/investor/campaigns/${id}`),
    await mockCampaign(id)
  );
}

export async function getPortfolio(): Promise<Campaign[]> {
  const res = await withFallback<{ campaigns: any[] }>(
    apiFetch("/api/investor/portfolio"),
    { campaigns: await mockPortfolio() }
  );
  return res.campaigns;
}

export async function getTrustScore(id: string): Promise<Campaign | undefined> {
  return withFallback<Campaign | undefined>(
    apiFetch(`/api/investor/trust/${id}`),
    await mockTrustScore(id)
  );
}

export async function getCompletionReport(id: string): Promise<Campaign | undefined> {
  return withFallback<Campaign | undefined>(
    apiFetch(`/api/investor/report/${id}`),
    await mockCompletionReport(id)
  );
}

export async function getPayout(id: string): Promise<Campaign | undefined> {
  return withFallback<Campaign | undefined>(
    apiFetch(`/api/investor/payout/${id}`),
    await mockPayout(id)
  );
}

export async function getRegionalImpact(): Promise<RegionalImpact> {
  const res = await withFallback<{ impact: RegionalImpact }>(
    apiFetch("/api/investor/regional"),
    { impact: await mockRegionalImpact() }
  );
  return res.impact;
}

export async function fundCampaignMock(input: {
  campaignId: string;
  amount: number;
}): Promise<{ transaction: { id: string; amount: number; status: string } }> {
  return withFallback(
    apiFetch("/api/investor/fund", {
      method: "POST",
      headers: { Authorization: `Bearer ${getDemoSessionToken()}` },
      body: JSON.stringify(input),
    }),
    await mockFund(input)
  );
}

export async function getFundedProjects(): Promise<{ funded: Campaign[] }> {
  return withFallback<{ funded: Campaign[] }>(
    apiFetch("/api/investor/funded"),
    { funded: await mockPortfolio() }
  );
}

export async function getImpactAnalytics(): Promise<{ impact: any[] }> {
  return withFallback<{ impact: any[] }>(
    apiFetch("/api/investor/impact"),
    { impact: [] }
  );
}
