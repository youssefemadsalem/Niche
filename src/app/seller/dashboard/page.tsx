"use client";
import { useState, useEffect } from "react";

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch only this seller's products from an API
    fetch("/api/seller/my-products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      <div className="grid grid-cols-1 gap-4">
        {products.map((p: any) => (
          <div
            key={p._id}
            className="p-4 border rounded-xl flex justify-between items-center bg-white"
          >
            <div className="flex items-center gap-4">
              <img
                src={p.images[0]}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-bold">{p.name}</h3>
                <p className="text-gray-500">
                  ${p.price} | Stock: {p.stock}
                </p>
              </div>
            </div>
            <button className="text-blue-500 font-medium">Edit Product</button>
          </div>
        ))}
      </div>
    </div>
  );
}
