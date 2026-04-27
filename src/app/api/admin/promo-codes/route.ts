import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import PromoCode from "@/models/PromoCode";
import { z } from "zod";

const promoSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().min(0, "Discount value must be positive"),
  minOrderAmount: z.number().min(0).optional(),
  maxUses: z.number().min(1).optional(),
  expiryDate: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
});

// GET — fetch all promo codes
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
    return NextResponse.json({ promoCodes }, { status: 200 });
  } catch (error) {
    console.error("Get promo codes error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// POST — create a new promo code
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = promoSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await connectDB();

    const existing = await PromoCode.findOne({
      code: parsed.data.code.toUpperCase(),
    });
    if (existing) {
      return NextResponse.json(
        { error: "Promo code already exists" },
        { status: 409 },
      );
    }

    const promoCode = await PromoCode.create(parsed.data);
    return NextResponse.json(
      { message: "Promo code created", promoCode },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create promo code error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
