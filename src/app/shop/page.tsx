"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

// 1. Extract the dynamic states and search logic into a sub-component
function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);

  const currentSearch = searchParams.get("query") || "";

  useEffect(() => {
    fetch(`/api/products?query=${encodeURIComponent(currentSearch)}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(console.error);
  }, [currentSearch]);

  const onSearch = (val: string) => {
    // Safely generate search parameters using Next.js safe read-only searchParams
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("query", val);
    } else {
      params.delete("query");
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="p-10 flex flex-col gap-6">
      <input
        type="text"
        placeholder="Search for something..."
        defaultValue={currentSearch}
        className="p-3 border rounded-full w-full max-w-md mx-auto"
        onChange={(e) => onSearch(e.target.value)}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products && products.map((p: any) => (
          <div key={p._id} className="group cursor-pointer">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-2">
              <img
                src={p.images?.[0] || "/placeholder.jpg"}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>
            <h2 className="font-bold">{p.name}</h2>
            <p className="text-gray-600 font-medium">${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Default export wraps the sub-component in Suspense to make it completely build-safe
export default function Shop() {
  return (
    <Suspense fallback={
      <div className="p-10 flex flex-col gap-6 items-center justify-center min-h-[50vh]">
        <p className="text-zinc-500 font-medium">Loading premium marketplace...</p>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}