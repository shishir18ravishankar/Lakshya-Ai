import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { generateMarketAnalysis } from '@/lib/ai/gemini';
import { calculateFinancials } from '@/lib/finance/calculator';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ ok: false, error: 'Request body is required' }, { status: 400 });
    }

    // ── Strict 3-field contract ──────────────────────────────
    const { location, marginCapital, businessCategory } = body;

    const loc = (typeof location === 'string' ? location : '').trim();
    if (!loc) {
      return NextResponse.json({ ok: false, error: 'location is required' }, { status: 400 });
    }

    const numMarginCapital = Number(marginCapital);
    if (marginCapital === undefined || isNaN(numMarginCapital) || numMarginCapital <= 0) {
      return NextResponse.json({ ok: false, error: 'Valid positive marginCapital is required' }, { status: 400 });
    }

    const cat = (typeof businessCategory === 'string' ? businessCategory : '').trim();
    if (!cat) {
      return NextResponse.json({ ok: false, error: 'businessCategory is required' }, { status: 400 });
    }

    // ── 1. Grounding data (safe, never crashes) ─────────────
    let groundingData: any[] = [];
    try {
      const { data, error } = await supabase
        .from('grounding_data')
        .select('*')
        .or(`location_name.ilike.%${loc}%,district.ilike.%${loc}%`);

      if (!error && Array.isArray(data)) {
        groundingData = data;
      }
    } catch (e: any) {
      console.warn('grounding_data fetch failed, continuing with []:', e?.message);
    }

    // ── 2. Run both engines in parallel ─────────────────────
    const [marketAnalysis, financials] = await Promise.all([
      generateMarketAnalysis(loc, cat, numMarginCapital, groundingData),
      Promise.resolve(calculateFinancials({ marginCapital: numMarginCapital })),
    ]);

    // ── 3. Merge into single flat response ──────────────────
    const response = {
      ok: true,
      verdict: marketAnalysis.verdict,
      verdictReason: marketAnalysis.verdictReason,
      location: loc,
      businessCategory: cat,
      marketReach: marketAnalysis.marketReach,
      swot: marketAnalysis.swot,
      competitorMapping: marketAnalysis.competitorMapping,
      suggestedPricing: marketAnalysis.suggestedPricing,
      financials,
      sources: marketAnalysis.sources,
      actionPlan: marketAnalysis.actionPlan,
    };

    // ── 4. Save to Supabase (safe, never crashes) ───────────
    let submissionId: string | null = null;
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert([{
          location: loc,
          margin_capital: numMarginCapital,
          business_category: cat,
          // backward compat for NOT NULL columns still in the table
          business_type: cat,
          capital_available: numMarginCapital,
          feasibility_output: {
            verdict: marketAnalysis.verdict,
            verdictReason: marketAnalysis.verdictReason,
            marketReach: marketAnalysis.marketReach,
            swot: marketAnalysis.swot,
            competitorMapping: marketAnalysis.competitorMapping,
            suggestedPricing: marketAnalysis.suggestedPricing,
            sources: marketAnalysis.sources,
            actionPlan: marketAnalysis.actionPlan,
          },
          financial_output: financials,
        }])
        .select('id')
        .single();

      if (!error && data) {
        submissionId = data.id;
      } else if (error) {
        console.warn('Supabase insert failed (non-fatal):', error.message);
      }
    } catch (e: any) {
      console.warn('Supabase insert exception (non-fatal):', e?.message);
    }

    // Attach submission_id at the top level for the frontend
    return NextResponse.json({ ...response, submissionId }, { status: 200 });
  } catch (err: any) {
    console.error('Verdict route error:', err);
    return NextResponse.json(
      { ok: false, error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
