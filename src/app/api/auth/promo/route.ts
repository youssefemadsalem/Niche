import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/promo
// Body: { code: string, subtotal: number }
//
// NOTE: In production, connect this to Dev1's Admin promo codes in MongoDB.
// Dev1's Admin Panel manages promo codes — you can swap this static list
// for a DB lookup against a PromoCodes collection later.
// ─────────────────────────────────────────────────────────────────────────────

const PROMO_CODES: Record<
  string,
  { pct?: number; fixed?: number; min?: number; label: string }
> = {
  NICHE10:   { pct: 10,   min: 100, label: '10% off orders over $100' },
  WELCOME20: { pct: 20,            label: '20% off welcome discount'  },
  FLAT50:    { fixed: 50, min: 200, label: '$50 off orders over $200' },
  VELVET15:  { pct: 15,            label: '15% off'                   },
  FREESHIP:  { fixed: 15,          label: 'Free shipping'             },
};

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = (await req.json()) as {
      code: string;
      subtotal: number;
    };

    const promo = PROMO_CODES[code?.toUpperCase()?.trim()];

    if (!promo) {
      return NextResponse.json({ error: 'Promo code not found.' }, { status: 404 });
    }
    if (promo.min && subtotal < promo.min) {
      return NextResponse.json(
        { error: `Minimum order of $${promo.min} required.` },
        { status: 400 }
      );
    }

    const discount = promo.pct ? (subtotal * promo.pct) / 100 : (promo.fixed ?? 0);

    return NextResponse.json({
      valid:    true,
      code:     code.toUpperCase(),
      discount: parseFloat(discount.toFixed(2)),
      label:    promo.label,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
