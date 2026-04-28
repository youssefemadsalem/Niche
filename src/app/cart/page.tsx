'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';

export default function CartPage() {
  const { items, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-8 opacity-20">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path d="M8 8h6l8 32h28l6-24H18" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="26" cy="52" r="3" stroke="#1A1A1A" strokeWidth="2" />
            <circle cx="44" cy="52" r="3" stroke="#1A1A1A" strokeWidth="2" />
          </svg>
        </div>
        <p className="text-xs tracking-widest uppercase font-['Manrope'] text-[#C5A059] mb-2">Shopping Bag</p>
        <h1 className="font-['Noto_Serif'] text-3xl text-[#1A1A1A] mb-4">Your bag is empty.</h1>
        <p className="text-[#1A1A1A]/50 font-['Manrope'] text-sm mb-8 max-w-xs">
          Discover rare essences curated for the discerning collector.
        </p>
        <Link
          href="/discover"
          className="border border-[#1A1A1A] text-[#1A1A1A] px-8 py-3 text-xs tracking-widest uppercase font-['Manrope'] hover:bg-[#1A1A1A] hover:text-white transition-colors"
        >
          Explore Collection
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-14">
        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase font-['Manrope'] text-[#C5A059] mb-1">Shopping Bag</p>
          <h1 className="font-['Noto_Serif'] text-4xl text-[#1A1A1A]">The Curated Edit</h1>
          <p className="mt-2 text-sm text-[#1A1A1A]/50 font-['Manrope'] italic">
            A selection of rare essences captured in crystal, awaiting your final decision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          <div className="bg-white border border-[#E5D5B0] rounded-lg px-6">
            {items.map((item) => (
              <CartItem key={`${item.productId}-${item.size}`} item={item} />
            ))}
          </div>
          <CartSummary />
        </div>
      </div>
    </main>
  );
}
