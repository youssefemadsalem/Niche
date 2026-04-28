import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import Product from "@/models/Product";

export async function GET() {
  try {
    const session = await auth();
    if (!session || session.user.role !== "seller") {
      return NextResponse.json({ error: "Sellers only" }, { status: 401 });
    }

    await connectDB();
    const myProducts = await Product.find({ seller: session.user.id });

    return NextResponse.json({ products: myProducts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
