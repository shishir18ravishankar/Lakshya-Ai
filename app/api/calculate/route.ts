import { NextResponse } from 'next/server';
import { calculateFinancials } from '@/lib/finance/calculator';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ ok: false, error: 'Request body is required' }, { status: 400 });
    }

    const { marginCapital } = body;
    const num = Number(marginCapital);

    if (marginCapital === undefined || isNaN(num) || num <= 0) {
      return NextResponse.json(
        { ok: false, error: 'Valid positive marginCapital is required' },
        { status: 400 }
      );
    }

    const financials = calculateFinancials({ marginCapital: num });
    return NextResponse.json({ ok: true, financials });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || 'Calculation error' },
      { status: 500 }
    );
  }
}
