import mongoose, { Schema, model } from "mongoose";

export interface AiFeature {
  label: string;
  confidence: number;
}

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
  userEstimate?: number | null;
  status: string; // Reported | Verified | Funding | InProgress | Done
  createdAt: string;
  /** Org role — presentation fields (additive, optional). */
  title?: string;
  category?: string;
  emoji?: string;
  gradient?: string;
  area?: string;
  citizenName?: string;
  citizenAvatar?: string;
  urgency?: "High" | "Medium" | "Low";
  aiFeatures?: AiFeature[];
  /** AI pre-screening verdict (org report queue). */
  aiPrescreen?: {
    is_valid: boolean;
    is_duplicate: boolean;
    flag_reason: string | null;
  };
  /** Org review state: pending | approved | rejected. */
  reviewStatus?: string;
  municipalNote?: string;
  submittedAt?: string;
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
    userEstimate: { type: Number },
    status: { type: String, default: "Reported" },
    title: { type: String },
    category: { type: String },
    emoji: { type: String },
    gradient: { type: String },
    area: { type: String },
    citizenName: { type: String },
    citizenAvatar: { type: String },
    urgency: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    aiFeatures: [{ label: String, confidence: Number }],
    aiPrescreen: {
      is_valid: Boolean,
      is_duplicate: Boolean,
      flag_reason: { type: String, default: null },
    },
    reviewStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending", index: true },
    municipalNote: { type: String, default: "" },
    submittedAt: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const IssueModel = model<IIssue>("Issue", IssueSchema);
export default IssueModel;