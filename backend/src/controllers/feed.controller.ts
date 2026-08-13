import { Request, Response } from "express";
import { PostModel, IPostComment } from "../models/Post.model";
import { isMongoConnected } from "../config/db";
import {
  getFeedPosts,
  getFeedPostById,
  createFeedPost,
  getFallbackStream,
  FeedPostInput,
} from "../services/feed.service";

/**
 * 🌐 Unified community feed endpoints.
 * Mounted at /api/feed. Every role reads the same stream; posts are created
 * automatically by the role flows (citizen report, org publish, worker proof)
 * and can also be created manually via POST /api/feed.
 */

function serialize(post: any): any {
  return {
    id: post.id,
    type: post.type,
    title: post.title,
    caption: post.caption || "",
    category: post.category || "General",
    emoji: post.emoji || "🛠️",
    gradient: post.gradient || "linear-gradient(135deg,#3b82f6,#6366f1)",
    authorId: post.authorId,
    authorName: post.authorName,
    authorAvatar: post.authorAvatar || "🧑",
    authorRole: post.authorRole,
    authorVerified: post.authorVerified ?? false,
    area: post.area || "—",
    location: post.location || "India",
    amount: post.amount ?? null,
    targetAmount: post.targetAmount ?? null,
    raisedAmount: post.raisedAmount ?? null,
    backers: post.backers ?? 0,
    status: post.status || "",
    urgency: post.urgency || null,
    likes: post.likes || [],
    likeCount: (post.likes || []).length,
    shares: post.shares || 0,
    comments: post.comments || [],
    hashtags: post.hashtags || [],
    issueId: post.issueId || null,
    jobId: post.jobId || null,
    campaignId: post.campaignId || null,
    beforeAfter: post.beforeAfter || null,
    createdAt: post.createdAt || new Date().toISOString(),
  };
}

export async function getFeed(req: Request, res: Response) {
  try {
    const posts = await getFeedPosts();
    return res.json({ posts: posts.map(serialize) });
  } catch (err) {
    console.error("[FEED] getFeed:", err);
    return res.status(500).json({ error: "Failed to load feed." });
  }
}

export async function createPost(req: Request, res: Response) {
  const userId = (req as any).userId || "user_demo_001";
  const body = req.body || {};
  const input: FeedPostInput = {
    ...body,
    authorId: body.authorId || userId,
  };
  if (!input.type || !input.title) {
    return res.status(400).json({ error: "type and title are required." });
  }
  try {
    const post = await createFeedPost(input);
    return res.status(201).json({ post: serialize(post) });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create post." });
  }
}

export async function likePost(req: Request, res: Response) {
  const { id } = req.params;
  const userId = (req as any).userId || "user_demo_001";

  try {
    if (!isMongoConnected()) {
      const post = getFallbackStream().find((p) => p.id === id);
      if (!post) return res.status(404).json({ error: "Post not found." });
      const liked = post.likes.includes(userId);
      if (liked) {
        post.likes = post.likes.filter((u) => u !== userId);
      } else {
        post.likes.push(userId);
      }
      return res.json({ liked: !liked, likeCount: post.likes.length });
    }
    const post = await PostModel.findOne({ id });
    if (!post) return res.status(404).json({ error: "Post not found." });
    const liked = post.likes.includes(userId);
    if (liked) {
      post.likes = post.likes.filter((u) => u !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    return res.json({ liked: !liked, likeCount: post.likes.length });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update like." });
  }
}

export async function commentPost(req: Request, res: Response) {
  const { id } = req.params;
  const { text, userName } = req.body || {};
  const userId = (req as any).userId || "user_demo_001";

  if (!text || !String(text).trim()) {
    return res.status(400).json({ error: "Comment text is required." });
  }

  const comment: IPostComment = {
    id: `pc_${Date.now()}`,
    userId,
    userName: String(userName || "You").slice(0, 40),
    avatar: "🙂",
    text: String(text).trim(),
    time: "now",
    createdAt: new Date().toISOString(),
    likes: 0,
  };

  try {
    if (!isMongoConnected()) {
      const post = getFallbackStream().find((p) => p.id === id);
      if (!post) return res.status(404).json({ error: "Post not found." });
      post.comments.push(comment);
      return res.status(201).json({ comment });
    }
    const post = await PostModel.findOne({ id });
    if (!post) return res.status(404).json({ error: "Post not found." });
    post.comments.push(comment);
    await post.save();
    return res.status(201).json({ comment });
  } catch (err) {
    return res.status(500).json({ error: "Failed to add comment." });
  }
}

export async function sharePost(req: Request, res: Response) {
  const { id } = req.params;
  try {
    if (!isMongoConnected()) {
      const post = getFallbackStream().find((p) => p.id === id);
      if (!post) return res.status(404).json({ error: "Post not found." });
      post.shares = (post.shares || 0) + 1;
      return res.json({ shares: post.shares });
    }
    const post = await PostModel.findOne({ id });
    if (!post) return res.status(404).json({ error: "Post not found." });
    post.shares = (post.shares || 0) + 1;
    await post.save();
    return res.json({ shares: post.shares });
  } catch (err) {
    return res.status(500).json({ error: "Failed to share post." });
  }
}
