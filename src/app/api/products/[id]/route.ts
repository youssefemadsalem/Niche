import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import Product from "@/models/Product";

/**
 * PATCH - Update Product Details & Stock logic
 * This handles the "U" in CRUD for your Product Management task
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    // Check if user is logged in and has correct role
    if (
      !session ||
      (session.user.role !== "seller" && session.user.role !== "admin")
    ) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    const body = await req.json();
    await connectDB();

    // Ensure the seller can only update THEIR own product
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: params.id, seller: session.user.id },
      { $set: body },
      { new: true }, // Returns the modified document
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found or you don't have permission" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Product updated successfully", product: updatedProduct },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Update operation failed" },
      { status: 500 },
    );
  }
}

/**
 * DELETE - Remove a Product
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (
      !session ||
      (session.user.role !== "seller" && session.user.role !== "admin")
    ) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    await connectDB();

    // Only allow the owner to delete the product
    const deletedProduct = await Product.findOneAndDelete({
      _id: params.id,
      seller: session.user.id,
    });

    if (!deletedProduct) {
      return NextResponse.json(
        { error: "Product not found or you don't have permission" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Delete operation failed" },
      { status: 500 },
    );
  }
}
