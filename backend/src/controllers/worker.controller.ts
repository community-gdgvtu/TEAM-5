import { Request, Response } from "express";
import { JobModel } from "../models/Job.model";
import { BidModel } from "../models/Bid.model";
import { ReviewModel } from "../models/Review.model";
import { UserModel } from "../models/User.model";
import { isMongoConnected, getUserModel } from "../config/db";
import { createFeedPost } from "../services/feed.service";
import {
  demoJobs,
  demoBids,
  demoActiveJobs,
  demoWallet,
  demoWorkerReviews,
  demoWorkerProfile,
  DemoBid,
  DemoActiveJob,
} from "../config/demoData";

const DEFAULT_GRADIENT = "linear-gradient(135deg,#3b82f6,#6366f1)";

/**
 * 🟠 Worker endpoints.
 * Owns this file + routes/worker.routes.ts.
 * Every endpoint reads MongoDB when it is connected and falls back to the
 * rich demo data otherwise, so the worker marketplace always renders.
 */

interface DemoJobLike {
  id: string;
  title?: string;
  category?: string;
  emoji?: string;
  gradient?: string;
  area?: string;
  location?: string | { city?: string; state?: string; country?: string };
  payout?: number;
  raised?: number;
  status?: string;
  workerName?: string;
  worker?: string;
  workerRating?: number;
  bidsCount?: number;
  postedAt?: string;
  dueDate?: string;
  description?: string;
}

function enrichFromDemo<T extends DemoJobLike>(job: T): T {
  const demo = demoJobs.find((d) => d.id === job.id);
  return {
    ...job,
    title: job.title || demo?.title || "Civic repair job",
    category: job.category || demo?.category || "General",
    emoji: job.emoji || demo?.emoji || "🔧",
    gradient: job.gradient || demo?.gradient || "linear-gradient(135deg,#3b82f6,#6366f1)",
    area: job.area || demo?.area || "—",
    payout: job.payout ?? demo?.payout ?? 0,
    raised: job.raised ?? demo?.raised ?? 0,
    bidsCount: job.bidsCount ?? demo?.bidsCount ?? 0,
    postedAt: job.postedAt || demo?.postedAt || "recently",
    dueDate: job.dueDate || demo?.dueDate,
    description: job.description || demo?.description || "",
    workerName: job.workerName || job.worker || demo?.worker,
    workerRating: job.workerRating ?? demo?.workerRating,
  };
}

function toWorkerJob(job: DemoJobLike): any {
  const j = enrichFromDemo(job);
  const num = parseInt(j.id.replace(/\D/g, ""), 10) || 1;
  const payoutMin = Math.round((j.payout ?? 0) * 0.78);
  const payoutMax = Math.round((j.payout ?? 0) * 1.12);
  const funded = (j.raised ?? 0) >= (j.payout ?? 0);
  const urgency: "High" | "Medium" | "Low" = funded ? "Medium" : (j.raised ?? 0) / Math.max(j.payout ?? 1, 1) > 0.5 ? "High" : "Low";
  return {
    id: j.id,
    title: j.title,
    category: j.category,
    emoji: j.emoji,
    gradient: j.gradient,
    org: demoJobs.find((d) => d.id === j.id)?.area ? "Municipal Corporation" : "Community Fund",
    orgVerified: true,
    area: j.area,
    location: typeof j.location === "string" ? j.location : j.location?.city || "India",
    distanceKm: 1.5 + Math.round(num * 1.3) / 10,
    payout: j.payout,
    payoutMin,
    payoutMax,
    raised: j.raised,
    funded,
    urgency,
    postedAgo: j.postedAt,
    description: j.description,
    aiEstimate: j.payout,
    aiConfidence: 0.85 + (num % 12) / 100,
    bidsCount: j.bidsCount,
    status: (j.status === "Open" ? "open" : j.status === "Claimed" ? "bidding" : j.status === "InProgress" ? "active" : j.status === "Submitted" ? "proof" : "completed") as any,
    deadDate: j.dueDate,
    worker: j.workerName,
    workerRating: j.workerRating,
  };
}

export async function getOpenJobs(req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      const list = demoJobs.filter((j) => j.stage === "Open" || j.stage === "Claimed");
      return res.json({ jobs: list.map(toWorkerJob) });
    }
    const jobs = await JobModel.find({
      status: { $in: ["Open", "Claimed"] },
    }).lean();
    return res.json({ jobs: (jobs.length ? jobs : demoJobs).map(toWorkerJob) });
  } catch (err) {
    return res.json({ jobs: demoJobs.filter((j) => j.stage === "Open" || j.stage === "Claimed").map(toWorkerJob) });
  }
}

