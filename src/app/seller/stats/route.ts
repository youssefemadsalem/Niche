import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import Order from "@/models/Order"; // Created by Dev 3

export async function GET() {
  const session = await auth();
  await connectDB();

  // Find all orders that contain products belonging to this seller
  const orders = await Order.find({
    "items.seller": session!.user.id,
    status: "Delivered",
  });

  const totalEarnings = orders.reduce((acc, order) => acc + order.total, 0);

  return NextResponse.json({
    totalOrders: orders.length,
    earnings: totalEarnings,
    payoutStatus: "Pending",
  });
}
