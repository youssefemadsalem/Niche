import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import ProductImage from "@/components/ProductImage";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    await connectDB();
  } catch {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <p className="text-red-500">Database connection error.</p>
      </div>
    );
  }

  let product: any = null;
  try {
    product = await Product.findById(id).lean();
  } catch {
    notFound();
  }

  if (!product) notFound();
  const p = JSON.parse(JSON.stringify(product));

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <div className="border-b border-[#E5D5B0] bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/discover" className="text-xs font-bold uppercase tracking-widest text-[#C5A059] hover:underline">
            ← Back to Collection
          </Link>
          <Link href="/" className="text-xl font-bold tracking-tighter" style={{ fontFamily: "var(--font-headline)" }}>
            NICHE
          </Link>
          <Link href="/cart" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#1A1A1A]">
            Cart
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        <div className="relative aspect-[3/4] bg-white rounded-3xl overflow-hidden border border-[#E5D5B0]/30 shadow-sm">
          <ProductImage src={p.images?.[0]} alt={p.name} />
        </div>

        <div className="pt-4">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#C5A059] mb-3">{p.brand ?? "NICHE"}</p>
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4 leading-tight" style={{ fontFamily: "var(--font-headline)" }}>
            {p.name}
          </h1>

          {p.notes?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {p.notes.map((note: string) => (
                <span key={note} className="px-3 py-1 bg-[#E5D5B0]/40 text-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {note}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-500 leading-relaxed text-sm mb-8">{p.description}</p>

          <div className="border-t border-[#E5D5B0] pt-6 mb-8 space-y-3">
            {p.size && (
              <div className="flex justify-between text-sm">
                <span className="font-bold uppercase tracking-widest text-xs text-gray-400">Size</span>
                <span className="font-semibold">{p.size}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="font-bold uppercase tracking-widest text-xs text-gray-400">Availability</span>
              <span className={`font-semibold ${p.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {p.stock > 0 ? `In Stock (${p.stock} left)` : "Out of Stock"}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-4xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-headline)" }}>${p.price}</span>
          </div>

          <AddToCartButton product={p} />

          <div className="mt-8 pt-6 border-t border-[#E5D5B0] grid grid-cols-3 gap-4 text-center">
            {[
              { icon: "🛡", label: "Secure Payment" },
              { icon: "🌿", label: "Eco Packaging" },
              { icon: "🎧", label: "24/7 Support" },
            ].map((b) => (
              <div key={b.label}>
                <div className="text-2xl mb-1">{b.icon}</div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
