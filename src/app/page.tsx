import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const session = await auth();
  await connectDB();
  const products = await Product.find({ isFeatured: true }).limit(8).lean();

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <Navbar session={session} />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/20 z-10" />
          <Image
            src="https://images.unsplash.com/photo-1592947906741-c05764a4da5b?q=80&w=2000"
            alt="Hero Background"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-20 text-center text-white px-4">
          <p className="text-xs uppercase tracking-[0.3em] mb-4 font-bold">
            New Collection 2026
          </p>
          <h1
            className="text-6xl md:text-8xl font-bold mb-8"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            The Scent of <br /> Excellence
          </h1>
          <Link
            href="/discover"
            className="inline-block bg-white text-black px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-all"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              Featured Scents
            </h2>
            <p className="text-sm text-gray-500">
              Hand-picked premium selections from our master curators.
            </p>
          </div>
          <Link
            href="/discover"
            className="text-xs font-bold uppercase tracking-widest border-b-2 border-black pb-1"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product: any) => (
            <Link
              key={product._id.toString()}
              href={`/products/${product._id}`}
              className="group"
            >
              <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-white rounded-2xl border border-[#E5D5B0]/20">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm">
                  {product.brand}
                </div>
              </div>
              <h3 className="font-['Noto_Serif'] text-lg mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-400 mb-2 uppercase tracking-tighter text-[10px] font-bold">
                {product.notes.slice(0, 2).join(" • ")}
              </p>
              <p className="text-sm font-bold text-[#C5A059]">
                ${product.price}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12">
          <div>
            <h3 className="text-xl font-bold mb-6">NICHE</h3>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Redefining luxury through curated scents. We bring the world's
              most unique fragrances to your doorstep.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-black mb-6 text-[#C5A059]">
              Shop
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link href="/discover">All Perfumes</Link>
              </li>
              <li>
                <Link href="/categories/woody">Woody Collection</Link>
              </li>
              <li>
                <Link href="/categories/floral">Floral Collection</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-black mb-6 text-[#C5A059]">
              Support
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li>
                <Link href="/contact">Contact Us</Link>
              </li>
              <li>
                <Link href="/orders">Shipping & Returns</Link>
              </li>
              <li>
                <Link href="/faq">FAQ</Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-12">
          © 2026 NICHE Premium Marketplace. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
