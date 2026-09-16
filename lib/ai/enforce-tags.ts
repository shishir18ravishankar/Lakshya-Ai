import type { GroundingRow } from "./mock-grounding";
import type { FeasibilityModelOutput, FeasibilityResponse, Tag } from "./types";

interface TaggedLike {
  value: unknown;
  tag: Tag;
  source: string | null;
  source_year: number | null;
  grounding_ids: string[];
}

function isTaggedLike(node: unknown): node is TaggedLike {
  if (typeof node !== "object" || node === null || Array.isArray(node)) {
    return false;
  }
  const candidate = node as Record<string, unknown>;
  return (
    "value" in candidate &&
    "tag" in candidate &&
    "source" in candidate &&
    "source_year" in candidate &&
    "grounding_ids" in candidate &&
    typeof candidate.tag === "string" &&
    Array.isArray(candidate.grounding_ids)
  );
}

interface WalkContext {
  rowsById: Map<string, GroundingRow>;
  citedIds: Set<string>;
}

function walk(node: unknown, ctx: WalkContext): unknown {
  if (Array.isArray(node)) {
    return node.map((item) => walk(item, ctx));
  }

  if (node !== null && typeof node === "object") {
    if (isTaggedLike(node)) {
      let tag = node.tag;
      let source = node.source;
      let source_year = node.source_year;
      let grounding_ids = node.grounding_ids;

      if (tag === "verified") {
        const allIdsKnown =
          grounding_ids.length > 0 && grounding_ids.every((id) => ctx.rowsById.has(id));

        if (allIdsKnown) {
          for (const id of grounding_ids) {
            ctx.citedIds.add(id);
          }
        } else {
          tag = "estimate";
          source = null;
          source_year = null;
          grounding_ids = [];
        }
      }

      return {
        value: walk(node.value, ctx),
        tag,
        source,
        source_year,
        grounding_ids,
      };
    }

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      result[key] = walk(value, ctx);
    }
    return result;
  }

  return node;
}

export function enforceTagsAndBuildSources(
  modelOutput: FeasibilityModelOutput,
  suppliedRows: GroundingRow[]
): {
  enforced: FeasibilityModelOutput;
  sources: FeasibilityResponse["sources"];
  groundingRowsCited: number;
} {
  const rowsById = new Map(suppliedRows.map((row) => [row.id, row]));
  const citedIds = new Set<string>();

  const enforced = walk(modelOutput, { rowsById, citedIds }) as FeasibilityModelOutput;

  const sources: FeasibilityResponse["sources"] = Array.from(citedIds)
    .map((id) => rowsById.get(id))
    .filter((row): row is GroundingRow => row !== undefined)
    .map((row) => ({
      id: row.id,
      sector: row.sector,
      stat_name: row.stat_name,
      stat_value: row.stat_value,
      unit: row.unit,
      source: row.source,
      source_url: row.source_url,
      source_year: row.source_year,
    }));

  return {
    enforced,
    sources,
    groundingRowsCited: sources.length,
  };
}
