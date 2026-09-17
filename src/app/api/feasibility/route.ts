import { callFeasibilityModel } from "../../../../lib/ai/client";
import { enforceTagsAndBuildSources } from "../../../../lib/ai/enforce-tags";
import { getGroundingRows } from "../../../../lib/ai/mock-grounding";
import { buildUserMessage, inferSector } from "../../../../lib/ai/prompt";
import {
  FeasibilityErrorSchema,
  FeasibilityRequestSchema,
  FeasibilityResponseSchema,
  type FeasibilityError,
  type FeasibilityResponse,
  type Tagged,
} from "../../../../lib/ai/types";

function errorResponse(error: FeasibilityError["error"], status: number): Response {
  const body: FeasibilityError = FeasibilityErrorSchema.parse({ ok: false, error });
  return Response.json(body, { status });
}

function userInputTag<T>(value: T): Tagged<T> {
  return {
    value,
    tag: "user_input",
    source: null,
    source_year: null,
    grounding_ids: [],
  };
}

export async function POST(request: Request): Promise<Response> {
  let bodyJson: unknown;
  try {
    bodyJson = await request.json();
  } catch {
    return errorResponse(
      {
        code: "INVALID_INPUT",
        message: "Request body must be valid JSON.",
        retryable: false,
      },
      400
    );
  }

  const parsedRequest = FeasibilityRequestSchema.safeParse(bodyJson);
  if (!parsedRequest.success) {
    const message = parsedRequest.error.issues
      .map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("; ");
    return errorResponse(
      {
        code: "INVALID_INPUT",
        message: message || "Invalid request body.",
        retryable: false,
      },
      400
    );
  }

  const { location, businessCategory, marginCapital, mode, current_revenue_inr, monthly_expenses_inr } =
    parsedRequest.data;

  const sector = inferSector(businessCategory);

  let rows;
  try {
    rows = getGroundingRows(location, sector ?? undefined);
  } catch {
    return errorResponse(
      {
        code: "GROUNDING_QUERY_FAILED",
        message: "Could not retrieve grounding data for this location.",
        retryable: true,
      },
      502
    );
  }

  const userMessage = buildUserMessage({
    location,
    businessCategory,
    marginCapital,
    mode,
    current_revenue_inr,
    monthly_expenses_inr,
    grounding_rows: rows,
  });

  const modelResult = await callFeasibilityModel(userMessage);
  if (!modelResult.ok) {
    return errorResponse(modelResult.error, 502);
  }

  const { enforced, sources, groundingRowsCited } = enforceTagsAndBuildSources(
    modelResult.data,
    rows
  );

  const inputs: FeasibilityResponse["inputs"] = {
    location: userInputTag(location),
    business_category: userInputTag(businessCategory),
    margin_capital_inr: userInputTag(marginCapital),
  };
  if (current_revenue_inr !== undefined) {
    inputs.current_revenue_inr = userInputTag(current_revenue_inr);
  }
  if (monthly_expenses_inr !== undefined) {
    inputs.monthly_expenses_inr = userInputTag(monthly_expenses_inr);
  }

  const candidate = {
    ok: true as const,
    meta: {
      location,
      business_category: businessCategory,
      sector_inferred: sector,
      mode,
      grounding_rows_supplied: rows.length,
      grounding_rows_cited: groundingRowsCited,
      model: modelResult.modelUsed,
      generated_at: new Date().toISOString(),
    },
    inputs,
    ...enforced,
    sources,
  };

  const validated = FeasibilityResponseSchema.safeParse(candidate);
  if (!validated.success) {
    return errorResponse(
      {
        code: "AI_PARSE_FAILED",
        message: "Internal error assembling the feasibility response.",
        retryable: false,
      },
      502
    );
  }

  return Response.json(validated.data, { status: 200 });
}
