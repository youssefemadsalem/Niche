import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import Order from "@/models/Order"; // This model is managed by Developer 3

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // 1. Find orders where this seller's products were bought
    const orders = await Order.find({ "items.seller": session.user.id });

    // 2. Calculate totals
    const stats = orders.reduce(
      (acc, order) => {
        // Only count the items that belong to THIS seller in the order
        const sellerItems = order.items.filter(
          (item: any) => item.seller.toString() === session.user.id,
        );

        const subtotal = sellerItems.reduce(
          (s: number, item: any) => s + item.price * item.quantity,
          0,
        );

        acc.totalEarnings += subtotal;
        acc.totalOrders += 1;
        return acc;
      },
      { totalEarnings: 0, totalOrders: 0 },
    );

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to calculate stats" },
      { status: 500 },
    );
  }
}
