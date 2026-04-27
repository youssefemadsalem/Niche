import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NICHE — Curated Perfumery",
  description: "Rare essences for the discerning collector.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${notoSerif.variable} ${manrope.variable}`}>
      <body className="bg-[#F9F8F6] text-[#1A1A1A] antialiased">
        {/*
          ── NOTE FOR DEV1 ────────────────────────────────────────────────────
          NextAuth v5 (your auth.ts) does NOT require a <SessionProvider> in
          App Router. The auth() function is called server-side directly.

          If Dev1 adds a client-side SessionProvider for any reason, nest it like:
            <SessionProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </SessionProvider>

          CartProvider is safe to keep at this level regardless.
          ────────────────────────────────────────────────────────────────────
        */}
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
