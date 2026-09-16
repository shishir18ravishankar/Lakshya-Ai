import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "./prompt";
import {
  FeasibilityModelOutputSchema,
  feasibilityModelOutputJsonSchema,
  type FeasibilityModelOutput,
} from "./types";

const MODEL = "claude-sonnet-5";
const MAX_TOKENS = 8192;

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

// A 4xx from the API (bad request, auth, permission, not found, unprocessable)
// will fail identically on retry, so it's treated as terminal. 429/5xx/network
// failures are transient and get the single retry.
function isNonRetryableClientError(error: unknown): boolean {
  if (error instanceof Anthropic.APIConnectionError) return false;
  if (error instanceof Anthropic.RateLimitError) return false;
  if (error instanceof Anthropic.InternalServerError) return false;
  return (
    error instanceof Anthropic.APIError &&
    typeof error.status === "number" &&
    error.status >= 400 &&
    error.status < 500
  );
}

export async function callFeasibilityModel(
  userMessage: string
): Promise<CallFeasibilityModelResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
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

  const client = new Anthropic({ apiKey });

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
    let response: Anthropic.Message;

    try {
      response = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMessage }],
        output_config: {
          format: {
            type: "json_schema",
            schema: feasibilityModelOutputJsonSchema,
          },
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

    let text: string | undefined;
    for (const block of response.content) {
      if (block.type === "text") {
        text = block.text;
        break;
      }
    }

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

    return { ok: true, data: parsed.data, modelUsed: response.model };
  }

  return lastError;
}