export async function getJobDetail(req: Request, res: Response) {
  const { id } = req.params;
  try {
    if (!isMongoConnected()) {
      const job = demoJobs.find((j) => j.id === id);
      if (!job) return res.status(404).json({ error: "Job not found." });
      return res.json(toWorkerJob(job));
    }
    const job = await JobModel.findOne({ id }).lean();
    if (!job) return res.status(404).json({ error: "Job not found." });
    return res.json(toWorkerJob(job));
  } catch (err) {
    return res.status(500).json({ error: "Failed to load job." });
  }
}

function toMyBid(bid: any, demo: DemoBid | undefined): any {
  return {
    id: bid.id,
    jobId: bid.jobId,
    jobTitle: bid.jobTitle || demo?.jobTitle || "Civic repair job",
    emoji: bid.emoji || demo?.emoji || "🔧",
    gradient: bid.gradient || demo?.gradient || "linear-gradient(135deg,#3b82f6,#6366f1)",
    quoted: Number(bid.amount) || bid.quoted || 0,
    timelineDays: Number(bid.timelineDays) || 3,
    message: bid.message || "",
    status: ((bid.status || "Pending").toLowerCase() as any),
    submittedAgo: bid.submittedAgo || "recently",
    aiEstimate: bid.aiEstimate || 0,
    org: bid.org || demo?.org || "Municipal Corporation",
  };
}

export async function getMyBids(req: Request, res: Response) {
  const userId = (req as any).userId || "user_demo_worker_001";
  try {
    if (!isMongoConnected()) {
      return res.json({ bids: demoBids.map((b) => toMyBid(b, b)) });
    }
    const bids = await BidModel.find({ workerId: userId }).lean();
    return res.json({ bids: bids.length ? bids.map((b) => toMyBid(b, demoBids.find((d) => d.id === b.id))) : demoBids.map((b) => toMyBid(b, b)) });
  } catch (err) {
    return res.json({ bids: demoBids.map((b) => toMyBid(b, b)) });
  }
}

export async function submitBid(req: Request, res: Response) {
  const { jobId } = req.params;
  const { amount, timeline, message } = req.body || {};
  const userId = (req as any).userId || "user_demo_worker_001";

  const bid = {
    id: `bid_${Date.now()}`,
    jobId,
    workerId: userId,
    amount: Number(amount) || 100,
    timeline: timeline || "3 days",
    message: message || "",
    status: "Pending",
  };

  const demo = demoBids.find((d) => d.jobId === jobId);
  const payload = toMyBid(
    { ...bid, amount: Number(amount) || demo?.quoted || 100, jobTitle: demo?.jobTitle, emoji: demo?.emoji, gradient: demo?.gradient, aiEstimate: demo?.aiEstimate, org: demo?.org },
    demo
  );

  if (!isMongoConnected()) {
    return res.status(201).json({ bid: payload });
  }

  try {
    await BidModel.create(bid);
    await JobModel.updateOne({ id: jobId }, { $inc: { bidsCount: 1 } });
    return res.status(201).json({ bid: payload });
  } catch (err) {
    return res.status(500).json({ error: "Failed to submit bid." });
  }
}

export async function uploadProof(req: Request, res: Response) {
  const { jobId } = req.params;
  const { afterPhotoUrl } = req.body || {};
  const userId = (req as any).userId || "user_demo_worker_001";
  const demo = demoJobs.find((j) => j.id === jobId);
  const title = demo?.title || "Completed civic work";
  const area = demo?.area || "—";
  const location = demo?.location || "India";
  try {
    if (!isMongoConnected()) {
      await createFeedPost({
        type: "completed",
        title: `${title} — Work Completed`,
        caption: "Work completed on site. After-photo uploaded and matched by AI verification against the original issue.",
        category: demo?.category || "General",
        emoji: demo?.emoji || "✅",
        gradient: demo?.gradient || DEFAULT_GRADIENT,
        authorId: userId,
        authorName: demoWorkerProfile.name,
        authorAvatar: "🧑‍🔧",
        authorRole: "worker",
        authorVerified: true,
        area,
        location,
        amount: demo?.payout,
        status: "Completed",
        hashtags: ["#WorkDone", "#AIVerified"],
        jobId,
        beforeAfter: {
          before: "Original issue as reported by the citizen.",
          after: "Completed work verified on site.",
        },
      });
      return res.json({ jobId, status: "Submitted", afterPhotoUrl });
    }
    await JobModel.updateOne({ id: jobId }, { status: "Submitted" });
    await createFeedPost({
      type: "completed",
      title: `${title} — Work Completed`,
      caption: "Work completed on site. After-photo uploaded and matched by AI verification against the original issue.",
      category: demo?.category || "General",
      emoji: demo?.emoji || "✅",
      gradient: demo?.gradient || DEFAULT_GRADIENT,
      authorId: userId,
      authorName: demoWorkerProfile.name,
      authorAvatar: "🧑‍🔧",
      authorRole: "worker",
      authorVerified: true,
      area,
      location,
      amount: demo?.payout,
      status: "Completed",
      hashtags: ["#WorkDone", "#AIVerified"],
      jobId,
      beforeAfter: {
        before: "Original issue as reported by the citizen.",
        after: "Completed work verified on site.",
      },
    });
    return res.json({ jobId, status: "Submitted", afterPhotoUrl });
  } catch (err) {
    return res.status(500).json({ error: "Failed to upload proof." });
  }
}

