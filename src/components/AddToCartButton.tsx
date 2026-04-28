"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag } from "lucide-react";

export default function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full py-4 bg-gray-200 text-gray-400 text-xs font-black uppercase tracking-widest rounded-none cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  const handle = () => {
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
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handle}
        className={`w-full flex items-center justify-center gap-3 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
          added
            ? "bg-[#C5A059] text-white"
            : "bg-[#1A1A1A] text-white hover:bg-[#C5A059]"
        }`}
      >
        <ShoppingBag size={16} strokeWidth={2} />
        {added ? "✓ Added to Bag!" : "Add to Bag"}
      </button>
    </div>
  );
}
