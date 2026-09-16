import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// ---------------------------------------------------------------------------
// Tagged value wrapper
// ---------------------------------------------------------------------------

export const TagSchema = z.enum(["verified", "estimate", "user_input"]);
export type Tag = z.infer<typeof TagSchema>;

export function TaggedSchema<T extends z.ZodTypeAny>(valueSchema: T) {
  return z.object({
    value: valueSchema,
    tag: TagSchema,
    source: z.string().nullable(),
    source_year: z.number().nullable(),
    grounding_ids: z.array(z.string()),
  });
}

export type Tagged<T> = {
  value: T;
  tag: Tag;
  source: string | null;
  source_year: number | null;
  grounding_ids: string[];
};

// ---------------------------------------------------------------------------
// Shared leaf schemas
// ---------------------------------------------------------------------------

const ModeSchema = z.enum(["start", "scale"]);
const RecommendationSchema = z.enum(["proceed", "review", "high_risk"]);
const IntensitySchema = z.enum(["low", "medium", "high"]);
const SegmentPrioritySchema = z.enum(["primary", "secondary"]);
const SeveritySchema = z.enum(["low", "medium", "high"]);

// ---------------------------------------------------------------------------
// FeasibilityResponse
// ---------------------------------------------------------------------------

export const FeasibilityResponseSchema = z.object({
  ok: z.literal(true),

  meta: z.object({
    location: z.string(),
    business_idea: z.string(),
    sector_inferred: z.string().nullable(),
    mode: ModeSchema,
    grounding_rows_supplied: z.number(),
    grounding_rows_cited: z.number(),
    model: z.string(),
    generated_at: z.string(), // ISO timestamp
  }),

  inputs: z.object({
    location: TaggedSchema(z.string()),
    business_idea: TaggedSchema(z.string()),
    capital_inr: TaggedSchema(z.number()),
    current_revenue_inr: TaggedSchema(z.number()).optional(), // scale mode only
    monthly_expenses_inr: TaggedSchema(z.number()).optional(), // scale mode only
  }),

  verdict_input: z.object({
    market_score: TaggedSchema(z.number()), // 0-100
    competition_score: TaggedSchema(z.number()), // 0-100
    opportunity_score: TaggedSchema(z.number()), // 0-100
    overall_score: TaggedSchema(z.number()), // 0-100
    recommendation: TaggedSchema(RecommendationSchema),
    rationale: TaggedSchema(z.string()),
  }),

  local_demand: z.object({
    summary: TaggedSchema(z.string()),
    indicators: z.array(TaggedSchema(z.string())),
  }),

  competitors: z.object({
    summary: TaggedSchema(z.string()),
    intensity: TaggedSchema(IntensitySchema),
    players: z.array(TaggedSchema(z.string())),
  }),

  customer_segments: z.array(
    TaggedSchema(
      z.object({
        name: z.string(),
        description: z.string(),
        priority: SegmentPrioritySchema,
      })
    )
  ),

  suggested_pricing: z.object({
    summary: TaggedSchema(z.string()),
    items: z.array(
      TaggedSchema(
        z.object({
          product: z.string(),
          price_min_inr: z.number(),
          price_max_inr: z.number(),
          basis: z.string(),
        })
      )
    ),
  }),

  opportunity_areas: z.array(TaggedSchema(z.string())),

  risks: z.array(
    TaggedSchema(
      z.object({
        risk: z.string(),
        severity: SeveritySchema,
        mitigation: z.string(),
      })
    )
  ),

  sources: z.array(
    z.object({
      id: z.string(),
      sector: z.string(),
      stat_name: z.string(),
      stat_value: z.string(),
      unit: z.string().nullable(),
      source: z.string(),
      source_url: z.string().nullable(),
      source_year: z.number(),
    })
  ),
});

export type FeasibilityResponse = z.infer<typeof FeasibilityResponseSchema>;

// ---------------------------------------------------------------------------
// FeasibilityError
// ---------------------------------------------------------------------------

export const FeasibilityErrorSchema = z.object({
  ok: z.literal(false),
  error: z.object({
    code: z.enum([
      "INVALID_INPUT",
      "AI_PARSE_FAILED",
      "AI_UNAVAILABLE",
      "GROUNDING_QUERY_FAILED",
    ]),
    message: z.string(),
    retryable: z.boolean(),
  }),
});

export type FeasibilityError = z.infer<typeof FeasibilityErrorSchema>;

// ---------------------------------------------------------------------------
// Result union
// ---------------------------------------------------------------------------

export const FeasibilityResultSchema = z.union([
  FeasibilityResponseSchema,
  FeasibilityErrorSchema,
]);

export type FeasibilityResult = z.infer<typeof FeasibilityResultSchema>;

// ---------------------------------------------------------------------------
// JSON Schema (for Claude's output_config.format)
// ---------------------------------------------------------------------------

export const feasibilityJsonSchema = zodToJsonSchema(FeasibilityResponseSchema, {
  $refStrategy: "none",
}) as Record<string, unknown>;
