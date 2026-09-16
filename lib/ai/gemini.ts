import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Unified market analysis result returned by the AI feasibility engine.
 * This is the AI-produced half of the verdict response — it covers market,
 * SWOT, competitors, pricing, sources, and action plan.
 * The financial numbers are NOT produced here; they come from the
 * deterministic calculator.
 */
export interface MarketAnalysisResult {
  verdict: 'PROCEED' | 'REVIEW' | 'HIGH_RISK';
  verdictReason: string;
  marketReach: {
    radiusKm: string;
    estimatedConsumerBase: string;
    distributionChannels: string[];
  };
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  competitorMapping: {
    directCompetitors: string;
    indirectCompetitors: string;
    competitiveAdvantage: string;
  };
  suggestedPricing: {
    strategy: string;
    priceRange: string;
    marginEstimate: string;
  };
  sources: { id: string; source: string; year: string }[];
  actionPlan: string[];
}

const ANALYSIS_PROMPT = (
  location: string,
  businessCategory: string,
  marginCapital: number,
  groundingStats: any[]
) => `
You are Lakshya AI, an expert business advisor for rural micro-entrepreneurs in India.
You are part of a system built for PS26091 (Ministry of Social Justice & Empowerment).

Analyze this business idea and location, then return a market feasibility assessment.

Location: ${location}
Business Category: ${businessCategory}
Margin Capital (promoter contribution): ₹${marginCapital.toLocaleString('en-IN')}
Local Grounding Data: ${JSON.stringify(groundingStats)}

IMPORTANT RULES:
1. Be realistic and grounded — do not invent census numbers or hard statistics.
2. If grounding data is empty, use your general knowledge but flag it.
3. The verdict must be one of: "PROCEED", "REVIEW", or "HIGH_RISK".
4. PROCEED = strong opportunity, low risk. REVIEW = viable but needs careful planning. HIGH_RISK = significant concerns.

Return ONLY a valid JSON object (no markdown fences, no explanation) matching this EXACT structure:
{
  "verdict": "PROCEED",
  "verdictReason": "One clear sentence explaining the verdict",
  "marketReach": {
    "radiusKm": "5-10",
    "estimatedConsumerBase": "Description of target consumer population",
    "distributionChannels": ["Channel 1", "Channel 2", "Channel 3"]
  },
  "swot": {
    "strengths": ["Strength 1", "Strength 2"],
    "weaknesses": ["Weakness 1", "Weakness 2"],
    "opportunities": ["Opportunity 1", "Opportunity 2"],
    "threats": ["Threat 1", "Threat 2"]
  },
  "competitorMapping": {
    "directCompetitors": "Description of direct competitors",
    "indirectCompetitors": "Description of indirect competitors",
    "competitiveAdvantage": "What gives this venture an edge"
  },
  "suggestedPricing": {
    "strategy": "Pricing strategy recommendation",
    "priceRange": "Suggested price range",
    "marginEstimate": "Expected gross margin percentage"
  },
  "sources": [
    { "id": "1", "source": "Source name", "year": "Year" }
  ],
  "actionPlan": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ]
}
`;

/**
 * Runs AI feasibility/market analysis via Google Gemini.
 * Returns the market half of the unified verdict — the caller merges this
 * with the deterministic financial output.
 */
export async function generateMarketAnalysis(
  location: string,
  businessCategory: string,
  marginCapital: number,
  groundingStats: any[] = []
): Promise<MarketAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('GEMINI_API_KEY not configured; using structured fallback.');
    return getFallbackAnalysis(location, businessCategory, marginCapital, groundingStats);
  }

  const prompt = ANALYSIS_PROMPT(location, businessCategory, marginCapital, groundingStats);
  const genAI = new GoogleGenerativeAI(apiKey);
  const candidateModels = ['gemini-3.6-flash', 'gemini-2.5-flash-lite'];

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      const generatePromise = model.generateContent(prompt);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout (15s)')), 15000)
      );

      const result: any = await Promise.race([generatePromise, timeoutPromise]);
      const rawText: string = result.response.text();

      // Strip markdown fences if present
      const cleaned = rawText
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed = JSON.parse(cleaned);

      // Validate essential keys
      if (parsed?.verdict && parsed?.swot && parsed?.marketReach) {
        // Normalize verdict to allowed values
        const v = String(parsed.verdict).toUpperCase();
        if (!['PROCEED', 'REVIEW', 'HIGH_RISK'].includes(v)) {
          parsed.verdict = 'REVIEW';
        } else {
          parsed.verdict = v;
        }
        return parsed as MarketAnalysisResult;
      }
    } catch (err: any) {
      console.warn(`Gemini model ${modelName} failed: ${err?.message || err}`);
    }
  }

  return getFallbackAnalysis(location, businessCategory, marginCapital, groundingStats);
}

function getFallbackAnalysis(
  location: string,
  businessCategory: string,
  marginCapital: number,
  groundingStats: any[]
): MarketAnalysisResult {
  const hasGrounding = Array.isArray(groundingStats) && groundingStats.length > 0;

  return {
    verdict: 'REVIEW',
    verdictReason: `${businessCategory} in ${location} shows moderate potential; detailed local validation recommended before proceeding.`,
    marketReach: {
      radiusKm: '5-15',
      estimatedConsumerBase: `Rural and semi-urban households within 15 km of ${location}`,
      distributionChannels: [
        'Local weekly haats and mandis',
        'Direct door-to-door sales',
        'Nearby town retail outlets',
      ],
    },
    swot: {
      strengths: [
        `Low entry barrier for ${businessCategory} in rural India`,
        `Promoter has ₹${marginCapital.toLocaleString('en-IN')} margin capital available`,
      ],
      weaknesses: [
        'Limited brand recognition at launch',
        'Dependence on local supply chain reliability',
      ],
      opportunities: [
        'Growing rural consumer spending in this category',
        'Government scheme support (NSFDC financing available)',
      ],
      threats: [
        'Seasonal demand fluctuation',
        'Competition from unorganized local players',
      ],
    },
    competitorMapping: {
      directCompetitors: hasGrounding
        ? `${groundingStats.length} registered competitors in the area`
        : 'Primarily unorganized small-scale operators',
      indirectCompetitors: 'Online marketplaces and nearby town retailers',
      competitiveAdvantage: 'Local presence, lower logistics cost, direct consumer relationships',
    },
    suggestedPricing: {
      strategy: 'Competitive entry pricing with gradual premium positioning',
      priceRange: 'Market-aligned with 5-10% undercut on comparable products',
      marginEstimate: '20-35% gross margin depending on input costs',
    },
    sources: [
      { id: '1', source: 'AI Market Estimate (Lakshya AI)', year: '2026' },
      ...(hasGrounding
        ? [{ id: '2', source: 'Local Grounding Database', year: '2026' }]
        : []),
    ],
    actionPlan: [
      'Conduct local market survey to validate demand within 10 km radius',
      'Register with District Industries Centre (DIC) for MSME benefits',
      'Apply for NSFDC financing through State Channelising Agency',
      'Set up initial supply chain with 2-3 reliable local vendors',
      'Launch with pilot batch and gather customer feedback in first quarter',
    ],
  };
}
