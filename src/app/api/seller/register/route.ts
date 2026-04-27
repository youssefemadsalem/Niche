import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth"; // Utility from Dev 1
import User from "@/models/User";

/**
 * POST - Upgrades a user to a Seller role and sets up their profile
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // 1. Security Check: Must be logged in
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const { shopName, description } = await req.json();

    // 2. Validation
    if (!shopName || !description) {
      return NextResponse.json(
        { error: "Shop name and description are required" },
        { status: 400 },
      );
    }

    await connectDB();

    // 3. Update the User Document
    // We change the role and add the seller-specific profile data
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          role: "seller",
          "sellerProfile.shopName": shopName,
          "sellerProfile.description": description,
          "sellerProfile.isSetup": true,
          "sellerProfile.joinedAt": new Date(),
        },
      },
      { new: true },
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Congratulations! You are now a registered seller.",
        user: {
          name: updatedUser.name,
          role: updatedUser.role,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Seller Registration Error:", error);
    return NextResponse.json(
      { error: "Failed to register seller profile" },
      { status: 500 },
    );
  }
}
