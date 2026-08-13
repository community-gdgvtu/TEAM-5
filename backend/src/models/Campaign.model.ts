import mongoose, { Schema, model } from "mongoose";

export interface ICampaignComment {
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

export interface ICampaignBid {
  id: string;
  worker: string;
  rating: number;
  quotedPrice: number;
  etaDays: number;
  jobsDone: number;
  verified: boolean;
}

export interface ICampaign {
  id: string;
  issueId: string;
  title: string;
  targetAmount: number;
  raisedAmount: number;
  currency: string;
  status: string; // Draft | Active | Funded | Completed
  escrowState: string; // Holding | Released | Refunded
  createdAt: string;
  /** Investor role — presentation fields (additive, optional). */
  category?: string;
  emoji?: string;
  gradient?: string;
  org?: string;
  orgVerified?: boolean;
  location?: string;
  area?: string;
  description?: string;
  backers?: number;
  likes?: number;
  shares?: number;
  comments?: ICampaignComment[];
  aiConfidence?: number;
  workerRating?: number;
  impactScore?: number;
  workerBids?: ICampaignBid[];
  hashtags?: string[];
  beforeAfter?: { before: string; after: string };
  payout?: { txnId: string; released: number; worker: string; status: string };
  impactSummary?: string;
}

const CampaignSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    issueId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    raisedAmount: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    status: { type: String, default: "Active" },
    escrowState: { type: String, default: "Holding" },
    category: { type: String },
    emoji: { type: String },
    gradient: { type: String },
    org: { type: String },
    orgVerified: { type: Boolean },
    location: { type: String },
    area: { type: String },
    description: { type: String },
    backers: { type: Number },
    likes: { type: Number },
    shares: { type: Number },
    comments: [{ user: String, avatar: String, text: String, time: String, likes: Number }],
    aiConfidence: { type: Number },
    workerRating: { type: Number },
    impactScore: { type: Number },
    workerBids: [
      {
        id: String,
        worker: String,
        rating: Number,
        quotedPrice: Number,
        etaDays: Number,
        jobsDone: Number,
        verified: Boolean,
      },
    ],
    hashtags: [String],
    beforeAfter: { before: String, after: String },
    payout: { txnId: String, released: Number, worker: String, status: String },
    impactSummary: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const CampaignModel = model<ICampaign>("Campaign", CampaignSchema);
export default CampaignModel;