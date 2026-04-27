import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import Banner from "@/models/Banner";
import { z } from "zod";

const bannerUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  image: z.string().url().optional(),
  link: z.string().url().optional(),
  isActive: z.boolean().optional(),
  position: z
    .enum(["home_top", "home_middle", "home_bottom", "sidebar"])
    .optional(),
});

// PATCH — update a banner
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
    const parsed = bannerUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await connectDB();
    const banner = await Banner.findByIdAndUpdate(
      id,
      { $set: parsed.data },
      { new: true },
    );

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Banner updated", banner },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update banner error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// DELETE — delete a banner
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

    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Banner deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete banner error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
