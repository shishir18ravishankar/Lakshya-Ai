import { ApiError, GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT } from "./prompt";
import {
  FeasibilityModelOutputSchema,
  feasibilityModelOutputJsonSchema,
  type FeasibilityModelOutput,
} from "./types";

const MODEL = "gemini-3.7-flash";
const MAX_OUTPUT_TOKENS = 8192;

export type CallFeasibilityModelResult =
  | { ok: true; data: FeasibilityModelOutput; modelUsed: string }
  | {
      ok: false;
      error: {
        code: "AI_UNAVAILABLE" | "AI_PARSE_FAILED";
        message: string;
        retryable: boolean;
      };
    };

// A 4xx from the API (bad request, auth, permission, not found, ...) will
// fail identically on retry, so it's treated as terminal. 429 is rate
// limiting rather than a malformed request, so it stays in the
// transient/retryable bucket along with 5xx and network failures.
function isNonRetryableClientError(error: unknown): boolean {
  if (!(error instanceof ApiError) || typeof error.status !== "number") {
    return false;
  }
  if (error.status === 429) return false;
  return error.status >= 400 && error.status < 500;
}

export async function callFeasibilityModel(
  userMessage: string
): Promise<CallFeasibilityModelResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error: {
        code: "AI_UNAVAILABLE",
        message: "The AI service is not configured.",
        retryable: false,
      },
    };
  }

  const client = new GoogleGenAI({ apiKey });

  let lastError: CallFeasibilityModelResult & { ok: false } = {
    ok: false,
    error: {
      code: "AI_UNAVAILABLE",
      message: "The AI service is temporarily unavailable.",
      retryable: true,
    },
  };

  // At most one retry total, across both transient API failures and
  // validation failures — not one retry budget per failure type.
  for (let attempt = 0; attempt < 2; attempt++) {
    let response: GenerateContentResponse;

    try {
      response = await client.models.generateContent({
        model: MODEL,
        contents: userMessage,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          responseMimeType: "application/json",
          responseJsonSchema: feasibilityModelOutputJsonSchema,
        },
      });
    } catch (error) {
      if (isNonRetryableClientError(error)) {
        return {
          ok: false,
          error: {
            code: "AI_UNAVAILABLE",
            message: "The AI service rejected the request.",
            retryable: false,
          },
        };
      }

      lastError = {
        ok: false,
        error: {
          code: "AI_UNAVAILABLE",
          message: "The AI service is temporarily unavailable.",
          retryable: true,
        },
      };
      continue;
    }

    const text = response.text;

    if (text === undefined) {
      lastError = {
        ok: false,
        error: {
          code: "AI_PARSE_FAILED",
          message: "The AI response did not contain any text.",
          retryable: true,
        },
      };
      continue;
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(text);
    } catch {
      lastError = {
        ok: false,
        error: {
          code: "AI_PARSE_FAILED",
          message: "The AI response was not valid JSON.",
          retryable: true,
        },
      };
      continue;
    }

    const parsed = FeasibilityModelOutputSchema.safeParse(parsedJson);
    if (!parsed.success) {
      lastError = {
        ok: false,
        error: {
          code: "AI_PARSE_FAILED",
          message: "The AI response did not match the expected schema.",
          retryable: true,
        },
      };
      continue;
    }

    return { ok: true, data: parsed.data, modelUsed: MODEL };
  }

  return lastError;
}
