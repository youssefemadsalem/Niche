"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function MyProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seller/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts(products.filter((p: any) => p._id !== id));
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading Inventory...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        <Link
          href="/seller/products/new"
          className="bg-black text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-800"
        >
          + Add New Product
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-500 text-sm">
              <th className="p-4 font-semibold">Product Details</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Price</th>
              <th className="p-4 font-semibold">Stock Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product: any) => (
              <tr key={product._id} className="hover:bg-gray-50 transition">
                <td className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border">
                    <img
                      src={product.images?.[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-gray-900">
                    {product.name}
                  </span>
                </td>
                <td className="p-4 text-gray-600">
                  {product.category?.name || "General"}
                </td>
                <td className="p-4 font-semibold text-gray-900">
                  ${product.price}
                </td>
                <td className="p-4">
                  {/* Stock Availability Logic */}
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">
                      {product.stock} units
                    </span>
                    {product.stock < 5 ? (
                      <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">
                        Available
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 hover:underline mr-4 text-sm font-medium">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-500 hover:underline text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="p-20 text-center text-gray-400">
            You haven't added any products yet.
          </div>
        )}
      </div>
    </div>
  );
}
