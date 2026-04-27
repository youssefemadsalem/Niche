'use client';

import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { CheckoutFormData, PaymentMethodType } from '@/types';

const METHODS: { id: PaymentMethodType; label: string; icon: string }[] = [
  { id: 'card',   label: 'Card',   icon: '💳' },
  { id: 'paypal', label: 'PayPal', icon: '🅿' },
  { id: 'cod',    label: 'COD',    icon: '📦' },
  { id: 'wallet', label: 'Wallet', icon: '👜' },
];

interface Props {
  register: UseFormRegister<CheckoutFormData>;
  watch:    UseFormWatch<CheckoutFormData>;
}

export default function PaymentMethodSelector({ register, watch }: Props) {
  const selected = watch('paymentMethod');

  return (
    <div className="mt-10">
      <h2 className="font-['Noto_Serif'] text-2xl text-[#1A1A1A] mb-6">Payment Method</h2>
      <div className="grid grid-cols-2 gap-3">
        {METHODS.map((m) => (
          <label key={m.id}
            className={`flex flex-col items-center justify-center gap-2 py-5 border rounded cursor-pointer transition-all duration-200 font-['Manrope'] text-sm tracking-wider uppercase
              ${selected === m.id ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white' : 'border-[#E5D5B0] bg-white text-[#1A1A1A]/60 hover:border-[#C5A059]'}`}
          >
            <input type="radio" value={m.id} className="sr-only"
              {...register('paymentMethod', { required: true })} />
            <span className="text-xl">{m.icon}</span>
            <span>{m.label}</span>
          </label>
        ))}
      </div>

      {selected === 'card' && (
        <div className="mt-4 p-4 bg-[#F9F8F6] border border-[#E5D5B0] rounded text-xs font-['Manrope'] text-[#1A1A1A]/50">
          You will be redirected to our secure Stripe checkout to complete payment.
        </div>
      )}
      {selected === 'cod' && (
        <div className="mt-4 p-4 bg-[#F9F8F6] border border-[#E5D5B0] rounded text-xs font-['Manrope'] text-[#1A1A1A]/50">
          Pay with cash upon delivery. Available for eligible orders under $500.
        </div>
      )}
      {selected === 'wallet' && (
        <div className="mt-4 p-4 bg-[#F9F8F6] border border-[#E5D5B0] rounded text-xs font-['Manrope'] text-[#1A1A1A]/50">
          Pay using your Niche wallet balance. Managed by your account profile.
        </div>
      )}
    </div>
  );
}
