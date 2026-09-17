import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

/**
 * Standalone chat endpoint for the cosmetic chat widget only. Deliberately
 * has zero imports from lib/ai/ or the feasibility/verdict routes — plain
 * text in, plain text out, no structured schema, no shared logic with the
 * feasibility engine. If this breaks, nothing else can break with it.
 */

const GROQ_MODEL = "openai/gpt-oss-20b";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const GEMINI_MODEL = "gemini-3.7-flash";
const REQUEST_TIMEOUT_MS = 15_000;

const SYSTEM_PROMPT =
  "You are Lakshya AI's assistant, an advisor for rural Indian micro-entrepreneurs on business feasibility and government financing schemes. Answer briefly and helpfully in 2-3 sentences.";

const FALLBACK_REPLY = "I'm having trouble connecting right now — please try again in a moment.";

async function callGroq(message: string): Promise<string | null> {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) return null;

  try {
    const client = new OpenAI({ apiKey, baseURL: GROQ_BASE_URL });
    const completion = await client.chat.completions.create(
      {
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        max_tokens: 300,
      },
      { maxRetries: 0, timeout: REQUEST_TIMEOUT_MS }
    );

    const text = completion.choices[0]?.message?.content?.trim();
    return text ? text : null;
  } catch {
    return null;
  }
}

async function callGemini(message: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const client = new GoogleGenAI({ apiKey });
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: message,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 300,
        httpOptions: { timeout: REQUEST_TIMEOUT_MS },
      },
    });

    const text = response.text?.trim();
    return text ? text : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ reply: FALLBACK_REPLY }, { status: 200 });
  }

  const message =
    body && typeof body === "object" && "message" in body && typeof (body as { message: unknown }).message === "string"
      ? (body as { message: string }).message.trim()
      : "";

  if (!message) {
    return Response.json({ reply: FALLBACK_REPLY }, { status: 200 });
  }

  // Groq first (fast, cheap), Gemini as fallback — order intentionally
  // reversed from the feasibility engine's Gemini-primary setup, since this
  // widget wants to exercise the Groq path per the original request.
  const groqReply = await callGroq(message);
  if (groqReply) {
    return Response.json({ reply: groqReply, provider: "groq" }, { status: 200 });
  }

  const geminiReply = await callGemini(message);
  if (geminiReply) {
    return Response.json({ reply: geminiReply, provider: "gemini" }, { status: 200 });
  }

  return Response.json({ reply: FALLBACK_REPLY }, { status: 200 });
}
