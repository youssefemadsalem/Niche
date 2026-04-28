"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CheckoutFormData } from "@/types";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import OrderSummaryPanel from "@/components/checkout/OrderSummaryPanel";

const STEPS = ["Shipping", "Payment", "Review"] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    shipping,
    tax,
    promoDiscount,
    promoCode,
    finalTotal,
    clearCart,
  } = useCart();

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<CheckoutFormData>({ defaultValues: { paymentMethod: "card" } });

  const paymentMethod = watch("paymentMethod");

  if (!items.length) {
    router.replace("/cart");
    return null;
  }

  const nextStep = async () => {
    const fields =
      step === 0
        ? ([
            "shippingAddress.firstName",
            "shippingAddress.lastName",
            "shippingAddress.street",
            "shippingAddress.city",
            "shippingAddress.postalCode",
            "shippingAddress.country",
          ] as const)
        : (["paymentMethod"] as const);
    const valid = await trigger(fields as any);
    if (valid) setStep((s) => (s < 2 ? s + 1 : s) as 0 | 1 | 2);
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setLoading(true);
    setError("");
    try {
      if (data.paymentMethod === "card") {
        const res = await fetch("/api/checkout/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            shippingAddress: data.shippingAddress,
            promoCode,
            promoDiscount,
            guestEmail: data.guestEmail,
            // userId is passed server-side via Stripe webhook from session
          }),
        });
        const { url, error: stripeError } = await res.json();
        if (stripeError) throw new Error(stripeError);
        window.location.href = url;
      } else {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            shippingAddress: data.shippingAddress,
            paymentMethod: data.paymentMethod,
            guestEmail: data.guestEmail,
            subtotal,
            shipping,
            tax,
            promoDiscount,
            total: finalTotal,
            promoCode,
          }),
        });
        const order = await res.json();
        if (!res.ok) throw new Error(order.error);
        clearCart();
        router.push(`/checkout/success?orderId=${order._id}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F8F6]">
      {/* Top bar */}
      <header className="border-b border-[#E5D5B0] bg-white px-6 py-4 flex items-center justify-between">
        <Link
          href="/cart"
          className="flex items-center gap-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 2L4 8l6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </Link>
        <span className="font-['Noto_Serif'] text-lg tracking-[0.2em] text-[#1A1A1A]">
          NICHE
        </span>
        <div className="flex items-center gap-1 text-[#1A1A1A]/40">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect
              x="1"
              y="5"
              width="12"
              height="8"
              rx="1"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M4 5V4a3 3 0 016 0v1"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
          <span className="text-xs font-['Manrope'] tracking-widest uppercase">
            Secure Checkout
          </span>
        </div>
      </header>

      {/* Step indicator */}
      <div className="flex border-b border-[#E5D5B0] bg-white">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 text-center py-3">
            <p
              className={`text-[10px] tracking-widest uppercase font-['Manrope'] ${i === step ? "text-[#1A1A1A]" : "text-[#1A1A1A]/30"}`}
            >
              Step {i + 1}
            </p>
            <p
              className={`text-sm font-['Noto_Serif'] ${i === step ? "text-[#1A1A1A]" : "text-[#1A1A1A]/30"}`}
            >
              {s}
            </p>
            {i === step && (
              <div className="mt-1 h-0.5 bg-[#C5A059] mx-auto w-8" />
            )}
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        <div className="bg-white border border-[#E5D5B0] rounded-lg p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {step === 0 && <ShippingForm register={register} errors={errors} />}
            {step === 1 && (
              <PaymentMethodSelector register={register} watch={watch} />
            )}
            {step === 2 && (
              <div>
                <h2 className="font-['Noto_Serif'] text-2xl text-[#1A1A1A] mb-4">
                  Review Order
                </h2>
                <p className="text-sm text-[#1A1A1A]/60 font-['Manrope']">
                  Please review your items in the summary panel before
                  completing your purchase.
                </p>
              </div>
            )}

            {error && (
              <p className="mt-4 text-red-500 text-sm font-['Manrope'] bg-red-50 border border-red-200 rounded px-4 py-3">
                {error}
              </p>
            )}

            <div className="mt-8 flex gap-3">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as 0 | 1 | 2)}
                  className="flex-1 border border-[#1A1A1A]/20 text-[#1A1A1A] py-4 text-xs tracking-widest uppercase font-['Manrope'] hover:border-[#1A1A1A] transition-colors"
                >
                  Back
                </button>
              )}
              {step < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-[#1A1A1A] text-white py-4 text-xs tracking-widest uppercase font-['Manrope'] hover:bg-[#C5A059] transition-colors"
                >
                  Continue to {STEPS[step + 1]} →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#1A1A1A] text-white py-4 text-xs tracking-widest uppercase font-['Manrope'] hover:bg-[#C5A059] transition-colors disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : paymentMethod === "card"
                      ? "Pay with Stripe →"
                      : "Place Order →"}
                </button>
              )}
            </div>
          </form>
        </div>

        <OrderSummaryPanel />
      </div>
    </main>
  );
}
