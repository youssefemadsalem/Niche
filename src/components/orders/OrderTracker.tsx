import { Order, OrderStatus } from '@/types';

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'pending',    label: 'Order Placed' },
  { status: 'confirmed',  label: 'Confirmed'    },
  { status: 'processing', label: 'Processing'   },
  { status: 'shipped',    label: 'Shipped'      },
  { status: 'delivered',  label: 'Delivered'    },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4, cancelled: -1,
};

export default function OrderTracker({ order }: { order: Order }) {
  const currentIdx = STATUS_INDEX[order.status] ?? 0;

  if (order.status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg px-6 py-4">
        <p className="text-sm font-['Manrope'] text-red-600 font-semibold">Order Cancelled</p>
        <p className="text-xs text-red-400 font-['Manrope'] mt-1">
          This order was cancelled. Contact support if you have questions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5D5B0] rounded-lg p-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-['Noto_Serif'] text-lg text-[#1A1A1A]">Order Tracking</h3>
        {order.trackingNumber && (
          <p className="text-xs text-[#1A1A1A]/40 font-['Manrope']">
            Tracking: <span className="text-[#C5A059]">{order.trackingNumber}</span>
          </p>
        )}
      </div>

      <div className="relative flex justify-between">
        <div className="absolute top-3 left-0 right-0 h-px bg-[#E5D5B0] z-0" />
        <div
          className="absolute top-3 left-0 h-px bg-[#C5A059] z-0 transition-all duration-700"
          style={{ width: `${(currentIdx / (STEPS.length - 1)) * 100}%` }}
        />
        {STEPS.map((step, i) => {
          const done   = i < currentIdx;
          const active = i === currentIdx;
          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                ${done   ? 'bg-[#C5A059] border-[#C5A059]' : ''}
                ${active ? 'bg-[#1A1A1A] border-[#1A1A1A]' : ''}
                ${!done && !active ? 'bg-white border-[#E5D5B0]' : ''}`}>
                {done   && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                {active && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className={`text-[9px] tracking-wider uppercase font-['Manrope'] text-center max-w-[56px] leading-tight
                ${active ? 'text-[#1A1A1A] font-semibold' : done ? 'text-[#C5A059]' : 'text-[#1A1A1A]/30'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {order.statusHistory?.length > 0 && (
        <div className="mt-8">
          <p className="text-xs tracking-widest uppercase font-['Manrope'] text-[#1A1A1A]/40 mb-4">History</p>
          <div className="space-y-3">
            {[...order.statusHistory].reverse().map((h, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059] mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-['Manrope'] text-[#1A1A1A] capitalize">{h.status}</p>
                  {h.note && <p className="text-xs text-[#1A1A1A]/50 font-['Manrope']">{h.note}</p>}
                  <p className="text-[10px] text-[#1A1A1A]/30 font-['Manrope']">
                    {new Date(h.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
