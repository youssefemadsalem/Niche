import { connectDB } from "@/lib/mongodb";

export default async function Home() {
  await connectDB();
  console.log("MongoDB connected ✅");

  return <div>HomePage</div>;
}
