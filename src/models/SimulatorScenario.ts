import mongoose, { Schema, Document } from "mongoose";
import type { ProjectionPoint } from "@/types";

export interface ISimulatorScenario extends Document {
  userId: string;
  name: string;
  initialAmount: number;
  monthlyContribution: number;
  annualReturnRate: number;
  years: number;
  result: ProjectionPoint[];
  createdAt: Date;
}

const SimulatorScenarioSchema = new Schema<ISimulatorScenario>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    initialAmount: { type: Number, required: true },
    monthlyContribution: { type: Number, default: 0 },
    annualReturnRate: { type: Number, required: true },
    years: { type: Number, required: true },
    result: [
      {
        year: Number,
        balance: Number,
        contributions: Number,
        interest: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.SimulatorScenario ||
  mongoose.model<ISimulatorScenario>("SimulatorScenario", SimulatorScenarioSchema);
