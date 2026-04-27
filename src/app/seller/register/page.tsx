"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerRegisterUI() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/seller/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/seller/dashboard");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-black text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            S
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Start Selling</h1>
          <p className="text-gray-500 mt-2">
            Setup your shop and join our marketplace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shop Name Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Shop Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Youssef's Tech Store"
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-black focus:bg-white outline-none transition-all"
              onChange={(e) =>
                setFormData({ ...formData, shopName: e.target.value })
              }
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Store Description
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tell customers what you sell..."
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-black focus:bg-white outline-none transition-all resize-none"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-[0.99] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : "Create My Shop"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8 px-4">
          By clicking "Create My Shop", you agree to our Vendor Terms and
          Conditions.
        </p>
      </div>
    </div>
  );
}
