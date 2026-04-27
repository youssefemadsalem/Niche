'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CheckoutFormData } from '@/types';

interface Props {
  register: UseFormRegister<CheckoutFormData>;
  errors:   FieldErrors<CheckoutFormData>;
}

function Field({ id, label, error, register: reg, type = 'text' }: {
  id: string; label: string; error?: string; register: object; type?: string;
}) {
  return (
    <div className="relative pb-6">
      <input
        id={id} type={type} placeholder=" "
        className="peer w-full border-0 border-b border-[#1A1A1A]/20 bg-transparent py-3 px-0 text-sm font-['Manrope'] text-[#1A1A1A] placeholder-transparent focus:outline-none focus:border-[#C5A059] transition-colors"
        {...(reg as object)}
      />
      <label
        htmlFor={id}
        className="absolute left-0 top-3 text-[#1A1A1A]/40 text-xs tracking-widest uppercase font-['Manrope'] transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:-top-3 peer-focus:text-[10px] peer-focus:text-[#C5A059] -top-3 text-[10px]"
      >
        {label}
      </label>
      {error && <p className="absolute bottom-1 text-red-400 text-[10px] font-['Manrope']">{error}</p>}
    </div>
  );
}

export default function ShippingForm({ register, errors }: Props) {
  return (
    <div>
      <h2 className="font-['Noto_Serif'] text-2xl text-[#1A1A1A] mb-8">Delivery Details</h2>
      <div className="grid grid-cols-2 gap-x-4">
        <Field id="firstName" label="First Name"
          register={register('shippingAddress.firstName', { required: 'Required' })}
          error={errors.shippingAddress?.firstName?.message} />
        <Field id="lastName" label="Last Name"
          register={register('shippingAddress.lastName', { required: 'Required' })}
          error={errors.shippingAddress?.lastName?.message} />
      </div>
      <Field id="street" label="Street Address"
        register={register('shippingAddress.street', { required: 'Required' })}
        error={errors.shippingAddress?.street?.message} />
      <div className="grid grid-cols-2 gap-x-4">
        <Field id="city" label="City"
          register={register('shippingAddress.city', { required: 'Required' })}
          error={errors.shippingAddress?.city?.message} />
        <Field id="postalCode" label="Postal Code"
          register={register('shippingAddress.postalCode', { required: 'Required' })}
          error={errors.shippingAddress?.postalCode?.message} />
      </div>
      <Field id="country" label="Country"
        register={register('shippingAddress.country', { required: 'Required' })}
        error={errors.shippingAddress?.country?.message} />
      {/* Guest email — Dev1 can hide this conditional on session existence */}
      <Field id="guestEmail" label="Email (for order confirmation)" type="email"
        register={register('guestEmail', {
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
        })}
        error={errors.guestEmail?.message} />
    </div>
  );
}
