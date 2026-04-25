import mongoose from "mongoose";

const StatementSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    fileName: { type: String, default: "statement.pdf" },
    period: String,
    currency: { type: String, default: "USD" },
    totalCredits: { type: Number, default: 0 },
    totalDebits: { type: Number, default: 0 },
    netBalance: { type: Number, default: 0 },
    savingsRate: { type: Number, default: 0 },
    categories: [{ name: String, amount: Number, count: Number, emoji: String }],
    topMerchants: [{ name: String, amount: Number, count: Number }],
    biggestExpense: { description: String, amount: Number, date: String },
    insights: [String],
    warningFlags: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Statement || mongoose.model("Statement", StatementSchema);
