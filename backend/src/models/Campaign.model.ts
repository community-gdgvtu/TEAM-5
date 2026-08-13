import mongoose, { Schema, model } from "mongoose";

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
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const CampaignModel = model<ICampaign>("Campaign", CampaignSchema);
export default CampaignModel;