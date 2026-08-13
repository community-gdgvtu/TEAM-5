import mongoose, { Schema, model } from "mongoose";

export interface IJob {
  id: string;
  campaignId: string;
  issueId: string;
  title: string;
  description: string;
  payout: number;
  currency: string;
  status: string; // Open | Claimed | InProgress | Submitted | Verified | Done
  workerId?: string;
  location: { city: string; state: string; country: string };
  photoUrl?: string;
  createdAt: string;
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
    status: { type: String, default: "Open" },
    workerId: { type: String },
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