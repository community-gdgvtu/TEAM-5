/**
 * 🌐 Unified community feed mock — mirrors what GET /api/feed returns.
 * One stream for every role: issues (citizens), jobs (organizations),
 * completed work (workers) and campaigns (funders).
 * Keeps an in-memory store so demo posts added during a session survive
 * even when the backend (and its fallback stream) is unavailable.
 */

import { demoCampaigns, fmtMoney } from "./investorMock";

export type FeedPostType = "issue" | "job" | "completed" | "campaign" | "failed";
export type FeedAuthorRole = "citizen" | "organization" | "worker" | "investor";

export interface FeedComment {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  text: string;
  time: string;
  createdAt: string;
  likes: number;
}

export interface FeedPost {
  id: string;
  type: FeedPostType;
  title: string;
  caption: string;
  category: string;
  emoji: string;
  gradient: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: FeedAuthorRole;
  authorVerified: boolean;
  area: string;
  location: string;
  amount: number | null;
  targetAmount: number | null;
  raisedAmount: number | null;
  backers: number;
  status: string;
  urgency: "High" | "Medium" | "Low" | null;
  likes: string[];
  likeCount: number;
  shares: number;
  comments: FeedComment[];
  hashtags: string[];
  issueId: string | null;
  jobId: string | null;
  campaignId: string | null;
  beforeAfter: { before: string; after: string } | null;
  createdAt: string;
  /** Citizen uploads — real photo, tagged worker, quality tracking. */
  photoUrl?: string;
  taggedWorker?: string;
  qualityScore?: number;
  locationTag?: { city: string; state: string; country: string };
}

export const C = fmtMoney;

const LIKED_BY = ["user_demo_001", "user_demo_002"];

function comment(user: string, avatar: string, text: string, time: string, likes: number): FeedComment {
  return { id: `c_${Math.random().toString(36).slice(2, 8)}`, userId: "user_demo_002", userName: user, avatar, text, time, createdAt: "2026-08-12T09:00:00.000Z", likes };
}

function buildCampaignPosts(): FeedPost[] {
  return demoCampaigns.map((c) => ({
    id: `post_camp_${c.id}`,
    type: "campaign",
    title: c.title,
    caption: c.description,
    category: c.category,
    emoji: c.emoji,
    gradient: c.gradient,
    authorId: `org_${c.id}`,
    authorName: c.org,
    authorAvatar: c.orgVerified ? "🏛️" : "🏢",
    authorRole: "organization",
    authorVerified: c.orgVerified,
    area: c.area,
    location: c.location,
    amount: c.targetAmount,
    targetAmount: c.targetAmount,
    raisedAmount: c.raisedAmount,
    backers: c.backers,
    status: c.status,
    urgency: c.status === "Funding" ? "High" : "Medium",
    likes: LIKED_BY,
    likeCount: c.likes,
    shares: c.shares,
    comments: c.comments.map((cm) => ({
      id: `c_${cm.user.replace(/\s+/g, "").toLowerCase()}`,
      userId: "user_demo_002",
      userName: cm.user,
      avatar: cm.avatar,
      text: cm.text,
      time: cm.time,
      createdAt: "2026-08-11T08:00:00.000Z",
      likes: cm.likes,
    })),
    hashtags: c.hashtags,
    issueId: null,
    jobId: null,
    campaignId: c.id,
    beforeAfter: c.beforeAfter || null,
    createdAt: new Date(c.createdAt).toISOString(),
  }));
}

