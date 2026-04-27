import { notFound }      from 'next/navigation';
import Link              from 'next/link';
import Image             from 'next/image';
import { connectDB }     from '@/lib/mongodb';   // ✅ FIX: Dev1's mongodb.ts
import Order             from '@/models/Order';
import OrderTracker      from '@/components/orders/OrderTracker';

export default async function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  await connectDB();
  const raw = await Order.findById(params.orderId).lean();
  if (!raw) notFound();

  // Serialize Mongoose document so it can be passed to client components
  const order = JSON.parse(JSON.stringify(raw));

  return (
    <main className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Back */}
        <Link href="/orders"
          className="flex items-center gap-2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors text-xs font-['Manrope'] uppercase tracking-widest mb-8">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          All Orders
        </Link>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-widest uppercase font-['Manrope'] text-[#C5A059] mb-1">
            {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="font-['Noto_Serif'] text-3xl text-[#1A1A1A]">{order.orderNumber}</h1>
        </div>

        {/* Tracker */}
        <div className="mb-8">
          <OrderTracker order={order} />
        </div>

        {/* Items */}
        <div className="bg-white border border-[#E5D5B0] rounded-lg p-6 mb-6">
          <h2 className="font-['Noto_Serif'] text-lg text-[#1A1A1A] mb-5">Items</h2>
          <div className="space-y-4">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex gap-4 items-center py-3 border-b border-[#E5D5B0] last:border-0">
                <div className="relative w-14 h-16 bg-[#E5D5B0] rounded overflow-hidden flex-shrink-0">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-[#C5A059] font-['Manrope'] uppercase tracking-wider">{item.brand}</p>
                  <p className="font-['Noto_Serif'] text-[#1A1A1A]">{item.name}</p>
                  <p className="text-xs text-[#1A1A1A]/40 font-['Manrope']">{item.size} · Qty {item.quantity}</p>
                </div>
                <p className="font-['Manrope'] text-[#1A1A1A]">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Price breakdown */}
          <div className="mt-4 pt-4 border-t border-[#E5D5B0] space-y-2 text-sm font-['Manrope']">
            <div className="flex justify-between text-[#1A1A1A]/60"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-[#1A1A1A]/60">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? 'Complimentary' : `$${order.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-[#1A1A1A]/60"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
            {order.promoDiscount > 0 && (
              <div className="flex justify-between text-[#C5A059]">
                <span>Discount ({order.promoCode})</span><span>−${order.promoDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#1A1A1A] font-medium pt-2 border-t border-[#E5D5B0]">
              <span className="font-['Noto_Serif']">Total</span>
              <span className="font-['Noto_Serif'] text-lg">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-white border border-[#E5D5B0] rounded-lg p-6">
          <h2 className="font-['Noto_Serif'] text-lg text-[#1A1A1A] mb-3">Delivery Address</h2>
          <address className="not-italic text-sm text-[#1A1A1A]/70 font-['Manrope'] leading-relaxed">
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
            {order.shippingAddress.country}
          </address>
        </div>
      </div>
    </main>
  );
}
