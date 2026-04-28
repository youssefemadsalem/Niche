"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ArrowLeft } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  woody:    "Woody Collection",
  floral:   "Floral Collection",
  oriental: "Oriental Collection",
  fresh:    "Fresh Collection",
  citrus:   "Citrus Collection",
  musk:     "Musk Collection",
  aquatic:  "Aquatic Collection",
  spicy:    "Spicy Collection",
};

export default function CategoryPage() {
  const params    = useParams();
  const slug      = (params?.slug as string) ?? "";
  const { addItem, itemCount } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [addedId, setAddedId]   = useState<string | null>(null);

  const label = CATEGORY_LABELS[slug.toLowerCase()] ?? `${slug.charAt(0).toUpperCase()}${slug.slice(1)} Collection`;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products?category=${slug}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAdd = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product._id,
      name:      product.name,
      brand:     product.brand ?? "NICHE",
      price:     product.price,
      quantity:  1,
      image:     product.images?.[0] ?? "",
      size:      product.size ?? "50ML",
      maxStock:  product.stock ?? 10,
    });
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* Header */}
      <div className="border-b border-[#E5D5B0] bg-white px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/discover"
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C5A059] hover:underline mb-3"
              >
                <ArrowLeft size={13} /> All Fragrances
              </Link>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                The Fragrance Gallery
              </p>
              <h1 className="text-4xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-headline)" }}>
                {label}
              </h1>
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative p-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#C5A059] transition-all">
              <ShoppingBag size={18} strokeWidth={2} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 mt-6 flex-wrap">
            {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
              <Link
                key={key}
                href={`/categories/${key}`}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  key === slug.toLowerCase()
                    ? "bg-[#1A1A1A] text-white"
                    : "border border-[#E5D5B0] text-gray-500 hover:border-[#C5A059] bg-white"
                }`}
              >
                {key}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-2xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-2">
              {label}
            </p>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-headline)" }}>
              No products in this category yet.
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Check back soon or explore our full collection.
            </p>
            <Link
              href="/discover"
              className="bg-[#1A1A1A] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors"
            >
              View All Fragrances
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-8">
              {products.length} {products.length === 1 ? "Fragrance" : "Fragrances"}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
              {products.map((product: any) => (
                <Link key={product._id} href={`/products/${product._id}`} className="group">
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-white rounded-2xl border border-[#E5D5B0]/20 shadow-sm">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          const el = e.currentTarget;
                          el.onerror = null;
                          el.src = `https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80`;
                        }}
                      />
                    ) : (
                      <img
                        src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80"
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}

                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Out of Stock</span>
                      </div>
                    )}

                    {product.brand && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm">
                        {product.brand}
                      </div>
                    )}

                    {product.stock > 0 && (
                      <button
                        onClick={(e) => handleAdd(product, e)}
                        className={`absolute bottom-3 left-3 right-3 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl ${
                          addedId === product._id
                            ? "bg-[#C5A059] text-white opacity-100"
                            : "bg-[#1A1A1A] text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        }`}
                      >
                        {addedId === product._id ? "✓ Added" : "Add to Bag"}
                      </button>
                    )}
                  </div>

                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                    {product.brand ?? "NICHE"}
                  </p>
                  <h3 className="font-bold text-[#1A1A1A] mb-1 leading-tight" style={{ fontFamily: "var(--font-headline)" }}>
                    {product.name}
                  </h3>
                  {product.notes?.length > 0 && (
                    <p className="text-[10px] text-gray-400 uppercase tracking-tighter font-bold mb-2">
                      {product.notes.slice(0, 2).join(" · ")}
                    </p>
                  )}
                  <p className="text-sm font-bold text-[#C5A059]">${product.price}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