function buildJobPosts(): FeedPost[] {
  return [
    { id: "post_done_job_006", type: "completed", title: "Churchgate Drain Clearing — Work Completed", caption: "Work completed on site. After-photo uploaded and matched by AI verification against the original issue.", category: "Sanitation & Drainage", emoji: "💧", gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)", authorId: "w_001", authorName: "Rahul Deshmukh", authorAvatar: "🧑‍🔧", authorRole: "worker", authorVerified: true, area: "Churchgate", location: "Mumbai, Maharashtra", amount: 52000, targetAmount: null, raisedAmount: null, backers: 0, status: "Completed", urgency: null, likes: LIKED_BY, likeCount: 214, shares: 21, comments: [comment("Anita K.", "👩", "Drain cleared before the next downpour. Zero waterlogging since! 🙌", "1h", 18)], hashtags: ["#WorkDone", "#AIVerified", "#Proof"], issueId: null, jobId: "job_006", campaignId: null, beforeAfter: { before: "Stagnant grey water flooding the street.", after: "Clear drain, dry road, fresh kerb markings." }, createdAt: "2026-08-12T13:30:00.000Z" },
    { id: "post_done_job_007", type: "completed", title: "Bandra Signal Re-timing — Work Completed", caption: "Signal timings recalibrated with AI-verified traffic data. Average wait time cut by 40%.", category: "Traffic & Signals", emoji: "🚦", gradient: "linear-gradient(135deg,#10b981,#0d9488)", authorId: "w_002", authorName: "Vikram Jadhav", authorAvatar: "🧑‍🔧", authorRole: "worker", authorVerified: true, area: "Bandra West", location: "Mumbai, Maharashtra", amount: 18000, targetAmount: null, raisedAmount: null, backers: 0, status: "Completed", urgency: null, likes: ["user_demo_001"], likeCount: 96, shares: 9, comments: [], hashtags: ["#WorkDone", "#AIVerified"], issueId: null, jobId: "job_007", campaignId: null, beforeAfter: null, createdAt: "2026-08-12T09:15:00.000Z" },
    ...demoCampaigns.filter((c) => c.status === "Funding" || c.status === "InProgress").map((c) => ({
      id: `post_job_${c.id}`,
      type: "job" as const,
      title: c.title,
      caption: `${c.category} work now open for contractor bids on the marketplace.`,
      category: c.category,
      emoji: c.emoji,
      gradient: c.gradient,
      authorId: "org_mumbai_001",
      authorName: "Brihanmumbai Municipal Corporation",
      authorAvatar: "🏛️",
      authorRole: "organization" as const,
      authorVerified: true,
      area: c.area,
      location: c.location,
      amount: c.targetAmount,
      targetAmount: null,
      raisedAmount: c.raisedAmount,
      backers: c.backers,
      status: "Open for bids",
      urgency: (c.status === "Funding" ? "High" : "Medium") as "High" | "Medium",
      likes: [],
      likeCount: 0,
      shares: 3,
      comments: [],
      hashtags: ["#Marketplace", "#OpenForBids", `#${c.category.replace(/\s+/g, "")}`],
      issueId: null,
      jobId: `job_${c.id}`,
      campaignId: c.id,
      beforeAfter: null,
      createdAt: "2026-08-11T11:00:00.000Z",
    })),
  ];
}

