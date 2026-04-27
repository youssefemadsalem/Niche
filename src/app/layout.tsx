import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/components/SessionProvider";
import { CartProvider } from "@/context/CartContext";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["400", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
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
        {/* Nesting both providers ensures both Auth and Cart context 
            are available throughout the app. 
        */}
        <NextAuthSessionProvider>
          <CartProvider>{children}</CartProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
