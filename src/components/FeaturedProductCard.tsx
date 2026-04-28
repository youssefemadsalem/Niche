"use client";

import Link from "next/link";
import { useState } from "react";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80",
  "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80",
  "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600&q=80",
  "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&q=80",
  "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=80",
  "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80",
  "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?w=600&q=80",
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
];

export default function FeaturedProductCard({
  product,
  index,
}: {
  product: any;
  index: number;
}) {
  const fallback = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const [src, setSrc] = useState<string>(product.images?.[0] || fallback);

  return (
    <Link
      href={`/products/${product._id}`}
      className="group block"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-[3/4] mb-5 overflow-hidden bg-white rounded-2xl shadow-md border border-[#E5D5B0]/30 transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
        <img
          src={src}
          alt={product.name}
          onError={() => setSrc(fallback)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          style={{ transition: "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)" }}
        />

        {/* Shimmer overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Brand badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border border-[#E5D5B0]/40">
          {product.brand || "NICHE"}
        </div>

        {/* Quick view label on hover */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="bg-white text-[#1A1A1A] px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
            View Details
          </span>
        </div>
      </div>

      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C5A059] mb-1">
        {product.brand || "NICHE"}
      </p>
      <h3 className="text-base font-bold text-[#1A1A1A] mb-1 leading-snug group-hover:text-[#C5A059] transition-colors duration-300">
        {product.name}
      </h3>
      {product.notes?.length > 0 && (
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-2">
          {product.notes.slice(0, 2).join(" · ")}
        </p>
      )}
      <p className="text-sm font-bold text-[#1A1A1A]">${product.price}</p>
    </Link>
  );
}
