import mongoose, { Schema, model } from "mongoose";

export interface IIssue {
  id: string;
  reporterId: string; // citizen user id
  issueType: string; // pothole | streetlight | tree | cleaning | sidewalk | other
  description: string;
  photoUrl?: string;
  location: { city: string; state: string; country: string; lat?: number; lng?: number };
  aiEstimate?: {
    amount: number;
    currency: string;
    severity: string; // Minor | Moderate | Critical
    confidence: number;
    summary: string;
  };
  status: string; // Reported | Verified | Funding | InProgress | Done
  createdAt: string;
}

const IssueSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    reporterId: { type: String, required: true, index: true },
    issueType: { type: String, required: true },
    description: { type: String, default: "" },
    photoUrl: { type: String },
    location: {
      city: String,
      state: String,
      country: String,
      lat: Number,
      lng: Number,
    },
    aiEstimate: {
      amount: Number,
      currency: { type: String, default: "INR" },
      severity: String,
      confidence: Number,
      summary: String,
    },
    status: { type: String, default: "Reported" },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const IssueModel = model<IIssue>("Issue", IssueSchema);
export default IssueModel;