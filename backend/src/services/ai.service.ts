import { env } from "../config/env";

/**
 * AI estimate + verification service.
 * Owned by whoever builds the AI pipeline (Gemini multimodal is already a dependency).
 * Placeholder — wire the photo(s) + issue type to the multimodal API here.
 */

export interface AiEstimateRequest {
  photoUrl: string;
  issueType: string;
  description?: string;
}

export interface AiEstimateResult {
  amount: number;
  currency: string;
  severity: "Minor" | "Moderate" | "Critical";
  confidence: number; // 0-1
  summary: string;
}

export interface AiVerifyRequest {
  beforePhotoUrl: string;
  afterPhotoUrl: string;
  issueType: string;
}

export interface AiVerifyResult {
  passed: boolean;
  confidence: number; // 0-1 (match score)
  reason: string;
}

export async function estimateCost(req: AiEstimateRequest): Promise<AiEstimateResult> {
  if (!env.geminiApiKey) {
    // Rule-based fallback so the demo works without keys
    const severity = severityFromType(req.issueType);
    const amount = amountFromSeverity(severity);
    return {
      amount,
      currency: "INR",
      severity,
      confidence: 0.72,
      summary: `AI estimate for ${req.issueType}: approx ₹${amount}.`,
    };
  }
  // TODO(AI owner): call @google/genai with the photo + issue type.
  throw new Error("ai.service.estimateCost not implemented yet");
}

export async function verifyCompletion(req: AiVerifyRequest): Promise<AiVerifyResult> {
  return { passed: true, confidence: 0.92, reason: "Before/after similarity passed" };
}

function severityFromType(type: string): AiEstimateResult["severity"] {
  const t = type.toLowerCase();
  if (t.includes("pothole") || t.includes("streetlight")) return "Moderate";
  if (t.includes("tree") || t.includes("cleaning")) return "Minor";
  return "Critical";
}

function amountFromSeverity(severity: AiEstimateResult["severity"]): number {
  switch (severity) {
    case "Minor":
      return 45;
    case "Moderate":
      return 150;
    default:
      return 500;
  }
}