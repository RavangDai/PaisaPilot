import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import type { SafetySetting } from "@google/generative-ai";

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

const FLASH_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

const PRO_MODELS = [
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
];

// Permissive settings for roast mode — allows comedic/satirical content
export const ROAST_SAFETY: SafetySetting[] = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

/** True for 404-style "model unavailable" errors — used to skip to the next fallback model. */
function isModelError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  // Exclude quota/rate-limit errors — those are NOT model availability issues
  if (msg.includes("429") || msg.includes("too many requests") || msg.includes("quota")) {
    return false;
  }
  return (
    msg.includes("not found") ||
    msg.includes("deprecated") ||
    msg.includes("not supported") ||
    msg.includes("404") ||
    msg.includes("invalid model") ||
    msg.includes("models/")
  );
}

/** True for 429 quota/rate-limit errors — try the next model, it may have a separate quota. */
function isQuotaError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return msg.includes("429") || msg.includes("too many requests") || msg.includes("quota");
}

export async function generateText(
  prompt: string,
  model: "pro" | "flash" = "flash",
  safetySettings?: SafetySetting[]
): Promise<string> {
  const client = getClient();
  const candidates = model === "pro" ? PRO_MODELS : FLASH_MODELS;

  let lastError: unknown;
  for (const modelName of candidates) {
    try {
      const m = client.getGenerativeModel({ model: modelName, safetySettings });
      const result = await m.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      lastError = err;
      if (isModelError(err) || isQuotaError(err)) continue;
      throw err;
    }
  }
  if (isQuotaError(lastError)) {
    throw new Error("AI quota exceeded. Please wait a moment and try again.");
  }
  throw lastError ?? new Error("All Gemini models unavailable");
}

export async function generateFromPDF(
  pdfBase64: string,
  prompt: string,
  safetySettings?: SafetySetting[]
): Promise<string> {
  const client = getClient();
  let lastError: unknown;
  for (const modelName of FLASH_MODELS) {
    try {
      const m = client.getGenerativeModel({ model: modelName, safetySettings });
      const result = await m.generateContent([
        { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
        { text: prompt },
      ]);
      return result.response.text();
    } catch (err) {
      lastError = err;
      if (isModelError(err) || isQuotaError(err)) continue;
      throw err;
    }
  }
  if (isQuotaError(lastError)) {
    throw new Error("AI quota exceeded. Please wait a moment and try again.");
  }
  throw lastError ?? new Error("All Gemini models unavailable");
}

export async function generateStream(prompt: string) {
  const client = getClient();
  let lastError: unknown;
  for (const modelName of FLASH_MODELS) {
    try {
      const m = client.getGenerativeModel({ model: modelName });
      const result = await m.generateContentStream(prompt);
      return result.stream;
    } catch (err) {
      lastError = err;
      if (isModelError(err) || isQuotaError(err)) continue;
      throw err;
    }
  }
  if (isQuotaError(lastError)) {
    throw new Error("AI quota exceeded. Please wait a moment and try again.");
  }
  throw lastError ?? new Error("All Gemini stream models unavailable");
}

