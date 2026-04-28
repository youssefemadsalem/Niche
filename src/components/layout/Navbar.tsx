"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, User, LogOut } from "lucide-react";

export default function Navbar({ session }: { session: any }) {
  const { items, itemCount, clearCart } = useCart();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#E5D5B0]/30">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tighter"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          NICHE
        </Link>

        {/* Links */}
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-widest font-semibold text-gray-500">
          <Link href="/discover" className="hover:text-black transition-colors">
            Shop All
          </Link>
          <Link
            href="/categories/woody"
            className="hover:text-black transition-colors"
          >
            Woody
          </Link>
          <Link
            href="/categories/floral"
            className="hover:text-black transition-colors"
          >
            Floral
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          {session ? (
            <div className="flex items-center gap-6">
              <Link
                href="/orders"
                className="flex items-center gap-2 hover:text-[#C5A059] transition-colors"
              >
                <User size={20} strokeWidth={1.5} />
                <span className="hidden sm:inline text-xs font-bold uppercase tracking-tight">
                  Orders
                </span>
              </Link>

              <button
                onClick={() => {
                  clearCart();
                  signOut();
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <LogOut size={20} strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="text-xs font-bold uppercase tracking-widest"
            >
              Sign In
            </Link>
          )}

          {/* Cart Icon with Dynamic Badge */}
          <Link
            href="/cart"
            className="relative p-2 bg-[#1A1A1A] text-white rounded-full hover:bg-[#C5A059] transition-all"
          >
            <ShoppingBag size={18} strokeWidth={2} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
