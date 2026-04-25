export interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
}

export interface ChatMessage {
  _id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface ChatSession {
  _id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SimulatorScenario {
  _id: string;
  userId: string;
  name: string;
  initialAmount: number;
  monthlyContribution: number;
  annualReturnRate: number;
  years: number;
  result: ProjectionPoint[];
  createdAt: Date;
}

export interface ProjectionPoint {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
}

export interface RoastHistory {
  _id: string;
  userId: string;
  fileName: string;
  summary: string;
  roastText: string;
  score: number;
  createdAt: Date;
}

export interface StockPrediction {
  ticker: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  analysis: string;
  timeframe: string;
}
