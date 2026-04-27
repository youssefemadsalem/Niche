import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import User from "@/models/User";
import { z } from "zod";

const paymentSchema = z.object({
  cardholderName: z.string().min(2, "Cardholder name is required"),
  lastFourDigits: z.string().length(4, "Must be last 4 digits"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format must be MM/YY"),
  paymentType: z.enum(["credit", "debit"]),
});

// GET — fetch saved payment methods
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id).select("paymentDetails");

    return NextResponse.json({ paymentDetails: user?.paymentDetails ?? [] }, { status: 200 });
  } catch (error) {
    console.error("Get payment error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST — add a new payment method
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = paymentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $push: { paymentDetails: parsed.data } },
      { new: true }
    ).select("paymentDetails");

    return NextResponse.json(
      { message: "Payment method added", paymentDetails: user?.paymentDetails },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add payment error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// DELETE — remove a payment method by id
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("id");

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 });
    }

    await connectDB();

    await User.findByIdAndUpdate(session.user.id, {
      $pull: { paymentDetails: { _id: paymentId } },
    });

    return NextResponse.json({ message: "Payment method removed" }, { status: 200 });
  } catch (error) {
    console.error("Delete payment error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}