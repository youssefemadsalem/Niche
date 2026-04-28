import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { OrderStatus } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  await connectDB();
  const order = await Order.findById(params.orderId).lean();
  if (!order)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  await connectDB();
  const { status, note, trackingNumber } = (await req.json()) as {
    status: OrderStatus;
    note?: string;
    trackingNumber?: string;
  };

  const order = await Order.findById(params.orderId);
  if (!order)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  order.statusHistory.push({ status, timestamp: new Date(), note });
  await order.save();

  return NextResponse.json(order);
}
