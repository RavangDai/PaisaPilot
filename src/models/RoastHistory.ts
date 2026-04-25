import mongoose, { Schema, Document } from "mongoose";

export interface IRoastHistory extends Document {
  userId: string;
  fileName: string;
  summary: string;
  roastText: string;
  score: number;
  createdAt: Date;
}

const RoastHistorySchema = new Schema<IRoastHistory>(
  {
    userId: { type: String, required: true, index: true },
    fileName: { type: String, required: true },
    summary: { type: String, required: true },
    roastText: { type: String, required: true },
    score: { type: Number, min: 0, max: 100, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.RoastHistory || mongoose.model<IRoastHistory>("RoastHistory", RoastHistorySchema);
