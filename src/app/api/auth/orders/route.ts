import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  await connectDB();

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const {
      items,
      shippingAddress,
      paymentMethod,
      userId,
      guestEmail,
      subtotal,
      shipping,
      tax,
      promoDiscount,
      total,
      promoCode,
    } = body;

    // Card payments go through Stripe — not this route
    if (!["cod", "wallet"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Use /api/checkout/session for card payments." },
        { status: 400 },
      );
    }

    const order = await Order.create({
      userId,
      guestEmail,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      promoDiscount,
      total,
      promoCode,
      status: "pending",
      statusHistory: [
        { status: "pending", timestamp: new Date(), note: "Order placed" },
      ],
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
