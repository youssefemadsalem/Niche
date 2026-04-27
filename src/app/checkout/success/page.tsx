'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Order } from '@/types';

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    clearCart();
    const orderId = params.get('orderId');
    if (orderId) {
      fetch(`/api/orders/${orderId}`)
        .then((r) => r.json())
        .then(setOrder)
        .catch(console.error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-[#F9F8F6] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-20 h-20 rounded-full border-2 border-[#C5A059] flex items-center justify-center mb-8">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M6 16l8 8 12-16" stroke="#C5A059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <p className="text-xs tracking-widest uppercase font-['Manrope'] text-[#C5A059] mb-2">
        Order Confirmed
      </p>
      <h1 className="font-['Noto_Serif'] text-4xl text-[#1A1A1A] mb-4 text-center">Thank you.</h1>
      <p className="text-center text-[#1A1A1A]/60 font-['Manrope'] text-sm max-w-sm mb-2">
        Your order has been placed and a confirmation has been sent to your email.
      </p>

      {order && (
        <p className="text-center text-xs tracking-widest uppercase font-['Manrope'] text-[#1A1A1A]/40 mb-10">
          Order {order.orderNumber}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        {order && (
          <Link href={`/orders/${order._id}`}
            className="border border-[#1A1A1A] text-[#1A1A1A] px-8 py-3 text-xs tracking-widest uppercase font-['Manrope'] hover:bg-[#1A1A1A] hover:text-white transition-colors text-center">
            Track Order
          </Link>
        )}
        <Link href="/discover"
          className="bg-[#1A1A1A] text-white px-8 py-3 text-xs tracking-widest uppercase font-['Manrope'] hover:bg-[#C5A059] transition-colors text-center">
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
