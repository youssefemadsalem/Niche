import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { OrderStatus } from "@/types";

// Type definition: params is wrapped in a Promise to satisfy Next.js 15+
type RouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function GET(
  _req: NextRequest,
  { params }: RouteContext
) {
  await connectDB();
  
  // Await the asynchronous params object
  const { orderId } = await params;
  
  const order = await Order.findById(orderId).lean();
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  
  return NextResponse.json(order);
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  await connectDB();
  
  // Await the asynchronous params object
  const { orderId } = await params;
  
  const { status, note, trackingNumber } = (await req.json()) as {
    status: OrderStatus;
    note?: string;
    trackingNumber?: string;
  };

  const order = await Order.findById(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  order.statusHistory.push({ status, timestamp: new Date(), note });
  await order.save();

  return NextResponse.json(order);
}