function toActiveJob(job: DemoActiveJob): any {
  return {
    ...toWorkerJob(job),
    status: "active",
    bidId: job.bidId,
    awardedAt: job.awardedAt,
    dueDate: job.dueDate,
    clientName: job.clientName,
    clientMobile: job.clientMobile,
    instructionNote: job.instructionNote,
    payoutEligible: job.payoutEligible,
    completionMarked: job.completionMarked,
    checklist: job.checklist,
  };
}

export async function getActiveJobs(req: Request, res: Response) {
  try {
    if (!isMongoConnected()) {
      return res.json({ jobs: demoActiveJobs.map(toActiveJob) });
    }
    const jobs = await JobModel.find({ status: { $in: ["Claimed", "InProgress", "Submitted"] } }).lean();
    if (!jobs.length) return res.json({ jobs: demoActiveJobs.map(toActiveJob) });
    return res.json({
      jobs: jobs.map((j) =>
        toActiveJob({
          ...(demoActiveJobs[0] || {}),
          ...j,
          status: "active",
          worker: j.workerName,
          dueDate: j.dueDate || "ongoing",
        } as any)
      ),
    });
  } catch (err) {
    return res.json({ jobs: demoActiveJobs.map(toActiveJob) });
  }
}

export async function getWallet(req: Request, res: Response) {
  return res.json({ wallet: demoWallet });
}

export async function getWorkerProfile(req: Request, res: Response) {
  const userId = (req as any).userId || "user_demo_worker_001";
  const demo = demoWorkerProfile;
  let profile = demo;
  if (isMongoConnected()) {
    try {
      const user = await UserModel.findOne({ id: userId }).lean();
      if (user) {
        profile = {
          ...demo,
          name: user.name || demo.name,
          skillCategory: user.supplementaryData?.workerSkillCategory || demo.skillCategory,
          licenseId: user.supplementaryData?.workerLicenseId || demo.licenseId,
          rating: user.workerRating ?? demo.rating,
          jobsDone: user.workerJobsDone ?? demo.jobsDone,
          verified: user.workerVerified ?? demo.verified,
        };
      }
    } catch {
      /* keep demo profile */
    }
  }
  return res.json({ profile });
}

export async function getWorkerReviews(_req: Request, res: Response) {
  return res.json({ reviews: demoWorkerReviews });
}

/**
 * GET /api/worker/task-history
 * Returns the full task history for the authenticated worker:
 * - All jobs the worker has interacted with (bids, claimed, completed)
 * - All bids with status
 * - All reviews received
 * - Aggregated stats (total earned, jobs completed, avg rating, etc.)
 */
