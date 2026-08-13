import { PostModel, IPost, IPostComment, PostType, PostAuthorRole } from "../models/Post.model";
import { isMongoConnected } from "../config/db";
import {
  demoReports,
  demoJobs,
  demoCampaigns,
  demoActiveJobs,
  demoWorkerProfile,
  demoOrganization,
} from "../config/demoData";

/**
 * 🌐 Shared feed service.
 * Every role reads the SAME post stream:
 *  - citizens post "issue"   (work to be done) via report creation
 *  - organizations post "job" (open work) via marketplace publish
 *  - workers post "completed" (work done) via completion proof
 *  - campaigns surface as "campaign" posts for funders
 *
 * Writes go to MongoDB when it is connected; otherwise they land in an
 * in-memory fallback stream so the demo still feels live within a session.
 */

export interface FeedPostInput {
  id?: string;
  type: PostType;
  title: string;
  caption?: string;
  category?: string;
  emoji?: string;
  gradient?: string;
  authorId?: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: PostAuthorRole;
  authorVerified?: boolean;
  area?: string;
  location?: string;
  amount?: number;
  targetAmount?: number;
  raisedAmount?: number;
  backers?: number;
  status?: string;
  urgency?: "High" | "Medium" | "Low";
  likes?: string[];
  shares?: number;
  comments?: IPostComment[];
  hashtags?: string[];
  issueId?: string;
  jobId?: string;
  campaignId?: string;
  beforeAfter?: { before: string; after: string };
}

const DEFAULT_GRADIENT = "linear-gradient(135deg,#3b82f6,#6366f1)";

let fallbackStream: IPost[] | null = null;

export function buildDemoPosts(): IPost[] {
  const orgName = demoOrganization.orgName;

  const issuePosts: IPost[] = demoReports.map((r) => ({
    id: `post_issue_${r.id}`,
    type: "issue",
    title: r.title,
    caption: r.description || r.title,
    category: r.category,
    emoji: r.emoji,
    gradient: r.gradient,
    authorId: `citizen_${r.id}`,
    authorName: r.citizenName,
    authorAvatar: r.citizenAvatar,
    authorRole: "citizen",
    authorVerified: true,
    area: r.area,
    location: r.location,
    amount: r.aiEstimate,
    status: r.status === "approved" ? "Funding" : r.status === "rejected" ? "Rejected" : "Pending review",
    urgency: r.urgency,
    likes: ["user_demo_001"],
    shares: r.id === "rep_001" ? 96 : 12,
    comments: [],
    hashtags: [`#${r.category}`, `#${r.area.replace(/\s+/g, "")}`, "#CitizenReported"],
    issueId: r.id,
    createdAt: "2026-08-13T08:00:00.000Z",
  }));

  const jobPosts: IPost[] = demoJobs
    .filter((j) => j.stage === "Open" || j.stage === "Claimed")
    .map((j) => ({
      id: `post_job_${j.id}`,
      type: "job",
      title: j.title,
      caption: j.description || `${j.category} work listed on the marketplace.`,
      category: j.category,
      emoji: j.emoji,
      gradient: j.gradient,
      authorId: "org_mumbai_001",
      authorName: orgName,
      authorAvatar: "🏛️",
      authorRole: "organization",
      authorVerified: true,
      area: j.area,
      location: j.location,
      amount: j.payout,
      raisedAmount: j.raised,
      backers: Math.round(j.raised / 1000),
      status: j.stage === "Claimed" ? "Bidding open" : "Open for bids",
      urgency: j.id === "job_001" ? "High" : j.raised / j.payout > 0.5 ? "High" : "Medium",
      likes: [],
      shares: 3,
      comments: [],
      hashtags: ["#Marketplace", `#${j.category}`, "#Hiring"],
      jobId: j.id,
      createdAt: "2026-08-12T10:00:00.000Z",
    }));

  const campaignPosts: IPost[] = demoCampaigns
    .filter((c) => c.status === "Funding" || c.status === "InProgress")
    .map((c) => ({
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
      likes: ["user_demo_001", "user_demo_002"],
      shares: c.shares,
      comments: c.comments.map((cm, i) => ({
        id: `pc_${c.id}_${i}`,
        userId: `user_${i}`,
        userName: cm.user,
        avatar: cm.avatar,
        text: cm.text,
        time: cm.time,
        createdAt: "2026-08-11T08:00:00.000Z",
        likes: cm.likes,
      })),
      hashtags: c.hashtags,
      campaignId: c.id,
      createdAt: c.createdAt,
    }));

  const completedPosts: IPost[] = demoActiveJobs.map((a, i) => ({
    id: `post_done_${a.id}`,
    type: "completed",
    title: `${a.title} — Work Completed`,
    caption: "Work completed on site. After-photo uploaded and matched by AI verification against the original issue.",
    category: a.category,
    emoji: a.emoji,
    gradient: a.gradient,
    authorId: "w_001",
    authorName: demoWorkerProfile.name,
    authorAvatar: "🧑‍🔧",
    authorRole: "worker",
    authorVerified: true,
    area: a.area,
    location: a.location,
    amount: a.payout,
    status: "Completed",
    likes: ["user_demo_001", "user_demo_002"],
    shares: 21,
    comments: [
      {
        id: `pc_done_${i}_0`,
        userId: "citizen_rep_006",
        userName: "Anita K.",
        avatar: "👩",
        text: "Drain cleared before the next downpour. Zero waterlogging since! 🙌",
        time: "1h",
        createdAt: "2026-08-12T14:00:00.000Z",
        likes: 18,
      },
    ],
    hashtags: ["#WorkDone", "#AIVerified", "#Proof"],
    jobId: a.id,
    beforeAfter: {
      before: "Stagnant grey water flooding the street.",
      after: "Clear drain, dry road, fresh kerb markings.",
    },
    createdAt: "2026-08-12T13:30:00.000Z",
  }));

  return [...completedPosts, ...campaignPosts, ...jobPosts, ...issuePosts].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function getFallbackStream(): IPost[] {
  if (!fallbackStream) fallbackStream = buildDemoPosts();
  return fallbackStream;
}

export async function getFeedPosts(): Promise<IPost[]> {
  if (!isMongoConnected()) return getFallbackStream();
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }).lean();
    return posts.length ? posts : buildDemoPosts();
  } catch {
    return getFallbackStream();
  }
}

