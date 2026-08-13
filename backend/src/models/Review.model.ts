import mongoose, { Schema, model } from "mongoose";

export interface IReview {
  id: string;
  jobId: string;
  reviewerId: string; // citizen or org user id
  revieweeId: string; // worker user id
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

const ReviewSchema: Schema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    jobId: { type: String, required: true, index: true },
    reviewerId: { type: String, required: true },
    revieweeId: { type: String, required: true, index: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const ReviewModel = model<IReview>("Review", ReviewSchema);
export default ReviewModel;