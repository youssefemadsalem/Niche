'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function PromoCode() {
  const { subtotal, promoCode, promoDiscount, applyPromo, removePromo } = useCart();
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handleApply = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res  = await fetch('/api/promo', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code: input.trim(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      applyPromo(data.code, data.discount);
      setSuccess(data.label);
      setInput('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (promoCode) {
    return (
      <div className="flex items-center justify-between bg-[#C5A059]/10 border border-[#C5A059]/30 rounded px-4 py-3">
        <div>
          <p className="text-xs tracking-widest uppercase font-['Manrope'] text-[#C5A059]">
            Promo Applied
          </p>
          <p className="font-['Manrope'] text-[#1A1A1A] text-sm mt-0.5">
            {promoCode} — <span className="text-[#C5A059]">−${promoDiscount.toFixed(2)}</span>
          </p>
        </div>
        <button
          onClick={removePromo}
          className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors text-xs font-['Manrope'] uppercase tracking-wider"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Promo code"
          value={input}
          onChange={(e) => { setInput(e.target.value.toUpperCase()); setError(''); }}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          className="flex-1 border-b border-[#1A1A1A]/20 bg-transparent px-0 py-2 text-sm font-['Manrope'] text-[#1A1A1A] placeholder-[#1A1A1A]/30 focus:outline-none focus:border-[#C5A059] transition-colors uppercase tracking-wider"
        />
        <button
          onClick={handleApply}
          disabled={loading || !input.trim()}
          className="text-xs font-['Manrope'] tracking-widest uppercase text-[#C5A059] disabled:opacity-40 transition-opacity px-2"
        >
          {loading ? '...' : 'Apply'}
        </button>
      </div>
      {error   && <p className="text-red-500 text-xs mt-1.5 font-['Manrope']">{error}</p>}
      {success && <p className="text-[#C5A059] text-xs mt-1.5 font-['Manrope']">{success}</p>}
    </div>
  );
}
