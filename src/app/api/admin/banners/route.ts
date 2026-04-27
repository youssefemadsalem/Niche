import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import Banner from "@/models/Banner";
import { z } from "zod";

const bannerSchema = z.object({
  title: z.string().min(2, "Title is required"),
  image: z.string().url("Invalid image URL"),
  link: z.string().url("Invalid link URL").optional(),
  isActive: z.boolean().default(true),
  position: z.enum(["home_top", "home_middle", "home_bottom", "sidebar"]),
});

// GET — fetch all banners
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const banners = await Banner.find().sort({ createdAt: -1 });
    return NextResponse.json({ banners }, { status: 200 });
  } catch (error) {
    console.error("Get banners error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

// POST — create a new banner
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = bannerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await connectDB();
    const banner = await Banner.create(parsed.data);
    return NextResponse.json(
      { message: "Banner created", banner },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create banner error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
