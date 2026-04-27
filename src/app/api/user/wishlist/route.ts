import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import User from "@/models/User";
import mongoose from "mongoose";

// GET — fetch wishlist
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id)
      .select("wishlist")
      .populate("wishlist"); // populates product details from Product model

    return NextResponse.json(
      { wishlist: user?.wishlist ?? [] },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get wishlist error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// POST — add product to wishlist
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findById(session.user.id).select("wishlist");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if product already in wishlist
    const alreadyInWishlist = user.wishlist.some(
      (id) => id.toString() === productId,
    );
    if (alreadyInWishlist) {
      return NextResponse.json(
        { error: "Product already in wishlist" },
        { status: 409 },
      );
    }

    user.wishlist.push(new mongoose.Types.ObjectId(productId));
    await user.save();

    return NextResponse.json(
      { message: "Product added to wishlist", wishlist: user.wishlist },
      { status: 200 },
    );
  } catch (error) {
    console.error("Add wishlist error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// DELETE — remove product from wishlist
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 },
      );
    }

    await connectDB();

    await User.findByIdAndUpdate(session.user.id, {
      $pull: { wishlist: new mongoose.Types.ObjectId(productId) },
    });

    return NextResponse.json(
      { message: "Product removed from wishlist" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Remove wishlist error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
