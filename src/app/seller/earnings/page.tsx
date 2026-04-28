"use client";
import { useState, useEffect } from "react";

export default function EarningsPage() {
  const [stats, setStats] = useState({ totalEarnings: 0, totalOrders: 0 });

  useEffect(() => {
    fetch("/api/seller/earnings")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">
        Financial Overview
      </h1>
      <p className="text-gray-500 mb-10">
        Manage your shop earnings and request payouts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Main Earnings Card */}
        <div className="p-10 bg-black text-white rounded-[3rem] shadow-2xl">
          <p className="text-sm opacity-60 mb-2">Total Revenue</p>
          <h2 className="text-5xl font-bold">
            ${stats.totalEarnings.toFixed(2)}
          </h2>
          <button className="mt-8 w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-gray-100 transition">
            Request Payout
          </button>
        </div>

        {/* Sales Count Card */}
        <div className="p-10 bg-white border-2 border-gray-100 rounded-[3rem] flex flex-col justify-center">
          <p className="text-sm text-gray-400 mb-2">Total Units Sold</p>
          <h2 className="text-5xl font-bold text-gray-800">
            {stats.totalOrders}
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-xs font-bold text-green-500 uppercase">
              Live Stats
            </span>
          </div>
        </div>
      </div>

      {/* Placeholder for Transaction History */}
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-4xl p-20 text-center">
        <p className="text-gray-400 font-medium italic">
          Detailed transaction history will appear here once orders are
          processed.
        </p>
      </div>
    </div>
  );
}
