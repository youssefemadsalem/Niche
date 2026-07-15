import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Stripe from "stripe";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/webhooks/stripe
// Stripe calls this automatically after a successful payment.
// Register this URL in Stripe Dashboard →
//   Developers → Webhooks → Add endpoint
//   URL: https://yourdomain.com/api/webhooks/stripe
//   Event: checkout.session.completed
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature")!;
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Webhook signature error";
    console.error("❌ Stripe webhook error:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  await connectDB(); 

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata!;

    try {
      const items = JSON.parse(meta.items ?? "[]");
      const address = JSON.parse(meta.shippingAddress ?? "{}");
      const subtotal = (session.amount_subtotal ?? 0) / 100;
      const total = (session.amount_total ?? 0) / 100;

      // Extract guestEmail cleanly to avoid any complex nested types for TypeScript
      const guestEmailValue = meta.guestEmail || session.customer_email || undefined;

      // Construct a clean database payload
      const orderPayload = {
        userId: meta.userId || undefined,
        guestEmail: guestEmailValue ?? undefined, // Guarantees a string or undefined, never null
        items,
        shippingAddress: address,
        paymentMethod: "card",
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : "",
        subtotal,
        shipping: (session.shipping_cost?.amount_total ?? 0) / 100,
        tax: (session.total_details?.amount_tax ?? 0) / 100,
        promoDiscount: parseFloat(meta.promoDiscount ?? "0"),
        total,
        promoCode: meta.promoCode || undefined,
        status: "confirmed" as const,
        statusHistory: [
          {
            status: "confirmed" as const,
            timestamp: new Date(),
            note: "Payment received via Stripe",
          },
        ],
      };

      const order = await Order.create(orderPayload);

      console.log("✅ Order created:", order.orderNumber);
    } catch (err) {
      console.error("❌ Failed to create order from Stripe webhook:", err);
    }
  }

  return NextResponse.json({ received: true });
}