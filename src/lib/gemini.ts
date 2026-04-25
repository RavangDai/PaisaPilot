import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiPro = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
export const geminiFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateText(prompt: string, model: "pro" | "flash" = "flash"): Promise<string> {
  const m = model === "pro" ? geminiPro : geminiFlash;
  const result = await m.generateContent(prompt);
  return result.response.text();
}

export async function generateStream(prompt: string) {
  const result = await geminiFlash.generateContentStream(prompt);
  return result.stream;
}
