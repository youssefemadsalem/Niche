import Link from 'next/link';
import Image from 'next/image';
import { Order, OrderStatus } from '@/types';

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending:    'bg-yellow-50  text-yellow-700  border-yellow-200',
  confirmed:  'bg-blue-50    text-blue-700    border-blue-200',
  processing: 'bg-purple-50  text-purple-700  border-purple-200',
  shipped:    'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20',
  delivered:  'bg-green-50   text-green-700   border-green-200',
  cancelled:  'bg-red-50     text-red-600     border-red-200',
};

export default function OrderCard({ order }: { order: Order }) {
  return (
    <Link href={`/orders/${order._id}`}>
      <div className="bg-white border border-[#E5D5B0] rounded-lg p-5 hover:border-[#C5A059] transition-colors cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs tracking-widest uppercase font-['Manrope'] text-[#1A1A1A]/40">
              {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="font-['Noto_Serif'] text-[#1A1A1A] mt-0.5">{order.orderNumber}</p>
          </div>
          <span className={`text-[10px] tracking-widest uppercase font-['Manrope'] px-2 py-1 border rounded ${STATUS_STYLES[order.status]}`}>
            {order.status}
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          {order.items.slice(0, 3).map((item, i) => (
            <div key={i} className="relative w-12 h-14 bg-[#E5D5B0] rounded overflow-hidden flex-shrink-0">
              {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="w-12 h-14 bg-[#F9F8F6] border border-[#E5D5B0] rounded flex items-center justify-center">
              <span className="text-xs text-[#1A1A1A]/40 font-['Manrope']">+{order.items.length - 3}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-[#1A1A1A]/50 font-['Manrope']">
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
          </p>
          <p className="font-['Noto_Serif'] text-[#1A1A1A]">${order.total.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}
