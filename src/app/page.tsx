import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Link from "next/link";

export default async function Home() {
  await connectDB();

  // Fetch products for the "Discovery" requirement
  const products = await Product.find({}).limit(4).lean();

  return (
    <main className="p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold italic">NI-CHE.</h1>
        <Link
          href="/seller/register"
          className="text-sm font-bold border-b-2 border-black"
        >
          Become a Seller
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-6">Latest Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p: any) => (
          <div key={p._id} className="group">
            <div className="aspect-square bg-gray-100 rounded-3xl mb-3 overflow-hidden">
              {/* Image Logic */}
              {p.images && (
                <img
                  src={p.images[0]}
                  className="object-cover w-full h-full"
                  alt={p.name}
                />
              )}
            </div>
            <p className="font-bold">{p.name}</p>
            <p className="text-sm text-gray-500">${p.price}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
