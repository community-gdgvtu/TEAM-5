import { apiFetch, withFallback, getDemoSessionToken } from "./index";
import {
  getFeedPostsMock as mockFeed,
  createFeedPostMock as mockCreate,
  C,
} from "../data/feedMock";
import type { FeedPost, FeedComment, FeedPostType } from "../data/feedMock";

export { C };
export type { FeedPost, FeedComment, FeedPostType } from "../data/feedMock";

/**
 * 🌐 Unified community feed API client — mirrors the feed mock's shapes so
 * every feed surface (citizen/worker/investor/org) reads the same stream.
 * Falls back to the in-memory mock when the backend is offline.
 */

export async function getFeedPosts(): Promise<FeedPost[]> {
  const res = await withFallback<{ posts: any[] }>(
    apiFetch("/api/feed"),
    { posts: await mockFeed() as any[] }
  );
  return (res.posts || []).map((p) => ({
    ...p,
    likeCount: p.likeCount ?? (p.likes || []).length,
  }));
}

export async function createFeedPost(input: {
  type: FeedPostType;
  title: string;
  caption?: string;
  category?: string;
  emoji?: string;
  gradient?: string;
  authorName?: string;
  authorAvatar?: string;
  authorRole?: FeedPost["authorRole"];
  authorVerified?: boolean;
  area?: string;
  location?: string;
  amount?: number;
  status?: string;
  urgency?: "High" | "Medium" | "Low";
  hashtags?: string[];
  issueId?: string;
  jobId?: string;
  campaignId?: string;
}): Promise<FeedPost> {
  return withFallback<FeedPost>(
    apiFetch("/api/feed", {
      method: "POST",
      headers: { Authorization: `Bearer ${getDemoSessionToken()}` },
      body: JSON.stringify(input),
    }).then((r: any) => r.post),
    await mockCreate(input)
  );
}

export async function likeFeedPost(id: string): Promise<{ liked: boolean; likeCount: number }> {
  return withFallback<{ liked: boolean; likeCount: number }>(
    apiFetch(`/api/feed/${id}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getDemoSessionToken()}` },
    }),
    { liked: true, likeCount: 0 }
  );
}

export async function commentFeedPost(
  id: string,
  text: string,
  userName?: string
): Promise<FeedComment> {
  return withFallback<FeedComment>(
    apiFetch(`/api/feed/${id}/comment`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getDemoSessionToken()}` },
      body: JSON.stringify({ text, userName }),
    }).then((r: any) => r.comment),
    {
      id: `c_${Date.now()}`,
      userId: "user_demo_001",
      userName: userName || "You",
      avatar: "🙂",
      text,
      time: "now",
      createdAt: new Date().toISOString(),
      likes: 0,
    }
  );
}

export async function shareFeedPost(id: string): Promise<{ shares: number }> {
  return withFallback<{ shares: number }>(
    apiFetch(`/api/feed/${id}/share`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getDemoSessionToken()}` },
    }),
    { shares: 0 }
  );
}
