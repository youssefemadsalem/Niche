'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import PromoCode from './PromoCode';

export default function CartSummary() {
  const { subtotal, shipping, tax, promoDiscount, finalTotal } = useCart();

  return (
    <div className="bg-white border border-[#E5D5B0] rounded-lg p-6 sticky top-6">
      <h2 className="font-['Noto_Serif'] text-xl text-[#1A1A1A] mb-6">Order Summary</h2>

      <div className="space-y-3 text-sm font-['Manrope']">
        <div className="flex justify-between text-[#1A1A1A]/70">
          <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[#1A1A1A]/70">
          <span>Shipping</span>
          <span>
            {shipping === 0
              ? <span className="text-[#C5A059]">Complimentary</span>
              : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-[#1A1A1A]/70">
          <span>Tax Estimate</span><span>${tax.toFixed(2)}</span>
        </div>
        {promoDiscount > 0 && (
          <div className="flex justify-between text-[#C5A059]">
            <span>Discount</span><span>−${promoDiscount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="my-5 border-t border-[#E5D5B0]" />

      <div className="mb-5">
        <p className="text-xs tracking-widest uppercase font-['Manrope'] text-[#1A1A1A]/40 mb-2">
          Promo Code
        </p>
        <PromoCode />
      </div>

      <div className="border-t border-[#E5D5B0] pt-4 flex justify-between items-baseline mb-6">
        <span className="text-xs tracking-widest uppercase font-['Manrope'] text-[#1A1A1A]/60">Total</span>
        <span className="font-['Noto_Serif'] text-2xl text-[#1A1A1A]">${finalTotal.toFixed(2)}</span>
      </div>

      <Link
        href="/checkout"
        className="block w-full bg-[#1A1A1A] text-white text-center py-4 font-['Manrope'] text-sm tracking-widest uppercase hover:bg-[#C5A059] transition-colors duration-300"
      >
        Proceed to Checkout
      </Link>

      <p className="text-center text-xs text-[#1A1A1A]/30 font-['Manrope'] mt-4">
        Insured Priority Shipping & Signature Gift Wrap Included
      </p>
    </div>
  );
}
