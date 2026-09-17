import { ApiError, GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import OpenAI from "openai";
import type { ZodType } from "zod";
import { SYSTEM_PROMPT } from "./prompt";
import {
  FeasibilityModelOutputSchema,
  feasibilityModelOutputJsonSchema,
  GroqCallASchema,
  GroqCallBSchema,
  groqCallAJsonSchema,
  groqCallBJsonSchema,
  type FeasibilityModelOutput,
} from "./types";

const GEMINI_MODEL = "gemini-3.7-flash";
// GROK_API_KEY is actually a Groq (console.groq.com) key, not xAI's Grok —
// different company, different API. strict-mode structured outputs are only
// supported on a few Groq models (GPT-OSS 20B/120B, Qwen 3); both gpt-oss-120b
// and gpt-oss-20b were tested live against this schema and unreliably produced
// invalid/incomplete JSON (missing required fields, malformed syntax) — a
// known limitation to revisit, not assumed fixed by this model choice.
const GROQ_MODEL = "openai/gpt-oss-20b";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const MAX_OUTPUT_TOKENS = 8192;
const REQUEST_TIMEOUT_MS = 30_000;

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

// ---------------------------------------------------------------------------
// Gemini — primary provider
// ---------------------------------------------------------------------------

// A 4xx from the API (bad request, auth, permission, not found, ...) will
// fail identically on retry, so it's treated as terminal. 429 is rate
// limiting rather than a malformed request, so it stays in the
// transient/retryable bucket along with 5xx and network failures.
function isNonRetryableGeminiError(error: unknown): boolean {
  if (!(error instanceof ApiError) || typeof error.status !== "number") {
    return false;
  }
  if (error.status === 429) return false;
  return error.status >= 400 && error.status < 500;
}

async function callGemini(userMessage: string): Promise<CallFeasibilityModelResult> {
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
        model: GEMINI_MODEL,
        contents: userMessage,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          responseMimeType: "application/json",
          responseJsonSchema: feasibilityModelOutputJsonSchema,
          httpOptions: { timeout: REQUEST_TIMEOUT_MS },
        },
      });
    } catch (error) {
      // A timed-out request throws a DOMException, not an ApiError, so it
      // falls through to the transient/retryable branch below automatically.
      if (isNonRetryableGeminiError(error)) {
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

    return { ok: true, data: parsed.data, modelUsed: GEMINI_MODEL };
  }

  return lastError;
}

// ---------------------------------------------------------------------------
// Groq — fallback provider, attempted once if Gemini didn't return ok:true.
// Groq's API is OpenAI-compatible, so it's reached through the openai SDK
// pointed at Groq's base URL.
//
// The full 8-field FeasibilityModelOutputSchema is too large for
// gpt-oss-20b's structured-output decoding to reliably satisfy in one shot —
// observed live failures include missing required fields and outright
// malformed top-level structure (a JSON array instead of an object, with key
// names as loose string fragments). This is a genuine model capability
// limit on this schema's size, not a config issue, so the single call is
// split into two smaller sequential calls, each against half the schema.
// ---------------------------------------------------------------------------

function isNonRetryableGroqError(error: unknown): boolean {
  if (!(error instanceof OpenAI.APIError) || typeof error.status !== "number") {
    return false;
  }
  if (error.status === 429) return false;
  return error.status >= 400 && error.status < 500;
}

const GROQ_CALL_A_FIELDS = [
  "verdict_input",
  "local_demand",
  "competitors",
  "customer_segments",
] as const;
const GROQ_CALL_B_FIELDS = ["suggested_pricing", "opportunity_areas", "risks", "swot"] as const;

// The caller-supplied userMessage already lists the full 8-field output
// contract (see buildUserMessage in ./prompt); this override narrows that
// down to the subset each split call is actually responsible for, without
// touching the shared SYSTEM_PROMPT or buildUserMessage itself.
function scopeUserMessageToFields(
  userMessage: string,
  fields: readonly string[],
  extraLine?: string
): string {
  const lines = [
    userMessage,
    "",
    "SCOPE OVERRIDE FOR THIS RESPONSE",
    `Disregard any other top-level field list mentioned above. For this response, output valid JSON containing ONLY these top-level fields, and no others: ${fields.join(", ")}.`,
  ];
  if (extraLine) lines.push(extraLine);
  return lines.join("\n");
}

