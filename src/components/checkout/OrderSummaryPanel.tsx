'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function OrderSummaryPanel() {
  const { items, subtotal, shipping, tax, promoDiscount, finalTotal } = useCart();

  return (
    <div className="bg-[#F9F8F6] border border-[#E5D5B0] rounded-lg p-6">
      <h2 className="font-['Noto_Serif'] text-xl text-[#1A1A1A] mb-6">Order Summary</h2>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}`} className="flex gap-3 items-center">
            <div className="relative w-14 h-16 flex-shrink-0 bg-[#E5D5B0] rounded overflow-hidden">
              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#C5A059] font-['Manrope'] uppercase tracking-wider">{item.brand}</p>
              <p className="font-['Noto_Serif'] text-sm text-[#1A1A1A] leading-tight">{item.name}</p>
              <p className="text-xs text-[#1A1A1A]/40 font-['Manrope']">{item.size} · Qty {item.quantity}</p>
            </div>
            <p className="text-sm font-['Manrope'] text-[#1A1A1A] flex-shrink-0">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-[#E5D5B0] pt-4 space-y-2 text-sm font-['Manrope']">
        <div className="flex justify-between text-[#1A1A1A]/60"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-[#1A1A1A]/60">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-[#1A1A1A]/60"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
        {promoDiscount > 0 && (
          <div className="flex justify-between text-[#C5A059]"><span>Discount</span><span>−${promoDiscount.toFixed(2)}</span></div>
        )}
        <div className="border-t border-[#E5D5B0] pt-3 flex justify-between items-baseline">
          <span className="text-xs tracking-widest uppercase text-[#1A1A1A]/50">Total</span>
          <span className="font-['Noto_Serif'] text-2xl text-[#1A1A1A]">${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#E5D5B0] space-y-3">
        {[
          { icon: '🛡', text: 'Secure Transactions',   sub: 'End-to-end encrypted payment'    },
          { icon: '🌿', text: 'Sustainable Packaging', sub: '100% recyclable materials'        },
          { icon: '🎧', text: 'Concierge Support',     sub: 'Available 24/7 for consultations' },
        ].map((b) => (
          <div key={b.text} className="flex gap-3 items-center">
            <span className="text-lg">{b.icon}</span>
            <div>
              <p className="text-xs font-['Manrope'] font-semibold text-[#1A1A1A] uppercase tracking-wider">{b.text}</p>
              <p className="text-[10px] text-[#1A1A1A]/40 font-['Manrope']">{b.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
