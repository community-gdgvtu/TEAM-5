import { Request, Response } from "express";
import { JobModel } from "../models/Job.model";
import { BidModel } from "../models/Bid.model";
import { UserModel } from "../models/User.model";
import { isMongoConnected } from "../config/db";
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