// Observed live: Groq's model consistently omits competitors.summary while
// correctly including competitors.intensity and competitors.players — a
// call-A-specific omission, so the reminder is scoped to call A only.
const COMPETITORS_SUMMARY_REMINDER =
  "The competitors object requires all three fields: summary, intensity, and players. Do not omit summary.";

type GroqSubcallResult<T> =
  | { ok: true; data: T }
  | { ok: false; result: CallFeasibilityModelResult & { ok: false } };

async function callGroqSubset<T>(
  client: OpenAI,
  userMessage: string,
  schemaName: string,
  jsonSchema: Record<string, unknown>,
  zodSchema: ZodType<T>
): Promise<GroqSubcallResult<T>> {
  let completion: OpenAI.Chat.Completions.ChatCompletion;
  try {
    // maxRetries: 0 — this is the fallback's single attempt per sub-call; the
    // OpenAI SDK otherwise retries transient failures internally by default.
    completion = await client.chat.completions.create(
      {
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        max_tokens: MAX_OUTPUT_TOKENS,
        response_format: {
          type: "json_schema",
          json_schema: {
            name: schemaName,
            schema: jsonSchema,
            strict: true,
          },
        },
      },
      { maxRetries: 0, timeout: REQUEST_TIMEOUT_MS }
    );
  } catch (error) {
    if (isNonRetryableGroqError(error)) {
      return {
        ok: false,
        result: {
          ok: false,
          error: {
            code: "AI_UNAVAILABLE",
            message: "The AI fallback service rejected the request.",
            retryable: false,
          },
        },
      };
    }

    return {
      ok: false,
      result: {
        ok: false,
        error: {
          code: "AI_UNAVAILABLE",
          message: "The AI fallback service is temporarily unavailable.",
          retryable: true,
        },
      },
    };
  }

  const text = completion.choices[0]?.message?.content;

  if (text === undefined || text === null) {
    return {
      ok: false,
      result: {
        ok: false,
        error: {
          code: "AI_PARSE_FAILED",
          message: "The AI fallback response did not contain any text.",
          retryable: true,
        },
      },
    };
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(text);
  } catch {
    return {
      ok: false,
      result: {
        ok: false,
        error: {
          code: "AI_PARSE_FAILED",
          message: "The AI fallback response was not valid JSON.",
          retryable: true,
        },
      },
    };
  }

  const parsed = zodSchema.safeParse(parsedJson);
  if (!parsed.success) {
    return {
      ok: false,
      result: {
        ok: false,
        error: {
          code: "AI_PARSE_FAILED",
          message: "The AI fallback response did not match the expected schema.",
          retryable: true,
        },
      },
    };
  }

  return { ok: true, data: parsed.data };
}

async function callGroq(userMessage: string): Promise<CallFeasibilityModelResult> {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error: {
        code: "AI_UNAVAILABLE",
        message: "The AI fallback service is not configured.",
        retryable: false,
      },
    };
  }

  const client = new OpenAI({ apiKey, baseURL: GROQ_BASE_URL });

  const callA = await callGroqSubset(
    client,
    scopeUserMessageToFields(userMessage, GROQ_CALL_A_FIELDS, COMPETITORS_SUMMARY_REMINDER),
    "feasibility_model_output_part_a",
    groqCallAJsonSchema,
    GroqCallASchema
  );
  if (!callA.ok) return callA.result;

  const callB = await callGroqSubset(
    client,
    scopeUserMessageToFields(userMessage, GROQ_CALL_B_FIELDS),
    "feasibility_model_output_part_b",
    groqCallBJsonSchema,
    GroqCallBSchema
  );
  if (!callB.ok) return callB.result;

  const merged = { ...callA.data, ...callB.data };
  const validated = FeasibilityModelOutputSchema.safeParse(merged);
  if (!validated.success) {
    return {
      ok: false,
      error: {
        code: "AI_PARSE_FAILED",
        message: "The AI fallback response did not match the expected schema.",
        retryable: true,
      },
    };
  }

  return { ok: true, data: validated.data, modelUsed: GROQ_MODEL };
}

// ---------------------------------------------------------------------------
// Public entry point — callers never know which provider actually answered.
// ---------------------------------------------------------------------------

export async function callFeasibilityModel(
  userMessage: string
): Promise<CallFeasibilityModelResult> {
  const geminiResult = await callGemini(userMessage);
  if (geminiResult.ok) {
    return geminiResult;
  }

  return callGroq(userMessage);
}
