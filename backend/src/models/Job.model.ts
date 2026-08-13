import mongoose, { Schema, model } from "mongoose";

export type JobStage = "Open" | "Claimed" | "InProgress" | "Submitted" | "Verified";

export interface IJob {
  id: string;
  campaignId: string;
  issueId: string;
  title: string;
  description: string;
  payout: number;
  currency: string;
  status: JobStage; // Open | Claimed | InProgress | Submitted | Verified
  workerId?: string;
  location: { city: string; state: string; country: string };
  photoUrl?: string;
  createdAt: string;
  /** Org role — presentation fields (additive, optional). */
  category?: string;
  emoji?: string;
  gradient?: string;
  area?: string;
  workerName?: string;
  workerRating?: number;
  raised?: number;
  bidsCount?: number;
  postedAt?: string;
  dueDate?: string;
}

const JobSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    campaignId: { type: String, required: true, index: true },
    issueId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    payout: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["Open", "Claimed", "InProgress", "Submitted", "Verified"],
      default: "Open",
      index: true,
    },
    workerId: { type: String },
    category: { type: String },
    emoji: { type: String },
    gradient: { type: String },
    area: { type: String },
    workerName: { type: String },
    workerRating: { type: Number },
    raised: { type: Number, default: 0 },
    bidsCount: { type: Number, default: 0 },
    postedAt: { type: String },
    dueDate: { type: String },
    location: {
      city: String,
      state: String,
      country: String,
    },
    photoUrl: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const JobModel = model<IJob>("Job", JobSchema);
export default JobModel;