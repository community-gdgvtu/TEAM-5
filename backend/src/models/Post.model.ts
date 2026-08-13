import { Schema, model } from "mongoose";

export type PostType = "issue" | "job" | "completed" | "campaign";
export type PostAuthorRole = "citizen" | "organization" | "worker" | "investor";

export interface IPostComment {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  text: string;
  time: string;
  createdAt: string;
  likes: number;
}

export interface IPost {
  id: string;
  type: PostType;
  title: string;
  caption: string;
  category: string;
  emoji: string;
  gradient: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: PostAuthorRole;
  authorVerified: boolean;
  area: string;
  location: string;
  amount?: number;
  targetAmount?: number;
  raisedAmount?: number;
  backers?: number;
  status?: string;
  urgency?: "High" | "Medium" | "Low";
  likes: string[];
  shares: number;
  comments: IPostComment[];
  hashtags: string[];
  issueId?: string;
  jobId?: string;
  campaignId?: string;
  beforeAfter?: { before: string; after: string };
  createdAt: string;
}

const PostCommentSchema: Schema = new Schema(
  {
    id: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    avatar: { type: String, default: "🙂" },
    text: { type: String, required: true },
    time: { type: String, default: "now" },
    createdAt: { type: String, default: () => new Date().toISOString() },
    likes: { type: Number, default: 0 },
  },
  { _id: false }
);

const PostSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ["issue", "job", "completed", "campaign"], index: true },
    title: { type: String, required: true },
    caption: { type: String, default: "" },
    category: { type: String, default: "General" },
    emoji: { type: String, default: "🛠️" },
    gradient: { type: String, default: "linear-gradient(135deg,#3b82f6,#6366f1)" },
    authorId: { type: String, required: true, index: true },
    authorName: { type: String, required: true },
    authorAvatar: { type: String, default: "🧑" },
    authorRole: { type: String, required: true, enum: ["citizen", "organization", "worker", "investor"] },
    authorVerified: { type: Boolean, default: false },
    area: { type: String, default: "—" },
    location: { type: String, default: "India" },
    amount: { type: Number },
    targetAmount: { type: Number },
    raisedAmount: { type: Number },
    backers: { type: Number },
    status: { type: String },
    urgency: { type: String, enum: ["High", "Medium", "Low"] },
    likes: { type: [String], default: [] },
    shares: { type: Number, default: 0 },
    comments: { type: [PostCommentSchema], default: [] },
    hashtags: { type: [String], default: [] },
    issueId: { type: String },
    jobId: { type: String },
    campaignId: { type: String },
    beforeAfter: { before: String, after: String },
    createdAt: { type: String, default: () => new Date().toISOString(), index: true },
  },
  { timestamps: true }
);

PostSchema.index({ createdAt: -1 });

export const PostModel = model<IPost>("Post", PostSchema);
export default PostModel;
