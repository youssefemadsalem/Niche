import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import Product from "@/models/Product";

// GET — Fetch products with search and filtration
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Filters
    const query = searchParams.get("query");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    await connectDB();

    // Build the dynamic filter object
    let filter: any = {};

    if (query) {
      filter.name = { $regex: query, $options: "i" }; // Case-insensitive search
    }
    if (category) {
      filter.category = category;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// POST — Create a new product (Sellers & Admins only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (
      !session ||
      (session.user.role !== "seller" && session.user.role !== "admin")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    const product = await Product.create({
      ...body,
      seller: session.user.id, // Attach the product to the logged-in seller
    });

    return NextResponse.json(
      { message: "Product created", product },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}
