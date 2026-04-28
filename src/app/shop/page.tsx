"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Shop() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);

  const currentSearch = searchParams.get("query") || "";

  useEffect(() => {
    fetch(`/api/products?query=${currentSearch}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, [currentSearch]);

  const onSearch = (val: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("query", val);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="p-10 flex flex-col gap-6">
      <input
        type="text"
        placeholder="Search for something..."
        className="p-3 border rounded-full w-full max-w-md mx-auto"
        onChange={(e) => onSearch(e.target.value)}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p: any) => (
          <div key={p._id} className="group cursor-pointer">
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-2">
              <img
                src={p.images[0]}
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
