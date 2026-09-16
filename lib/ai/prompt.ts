import type { GroundingRow } from "./mock-grounding";

// SYSTEM_PROMPT and buildUserMessage produce the two halves of the request
// sent to callFeasibilityModel (lib/ai/client.ts). The model's reply is
// validated against FeasibilityModelOutputSchema (lib/ai/types.ts) and then
// passed through enforceTagsAndBuildSources (lib/ai/enforce-tags.ts) before
// it becomes part of a FeasibilityResponse.

export const SYSTEM_PROMPT = `You are a business feasibility analyst producing a structured JSON report for a small business owner or aspiring entrepreneur in India. You will be given the user's business category, location, available capital, and growth stage (start or scale — scale-stage businesses may also include current revenue and expenses), along with zero or more "grounding rows" of verified local statistics.

You must follow these constraints exactly. They are hard requirements, not suggestions:

1. TAGGING DISCIPLINE — CITATIONS ONLY FROM SUPPLIED ROWS
   You may only mark a field's "tag" as "verified" if you directly cite one or more grounding row ids that were supplied to you in the user message, listed in that field's "grounding_ids" array. If you cannot point to a specific supplied row backing a value, the tag must be "estimate". No exceptions, and no "this is commonly known" reasoning as a substitute for a citation.

2. NEVER FABRICATE VERIFIED STATISTICS
   Never generate a population figure, income figure, market size, price, or any other statistic from your own general knowledge and present it as verified. General reasoning and plausible estimates ARE allowed, but must always be tagged "estimate" and must never be dressed up with false specificity. For example, do not invent "₹4,200 average monthly income" — instead say something like "likely modest, comparable to other rural artisan households" and tag it "estimate".

3. EVERY LEAF FIELD MUST BE TAGGED
   Every single leaf value in the response must be wrapped in the tagged format ({ value, tag, source, source_year, grounding_ids }) — there are no untagged or freely-worded fields anywhere in the output.

4. OUTPUT IS JSON ONLY
   Output must be the JSON object only — no prose before or after it, no markdown code fences, no explanation outside the JSON itself. The "rationale" field inside verdict_input is the only place for explanatory text, and it stays inside the JSON as a tagged string.

5. SECTOR INFERENCE
   sector_inferred is your best guess at the business's sector, matching the sector values used in the grounding rows (e.g. "handicrafts", "sericulture", "agriculture"), or null if it is unclear.

6. ALWAYS PRODUCE A COMPLETE RESPONSE, EVEN WITH ZERO GROUNDING ROWS
   If zero grounding rows are supplied, you must still produce a complete response — every data-bearing field becomes "estimate". Do not refuse, do not ask for more data, and do not return partial output.`;

export interface BuildUserMessageInput {
  location: string;
  businessCategory: string;
  marginCapital: number;
  mode: "start" | "scale";
  current_revenue_inr?: number;
  monthly_expenses_inr?: number;
  grounding_rows: GroundingRow[];
}

export function buildUserMessage(input: BuildUserMessageInput): string {
  const {
    location,
    businessCategory,
    marginCapital,
    mode,
    current_revenue_inr,
    monthly_expenses_inr,
    grounding_rows,
  } = input;

  const groundingSection =
    grounding_rows.length === 0
      ? "No verified grounding data available for this location."
      : grounding_rows
          .map((row) =>
            [
              `- id: ${row.id}`,
              `  sector: ${row.sector}`,
              `  stat_name: ${row.stat_name}`,
              `  stat_value: ${row.stat_value}`,
              `  unit: ${row.unit ?? "null"}`,
              `  source: ${row.source}`,
              `  source_year: ${row.source_year}`,
            ].join("\n")
          )
          .join("\n");

  const inputLines = [
    `location: ${location}`,
    `businessCategory: ${businessCategory}`,
    `marginCapital: ${marginCapital}`,
    `mode: ${mode}`,
  ];
  if (current_revenue_inr !== undefined) {
    inputLines.push(`current_revenue_inr: ${current_revenue_inr}`);
  }
  if (monthly_expenses_inr !== undefined) {
    inputLines.push(`monthly_expenses_inr: ${monthly_expenses_inr}`);
  }

  return [
    "AVAILABLE GROUNDING DATA",
    "(Each row is uniquely identified by its id. You may only tag a field \"verified\" by citing one or more of these ids in that field's grounding_ids array.)",
    groundingSection,
    "",
    "USER INPUTS",
    inputLines.join("\n"),
    "",
    "INSTRUCTIONS",
    "Output valid JSON only, matching the required schema exactly. The JSON must contain exactly these top-level fields: verdict_input, local_demand, competitors, customer_segments, suggested_pricing, opportunity_areas, risks, swot (with strengths and weaknesses arrays). Do NOT include meta, inputs, or sources — those are added by the server afterward, not by you. Every leaf field must be tagged. Cite only the grounding row ids listed above; never invent an id.",
  ].join("\n");
}

const SECTOR_KEYWORDS: Array<{ sector: string; keywords: string[] }> = [
  { sector: "handicrafts", keywords: ["toy", "wood", "lacquer", "handicraft", "craft"] },
  { sector: "sericulture", keywords: ["silk", "cocoon", "mulberry", "sericulture"] },
  { sector: "agriculture", keywords: ["farm", "crop", "agriculture", "agri"] },
];

export function inferSector(businessCategory: string): string | null {
  const lower = businessCategory.toLowerCase();

  for (const { sector, keywords } of SECTOR_KEYWORDS) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      return sector;
    }
  }

  return null;
}
