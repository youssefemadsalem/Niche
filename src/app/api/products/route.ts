import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import Product from "@/models/Product";

// GET — Fetch products with search and filtration
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Extract query params
    const query = searchParams.get("query");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("rating");

    // 2. DECLARE THE FILTER OBJECT FIRST (Fixed the error here)
    let filter: any = {};

    // 3. Build the filter logic
    if (query) {
      filter.name = { $regex: query, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (minRating) {
      filter["ratings.average"] = { $gte: Number(minRating) };
    }

    await connectDB();

    // 4. Build sort object based on 'sort' param
    const sortParam = searchParams.get("sort");
    let sortObj: Record<string, 1 | -1> = { createdAt: -1 }; // default: newest
    if (sortParam === "price_asc")  sortObj = { price: 1 };
    if (sortParam === "price_desc") sortObj = { price: -1 };

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort(sortObj);

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Fetch products error:", error);
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

    // The stock availability logic is handled here by ensuring stock is passed in body
    const product = await Product.create({
      ...body,
      seller: session.user.id,
    });

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 },
    );
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}
