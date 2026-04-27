import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import PromoCode from "@/models/PromoCode";
import { z } from "zod";

const promoUpdateSchema = z.object({
  discountType: z.enum(["percentage", "fixed"]).optional(),
  discountValue: z.number().min(0).optional(),
  minOrderAmount: z.number().min(0).optional(),
  maxUses: z.number().min(1).optional(),
  expiryDate: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
});

// PATCH — update a promo code
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = promoUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await connectDB();
    const promoCode = await PromoCode.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true },
    );

    if (!promoCode) {
      return NextResponse.json(
        { error: "Promo code not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Promo code updated", promoCode },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update promo code error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// DELETE — delete a promo code
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    const promoCode = await PromoCode.findByIdAndDelete(id);
    if (!promoCode) {
      return NextResponse.json(
        { error: "Promo code not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Promo code deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete promo code error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
