"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerSetup() {
  const router = useRouter();
  const [form, setForm] = useState({ shopName: "", description: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/seller/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) router.push("/seller/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50">
        <h1 className="text-3xl font-bold mb-2">Open your shop</h1>
        <p className="text-gray-500 mb-8">
          Set up your vendor profile to start selling.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 ml-1">
              Shop Name
            </label>
            <input
              required
              className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-black outline-none transition"
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 ml-1">
              Store Description
            </label>
            <textarea
              required
              rows={4}
              className="w-full border-2 border-gray-100 p-4 rounded-2xl focus:border-black outline-none transition"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <button className="w-full bg-black text-white py-5 rounded-2xl font-bold hover:scale-[0.98] transition">
            Create Store
          </button>
        </form>
      </div>
    </div>
  );
}
