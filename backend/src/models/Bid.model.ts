import mongoose, { Schema, model } from "mongoose";

export interface IBid {
  id: string;
  jobId: string;
  workerId: string;
  amount: number;
  timeline: string; // "1 day" | "3 days" | "1 week" | "2 weeks"
  message: string;
  status: string; // Pending | Awarded | Rejected
  createdAt: string;
}

const BidSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    jobId: { type: String, required: true, index: true },
    workerId: { type: String, required: true },
    amount: { type: Number, required: true },
    timeline: { type: String, required: true },
    message: { type: String, default: "" },
    status: { type: String, default: "Pending" },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const BidModel = model<IBid>("Bid", BidSchema);
export default BidModel;