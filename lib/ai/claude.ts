import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateFeasibilityAnalysis(
  location: string,
  businessIdea: string,
  capital: number,
  groundingStats: any[]
) {
  const prompt = `
You are Lakshya AI, an advisor for rural micro-entrepreneurs in India.
Analyze this business idea based ONLY on the provided local data and user inputs.

Location: ${location}
Business Idea: ${businessIdea}
Available Capital: ₹${capital}
Local Grounding Data: ${JSON.stringify(groundingStats)}

RULES:
1. Every item in your output MUST have a "tag" field set to either:
   - "Verified Data" (if it comes directly from local grounding data)
   - "AI Estimate" (if it is your reasoned market estimate)
   - "User Input" (if provided by the user)
2. NEVER invent population figures or hard statistics.

Return a JSON object with this exact structure:
{
  "verdict_input": { "demand_score": "High", "risk_level": "Medium" },
  "local_demand": { "value": "High local demand driven by tourist traffic", "tag": "AI Estimate" },
  "competitors": { "value": "12 registered local artisan clusters", "tag": "Verified Data", "source": "Census 2011" },
  "customer_segments": { "value": "Tourists, Retail Wholesalers", "tag": "AI Estimate" },
  "suggested_pricing": { "value": "₹150 - ₹1,200 per unit", "tag": "AI Estimate" },
  "opportunity_areas": { "value": "Lacquerware Eco-toys", "tag": "AI Estimate" },
  "risks": { "value": "Raw material cost fluctuations", "tag": "AI Estimate" }
}
`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0];
  if (content.type === 'text') {
    return JSON.parse(content.text);
  }
  throw new Error('Failed to parse Claude AI output');
}