export async function getFeedPostById(id: string): Promise<IPost | null> {
  if (!isMongoConnected()) return getFallbackStream().find((p) => p.id === id) || null;
  try {
    const post = await PostModel.findOne({ id }).lean();
    if (post) return post;
    return getFallbackStream().find((p) => p.id === id) || null;
  } catch {
    return getFallbackStream().find((p) => p.id === id) || null;
  }
}

export async function createFeedPost(input: FeedPostInput): Promise<IPost> {
  const post: IPost = {
    id: input.id || `post_${Date.now()}`,
    type: input.type,
    title: input.title,
    caption: input.caption || "",
    category: input.category || "General",
    emoji: input.emoji || "🛠️",
    gradient: input.gradient || DEFAULT_GRADIENT,
    authorId: input.authorId || `user_${Date.now()}`,
    authorName: input.authorName || "Citizen",
    authorAvatar: input.authorAvatar || "🧑",
    authorRole: input.authorRole,
    authorVerified: input.authorVerified ?? false,
    area: input.area || "—",
    location: input.location || "India",
    amount: input.amount,
    targetAmount: input.targetAmount,
    raisedAmount: input.raisedAmount,
    backers: input.backers,
    status: input.status,
    urgency: input.urgency,
    likes: input.likes || [],
    shares: input.shares || 0,
    comments: input.comments || [],
    hashtags: input.hashtags || [],
    issueId: input.issueId,
    jobId: input.jobId,
    campaignId: input.campaignId,
    beforeAfter: input.beforeAfter,
    createdAt: new Date().toISOString(),
  };

  if (isMongoConnected()) {
    try {
      const existing = await PostModel.findOne({ id: post.id });
      if (!existing) await PostModel.create(post);
      return post;
    } catch {
      /* fall through to in-memory */
    }
  }

  getFallbackStream().unshift(post);
  return post;
}