function buildIssuePosts(): FeedPost[] {
  return [
    { id: "post_issue_rep_001", type: "issue", title: "Pothole reported on Andheri Flyover", caption: "A 12-meter stretch of the Andheri flyover service road has crumbled, damaging two-wheelers daily.", category: "Road & Pavement Repairs", emoji: "🕳️", gradient: "linear-gradient(135deg,#f97316,#ef4444)", authorId: "citizen_rep_001", authorName: "Priya Mehta", authorAvatar: "🧕", authorRole: "citizen", authorVerified: true, area: "Andheri West", location: "Mumbai, Maharashtra", amount: 85000, targetAmount: null, raisedAmount: null, backers: 0, status: "Funding", urgency: "High", likes: LIKED_BY, likeCount: 1284, shares: 96, comments: [comment("Rahul S.", "🧑", "Can we get CCTV proof after completion?", "1h", 18)], hashtags: ["#PotholeFix", "#Mumbai", "#CitizenReported"], issueId: "rep_001", jobId: null, campaignId: null, beforeAfter: null, createdAt: "2026-08-10T07:30:00.000Z" },
    { id: "post_issue_rep_004", type: "issue", title: "Streetlight out on Sector 17", caption: "Eight streetlights out for 3 months. Women's safety group reports rising harassment after dark.", category: "Streetlight", emoji: "💡", gradient: "linear-gradient(135deg,#a855f7,#6366f1)", authorId: "citizen_rep_004", authorName: "Simran D.", authorAvatar: "👧", authorRole: "citizen", authorVerified: true, area: "Sector 17", location: "Chandigarh, Punjab", amount: 38000, targetAmount: null, raisedAmount: null, backers: 0, status: "Pending review", urgency: "Medium", likes: ["user_demo_001"], likeCount: 643, shares: 40, comments: [], hashtags: ["#SafetyFirst", "#CitizenReported"], issueId: "rep_004", jobId: null, campaignId: null, beforeAfter: null, createdAt: "2026-08-11T18:20:00.000Z" },
    { id: "post_issue_rep_006", type: "issue", title: "Blocked drain flooding Churchgate", caption: "Monsoon floods every monsoon here. Clearing the blocked storm drain protects 400 families from waterborne disease.", category: "Sanitation & Drainage", emoji: "💧", gradient: "linear-gradient(135deg,#3b82f6,#06b6d4)", authorId: "citizen_rep_006", authorName: "Anita K.", authorAvatar: "👩", authorRole: "citizen", authorVerified: true, area: "Churchgate", location: "Mumbai, Maharashtra", amount: 54000, targetAmount: null, raisedAmount: null, backers: 0, status: "Resolved", urgency: "High", likes: ["user_demo_001", "user_demo_002"], likeCount: 902, shares: 71, comments: [comment("Rahul S.", "🧑", "Thank you to every backer 💙", "3d", 120)], hashtags: ["#Drainage", "#MonsoonReady", "#CitizenReported"], issueId: "rep_006", jobId: null, campaignId: null, beforeAfter: null, createdAt: "2026-08-08T06:45:00.000Z" },
  ];
}

let store: FeedPost[] | null = null;

export function getFeedPostsMock(): Promise<FeedPost[]> {
  if (!store) {
    store = [...buildCampaignPosts(), ...buildJobPosts(), ...buildIssuePosts()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  return new Promise((res) => setTimeout(() => res([...store!]), 250));
}

export function createFeedPostMock(input: Partial<FeedPost> & { type: FeedPostType; title: string }): Promise<FeedPost> {
  const post: FeedPost = {
    id: `post_${Date.now()}`,
    type: input.type,
    title: input.title,
    caption: input.caption || "",
    category: input.category || "General",
    emoji: input.emoji || "🛠️",
    gradient: input.gradient || "linear-gradient(135deg,#3b82f6,#6366f1)",
    authorId: input.authorId || "user_demo_001",
    authorName: input.authorName || "You",
    authorAvatar: input.authorAvatar || "🧑",
    authorRole: input.authorRole || "citizen",
    authorVerified: input.authorVerified ?? false,
    area: input.area || "—",
    location: input.location || "India",
    amount: input.amount ?? null,
    targetAmount: input.targetAmount ?? null,
    raisedAmount: input.raisedAmount ?? null,
    backers: input.backers ?? 0,
    status: input.status || "",
    urgency: input.urgency ?? null,
    likes: input.likes || [],
    likeCount: input.likeCount ?? (input.likes || []).length,
    shares: input.shares || 0,
    comments: input.comments || [],
    hashtags: input.hashtags || [],
    issueId: input.issueId || null,
    jobId: input.jobId || null,
    campaignId: input.campaignId || null,
    beforeAfter: input.beforeAfter || null,
    photoUrl: input.photoUrl,
    taggedWorker: input.taggedWorker,
    qualityScore: input.qualityScore,
    locationTag: input.locationTag,
    createdAt: new Date().toISOString(),
  };
  store = [post, ...(store || [])];
  return new Promise((res) => setTimeout(() => res(post), 200));
}
