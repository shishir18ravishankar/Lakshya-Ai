/**
 * Runnable via: npx tsx lib/ai/test-harness.ts
 *
 * PART A is pure/offline and always runs. PART B is a live integration
 * check against the real Gemini API and only runs if GEMINI_API_KEY is
 * set in the environment.
 */

import { callFeasibilityModel } from "./client";
import { enforceTagsAndBuildSources } from "./enforce-tags";
import { getGroundingRows, MOCK_GROUNDING_ROWS, NO_MATCH_LOCATION } from "./mock-grounding";
import { buildUserMessage, inferSector } from "./prompt";
import type { FeasibilityModelOutput, Tag, Tagged } from "./types";

let passCount = 0;
let failCount = 0;

function check(label: string, condition: boolean): void {
  if (condition) {
    passCount++;
    console.log(`  PASS - ${label}`);
  } else {
    failCount++;
    console.log(`  FAIL - ${label}`);
  }
}

function tagged<T>(value: T, tag: Tag, grounding_ids: string[] = []): Tagged<T> {
  return {
    value,
    tag,
    source: tag === "verified" ? "test fixture" : null,
    source_year: tag === "verified" ? 2020 : null,
    grounding_ids,
  };
}

function collectTags(node: unknown, path: string, out: Array<{ path: string; tag: string }>): void {
  if (Array.isArray(node)) {
    node.forEach((item, i) => collectTags(item, `${path}[${i}]`, out));
    return;
  }
  if (node !== null && typeof node === "object") {
    const obj = node as Record<string, unknown>;
    if ("tag" in obj && "value" in obj && "grounding_ids" in obj) {
      out.push({ path, tag: String(obj.tag) });
      return;
    }
    for (const [key, value] of Object.entries(obj)) {
      collectTags(value, path ? `${path}.${key}` : key, out);
    }
  }
}

// ===========================================================================
// PART A — pure, offline, always runs
// ===========================================================================

function runPartA(): void {
  console.log("=== PART A: offline unit tests ===\n");

  console.log("enforceTagsAndBuildSources:");

  const realId = MOCK_GROUNDING_ROWS[0].id;
  const fakeId = "gd_does_not_exist";

  const fakeModelOutput: FeasibilityModelOutput = {
    verdict_input: {
      market_score: tagged(70, "verified", [realId]), // (a) truthfully verified
      competition_score: tagged(50, "estimate"),
      opportunity_score: tagged(60, "estimate"),
      overall_score: tagged(60, "estimate"),
      recommendation: tagged("proceed", "estimate"),
      rationale: tagged("Looks promising based on limited data.", "estimate"),
    },
    local_demand: {
      summary: tagged("Strong artisan demand", "verified", [fakeId]), // (b) fake citation
      indicators: [tagged("High tourist footfall", "estimate")],
    },
    competitors: {
      summary: tagged("Moderate competition", "estimate"),
      intensity: tagged("medium", "estimate"),
      players: [tagged("Local toy makers", "estimate")],
    },
    customer_segments: [
      tagged(
        { name: "Tourists", description: "Visitors buying souvenirs", priority: "primary" },
        "estimate"
      ),
    ],
    suggested_pricing: {
      summary: tagged("Mid-range pricing recommended", "estimate"),
      items: [
        tagged(
          { product: "Wooden toy", price_min_inr: 100, price_max_inr: 500, basis: "Comparable products" },
          "estimate"
        ),
      ],
    },
    opportunity_areas: [tagged("Export potential", "estimate")],
    risks: [
      tagged(
        { risk: "Raw material cost volatility", severity: "medium", mitigation: "Diversify suppliers" },
        "estimate"
      ),
    ],
  };

  const { enforced, sources } = enforceTagsAndBuildSources(fakeModelOutput, MOCK_GROUNDING_ROWS);

  check(
    "field truthfully citing a real id stays verified",
    enforced.verdict_input.market_score.tag === "verified"
  );
  check(
    "field citing a fake id is downgraded to estimate",
    enforced.local_demand.summary.tag === "estimate"
  );
  check(
    "downgraded field has empty grounding_ids",
    enforced.local_demand.summary.grounding_ids.length === 0
  );
  check(
    "fake id never appears in returned sources",
    !sources.some((s) => s.id === fakeId)
  );
  check(
    "real id from the truthful citation appears in sources",
    sources.some((s) => s.id === realId)
  );

  console.log("\ninferSector:");

  const sectorCases: Array<{ idea: string; expected: string | null }> = [
    { idea: "Wooden toy manufacturing unit", expected: "handicrafts" },
    { idea: "Mulberry cultivation and silk cocoon trading", expected: "sericulture" },
    { idea: "Organic vegetable farming on 5 acres", expected: "agriculture" },
    { idea: "Lacquerware handicraft workshop for tourists", expected: "handicrafts" },
    { idea: "Setting up a cloud kitchen for South Indian food", expected: null },
  ];

  for (const { idea, expected } of sectorCases) {
    const actual = inferSector(idea);
    check(`"${idea}" -> ${expected === null ? "null" : `"${expected}"`}`, actual === expected);
  }
}

// ===========================================================================
// PART B — live, only runs if GEMINI_API_KEY is set
// ===========================================================================

async function runLiveScenario(label: string, location: string, sector: string | undefined): Promise<void> {
  console.log(`\n--- ${label} ---`);

  const rows = getGroundingRows(location, sector);
  console.log(`grounding rows supplied: ${rows.length}`);

  const userMessage = buildUserMessage({
    location,
    business_idea: "A small workshop making and selling hand-painted wooden toys",
    capital_inr: 250000,
    mode: "start",
    grounding_rows: rows,
  });

  const result = await callFeasibilityModel(userMessage);

  if (!result.ok) {
    console.log(`callFeasibilityModel failed: [${result.error.code}] ${result.error.message}`);
    return;
  }

  const { enforced } = enforceTagsAndBuildSources(result.data, rows);

  const tags: Array<{ path: string; tag: string }> = [];
  collectTags(enforced, "", tags);

  console.log(`model used: ${result.modelUsed}`);
  console.log("field tags:");
  for (const { path, tag } of tags) {
    console.log(`  ${path}: ${tag}`);
  }

  if (rows.length === 0) {
    const allEstimate = tags.every((t) => t.tag === "estimate");
    check("zero grounding rows -> every field tagged estimate", allEstimate);
  }
}

async function runPartB(): Promise<void> {
  console.log("\n=== PART B: live API integration checks ===\n");

  if (!process.env.GEMINI_API_KEY) {
    console.log("GEMINI_API_KEY is not set — skipping live checks.");
    console.log(
      "NOTE: if the first-ever live call returns a 400 about schema complexity or " +
        "parameter limits, stop and report the exact error rather than simplifying the schema."
    );
    return;
  }

  await runLiveScenario("Channapatna / handicrafts", "Channapatna", "handicrafts");
  await runLiveScenario("NO_MATCH_LOCATION", NO_MATCH_LOCATION, undefined);
}

async function main(): Promise<void> {
  runPartA();
  await runPartB();

  console.log(`\n=== Summary: ${passCount} passed, ${failCount} failed ===`);
  if (failCount > 0) {
    process.exitCode = 1;
  }
}

main();
