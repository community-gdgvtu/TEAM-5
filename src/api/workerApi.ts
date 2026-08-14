import { apiFetch, withFallback, getDemoSessionToken } from "./index";
import {
  getOpenJobs as mockOpenJobs,
  getJob as mockJob,
  getMyBidsMock as mockBids,
  getActiveJobs as mockActiveJobs,
  getWallet as mockWallet,
  getReviews as mockReviews,
  getProfile as mockProfile,
  wallet,
  reviews,
  profile,
  C,
} from "../data/workerMock";
import type {
  WorkerJob,
  MyBid,
  ActiveJob,
  Withdrawal,
  EarningsTx,
  Review,
} from "../data/workerMock";

export { C, wallet, reviews, profile };

export type {
  WorkerJob,
  JobStatus,
  MyBid,
  ActiveJob,
  Withdrawal,
  EarningsTx,
  Review,
  Badge,
  PortfolioJob,
} from "../data/workerMock";

/**
 * 🟠 Worker API client — mirrors the worker mock's function names and types
 * so every screen stays the same except the import path.
 * Reads MongoDB-backed endpoints; falls back to demo data when offline.
 */

export async function getOpenJobs(): Promise<WorkerJob[]> {
  const res = await withFallback<{ jobs: any[] }>(
    apiFetch("/api/jobs"),
    { jobs: await mockOpenJobs() as any[] }
  );
  return res.jobs;
}

export async function getJob(id: string): Promise<WorkerJob | undefined> {
  const job = await withFallback<any | undefined>(
    apiFetch(`/api/jobs/${id}`),
    await mockJob(id)
  );
  return job;
}

export async function getMyBidsMock(): Promise<MyBid[]> {
  const res = await withFallback<{ bids: any[] }>(
    apiFetch("/api/bids"),
    { bids: await mockBids() as any[] }
  );
  return res.bids;
}

export async function getActiveJobs(): Promise<ActiveJob[]> {
  const res = await withFallback<{ jobs: any[] }>(
    apiFetch("/api/jobs/active/all"),
    { jobs: await mockActiveJobs() as any[] }
  );
  return res.jobs;
}

export async function getWallet(): Promise<typeof wallet> {
  const res = await withFallback<{ wallet: typeof wallet }>(
    apiFetch("/api/wallet"),
    { wallet: await mockWallet() }
  );
  return res.wallet;
}

export async function getReviews(): Promise<Review[]> {
  const res = await withFallback<{ reviews: Review[] }>(
    apiFetch("/api/worker/reviews"),
    { reviews: await mockReviews() }
  );
  return res.reviews;
}

export async function getProfile(): Promise<typeof profile> {
  const res = await withFallback<{ profile: typeof profile }>(
    apiFetch("/api/worker/profile", {
      headers: { Authorization: `Bearer ${getDemoSessionToken()}` },
    }),
    { profile: await mockProfile() }
  );
  return res.profile;
}

export async function submitBid(
  jobId: string,
  input: { amount: number; timeline: string; message?: string }
): Promise<{ bid: any }> {
  return withFallback(
    apiFetch(`/api/jobs/${jobId}/bids`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getDemoSessionToken()}` },
      body: JSON.stringify(input),
    }),
    { bid: null }
  );
}

export async function uploadProof(
  jobId: string,
  input: { afterPhotoUrl: string; note?: string }
): Promise<{ jobId: string; status: string }> {
  return withFallback(
    apiFetch(`/api/jobs/${jobId}/proof`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getDemoSessionToken()}` },
      body: JSON.stringify(input),
    }),
    { jobId, status: "Submitted" }
  );
}

export interface TaskHistoryData {
  workerId: string;
  user: {
    name: string;
    skillCategory: string;
    licenseId: string;
    memberSince: string;
    location: string;
    verified: boolean;
  };
  stats: {
    totalJobs: number;
    completedJobs: number;
    activeJobs: number;
    pendingBids: number;
    totalEarned: number;
    avgRating: number;
    acceptanceRate: number;
    responseTime: string;
  };
  jobs: WorkerJob[];
  bids: MyBid[];
  reviews: Review[];
  tags: string[];
}

export async function getTaskHistory(): Promise<TaskHistoryData | null> {
  try {
    const res = await fetch("/api/worker/task-history", {
      headers: { Authorization: `Bearer ${getDemoSessionToken()}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
