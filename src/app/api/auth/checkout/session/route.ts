import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { CartItem, ShippingAddress } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();

    const body = (await req.json()) as {
      items: CartItem[];
      shippingAddress: ShippingAddress;
      promoCode?: string;
      promoDiscount?: number;
      userId?: string;
      guestEmail?: string;
    };

    const {
      items,
      shippingAddress,
      promoCode,
      promoDiscount,
      userId,
      guestEmail,
    } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${item.brand} · ${item.name}`,
          description: item.size,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Apply promo as Stripe coupon
    let discounts: { coupon: string }[] = [];
    if (promoDiscount && promoDiscount > 0 && promoCode) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(promoDiscount * 100),
        currency: "usd",
        name: promoCode,
        duration: "once",
      });
      discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: guestEmail,
      discounts,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 1500, currency: "usd" },
            display_name: "Standard Delivery",
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      metadata: {
        shippingAddress: JSON.stringify(shippingAddress),
        items: JSON.stringify(items),
        promoCode: promoCode ?? "",
        promoDiscount: String(promoDiscount ?? 0),
        userId: userId ?? "",
        guestEmail: guestEmail ?? "",
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Stripe error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
