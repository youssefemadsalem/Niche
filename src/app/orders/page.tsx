// ─────────────────────────────────────────────────────────────────────────────
// src/app/orders/page.tsx  —  Order History (Server Component)
//
// ✅ FIX: Uses auth() from Dev1's lib/auth.ts (NextAuth v5 style)
//         NOT getServerSession() — that was NextAuth v4
// ─────────────────────────────────────────────────────────────────────────────

import Link      from 'next/link';
import { auth }  from '@/lib/auth';          // ✅ Dev1's export from auth.ts
import { connectDB } from '@/lib/mongodb';   // ✅ Dev1's export from mongodb.ts
import Order     from '@/models/Order';
import OrderCard from '@/components/orders/OrderCard';

export default async function OrdersPage() {
  // ── Get session via Dev1's auth() ─────────────────────────────────────────
  const session = await auth();
  const userId  = session?.user?.id ?? null;
  // session.user also has: .role, .isVerified, .isApproved (from next-auth.d.ts)

  await connectDB();
  const orders = userId
    ? await Order.find({ userId }).sort({ createdAt: -1 }).lean()
    : [];

  return (
    <main className="min-h-screen bg-[#F9F8F6]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <p className="text-xs tracking-widest uppercase font-['Manrope'] text-[#C5A059] mb-1">
          Your Account
        </p>
        <h1 className="font-['Noto_Serif'] text-4xl text-[#1A1A1A] mb-8">Order History</h1>

        {/* Not signed in */}
        {!userId && (
          <div className="bg-white border border-[#E5D5B0] rounded-lg p-8 text-center">
            <p className="font-['Noto_Serif'] text-xl text-[#1A1A1A] mb-2">
              Sign in to view your orders
            </p>
            <p className="text-sm text-[#1A1A1A]/50 font-['Manrope'] mb-6">
              Access your complete order history and tracking details.
            </p>
            {/* ✅ Points to Dev1's login page (auth.ts pages.signIn = "/auth/login") */}
            <Link
              href="/auth/login"
              className="inline-block bg-[#1A1A1A] text-white px-8 py-3 text-xs tracking-widest uppercase font-['Manrope'] hover:bg-[#C5A059] transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Signed in, no orders */}
        {userId && orders.length === 0 && (
          <div className="text-center py-16">
            <p className="font-['Noto_Serif'] text-2xl text-[#1A1A1A] mb-3">No orders yet.</p>
            <p className="text-sm text-[#1A1A1A]/50 font-['Manrope'] mb-8">
              Your curated selections will appear here.
            </p>
            <Link href="/discover"
              className="border border-[#1A1A1A] text-[#1A1A1A] px-8 py-3 text-xs tracking-widest uppercase font-['Manrope'] hover:bg-[#1A1A1A] hover:text-white transition-colors">
              Explore Collection
            </Link>
          </div>
        )}

        {/* Orders list */}
        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((o: any) => (
              <OrderCard
                key={o._id.toString()}
                order={{
                  ...o,
                  _id:       o._id.toString(),
                  createdAt: o.createdAt.toISOString(),
                  updatedAt: o.updatedAt.toISOString(),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
