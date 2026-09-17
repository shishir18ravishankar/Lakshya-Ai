import { POST as feasibilityPOST } from "../feasibility/route";
import { calculateFinancialStructure } from "../../../../lib/finance/calculator";
import { buildVerdictResponse } from "@/lib/verdict-response";
import type { FeasibilityResponse, FeasibilityError } from "../../../../lib/ai/types";

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = (body ?? {}) as Record<string, unknown>;
  const location = typeof parsed.location === "string" ? parsed.location.trim() : "";
  const businessCategory = typeof parsed.businessCategory === "string" ? parsed.businessCategory.trim() : "";
  const marginCapital = Number(parsed.marginCapital);

  if (!location) {
    return Response.json({ error: "Location is required." }, { status: 400 });
  }
  if (!businessCategory) {
    return Response.json({ error: "Business category is required." }, { status: 400 });
  }
  if (!Number.isFinite(marginCapital) || marginCapital <= 0) {
    return Response.json({ error: "A valid positive margin capital is required." }, { status: 400 });
  }

  // The real intake form (VerdictInputPayload) never collects a start/scale
  // distinction, so mode defaults to "start" here.
  const feasibilityRequest = new Request("http://internal/api/feasibility", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ location, businessCategory, marginCapital, mode: "start" }),
  });

  const feasibilityResponse = await feasibilityPOST(feasibilityRequest);
  const feasibilityJson = (await feasibilityResponse.json()) as FeasibilityResponse | FeasibilityError;

  if (!feasibilityJson.ok) {
    return Response.json({ error: feasibilityJson.error.message }, { status: feasibilityResponse.status });
  }

  const financial = calculateFinancialStructure({ mode: "start", marginCapital });
  const responseBody = buildVerdictResponse(feasibilityJson, financial);

  return Response.json(responseBody, { status: 200 });
}
