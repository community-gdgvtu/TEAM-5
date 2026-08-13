import mongoose, { Schema, model } from "mongoose";

export type DisputeType = "Bad work quality" | "Wrong worker" | "Funding issue" | "Verification fail";

export interface IDispute {
  id: string;
  jobId: string;
  jobTitle: string;
  emoji: string;
  gradient: string;
  type: DisputeType;
  severity: "High" | "Medium" | "Low";
  raisedBy: string;
  raisedAt: string;
  summary: string;
  worker: string;
  status: "open" | "resolved";
  createdAt: string;
}

const DisputeSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    jobId: { type: String, default: "", index: true },
    jobTitle: { type: String, required: true },
    emoji: { type: String, default: "⚠️" },
    gradient: { type: String, default: "linear-gradient(135deg,#f59e0b,#ef4444)" },
    type: { type: String, enum: ["Bad work quality", "Wrong worker", "Funding issue", "Verification fail"], required: true },
    severity: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    raisedBy: { type: String, default: "" },
    raisedAt: { type: String, default: "just now" },
    summary: { type: String, default: "" },
    worker: { type: String, default: "" },
    status: { type: String, enum: ["open", "resolved"], default: "open", index: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const DisputeModel = model<IDispute>("Dispute", DisputeSchema);
export default DisputeModel;
