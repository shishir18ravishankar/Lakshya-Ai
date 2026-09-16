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
// Analytical section schemas
//
// Each of these is the single source of truth for its section's shape.
// FeasibilityResponseSchema (the full server response) and
// FeasibilityModelOutputSchema (what we ask the model for) both reference
// these same constants, so the two can never drift apart.
// ---------------------------------------------------------------------------

export const VerdictInputSchema = z.object({
  market_score: TaggedSchema(z.number()), // 0-100
  competition_score: TaggedSchema(z.number()), // 0-100
  opportunity_score: TaggedSchema(z.number()), // 0-100
  overall_score: TaggedSchema(z.number()), // 0-100
  recommendation: TaggedSchema(RecommendationSchema),
  rationale: TaggedSchema(z.string()),
});

export const LocalDemandSchema = z.object({
  summary: TaggedSchema(z.string()),
  indicators: z.array(TaggedSchema(z.string())),
});

export const CompetitorsSchema = z.object({
  summary: TaggedSchema(z.string()),
  intensity: TaggedSchema(IntensitySchema),
  players: z.array(TaggedSchema(z.string())),
});

export const CustomerSegmentsSchema = z.array(
  TaggedSchema(
    z.object({
      name: z.string(),
      description: z.string(),
      priority: SegmentPrioritySchema,
    })
  )
);

export const SuggestedPricingSchema = z.object({
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
});

export const OpportunityAreasSchema = z.array(TaggedSchema(z.string()));

export const RisksSchema = z.array(
  TaggedSchema(
    z.object({
      risk: z.string(),
      severity: SeveritySchema,
      mitigation: z.string(),
    })
  )
);

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

  verdict_input: VerdictInputSchema,
  local_demand: LocalDemandSchema,
  competitors: CompetitorsSchema,
  customer_segments: CustomerSegmentsSchema,
  suggested_pricing: SuggestedPricingSchema,
  opportunity_areas: OpportunityAreasSchema,
  risks: RisksSchema,

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
// FeasibilityRequest (incoming POST body)
// ---------------------------------------------------------------------------

export const FeasibilityRequestSchema = z.object({
  location: z.string().min(1),
  business_idea: z.string().min(1),
  capital_inr: z.number().positive(),
  mode: ModeSchema,
  current_revenue_inr: z.number().positive().optional(),
  monthly_expenses_inr: z.number().positive().optional(),
});

export type FeasibilityRequest = z.infer<typeof FeasibilityRequestSchema>;

// ---------------------------------------------------------------------------
// FeasibilityModelOutput — the analytical-only shape we ask the model to
// produce. meta, inputs, and sources are always server-computed and are
// never part of what we ask the model for.
// ---------------------------------------------------------------------------

export const FeasibilityModelOutputSchema = z.object({
  verdict_input: VerdictInputSchema,
  local_demand: LocalDemandSchema,
  competitors: CompetitorsSchema,
  customer_segments: CustomerSegmentsSchema,
  suggested_pricing: SuggestedPricingSchema,
  opportunity_areas: OpportunityAreasSchema,
  risks: RisksSchema,
});

export type FeasibilityModelOutput = z.infer<typeof FeasibilityModelOutputSchema>;

export const feasibilityModelOutputJsonSchema = zodToJsonSchema(FeasibilityModelOutputSchema, {
  $refStrategy: "none",
}) as Record<string, unknown>;

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
