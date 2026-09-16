import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { generateMarketAnalysis } from '@/lib/ai/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ ok: false, error: 'Request body is required' }, { status: 400 });
    }

    const { location, businessCategory, marginCapital } = body;
    const loc = (typeof location === 'string' ? location : '').trim();
    const cat = (typeof businessCategory === 'string' ? businessCategory : '').trim();
    const numCapital = Number(marginCapital);

    if (!loc) {
      return NextResponse.json({ ok: false, error: 'location is required' }, { status: 400 });
    }
    if (!cat) {
      return NextResponse.json({ ok: false, error: 'businessCategory is required' }, { status: 400 });
    }
    if (marginCapital === undefined || isNaN(numCapital) || numCapital <= 0) {
      return NextResponse.json({ ok: false, error: 'Valid positive marginCapital is required' }, { status: 400 });
    }

    // Safely fetch grounding stats
    let groundingData: any[] = [];
    try {
      const { data, error } = await supabase
        .from('grounding_data')
        .select('*')
        .or(`location_name.ilike.%${loc}%,district.ilike.%${loc}%`);

      if (!error && Array.isArray(data)) {
        groundingData = data;
      }
    } catch (dbErr: any) {
      console.warn('grounding_data fetch failed, continuing with []:', dbErr?.message);
    }

    const analysis = await generateMarketAnalysis(loc, cat, numCapital, groundingData);
    return NextResponse.json({ ok: true, ...analysis });
  } catch (err: any) {
    console.error('Feasibility API Error:', err);
    return NextResponse.json(
      { ok: false, error: err.message || 'Feasibility analysis error' },
      { status: 500 }
    );
  }
}