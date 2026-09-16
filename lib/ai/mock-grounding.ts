export interface GroundingRow {
  id: string; // short stable id, e.g. "gd_001"
  location: string;
  sector: string;
  stat_name: string;
  stat_value: string;
  unit: string | null;
  source: string; // clearly prefixed "MOCK - ..." so it can never be mistaken for real data
  source_url: string | null;
  source_year: number;
  tag: "verified";
}

export const MOCK_GROUNDING_ROWS: GroundingRow[] = [
  {
    id: "gd_001",
    location: "Channapatna",
    sector: "handicrafts",
    stat_name: "registered toy/lacquerware units",
    stat_value: "62",
    unit: "units",
    source: "MOCK - Karnataka State Handicrafts Development Corporation",
    source_url: null,
    source_year: 2019,
    tag: "verified",
  },
  {
    id: "gd_002",
    location: "Channapatna",
    sector: "handicrafts",
    stat_name: "estimated artisan households",
    stat_value: "6500",
    unit: "households",
    source: "MOCK - Channapatna Taluk Industries Office",
    source_url: null,
    source_year: 2020,
    tag: "verified",
  },
  {
    id: "gd_003",
    location: "Channapatna",
    sector: "handicrafts",
    stat_name: "average toy unit price range",
    stat_value: "150-2500",
    unit: "INR",
    source: "MOCK - Local Market Survey (informal)",
    source_url: null,
    source_year: 2022,
    tag: "verified",
  },
  {
    id: "gd_004",
    location: "Channapatna",
    sector: "sericulture",
    stat_name: "mulberry cultivation acreage",
    stat_value: "4200",
    unit: "acres",
    source: "MOCK - Karnataka State Sericulture Department",
    source_url: null,
    source_year: 2011,
    tag: "verified",
  },
  {
    id: "gd_005",
    location: "Channapatna",
    sector: "sericulture",
    stat_name: "number of cocoon markets",
    stat_value: "1",
    unit: "markets",
    source: "MOCK - Central Silk Board Regional Office",
    source_url: null,
    source_year: 2018,
    tag: "verified",
  },
  {
    id: "gd_006",
    location: "Channapatna",
    sector: "sericulture",
    stat_name: "raw silk production",
    stat_value: "38",
    unit: "tonnes/year",
    source: "MOCK - Karnataka State Sericulture Department",
    source_url: null,
    source_year: 2006,
    tag: "verified",
  },
  {
    id: "gd_007",
    location: "Channapatna",
    sector: "agriculture",
    stat_name: "net sown area",
    stat_value: "9800",
    unit: "hectares",
    source: "MOCK - Department of Agriculture, Karnataka",
    source_url: null,
    source_year: 2015,
    tag: "verified",
  },
  {
    id: "gd_008",
    location: "Channapatna",
    sector: "agriculture",
    stat_name: "major crops under cultivation",
    stat_value: "ragi, paddy, sugarcane",
    unit: null,
    source: "MOCK - Department of Agriculture, Karnataka",
    source_url: null,
    source_year: 2015,
    tag: "verified",
  },
  {
    id: "gd_009",
    location: "Channapatna",
    sector: "population",
    stat_name: "total population",
    stat_value: "72578",
    unit: "persons",
    source: "MOCK - Census of India, Town Directory",
    source_url: null,
    source_year: 2011,
    tag: "verified",
  },
  {
    id: "gd_010",
    location: "Channapatna",
    sector: "population",
    stat_name: "workforce participation rate",
    stat_value: "38.4",
    unit: "percent",
    source: "MOCK - Census of India, Primary Census Abstract",
    source_url: null,
    source_year: 2011,
    tag: "verified",
  },
];

// A location guaranteed to return zero rows, for exercising the
// zero-grounding-rows / all-estimate-tags path.
export const NO_MATCH_LOCATION = "SomeCityWithNoData";

export function getGroundingRows(location: string, sector?: string): GroundingRow[] {
  const normalizedLocation = location.trim().toLowerCase();

  return MOCK_GROUNDING_ROWS.filter((row) => {
    const locationMatches = row.location.toLowerCase() === normalizedLocation;
    if (!locationMatches) return false;

    if (sector === undefined) return true;
    return row.sector.toLowerCase() === sector.trim().toLowerCase();
  });
}