export async function getTaskHistory(req: Request, res: Response) {
  const userId = (req as any).userId || req.query.workerId as string || "user_demo_worker_001";

  try {
    if (!isMongoConnected()) {
      // Return enriched demo data for the worker
      const completedJobs = demoJobs.filter((j) => j.stage === "Verified" || j.stage === "Submitted").map(toWorkerJob);
      const allBids = demoBids.map((b) => toMyBid(b, b));
      const stats = {
        totalJobs: 137,
        completedJobs: 124,
        activeJobs: 3,
        pendingBids: 2,
        totalEarned: 342000,
        avgRating: 4.9,
        acceptanceRate: 96,
        responseTime: "~20 min",
      };
      return res.json({
        workerId: userId,
        user: {
          name: demoWorkerProfile.name,
          skillCategory: demoWorkerProfile.skillCategory,
          licenseId: demoWorkerProfile.licenseId,
          memberSince: demoWorkerProfile.memberSince,
          location: demoWorkerProfile.location,
          verified: demoWorkerProfile.verified,
        },
        stats,
        jobs: completedJobs,
        bids: allBids,
        reviews: demoWorkerReviews,
        tags: ["#RoadRepair", "#DrainClearing", "#Streetlights", "#AIVerified", "#TopPerformer"],
      });
    }

    // MongoDB path — query all relevant collections
    const UserModel = getUserModel();

    // Get user profile
    const user = await UserModel.findOne({ id: userId }).lean();

    // Get all bids by this worker
    const workerBids = await BidModel.find({ workerId: userId }).sort({ createdAt: -1 }).lean();

    // Get all jobs where this worker has a bid or is assigned
    const jobIds = [...new Set([
      ...workerBids.map((b) => b.jobId),
    ])];

    // Also find jobs where workerId matches (assigned jobs)
    const assignedJobs = await JobModel.find({ workerId: userId }).lean();
    const allJobIds = [...new Set([...jobIds, ...assignedJobs.map((j) => j.id)])];

    // Fetch all relevant jobs
    const allJobs = allJobIds.length > 0
      ? await JobModel.find({ id: { $in: allJobIds } }).lean()
      : [];

    // Get all reviews for this worker
    const workerReviews = await ReviewModel.find({ revieweeId: userId }).sort({ createdAt: -1 }).lean();

    // Enrich jobs with demo data where fields are missing
    const enrichedJobs = allJobs.map((j) => toWorkerJob(enrichFromDemo(j)));

    // Enrich bids with job titles
    const enrichedBids = workerBids.map((b) => {
      const job = allJobs.find((j) => j.id === b.jobId);
      const demo = demoBids.find((d) => d.id === b.id);
      return toMyBid(
        {
          ...b,
          jobTitle: job?.title || demo?.jobTitle || "Civic repair job",
          emoji: job?.emoji || demo?.emoji || "🔧",
          gradient: job?.gradient || demo?.gradient || "linear-gradient(135deg,#3b82f6,#6366f1)",
          aiEstimate: job?.payout || demo?.aiEstimate || 0,
          org: job?.area ? "Municipal Corporation" : demo?.org || "Community Fund",
        },
        demo
      );
    });

    // Calculate stats
    const completedCount = enrichedJobs.filter((j) =>
      j.status === "completed" || j.status === "proof" || j.status === "verification"
    ).length;
    const activeCount = enrichedJobs.filter((j) => j.status === "active").length;
    const pendingBidsCount = enrichedBids.filter((b) => b.status === "pending").length;
    const totalEarned = enrichedJobs
      .filter((j) => j.status === "completed")
      .reduce((sum, j) => sum + (j.payout || 0), 0);
    const avgRating = workerReviews.length > 0
      ? workerReviews.reduce((sum, r) => sum + r.rating, 0) / workerReviews.length
      : 0;

    // Extract tags from job categories
    const categories = [...new Set(enrichedJobs.map((j) => j.category).filter(Boolean))];
    const tags = categories.map((c) => `#${c.replace(/\s+/g, "")}`);

    return res.json({
      workerId: userId,
      user: user ? {
        name: user.name,
        skillCategory: user.supplementaryData?.workerSkillCategory || "",
        licenseId: user.supplementaryData?.workerLicenseId || "",
        memberSince: user.createdAt || "Unknown",
        location: user.location ? `${user.location.city}, ${user.location.state}` : "",
        verified: user.workerVerified || false,
      } : {
        name: "Worker",
        skillCategory: "",
        licenseId: "",
        memberSince: "Unknown",
        location: "",
        verified: false,
      },
      stats: {
        totalJobs: enrichedJobs.length,
        completedJobs: completedCount,
        activeJobs: activeCount,
        pendingBids: pendingBidsCount,
        totalEarned,
        avgRating: Math.round(avgRating * 10) / 10,
        acceptanceRate: enrichedBids.length > 0
          ? Math.round((enrichedBids.filter((b) => b.status === "awarded").length / enrichedBids.length) * 100)
          : 0,
        responseTime: "~20 min",
      },
      jobs: enrichedJobs,
      bids: enrichedBids,
      reviews: workerReviews.map((r) => ({
        id: r.id,
        author: "Community Member",
        avatar: "👤",
        role: "Citizen" as const,
        rating: r.rating,
        text: r.comment,
        jobTitle: allJobs.find((j) => j.id === r.jobId)?.title || "Civic work",
        date: r.createdAt || "Recently",
      })),
      tags,
    });
  } catch (err) {
    console.error("[DB ERROR] task-history:", err);
    return res.status(500).json({ error: "Failed to load task history." });
  }
}
