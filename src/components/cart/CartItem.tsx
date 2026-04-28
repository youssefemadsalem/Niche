'use client';

import { useState } from 'react';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/context/CartContext';

const FALLBACK = "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&q=80";

function CartItemImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);
  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(FALLBACK)}
      className="w-full h-full object-cover"
    />
  );
}

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { setQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-6 border-b border-[#E5D5B0] last:border-0">
      <div className="relative w-24 h-28 flex-shrink-0 bg-[#E5D5B0] rounded overflow-hidden">
        <CartItemImage src={item.image} alt={item.name} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#C5A059] font-['Manrope']">
              {item.brand}
            </p>
            <h3 className="font-['Noto_Serif'] text-[#1A1A1A] text-base leading-snug mt-0.5">
              {item.name}
            </h3>
            <p className="text-xs text-[#1A1A1A]/50 font-['Manrope'] mt-1 uppercase tracking-wider">
              {item.size}
            </p>
          </div>
          <button
            onClick={() => removeItem(item.productId, item.size)}
            className="text-[#1A1A1A]/30 hover:text-[#1A1A1A] transition-colors p-1 -mr-1 flex-shrink-0"
            aria-label="Remove item"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-[#1A1A1A]/20 rounded">
            <button
              onClick={() => setQuantity(item.productId, item.size, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-['Manrope'] text-[#1A1A1A]">
              {item.quantity}
            </span>
            <button
              onClick={() => setQuantity(item.productId, item.size, item.quantity + 1)}
              disabled={item.quantity >= item.maxStock}
              className="w-8 h-8 flex items-center justify-center text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          <p className="font-['Manrope'] text-[#1A1A1A] font-medium">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
