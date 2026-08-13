import mongoose, { Schema, model } from "mongoose";

export interface ITransaction {
  id: string;
  payerId: string;
  campaignId: string;
  amount: number;
  currency: string;
  method: string; // upi | card | netbanking
  reference: string; // Razorpay payment id
  status: string; // Pending | Released | Refunded
  createdAt: string;
}

const TransactionSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    payerId: { type: String, required: true, index: true },
    campaignId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    method: { type: String, default: "upi" },
    reference: { type: String },
    status: { type: String, default: "Pending" },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const TransactionModel = model<ITransaction>("Transaction", TransactionSchema);
export default TransactionModel;