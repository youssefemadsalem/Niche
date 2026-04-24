import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/error?error=missing-token", req.url),
      );
    }

    await connectDB();

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpiry: { $gt: new Date() }, // token not expired
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/auth/error?error=invalid-token", req.url),
      );
    }

    // Mark user as verified and clear token
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    return NextResponse.redirect(new URL("/auth/login?verified=true", req.url));
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.redirect(
      new URL("/auth/error?error=server-error", req.url),
    );
  }
}
